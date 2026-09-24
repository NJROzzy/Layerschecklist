"""Week 9: VAE with explicit Gaussian likelihood and KL reductions.
python -m pip install torch
python dl-week-9.py [--smoke] [--beta 1.0]
Writes dl-week-9-samples.csv in the working directory (decoder means).
"""
import argparse
import copy
import csv
import math
import torch
from torch import nn

torch.set_num_threads(1)
OBS_VARIANCE = .1


def data(n, seed):
    g = torch.Generator().manual_seed(seed)
    k = torch.randint(8, (n,), generator=g)
    angles = k * (2*math.pi/8)
    return 2*torch.stack([angles.cos(), angles.sin()], 1) + .12*torch.randn(n, 2, generator=g)


class VAE(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(2, 48), nn.Tanh(), nn.Linear(48, 4))
        self.decoder = nn.Sequential(nn.Linear(2, 48), nn.Tanh(), nn.Linear(48, 48), nn.Tanh(), nn.Linear(48, 2))

    def forward(self, x, eps):
        mu, logvar = self.encoder(x).chunk(2, dim=1)
        z = mu + (.5*logvar).exp()*eps
        return self.decoder(z), mu, logvar


def terms(model, x, eps):
    mean, mu, logvar = model(x, eps)
    # Sum observation features and latent coordinates, then average examples.
    nll = .5*((x-mean).square()/OBS_VARIANCE + math.log(2*math.pi*OBS_VARIANCE)).sum(1).mean()
    kl = .5*(mu.square() + logvar.exp() - 1 - logvar).sum(1).mean()
    return nll, kl


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    p.add_argument('--beta', type=float, default=1.)
    args = p.parse_args()
    if args.beta < 0:
        p.error('--beta must be nonnegative')
    torch.manual_seed(7)
    print('PyTorch', torch.__version__)
    train, val, test = data(1024, 1), data(256, 2), data(512, 3)
    # Fixed validation noise makes checkpoint comparisons less noisy.
    eps_val = torch.randn(val.shape, generator=torch.Generator().manual_seed(4))
    model = VAE()
    opt = torch.optim.Adam(model.parameters(), lr=.003)
    best_value, best = float('inf'), copy.deepcopy(model.state_dict())
    for step in range(12 if args.smoke else 800):
        x = train[torch.randint(len(train), (128,))]
        nll, kl = terms(model, x, torch.randn_like(x))
        loss = nll + args.beta*kl
        assert torch.isfinite(loss)
        opt.zero_grad()
        loss.backward()
        opt.step()
        if step % 10 == 0:
            with torch.no_grad():
                vn, vk = terms(model, val, eps_val)
                score = (vn + args.beta*vk).item()
            if score < best_value:
                best_value, best = score, copy.deepcopy(model.state_dict())
    model.load_state_dict(best)
    model.eval()
    with torch.no_grad():
        nll, kl = terms(model, test, torch.randn_like(test))
        mu, _ = model.encoder(test).chunk(2, dim=1)
        ordinary = (model.decoder(mu)-test).square().mean().item()
        shuffled = (model.decoder(mu[torch.randperm(len(mu))])-test).square().mean().item()
        samples = model.decoder(torch.randn(1000, 2))
    assert torch.isfinite(samples).all()
    print(f'beta={args.beta:g}; test reconstruction NLL={nll.item():.4f}; KL={kl.item():.4f}')
    print(f'Decoder-at-posterior-mean MSE={ordinary:.4f}; shuffled-code MSE={shuffled:.4f}')
    with open('dl-week-9-samples.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['decoder_mean_x', 'decoder_mean_y'])
        writer.writerows(samples.tolist())
    print('Saved decoder means from prior draws, not full Gaussian observation samples.')
    print('Inspect coverage, reconstructions, and latent interventions together; KL alone is not a collapse test.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
