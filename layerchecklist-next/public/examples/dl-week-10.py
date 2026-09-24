"""Week 10: non-saturating GAN on eight Gaussian modes. CPU only.
python -m pip install torch
python dl-week-10.py [--smoke]
Writes dl-week-10-samples.csv in the working directory.
"""
import argparse
import csv
import math
import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)
ANGLES = torch.arange(8) * (2*math.pi/8)
CENTERS = 2*torch.stack([ANGLES.cos(), ANGLES.sin()], dim=1)


def real_samples(n):
    return CENTERS[torch.randint(8, (n,))] + .12*torch.randn(n, 2)


def network(input_dim, output_dim):
    return nn.Sequential(nn.Linear(input_dim, 64), nn.LeakyReLU(.2),
                         nn.Linear(64, 64), nn.LeakyReLU(.2), nn.Linear(64, output_dim))


def diagnostics(points):
    distance, mode = torch.cdist(points, CENTERS).min(dim=1)
    near = distance < .4  # declared diagnostic radius; not tuned on outputs
    counts = torch.bincount(mode[near], minlength=8)
    return int((counts >= 5).sum()), distance.mean().item(), counts.tolist()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--smoke', action='store_true')
    args = p.parse_args()
    torch.manual_seed(7)
    print('PyTorch', torch.__version__)
    generator, discriminator = network(4, 2), network(2, 1)
    opt_g = torch.optim.Adam(generator.parameters(), lr=.001, betas=(.5, .999))
    opt_d = torch.optim.Adam(discriminator.parameters(), lr=.001, betas=(.5, .999))
    fixed_z = torch.randn(128, 4)
    # Check routing independently of the training loop.
    for par in discriminator.parameters():
        par.requires_grad_(False)
    test_loss = F.softplus(-discriminator(generator(torch.randn(16, 4)))).mean()
    test_loss.backward()
    assert any(par.grad is not None and par.grad.abs().sum() > 0 for par in generator.parameters())
    assert all(par.grad is None for par in discriminator.parameters())
    generator.zero_grad(set_to_none=True)
    for par in discriminator.parameters():
        par.requires_grad_(True)
    print('Gradient routing: generator receives gradients through frozen discriminator.')
    steps = 12 if args.smoke else 1800
    for step in range(steps):
        real = real_samples(128)
        fake = generator(torch.randn(128, 4)).detach()
        opt_d.zero_grad(set_to_none=True)
        # softplus(-real_logit) + softplus(fake_logit) = BCE logits targets 1 and 0.
        loss_d = F.softplus(-discriminator(real)).mean() + F.softplus(discriminator(fake)).mean()
        loss_d.backward()
        opt_d.step()
        opt_d.zero_grad(set_to_none=True)
        for par in discriminator.parameters():
            par.requires_grad_(False)
        opt_g.zero_grad(set_to_none=True)
        loss_g = F.softplus(-discriminator(generator(torch.randn(128, 4)))).mean()
        loss_g.backward()
        opt_g.step()
        for par in discriminator.parameters():
            par.requires_grad_(True)
        assert torch.isfinite(loss_d) and torch.isfinite(loss_g)
        if step % 300 == 0:
            with torch.no_grad():
                _, dist, _ = diagnostics(generator(fixed_z))
            print(f'step={step} D={loss_d.item():.4f} G={loss_g.item():.4f} fixed-z mode distance={dist:.3f}')
    generator.eval()
    with torch.no_grad():
        samples = generator(torch.randn(1000, 4))
        coverage, distance, counts = diagnostics(samples)
        real_coverage, real_distance, _ = diagnostics(real_samples(1000))
    print(f'Generated: {coverage}/8 modes with >=5 samples within radius .4; mean mode distance={distance:.3f}')
    print('Counts within radius:', counts)
    print(f'Fresh real reference: {real_coverage}/8 modes; mean distance={real_distance:.3f}')
    with open('dl-week-10-samples.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['x', 'y'])
        writer.writerows(samples.tolist())
    print('Fixed-budget result, no final-metric checkpoint selection. Repeat seeds; losses are not quality scores.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
