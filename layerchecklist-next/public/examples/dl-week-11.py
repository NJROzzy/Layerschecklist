"""Week 11: complete DDPM on an eight-mode point distribution. CPU only.
python -m pip install torch
python dl-week-11.py [--smoke]
Writes dl-week-11-samples.csv in the working directory.
"""
import argparse
import copy
import csv
import math
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)
T = 64
# A deliberately short, strong schedule for two-dimensional toy data.
BETAS = torch.linspace(.02, .2, T)
ALPHAS = 1-BETAS
ALPHA_BAR = ALPHAS.cumprod(0)
PREVIOUS = torch.cat([torch.ones(1), ALPHA_BAR[:-1]])
POSTERIOR_VARIANCE = BETAS*(1-PREVIOUS)/(1-ALPHA_BAR)
ANGLES = torch.arange(8)*(2*math.pi/8)
CENTERS = 2*torch.stack([ANGLES.cos(), ANGLES.sin()], 1)


def data(n, seed):
    g = torch.Generator().manual_seed(seed)
    return CENTERS[torch.randint(8, (n,), generator=g)] + .12*torch.randn(n, 2, generator=g)


class Denoiser(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(6, 64), nn.SiLU(), nn.Linear(64, 64),
                                 nn.SiLU(), nn.Linear(64, 2))

    def forward(self, x, t):
        phase = t.float()[:, None]/(T-1)
        time = torch.cat([phase, phase.square(), (2*math.pi*phase).sin(), (2*math.pi*phase).cos()], 1)
        return self.net(torch.cat([x, time], 1))


def corrupt(x0, t, noise):
    a = ALPHA_BAR[t, None]
    return a.sqrt()*x0 + (1-a).sqrt()*noise


@torch.no_grad()
def sample(model, count):
    x = torch.randn(count, 2)
    # Array index 0 corresponds to mathematical forward transition t=1.
    for index in reversed(range(T)):
        t = torch.full((count,), index, dtype=torch.long)
        predicted_noise = model(x, t)
        mean = (x-BETAS[index]/(1-ALPHA_BAR[index]).sqrt()*predicted_noise)/ALPHAS[index].sqrt()
        x = mean + POSTERIOR_VARIANCE[index].sqrt()*torch.randn_like(x) if index > 0 else mean
    return x


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    torch.manual_seed(7)
    print('PyTorch', torch.__version__, 'terminal alpha_bar', ALPHA_BAR[-1].item())
    train, val = data(2048, 1), data(512, 2)
    val_t, val_noise = torch.randint(T, (len(val),)), torch.randn_like(val)
    val_noisy = corrupt(val, val_t, val_noise)
    a = ALPHA_BAR[val_t, None]
    recovered = (val_noisy-(1-a).sqrt()*val_noise)/a.sqrt()
    oracle_error = (recovered-val).abs().max().item()
    assert oracle_error < 1e-4
    assert POSTERIOR_VARIANCE[0] == 0
    print('Oracle inversion max error:', oracle_error)
    model = Denoiser()
    opt = torch.optim.Adam(model.parameters(), lr=.002)
    best_score, best = float('inf'), copy.deepcopy(model.state_dict())
    for step in range(15 if args.smoke else 2200):
        x = train[torch.randint(len(train), (128,))]
        t, noise = torch.randint(T, (len(x),)), torch.randn_like(x)
        loss = F.mse_loss(model(corrupt(x, t, noise), t), noise)
        assert torch.isfinite(loss)
        opt.zero_grad()
        loss.backward()
        opt.step()
        if step % 10 == 0:
            with torch.no_grad():
                score = F.mse_loss(model(val_noisy, val_t), val_noise).item()
            if score < best_score:
                best_score, best = score, copy.deepcopy(model.state_dict())
    model.load_state_dict(best)
    model.eval()
    points = sample(model, 1000)
    assert torch.isfinite(points).all()
    distance, nearest = torch.cdist(points, CENTERS).min(1)
    counts = torch.bincount(nearest[distance < .4], minlength=8)
    print(f'Validation noise MSE={best_score:.4f}; generated mean mode distance={distance.mean().item():.3f}')
    print(f'Modes with >=5 samples within radius .4: {int((counts>=5).sum())}/8; counts={counts.tolist()}')
    print(f'Sampling cost: {T} denoiser calls per sample (batched).')
    with open('dl-week-11-samples.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['x', 'y'])
        writer.writerows(points.tolist())
    print('Compare coverage and costs with the other toy generators; this schedule is not an image-model recipe.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
