"""Week 10: autoencoders, denoising, and variational autoencoders on CPU.

python -m pip install torch
python dl-week-10.py [--smoke] [--beta 1.0] [--latent-dim 2]

Generates binary 8x8 bar images without downloading data.
Writes dl-week-10-history.csv and dl-week-10-images.csv in the current folder.
The image CSV contains 64 row-major pixels per row, ready to reshape to 8x8.
"""
import argparse
import copy
import csv
import math

import torch
from torch import nn
from torch.nn import functional as F

torch.set_num_threads(1)
SIDE = 8
INPUT_DIM = SIDE * SIDE


def make_data(count, seed):
    generator = torch.Generator().manual_seed(seed)
    rows = torch.randint(SIDE, (count,), generator=generator)
    columns = torch.randint(SIDE, (count,), generator=generator)
    images = torch.zeros(count, SIDE, SIDE)
    images[torch.arange(count), rows, :] = 1
    images[torch.arange(count), :, columns] = 1
    return images.flatten(1)


def corrupt(clean, generator):
    flips = torch.rand(clean.shape, generator=generator) < .2
    return torch.where(flips, 1 - clean, clean)


class Autoencoder(nn.Module):
    def __init__(self, latent_dim):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(INPUT_DIM, 128), nn.ReLU(), nn.Linear(128, latent_dim))
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 128), nn.ReLU(), nn.Linear(128, INPUT_DIM))

    def forward(self, inputs):
        latent = self.encoder(inputs)
        return self.decoder(latent), latent


class VAE(nn.Module):
    def __init__(self, latent_dim):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(INPUT_DIM, 128), nn.ReLU())
        self.mu = nn.Linear(128, latent_dim)
        self.logvar = nn.Linear(128, latent_dim)
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 128), nn.ReLU(), nn.Linear(128, INPUT_DIM))

    @staticmethod
    def reparameterize(mu, logvar, epsilon):
        return mu + torch.exp(.5 * logvar) * epsilon

    def encode(self, inputs):
        hidden = self.encoder(inputs)
        return self.mu(hidden), self.logvar(hidden)

    def forward(self, inputs, epsilon):
        mu, logvar = self.encode(inputs)
        latent = self.reparameterize(mu, logvar, epsilon)
        return self.decoder(latent), mu, logvar, latent


def reconstruction_nll(logits, clean):
    return F.binary_cross_entropy_with_logits(
        logits, clean, reduction='none').sum(dim=1).mean()


def gaussian_kl(mu, logvar):
    return .5 * (mu.square() + logvar.exp() - 1 - logvar).sum(dim=1).mean()


def objective(model, inputs, clean, epsilon):
    if isinstance(model, VAE):
        logits, mu, logvar, _ = model(inputs, epsilon)
        return reconstruction_nll(logits, clean), gaussian_kl(mu, logvar)
    logits, _ = model(inputs)
    return reconstruction_nll(logits, clean), logits.new_zeros(())


def verify_mechanics():
    mu = torch.tensor([[1., 0.]], requires_grad=True)
    logvar = torch.zeros_like(mu, requires_grad=True)
    epsilon = torch.tensor([[-.5, .25]])
    latent = VAE.reparameterize(mu, logvar, epsilon)
    assert torch.allclose(latent, torch.tensor([[.5, .25]]))
    latent.sum().backward()
    assert torch.allclose(mu.grad, torch.ones_like(mu))
    assert torch.allclose(logvar.grad, .5 * epsilon)
    assert torch.allclose(gaussian_kl(mu.detach(), logvar.detach()), torch.tensor(.5))
    assert gaussian_kl(torch.zeros(2, 3), torch.zeros(2, 3)).item() == 0
    assert math.isclose(reconstruction_nll(torch.zeros(2, INPUT_DIM),
                                          torch.zeros(2, INPUT_DIM)).item(),
                        INPUT_DIM * math.log(2), rel_tol=1e-6)


