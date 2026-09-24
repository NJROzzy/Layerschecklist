"""DL Week 5: Residual Networks and Transfer Learning.

An independent teaching example accompanying the Algorithms II Week 6 material.
Run with: python -m pip install torch
          python dl-week-5.py

Pretrains a tiny residual backbone on a clean synthetic source task, then
compares three strategies on a smaller, noisier target task: a frozen backbone
with a new head, full fine-tuning, and training from scratch. Everything is
generated and trained locally; no checkpoint is downloaded.
"""
import argparse
import copy

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

torch.set_num_threads(1)

SIZE = 16


def make_stripes(count, seed, noise, period=4):
    """Half horizontal, half vertical stripes at a random phase, plus noise."""
    g = torch.Generator().manual_seed(seed)
    images = torch.zeros(count, 1, SIZE, SIZE)
    labels = torch.zeros(count, dtype=torch.long)
    for i in range(count):
        vertical = i % 2
        phase = int(torch.randint(0, period, (1,), generator=g).item())
        band = ((torch.arange(SIZE) + phase) % period < period // 2).float()
        images[i, 0] = band.repeat(SIZE, 1) if vertical else band.unsqueeze(1).repeat(1, SIZE)
        labels[i] = vertical
    images += noise * torch.randn(images.shape, generator=g)
    return TensorDataset(images, labels)


class ResidualBlock(nn.Module):
    """y = relu(F(x) + shortcut(x)), with a 1x1 projection when shapes differ."""

    def __init__(self, c_in, c_out, stride=1):
        super().__init__()
        self.branch = nn.Sequential(
            nn.Conv2d(c_in, c_out, 3, stride=stride, padding=1, bias=False),
            nn.BatchNorm2d(c_out), nn.ReLU(),
            nn.Conv2d(c_out, c_out, 3, padding=1, bias=False),
            nn.BatchNorm2d(c_out),
        )
        same = stride == 1 and c_in == c_out
        self.shortcut = nn.Identity() if same else nn.Sequential(
            nn.Conv2d(c_in, c_out, 1, stride=stride, bias=False), nn.BatchNorm2d(c_out)
        )

    def forward(self, x):
        return nn.functional.relu(self.branch(x) + self.shortcut(x))


def make_backbone():
    return nn.Sequential(
        nn.Conv2d(1, 8, 3, padding=1, bias=False), nn.BatchNorm2d(8), nn.ReLU(),
        ResidualBlock(8, 8),
        ResidualBlock(8, 16, stride=2),
        nn.AdaptiveAvgPool2d(1), nn.Flatten(),
    )


def make_head():
    return nn.Linear(16, 2)


def evaluate(backbone, head, loader):
    backbone.eval(); head.eval()
    loss_sum = correct = total = 0
    with torch.no_grad():
        for images, labels in loader:
            logits = head(backbone(images))
            loss_sum += nn.functional.cross_entropy(logits, labels, reduction="sum").item()
            correct += (logits.argmax(1) == labels).sum().item()
            total += labels.numel()
    return loss_sum / total, correct / total


def train(backbone, head, train_loader, val_loader, epochs, groups, freeze_backbone):
    """Fit, restoring whichever parameters gave the lowest validation loss."""
    optimizer = torch.optim.AdamW(groups)
    best = float("inf")
    best_state = (copy.deepcopy(backbone.state_dict()), copy.deepcopy(head.state_dict()))
    for _ in range(epochs):
        # model.train() would put a frozen backbone's BatchNorm back into
        # training mode and let its running statistics drift, so set the modes
        # explicitly every epoch rather than once at the start.
        head.train()
        backbone.eval() if freeze_backbone else backbone.train()
        for images, labels in train_loader:
            optimizer.zero_grad()
            if freeze_backbone:
                with torch.no_grad():
                    features = backbone(images)
            else:
                features = backbone(images)
            loss = nn.functional.cross_entropy(head(features), labels)
            loss.backward()
            optimizer.step()
        val_loss, _ = evaluate(backbone, head, val_loader)
        if val_loss < best:
            best = val_loss
            best_state = (copy.deepcopy(backbone.state_dict()), copy.deepcopy(head.state_dict()))
    backbone.load_state_dict(best_state[0]); head.load_state_dict(best_state[1])
    return best


def buffer_signature(module):
    """A single number summarising every BatchNorm running statistic."""
    return sum(float(b.sum()) for b in module.buffers())


def counts(backbone, head):
    total = sum(p.numel() for p in list(backbone.parameters()) + list(head.parameters()))
    trainable = sum(p.numel() for p in list(backbone.parameters()) + list(head.parameters()) if p.requires_grad)
    return total, trainable


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke", action="store_true", help="execution check, not a convergence result")
    args = parser.parse_args()

    torch.manual_seed(0)
    source_epochs = 2 if args.smoke else 14
    target_epochs = 2 if args.smoke else 24
    source_n = 128 if args.smoke else 1024
    target_n = 16 if args.smoke else 16

    # Source: many examples, and imagery that resembles the target. Target: very
    # few labels. That combination is the case where reusing features should pay.
    # Lower SOURCE_NOISE towards 0.25 to widen the domain gap and watch the
    # frozen backbone lose its advantage.
    SOURCE_NOISE, TARGET_NOISE = 0.9, 1.6
    source_train = DataLoader(make_stripes(source_n, 1, noise=SOURCE_NOISE), batch_size=32, shuffle=True)
    source_val = DataLoader(make_stripes(256, 2, noise=SOURCE_NOISE), batch_size=128)
    target_train = DataLoader(make_stripes(target_n, 3, noise=TARGET_NOISE), batch_size=8, shuffle=True)
    target_val = DataLoader(make_stripes(256, 4, noise=TARGET_NOISE), batch_size=128)
    target_test = DataLoader(make_stripes(512, 5, noise=TARGET_NOISE), batch_size=128)

    print("Shape check: the residual branch and its projection must agree")
    block = ResidualBlock(8, 16, stride=2)
    probe = torch.zeros(2, 8, 16, 16)
    with torch.no_grad():
        branch_out, short_out = block.branch(probe), block.shortcut(probe)
    print(f"  input     {tuple(probe.shape)}")
    print(f"  branch    {tuple(branch_out.shape)}")
    print(f"  shortcut  {tuple(short_out.shape)}")
    print(f"  addable   {branch_out.shape == short_out.shape}")

    print(f"\nPretraining the backbone on the clean source task ({source_n} examples)")
    backbone, head = make_backbone(), make_head()
    train(backbone, head, source_train, source_val, source_epochs,
          [{"params": list(backbone.parameters()) + list(head.parameters()), "lr": 3e-3}], False)
    _, source_acc = evaluate(backbone, head, source_val)
    print(f"  source validation accuracy {source_acc:.3f}")
    pretrained = copy.deepcopy(backbone.state_dict())

    print(f"\nTarget task: {target_n} noisy examples, three strategies")
    results = {}

    # 1. Frozen backbone, new head.
    b, h = make_backbone(), make_head()
    b.load_state_dict(pretrained)
    for p in b.parameters():
        p.requires_grad_(False)
    before = buffer_signature(b)
    total, trainable = counts(b, h)
    train(b, h, target_train, target_val, target_epochs, [{"params": h.parameters(), "lr": 5e-3}], True)
    after = buffer_signature(b)
    _, acc = evaluate(b, h, target_test)
    results["Frozen backbone"] = (total, trainable, acc)
    print(f"  frozen    buffers before {before:.6f} after {after:.6f} -> "
          f"{'unchanged' if abs(before - after) < 1e-9 else 'CHANGED'}")

    # 2. Fine-tune everything, with a smaller rate on the pretrained weights.
    b, h = make_backbone(), make_head()
    b.load_state_dict(pretrained)
    total, trainable = counts(b, h)
    train(b, h, target_train, target_val, target_epochs,
          [{"params": b.parameters(), "lr": 3e-4}, {"params": h.parameters(), "lr": 3e-3}], False)
    _, acc = evaluate(b, h, target_test)
    results["Fine-tuned"] = (total, trainable, acc)

    # 3. No source data at all.
    b, h = make_backbone(), make_head()
    total, trainable = counts(b, h)
    train(b, h, target_train, target_val, target_epochs,
          [{"params": list(b.parameters()) + list(h.parameters()), "lr": 3e-3}], False)
    _, acc = evaluate(b, h, target_test)
    results["From scratch"] = (total, trainable, acc)

    print(f"\n  {'strategy':<18}{'total':>9}{'trainable':>11}{'test acc':>10}")
    for name, (total, trainable, acc) in results.items():
        print(f"  {name:<18}{total:>9,}{trainable:>11,}{acc:>10.3f}")

    print("\nThe two transfer rows have already seen 1024 source examples; the scratch")
    print("row has only the 16 target labels. That is a difference in data budget, not")
    print("only in method, and it is the main reason the gap is large.")
    print("Try SOURCE_NOISE = 0.25 to make the source look unlike the target: the")
    print("frozen backbone can then fall to chance while fine-tuning still adapts.")
    print("One run on one synthetic pair — vary the seed before ranking anything.")
    if args.smoke:
        print("Smoke run: execution only. These numbers are not a convergence result.")


if __name__ == "__main__":
    main()
