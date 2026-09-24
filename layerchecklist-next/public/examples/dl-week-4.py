"""DL Week 4: Convolutional Neural Networks.

An independent teaching example accompanying the Algorithms II Week 5 material.
Run with: python -m pip install torch
          python dl-week-4.py

Builds a synthetic stripe-orientation task locally, trains a small CNN and a
dense baseline under the same split and budget, selects each by validation
loss, and reports held-out accuracy plus a shifted/noisier stress set.
No dataset or checkpoint is downloaded.
"""
import argparse
import copy

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

torch.set_num_threads(1)

SIZE = 16
CLASSES = ("horizontal", "vertical")


def make_stripes(count, seed, noise=0.9, phases=(0,)):
    """Half horizontal, half vertical stripes, drawn only at the given phases.

    Training uses one phase; the stress set uses phases never seen. The label
    rule does not depend on phase, so a model that has learned orientation
    rather than pixel positions should survive the shift.
    """
    g = torch.Generator().manual_seed(seed)
    images = torch.zeros(count, 1, SIZE, SIZE)
    labels = torch.zeros(count, dtype=torch.long)
    for i in range(count):
        vertical = i % 2
        period = 4
        phase = phases[int(torch.randint(0, len(phases), (1,), generator=g).item())]
        band = ((torch.arange(SIZE) + phase) % period < period // 2).float()
        images[i, 0] = band.repeat(SIZE, 1) if vertical else band.unsqueeze(1).repeat(1, SIZE)
        labels[i] = vertical
    images += noise * torch.randn(images.shape, generator=g)
    return TensorDataset(images, labels)


class SmallCNN(nn.Module):
    """Two convolution stages, then one linear head. Shapes are printed once."""

    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 8, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(8, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
        )
        self.head = nn.Sequential(nn.Flatten(), nn.Linear(16 * 4 * 4, 2))

    def forward(self, x):
        return self.head(self.features(x))


class DenseBaseline(nn.Module):
    """A flatten-first model, given a comparable parameter budget."""

    def __init__(self, hidden=24):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(), nn.Linear(SIZE * SIZE, hidden), nn.ReLU(), nn.Linear(hidden, 2)
        )

    def forward(self, x):
        return self.net(x)


def evaluate(model, loader):
    model.eval()
    loss_sum = correct = total = 0
    with torch.no_grad():
        for images, labels in loader:
            logits = model(images)
            loss_sum += nn.functional.cross_entropy(logits, labels, reduction="sum").item()
            correct += (logits.argmax(1) == labels).sum().item()
            total += labels.numel()
    return loss_sum / total, correct / total


def train(model, train_loader, val_loader, epochs, lr=3e-3):
    """Fit, keeping the parameters that gave the lowest validation loss."""
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
    best_loss, best_state, best_epoch = float("inf"), copy.deepcopy(model.state_dict()), 0
    for epoch in range(1, epochs + 1):
        model.train()
        for images, labels in train_loader:
            optimizer.zero_grad()
            loss = nn.functional.cross_entropy(model(images), labels)
            loss.backward()
            optimizer.step()
        val_loss, val_acc = evaluate(model, val_loader)
        if val_loss < best_loss:
            best_loss, best_state, best_epoch = val_loss, copy.deepcopy(model.state_dict()), epoch
        print(f"    epoch {epoch:2d}  val loss {val_loss:.4f}  val acc {val_acc:.3f}")
    model.load_state_dict(best_state)
    return best_loss, best_epoch


def count_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke", action="store_true", help="execution check, not a convergence result")
    args = parser.parse_args()

    torch.manual_seed(0)
    epochs = 2 if args.smoke else 12
    n_train = 128 if args.smoke else 1024

    # Train, validate and test on one stripe phase; stress on phases never seen.
    train_set = make_stripes(n_train, seed=1, phases=(0,))
    val_set = make_stripes(256, seed=2, phases=(0,))
    test_set = make_stripes(256, seed=3, phases=(0,))
    stress_set = make_stripes(256, seed=4, phases=(1, 2, 3))

    train_loader = DataLoader(train_set, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=128)
    test_loader = DataLoader(test_set, batch_size=128)
    stress_loader = DataLoader(stress_set, batch_size=128)

    sample = train_set[0][0].unsqueeze(0)
    probe = SmallCNN()
    print("Tensor shapes through the CNN")
    print(f"  input           {tuple(sample.shape)}")
    with torch.no_grad():
        feats = probe.features(sample)
    print(f"  after features  {tuple(feats.shape)}")
    print(f"  logits          {tuple(probe(sample).shape)}   (expected [1, 2])")

    results = {}
    for name, model in (("CNN", SmallCNN()), ("Dense baseline", DenseBaseline())):
        print(f"\n{name} — {count_parameters(model):,} trainable parameters")
        before_loss, before_acc = evaluate(model, val_loader)
        print(f"    before training: val loss {before_loss:.4f}  val acc {before_acc:.3f}")
        best_loss, best_epoch = train(model, train_loader, val_loader, epochs)
        test_loss, test_acc = evaluate(model, test_loader)
        stress_loss, stress_acc = evaluate(model, stress_loader)
        results[name] = dict(params=count_parameters(model), before=before_loss, best=best_loss,
                             epoch=best_epoch, test=test_acc, stress=stress_acc)
        print(f"    selected epoch {best_epoch} (val loss {best_loss:.4f})")
        print(f"    test accuracy {test_acc:.3f}   shifted-phase stress set {stress_acc:.3f}")

    print("\nSummary")
    print(f"  {'model':<16}{'params':>9}{'val before':>12}{'val best':>10}{'test':>8}{'shifted':>9}")
    for name, r in results.items():
        print(f"  {name:<16}{r['params']:>9,}{r['before']:>12.4f}{r['best']:>10.4f}{r['test']:>8.3f}{r['stress']:>9.3f}")
    print("\nThe test column uses the phase the models trained on; the stress column")
    print("uses phases they never saw. A gap between the two is the quantity of")
    print("interest, not the headline accuracy. One run on one synthetic task —")
    print("repeat across seeds before treating either architecture as better.")
    if args.smoke:
        print("Smoke run: execution only. These numbers are not a convergence result.")


if __name__ == "__main__":
    main()