def train_model(name, model, train, validation, latent_dim, beta, steps, history):
    optimizer = torch.optim.Adam(model.parameters(), lr=.003)
    batches = torch.Generator().manual_seed(31)
    corruption = torch.Generator().manual_seed(32)
    validation_input = (corrupt(validation, torch.Generator().manual_seed(33))
                        if name == 'denoising' else validation)
    validation_epsilon = torch.randn(
        len(validation), latent_dim, generator=torch.Generator().manual_seed(34))
    best_score, best_state = float('inf'), None
    for step in range(steps):
        model.train()
        clean = train[torch.randint(len(train), (128,), generator=batches)]
        inputs = corrupt(clean, corruption) if name == 'denoising' else clean
        epsilon = torch.randn(len(clean), latent_dim)
        reconstruction, kl = objective(model, inputs, clean, epsilon)
        loss = reconstruction + beta * kl
        assert torch.isfinite(loss)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()
        if step % 25 == 0 or step == steps - 1:
            model.eval()
            with torch.no_grad():
                val_reconstruction, val_kl = objective(
                    model, validation_input, validation, validation_epsilon)
                score = (val_reconstruction + beta * val_kl).item()
            history.append([name, step + 1, reconstruction.item(), kl.item(),
                            val_reconstruction.item(), val_kl.item(), score])
            if score < best_score:
                best_score = score
                best_state = copy.deepcopy(model.state_dict())
    model.load_state_dict(best_state)
    model.eval()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--smoke', action='store_true')
    parser.add_argument('--beta', type=float, default=1.)
    parser.add_argument('--latent-dim', type=int, default=2)
    args = parser.parse_args()
    if not math.isfinite(args.beta) or args.beta < 0:
        parser.error('--beta must be finite and nonnegative')
    if args.latent_dim < 1:
        parser.error('--latent-dim must be positive')
    verify_mechanics()
    train, validation, test = (make_data(count, seed)
                               for count, seed in [(1024, 1), (256, 2), (512, 3)])
    corrupted_test = corrupt(test, torch.Generator().manual_seed(35))
    history, models = [], {}
    print('PyTorch', torch.__version__, '| CPU | binary 8x8 images')
    print('Mechanics passed: reparameterization gradients, KL, and pixel-summed NLL.')
    for name in ['autoencoder', 'denoising', 'vae']:
        torch.manual_seed(7)
        model = VAE(args.latent_dim) if name == 'vae' else Autoencoder(args.latent_dim)
        train_model(name, model, train, validation, args.latent_dim, args.beta,
                    12 if args.smoke else 600, history)
        models[name] = model

    torch.manual_seed(36)
    with torch.no_grad():
        for name in ['autoencoder', 'denoising']:
            clean_logits, _ = models[name](test)
            noisy_logits, _ = models[name](corrupted_test)
            print(f'{name}: clean test NLL={reconstruction_nll(clean_logits, test):.3f}; '
                  f'corrupted-to-clean test NLL={reconstruction_nll(noisy_logits, test):.3f}')
        vae = models['vae']
        epsilon = torch.randn(len(test), args.latent_dim)
        reconstruction, kl = objective(vae, test, test, epsilon)
        print(f'VAE: test sampled reconstruction NLL={reconstruction:.3f}; '
              f'KL={kl:.3f}; NLL + beta*KL={reconstruction + args.beta*kl:.3f}')
        print(f'beta={args.beta:g}; latent_dim={args.latent_dim}; '
              'NLL sums pixels, KL sums latent coordinates; both average examples.')
        mu, logvar = vae.encode(test)
        ordinary = reconstruction_nll(vae.decoder(mu), test)
        shuffled = reconstruction_nll(vae.decoder(mu[torch.randperm(len(mu))]), test)
        print(f'Decoder-at-posterior-mean NLL={ordinary:.3f}; shuffled-code NLL={shuffled:.3f}')
        print('Posterior mean variance by coordinate:', mu.var(dim=0).tolist())
        print('Average posterior variance by coordinate:', logvar.exp().mean(dim=0).tolist())
        prior_probabilities = torch.sigmoid(vae.decoder(torch.randn(16, args.latent_dim)))
        prior_observations = torch.bernoulli(prior_probabilities)
        endpoint = (test != test[0]).any(dim=1).nonzero()[0].item()
        fractions = torch.linspace(0, 1, 9).unsqueeze(1)
        latent_path = (1 - fractions) * mu[0] + fractions * mu[endpoint]
        interpolated = torch.sigmoid(vae.decoder(latent_path))
        exports = {'clean': test[:16], 'corrupted': corrupted_test[:16],
                   'vae_reconstruction_probability': torch.sigmoid(vae.decoder(mu[:16])),
                   'vae_prior_probability': prior_probabilities,
                   'vae_prior_observation': prior_observations,
                   'vae_interpolation_probability': interpolated}
        for name in ['autoencoder', 'denoising']:
            logits, _ = models[name](test[:16])
            noisy_logits, _ = models[name](corrupted_test[:16])
            exports[name + '_clean_probability'] = torch.sigmoid(logits)
            exports[name + '_denoised_probability'] = torch.sigmoid(noisy_logits)
    with open('dl-week-10-history.csv', 'w', newline='') as output:
        writer = csv.writer(output)
        writer.writerow(['model', 'step', 'train_reconstruction_nll', 'train_kl',
                         'validation_reconstruction_nll', 'validation_kl', 'validation_objective'])
        writer.writerows(history)
    with open('dl-week-10-images.csv', 'w', newline='') as output:
        writer = csv.writer(output)
        writer.writerow(['kind', 'index'] + [f'pixel_{index}' for index in range(INPUT_DIM)])
        for kind, images in exports.items():
            assert torch.isfinite(images).all()
            for index, image in enumerate(images):
                writer.writerow([kind, index] + image.tolist())
    print('Saved history and images. Reshape pixel columns to 8x8 to inspect them.')
    print('Inspect reconstructions, prior draws, interpolation, and code interventions together.')
    if args.smoke:
        print('Smoke run checks execution, not convergence.')


if __name__ == '__main__':
    main()
