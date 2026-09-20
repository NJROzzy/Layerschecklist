"""DL Week 3: Optimization and Generalization.

An independent teaching example accompanying the Algorithms II Week 4 material.
Run with: python -m pip install torch
          python dl-week-3.py

Creates synthetic data locally; writes learning curves, a comparison summary,
and an inference checkpoint in the current directory.
"""
import copy
import csv
import math
import statistics
import time

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

torch.set_num_threads(1)
SEEDS = (17, 29)
MAX_EPOCHS = 50
PATIENCE = 6
BATCH_SIZE = 32
# Start without decay to study the optimizer/rate choices. Investigate
# regularization separately; equal decay numbers have different meanings
# for momentum SGD's coupled penalty and AdamW's decoupled shrinkage.
WEIGHT_DECAY = 0.0
CONFIGS = (
    ("momentum", 0.01), ("momentum", 0.05),
    ("adamw", 0.001), ("adamw", 0.01),
)

# The data generator and split are independent of each model's seed.
data_rng = torch.Generator().manual_seed(42)
X = torch.randn(600, 20, generator=data_rng)
signal = (1.4 * X[:, 0] - 0.9 * X[:, 1]
          + 0.6 * X[:, 2] * X[:, 3]
          + 0.5 * torch.randn(600, generator=data_rng))
y = (signal > 0).float().reshape(-1, 1)
indices = torch.randperm(len(X), generator=data_rng)
train_idx, val_idx, test_idx = indices[:360], indices[360:480], indices[480:]
X_train, y_train = X[train_idx], y[train_idx]
X_val, y_val = X[val_idx], y[val_idx]
X_test, y_test = X[test_idx], y[test_idx]
assert not set(train_idx.tolist()) & set(test_idx.tolist())
assert not set(val_idx.tolist()) & set(test_idx.tolist())

# Fit input statistics on training rows only.
train_mean = X_train.mean(dim=0)
train_std = X_train.std(dim=0, unbiased=False).clamp_min(1e-6)


class Classifier(nn.Module):
    def __init__(self):
        super().__init__()
        # Stored with the weights so inference accepts raw inputs.
        self.register_buffer("mean", train_mean.clone())
        self.register_buffer("std", train_std.clone())
        self.layers = nn.Sequential(
            nn.Linear(20, 64),
            nn.ReLU(),
            nn.Dropout(p=0.25),
            nn.Linear(64, 1),
        )

    def forward(self, features):
        return self.layers((features - self.mean) / self.std)


loss_fn = nn.BCEWithLogitsLoss()


def score(model, features, labels):
    model.eval()  # Disable dropout during both train-set and validation scoring.
    with torch.inference_mode():
        logits = model(features)
        loss = float(loss_fn(logits, labels))
        accuracy = float(((logits >= 0) == labels.bool()).float().mean())
    return loss, accuracy


curves = []


def fit_run(name, rate, seed):
    torch.manual_seed(seed)
    model = Classifier()
    # Separate generator: same initial batch order for a given seed/config.
    loader = DataLoader(
        TensorDataset(X_train, y_train), batch_size=BATCH_SIZE, shuffle=True,
        generator=torch.Generator().manual_seed(seed + 1000),
        num_workers=0,
    )
    if name == "momentum":
        optimizer = torch.optim.SGD(
            model.parameters(), lr=rate, momentum=0.9,
            weight_decay=WEIGHT_DECAY,
        )
    else:
        optimizer = torch.optim.AdamW(
            model.parameters(), lr=rate, weight_decay=WEIGHT_DECAY,
        )
    best_loss, best_epoch, waiting, best_state = math.inf, 0, 0, None
    started = time.perf_counter()
    for epoch in range(1, MAX_EPOCHS + 1):
        model.train()  # score() switches to eval, so reset every epoch.
        for features, labels in loader:
            optimizer.zero_grad(set_to_none=True)
            loss = loss_fn(model(features), labels)
            if not torch.isfinite(loss):
                raise RuntimeError("Non-finite training loss; inspect this run.")
            loss.backward()
            optimizer.step()

        # Both curves use eval mode and the same loss definition.
        train_loss, _ = score(model, X_train, y_train)
        val_loss, val_accuracy = score(model, X_val, y_val)
        if not math.isfinite(val_loss):
            raise RuntimeError("Non-finite validation loss.")
        curves.append({
            "optimizer": name, "lr": rate, "seed": seed, "epoch": epoch,
            "train_loss_eval_mode": train_loss,
            "validation_loss": val_loss, "validation_accuracy": val_accuracy,
        })
        if val_loss < best_loss:
            best_loss, best_epoch, waiting = val_loss, epoch, 0
            # A reference to state_dict() would keep changing during training.
            best_state = copy.deepcopy(model.state_dict())
        else:
            waiting += 1
            if waiting >= PATIENCE:
                break
    elapsed = time.perf_counter() - started
    assert best_state is not None
    model.load_state_dict(best_state)
    restored_loss, restored_accuracy = score(model, X_val, y_val)
    assert math.isclose(restored_loss, best_loss, abs_tol=1e-6)
    result = {
        "optimizer": name, "lr": rate, "seed": seed,
        "best_epoch": best_epoch, "epochs_run": epoch,
        "validation_loss": restored_loss,
        "validation_accuracy": restored_accuracy, "seconds": elapsed,
    }
    print(result)
    return model, result


runs = {}
summaries = []
for name, rate in CONFIGS:
    for seed in SEEDS:
        model, summary = fit_run(name, rate, seed)
        runs[(name, rate, seed)] = model
        summaries.append(summary)

# Choose the configuration using mean validation loss across the fixed seeds.
# Do not choose a favorable seed from its score.
mean_validation = {
    (name, rate): statistics.mean(
        row["validation_loss"] for row in summaries
        if row["optimizer"] == name and row["lr"] == rate
    )
    for name, rate in CONFIGS
}
selected = min(mean_validation, key=mean_validation.get)
print("Mean validation loss by configuration:", mean_validation)
print("Selected configuration:", selected)

# Prespecify the first seed's retained model for the single final test report.
# This is a small teaching study, not a robust ranking of optimizer families.
final_model = runs[(*selected, SEEDS[0])]
test_loss, test_accuracy = score(final_model, X_test, y_test)
print("Final held-out test loss / accuracy:", test_loss, test_accuracy)

for filename, rows in (
    ("dl-week-3-curves.csv", curves),
    ("dl-week-3-summary.csv", summaries),
):
    with open(filename, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)

checkpoint = {
    "state_dict": final_model.state_dict(),
    "optimizer_name": selected[0], "learning_rate": selected[1],
    "seed": SEEDS[0], "feature_order": [f"x{i}" for i in range(20)],
}
torch.save(checkpoint, "dl-week-3.pt")
reloaded = Classifier()
reloaded.load_state_dict(
    torch.load("dl-week-3.pt", weights_only=True)["state_dict"]
)
final_model.eval()
reloaded.eval()
with torch.inference_mode():
    torch.testing.assert_close(final_model(X_val), reloaded(X_val))
print("Saved inference checkpoint; reloaded validation predictions match.")
print("Versions: PyTorch", torch.__version__)
print("Open dl-week-3-curves.csv in Excel; group by optimizer, lr, and seed.")
# For exact training resumption, also save optimizer/scheduler state, epoch,
# random-generator state, and any other state required by the input pipeline.

