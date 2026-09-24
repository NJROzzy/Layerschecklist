"""Week 7: causal transformer on modular counting. CPU; no downloads.
python -m pip install torch
python dl-week-7.py [--smoke]
"""
import argparse
import copy
import math
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)
VOCAB, WIDTH, LENGTH = 8, 32, 12


def sequences(n, seed):
    g = torch.Generator().manual_seed(seed)
    starts = torch.randint(VOCAB, (n, 1), generator=g)
    return (starts + torch.arange(LENGTH + 1)) % VOCAB


class TinyTransformer(nn.Module):
    def __init__(self):
        super().__init__()
        self.embedding = nn.Embedding(VOCAB, WIDTH)
        block = nn.TransformerEncoderLayer(WIDTH, 4, 64, dropout=0., batch_first=True)
        self.encoder = nn.TransformerEncoder(block, 2, enable_nested_tensor=False)
        # Encoder clones begin with equal weights; initialize layers independently.
        for layer in self.encoder.layers:
            for parameter in layer.parameters():
                if parameter.dim() > 1:
                    nn.init.xavier_uniform_(parameter)
        self.head = nn.Linear(WIDTH, VOCAB)
        pos = torch.arange(64)[:, None]
        freq = torch.exp(torch.arange(0, WIDTH, 2) * (-math.log(10000.) / WIDTH))
        pe = torch.zeros(64, WIDTH)
        pe[:, 0::2], pe[:, 1::2] = torch.sin(pos * freq), torch.cos(pos * freq)
        self.register_buffer('positions', pe)

    def forward(self, tokens):
        t = tokens.size(1)
        blocked = torch.triu(torch.ones(t, t, dtype=torch.bool), diagonal=1)
        x = self.embedding(tokens) * math.sqrt(WIDTH) + self.positions[:t]
        return self.head(self.encoder(x, mask=blocked))


def loss_on(model, tokens):
    return F.cross_entropy(model(tokens[:, :-1]).reshape(-1, VOCAB), tokens[:, 1:].reshape(-1))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    torch.manual_seed(7)
    print('PyTorch', torch.__version__)
    train, val, test = sequences(256, 1), sequences(64, 2), sequences(128, 3)
    model = TinyTransformer()
    model.eval()
    with torch.no_grad():
        original = train[:4, :-1]
        changed = original.clone()
        changed[:, 5:] = (changed[:, 5:] + 3) % VOCAB
        error = (model(original)[:, :5] - model(changed)[:, :5]).abs().max().item()
        assert error < 1e-5, f'Future-token leakage: {error}'
        best_loss = loss_on(model, val).item()
    print('Causality check max prefix difference:', error)
    best = copy.deepcopy(model.state_dict())
    opt = torch.optim.AdamW(model.parameters(), lr=.003)
    for _ in range(2 if args.smoke else 25):
        model.train()
        for indices in torch.randperm(len(train)).split(64):
            opt.zero_grad()
            loss = loss_on(model, train[indices])
            assert torch.isfinite(loss)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.)
            opt.step()
        model.eval()
        with torch.no_grad():
            value = loss_on(model, val).item()
        if value < best_loss:
            best_loss, best = value, copy.deepcopy(model.state_dict())
    model.load_state_dict(best)
    model.eval()
    with torch.no_grad():
        print(f'Validation-selected loss={best_loss:.4f}; test={loss_on(model,test).item():.4f}; '
              f'uniform baseline={math.log(VOCAB):.4f}')
        generated = torch.tensor([[2]])
        for _ in range(11):
            token = model(generated)[:, -1].argmax(1, keepdim=True)
            generated = torch.cat([generated, token], dim=1)
        print('Generated:', generated[0].tolist())
    print('There are only eight distinct patterns. Held-out draws test the toy rule, not linguistic generalization.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
