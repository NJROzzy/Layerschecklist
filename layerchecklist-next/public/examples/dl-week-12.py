"""Week 12: calibration and local stress tests of a synthetic classifier.
python -m pip install torch
python dl-week-12.py [--smoke]
Separate train/validation/calibration/test sets. CPU, no external data.
"""
import argparse
import copy
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)


def data(n, seed):
    g = torch.Generator().manual_seed(seed)
    x = 2*torch.rand(n, 2, generator=g)-1
    y = (x[:, 0]*x[:, 1] > 0).long()
    # Irreducible label noise in this synthetic observation model.
    flip = torch.rand(n, generator=g) < .1
    y[flip] = 1-y[flip]
    return x, y


@torch.no_grad()
def metrics(logits, labels, temperature, bins=10):
    p = (logits/temperature).softmax(1)
    confidence, prediction = p.max(1)
    correct = prediction.eq(labels).float()
    bin_index = (confidence*bins).long().clamp(max=bins-1)
    ece, counts = 0., []
    for i in range(bins):
        chosen = bin_index == i
        counts.append(int(chosen.sum()))
        if chosen.any():
            ece += chosen.float().mean().item() * abs(correct[chosen].mean().item()-confidence[chosen].mean().item())
    return correct.mean().item(), F.cross_entropy(logits/temperature, labels).item(), ece, counts


def report(name, logits, labels, temperature):
    acc, nll, ece, counts = metrics(logits, labels, temperature)
    print(f'{name}: accuracy={acc:.3f} NLL={nll:.4f} ECE={ece:.4f}; bins={counts}')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    torch.manual_seed(7)
    print('PyTorch', torch.__version__)
    train, val, cal, test = [data(n, seed) for n, seed in [(800, 1), (300, 2), (400, 3), (600, 4)]]
    model = nn.Sequential(nn.Linear(2, 32), nn.ReLU(), nn.Linear(32, 32), nn.ReLU(), nn.Linear(32, 2))
    opt = torch.optim.Adam(model.parameters(), lr=.005)
    best_loss, best = float('inf'), copy.deepcopy(model.state_dict())
    for _ in range(5 if args.smoke else 90):
        model.train()
        for indices in torch.randperm(len(train[0])).split(64):
            opt.zero_grad()
            loss = F.cross_entropy(model(train[0][indices]), train[1][indices])
            loss.backward()
            opt.step()
        model.eval()
        with torch.no_grad():
            score = F.cross_entropy(model(val[0]), val[1]).item()
        if score < best_loss:
            best_loss, best = score, copy.deepcopy(model.state_dict())
    model.load_state_dict(best)
    model.eval()
    for parameter in model.parameters():
        parameter.requires_grad_(False)
    with torch.no_grad():
        logits_cal = model(cal[0])
    log_t = nn.Parameter(torch.zeros(()))
    opt_t = torch.optim.Adam([log_t], lr=.03)
    for _ in range(20 if args.smoke else 200):
        opt_t.zero_grad()
        loss = F.cross_entropy(logits_cal/log_t.exp(), cal[1])
        loss.backward()
        opt_t.step()
        with torch.no_grad():
            log_t.clamp_(-3, 3)  # predeclared positive temperature range
    temperature = log_t.exp().detach()
    with torch.no_grad():
        clean = model(test[0])
        noise = (test[0]+.2*torch.randn_like(test[0])).clamp(-1, 1)
        noisy_logits = model(noise)
    assert torch.equal(clean.argmax(1), (clean/temperature).argmax(1))
    print(f'T={temperature.item():.4f}; validation-selected classifier; temperature fitted on calibration only.')
    report('Clean, unscaled', clean, test[1], 1.)
    report('Clean, calibrated', clean, test[1], temperature)
    report('Feature noise std=.2, original labels', noisy_logits, test[1], temperature)
    # Local sensitivity test of this model. Inputs are in raw [-1,1] units.
    x = test[0].detach().clone().requires_grad_(True)
    loss = F.cross_entropy(model(x), test[1])
    gradient, = torch.autograd.grad(loss, x)
    attacked = (x.detach()+.1*gradient.sign()).clamp(-1, 1)
    assert (attacked-test[0]).abs().max() <= .100001
    with torch.no_grad():
        report('FGSM, L-infinity epsilon=.1', model(attacked), test[1], temperature)
    print('Stress tests retain original labels: near the true boundary, label-preservation is imperfect.')
    print('These are local sensitivity results, not a robustness certificate. Report this limitation in the model card.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
