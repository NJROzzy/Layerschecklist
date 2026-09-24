"""Week 6: packed RNN/GRU/LSTM memory study. CPU, synthetic data only.
Install: python -m pip install torch
Run: python dl-week-6.py [--smoke]
"""
import argparse
import copy
import torch
from torch import nn
from torch.nn import functional as F
from torch.utils.data import DataLoader, TensorDataset

torch.set_num_threads(1)


def dataset(n, seed, longest=10):
    g = torch.Generator().manual_seed(seed)
    lengths = torch.randint(4, longest + 1, (n,), generator=g)
    y = torch.randint(0, 2, (n,), generator=g)
    x = .2 * torch.randn(n, longest, 1, generator=g)
    x[:, 0, 0] = 2 * y.float() - 1
    x[torch.arange(longest)[None, :] >= lengths[:, None]] = 0
    return TensorDataset(x, lengths, y)


class MemoryModel(nn.Module):
    def __init__(self, kind):
        super().__init__()
        self.cell = getattr(nn, kind)(1, 24, batch_first=True)
        self.head = nn.Linear(24, 2)

    def forward(self, x, lengths):
        packed = nn.utils.rnn.pack_padded_sequence(
            x, lengths.cpu(), batch_first=True, enforce_sorted=False)
        _, state = self.cell(packed)
        hidden = state[0] if isinstance(state, tuple) else state
        return self.head(hidden[-1])


@torch.no_grad()
def evaluate(model, data):
    model.eval()
    x, lengths, labels = data.tensors
    logits = model(x, lengths)
    return F.cross_entropy(logits, labels).item(), (logits.argmax(1) == labels).float().mean().item()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    print('PyTorch', torch.__version__)
    train = dataset(128 if args.smoke else 640, 10)
    val, test, longer = dataset(200, 11), dataset(300, 12), dataset(300, 13, 24)
    for kind in ('RNN', 'GRU', 'LSTM'):
        torch.manual_seed(7)
        model = MemoryModel(kind)
        # Restart the same batch order for each architecture.
        loader = DataLoader(train, batch_size=64, shuffle=True,
                            generator=torch.Generator().manual_seed(8))
        optimizer = torch.optim.Adam(model.parameters(), lr=.008)
        best_loss, _ = evaluate(model, val)
        before = best_loss
        best = copy.deepcopy(model.state_dict())
        max_grad = 0.
        for _ in range(2 if args.smoke else 24):
            model.train()
            for x, lengths, labels in loader:
                optimizer.zero_grad()
                loss = F.cross_entropy(model(x, lengths), labels)
                assert torch.isfinite(loss)
                loss.backward()
                norm = nn.utils.clip_grad_norm_(model.parameters(), 5.)
                max_grad = max(max_grad, norm.item())
                optimizer.step()
            current, _ = evaluate(model, val)
            if current < best_loss:
                best_loss, best = current, copy.deepcopy(model.state_dict())
        model.load_state_dict(best)
        # Extra zero padding must not alter a packed sequence's final state.
        x, lengths, _ = test.tensors
        model.eval()
        with torch.no_grad():
            assert torch.allclose(model(x, lengths), model(F.pad(x, (0, 0, 0, 5)), lengths), atol=1e-6)
        _, acc = evaluate(model, test)
        _, stress = evaluate(model, longer)
        print(f'{kind:5} val {before:.4f}->{best_loss:.4f}; test acc={acc:.3f}; '
              f'longer acc={stress:.3f}; max pre-clip norm={max_grad:.3f}')
    print('Fixed toy split; longer set changes length distribution. Repeat seeds before ranking cells.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
