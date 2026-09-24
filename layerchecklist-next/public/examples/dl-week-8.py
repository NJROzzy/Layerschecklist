"""Week 8: contrastive pretraining plus frozen linear probes. CPU only.
python -m pip install torch
python dl-week-8.py [--smoke]
"""
import argparse
import copy
import math
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)


def data(n, seed):
    g = torch.Generator().manual_seed(seed)
    labels = torch.arange(n) % 4
    angle = labels.float() * (math.pi / 2)
    centers = 2 * torch.stack([angle.cos(), angle.sin()], dim=1)
    return centers + .3 * torch.randn(n, 2, generator=g), labels


def encoder():
    return nn.Sequential(nn.Linear(2, 32), nn.ReLU(), nn.Linear(32, 16))


def contrastive_loss(z1, z2, temperature=.3):
    n = len(z1)
    z = F.normalize(torch.cat([z1, z2]), dim=1)
    scores = z @ z.T / temperature
    scores = scores.masked_fill(torch.eye(2*n, dtype=torch.bool), float('-inf'))
    targets = (torch.arange(2*n) + n) % (2*n)
    return F.cross_entropy(scores, targets)


def probe(backbone, train, val, test, steps):
    backbone.eval()
    for p in backbone.parameters():
        p.requires_grad_(False)
    with torch.no_grad():
        h_train, h_val, h_test = [backbone(d[0]) for d in (train, val, test)]
    torch.manual_seed(123)
    head = nn.Linear(16, 4)
    opt = torch.optim.Adam(head.parameters(), lr=.03)
    best_loss, best = float('inf'), copy.deepcopy(head.state_dict())
    for _ in range(steps):
        opt.zero_grad()
        loss = F.cross_entropy(head(h_train), train[1])
        loss.backward()
        opt.step()
        with torch.no_grad():
            v = F.cross_entropy(head(h_val), val[1]).item()
        if v < best_loss:
            best_loss, best = v, copy.deepcopy(head.state_dict())
    head.load_state_dict(best)
    with torch.no_grad():
        acc = (head(h_test).argmax(1) == test[1]).float().mean().item()
    return best_loss, acc


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    torch.manual_seed(7)
    print('PyTorch', torch.__version__)
    backbone = encoder()
    random_baseline = copy.deepcopy(backbone)
    projector = nn.Sequential(nn.Linear(16, 16), nn.ReLU(), nn.Linear(16, 16))
    unlabeled, _ = data(512, 10)  # labels are never used in pretraining
    # Downstream splits are generated independently of unlabeled pretraining inputs.
    train, val, test = data(32, 11), data(200, 12), data(300, 13)
    opt = torch.optim.Adam(list(backbone.parameters()) + list(projector.parameters()), lr=.003)
    uniform = contrastive_loss(torch.ones(4, 16), torch.ones(4, 16)).item()
    assert abs(uniform - math.log(7)) < 1e-5
    for step in range(8 if args.smoke else 300):
        x = unlabeled[torch.randint(len(unlabeled), (64,))]
        a, b = x + .15*torch.randn_like(x), x + .15*torch.randn_like(x)
        loss = contrastive_loss(projector(backbone(a)), projector(backbone(b)))
        assert torch.isfinite(loss)
        opt.zero_grad()
        loss.backward()
        opt.step()
    with torch.no_grad():
        variation = backbone(unlabeled).std(dim=0).mean().item()
    print(f'Final contrastive loss={loss.item():.4f}; mean feature std={variation:.4f}')
    for name, model in [('Pretrained', backbone), ('Random encoder', random_baseline)]:
        vl, acc = probe(model, train, val, test, 10 if args.smoke else 150)
        print(f'{name}: probe validation NLL={vl:.4f}; held-out accuracy={acc:.3f}')
    print('Easy clusters can also be linearly separable in random features. Do not assume pretraining must win.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
