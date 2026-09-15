import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 4,
  summary: "Build a small neural classifier with TensorFlow and Keras while preserving the evaluation discipline from the earlier weeks. You will specify tensor shapes, match the output to its loss, train with validation-based early stopping, and save a model that includes its preprocessing.",
  prerequisites: "Weeks 0–3: classification probabilities, validation, scaling, and optimization. Use a Python version supported by the TensorFlow installation guide.",
  objectives: ["Trace shapes and trainable parameters through a dense neural network.", "Match a binary sigmoid output with the correct loss and decision threshold.", "Train, validate, evaluate, and reload a model without fitting preprocessing on held-out data."],
  workflow: ["Split and normalize", "Build and compile", "Fit with validation", "Evaluate and save"],
  sections: [
    {
      id: "tensors-and-layers", title: "Read a network as a sequence of shapes",
      paragraphs: ["A batch of n examples with two features has shape (n, 2). A Dense layer with 16 units applies a learned matrix and bias to each row, producing (n, 16). A nonlinear activation such as ReLU makes successive layers more expressive than a single affine transformation.", "The example uses 2 inputs, two hidden layers of 16 units, and one output. Each Dense layer has input_width*output_width weights plus output_width biases. The three Dense layers therefore have 48 + 272 + 17 = 337 trainable parameters. The batch dimension changes how many examples are processed together, not how many weights the network learns."],
      formula: "(batch, 2) -> Dense(16, relu) -> (batch, 16)\n           -> Dense(16, relu) -> (batch, 16)\n           -> Dense(1, sigmoid) -> (batch, 1)",
      reference: { title: "Keras Dense layer", href: "https://keras.io/api/layers/core_layers/dense/" },
    },
    {
      id: "output-and-loss", title: "Match the output, labels, and loss",
      paragraphs: ["For binary labels 0 and 1, a one-unit sigmoid output returns an estimated positive-class probability p. Pair that output with BinaryCrossentropy(from_logits=False). An alternative is a linear output paired with from_logits=True; mixing a sigmoid output with a logits loss is incorrect.", "The example keeps labels shaped (n, 1), matching the output. A probability of at least 0.5 predicts class 1. That threshold is a chosen decision rule, not a learned universal optimum. If mistake costs require another threshold, choose it using validation data. A probability estimate is not automatically well calibrated."],
      formula: "Binary cross-entropy = -mean(y*log(p) + (1-y)*log(1-p))\npredicted_class = 1 if p >= 0.5 else 0",
      reference: { title: "Binary cross-entropy and logits", href: "https://keras.io/api/losses/probabilistic_losses/" },
    },
    {
      id: "normalization-and-splits", title: "Keep preprocessing inside the saved model",
      paragraphs: ["Reserve 20% of the examples for testing, then reserve one quarter of the remaining 80% for validation. This gives 60% training, 20% validation, and 20% test data. The validation set guides early stopping; it is not the final test set.", "A Keras Normalization layer learns per-feature means and variances through adapt(X_train). Apply adapt only to the training features. Keeping this layer inside the model lets inference receive raw features with the same ordering and units. This fixed preprocessing layer is different from BatchNormalization, which can use mini-batch statistics during training."],
      reference: { title: "Normalization layer and adapt", href: "https://keras.io/api/layers/preprocessing_layers/numerical/normalization/" },
    },
    {
      id: "compile-fit-evaluate", title: "Distinguish compile, fit, and evaluate",
      paragraphs: ["compile configures the optimizer, loss, and reported metrics. It does not train the weights. fit runs the training loop: predict on a batch, calculate loss, differentiate it, and update parameters. Adam adapts parameter updates using moving averages of gradients; its learning rate still matters.", "An epoch is one pass through the training data, while batch_size controls how many examples contribute to one update. evaluate computes loss and metrics without updating parameters. Inference uses the model's evaluation behavior. Training accuracy alone is not enough to decide whether the network is useful."],
      reference: { title: "Training and evaluation with Keras", href: "https://www.tensorflow.org/guide/keras/training_with_built_in_methods" },
    },
    {
      id: "early-stopping", title: "Stop using validation evidence",
      paragraphs: ["EarlyStopping monitors a chosen validation metric. With monitor='val_loss', patience=10, and restore_best_weights=True, training can stop after ten epochs without improvement and restore the weights from the best monitored epoch. The last entry in the training history need not describe those restored weights.", "Compare training and validation curves. A growing gap can suggest overfitting, while poor performance on both may indicate optimization trouble, insufficient features, or insufficient capacity. First check data, loss/output compatibility, and learning rate. Dropout or a larger network should answer a diagnosed problem rather than be added automatically."],
      reference: { title: "EarlyStopping behavior", href: "https://keras.io/api/callbacks/early_stopping/" },
    },
    {
      id: "save-and-compare", title: "Evaluate against a simple reference and save",
      paragraphs: ["The example fixes a logistic-regression reference and a neural architecture before evaluating either on the test data. A neural network is not guaranteed to outperform a simpler model. Do not use repeated test comparisons to keep changing the architecture; that would make the test set part of development.", "Saving to a .keras file stores the model architecture, weights, and optimizer state. The included Normalization layer carries its fitted statistics with it. Reload the model and check that inference matches. Keep the input schema too: a model cannot detect that someone swapped the order or units of two numeric columns."],
      reference: { title: "Saving and loading Keras models", href: "https://keras.io/api/models/model_saving_apis/model_saving_and_loading/" },
    },
    {
      id: "environment", title: "Use a supported Python environment",
      paragraphs: ["Install TensorFlow in a Python environment supported by the official installation guide. This small example runs on a CPU and does not require a GPU or an external dataset. The fixed random seeds make comparisons easier, but exact floating-point results can still differ across hardware and package versions."],
      reference: { title: "TensorFlow installation guide", href: "https://www.tensorflow.org/install/pip" },
    },
  ],
  example: {
    title: "A small neural classifier with a saved normalizer",
    description: "Train on the two-moons problem, use a separate validation set for early stopping, compare with a fixed logistic baseline, and save ml-week-4.keras in the directory where you run the script.",
    install: "python -m pip install numpy scikit-learn tensorflow",
    code: `import numpy as np
import tensorflow as tf
from sklearn.datasets import make_moons
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

tf.keras.utils.set_random_seed(7)
X, y = make_moons(n_samples=1000, noise=0.25, random_state=7)
X = X.astype("float32")
y = y.astype("float32")
X_dev, X_test, y_dev, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_dev, y_dev, test_size=0.25, random_state=42, stratify=y_dev
)
y_train = y_train.reshape(-1, 1)
y_val = y_val.reshape(-1, 1)

normalize = tf.keras.layers.Normalization(axis=-1)
normalize.adapt(X_train)
model = tf.keras.Sequential([
    tf.keras.Input(shape=(2,)),
    normalize,
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid"),
])
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.BinaryCrossentropy(from_logits=False),
    metrics=[tf.keras.metrics.BinaryAccuracy(name="accuracy")],
)
assert sum(np.prod(weight.shape) for weight in model.trainable_weights) == 337
stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=10, restore_best_weights=True
)
history = model.fit(
    X_train, y_train, validation_data=(X_val, y_val),
    epochs=100, batch_size=32, callbacks=[stop], verbose=0
)
print("Train/validation/test rows:", len(X_train), len(X_val), len(X_test))
print("Epochs run:", len(history.history["loss"]))
print("Best validation epoch:", int(np.argmin(history.history["val_loss"])) + 1)

# A fixed reference, trained on the same training rows.
baseline = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
baseline.fit(X_train, y_train.ravel())
probability = model(X_test, training=False).numpy().ravel()
prediction = (probability >= 0.5).astype(int)
assert probability.shape == y_test.shape
assert np.isfinite(probability).all()
assert ((probability >= 0) & (probability <= 1)).all()
print("Logistic test balanced accuracy:",
      balanced_accuracy_score(y_test, baseline.predict(X_test)))
print("Neural test balanced accuracy:", balanced_accuracy_score(y_test, prediction))
print("Neural test F1:", f1_score(y_test, prediction))

model.save("ml-week-4.keras")
restored = tf.keras.models.load_model("ml-week-4.keras")
reloaded_probability = restored(X_test, training=False).numpy().ravel()
np.testing.assert_allclose(probability, reloaded_probability, atol=1e-6, rtol=1e-6)
print("Saved and reloaded predictions match.")
`,
    observations: ["The split contains 600 training, 200 validation, and 200 test rows. Only the 600 training inputs supply normalization statistics.", "The Dense layers contain 337 trainable parameters. The normalizer adds stored statistics rather than trainable prediction weights.", "Training may stop before 100 epochs. Evaluate the restored model, not just the last history entry.", "The .keras file is created, and the script checks that reloading preserves predictions within a small numerical tolerance."],
  },
  pitfalls: ["Pairing sigmoid probabilities with a loss configured for raw logits.", "Calling adapt on the full dataset or using the test set as validation_data.", "Treating the final epoch's logged metrics as the metrics of restored best weights.", "Assuming a neural network must beat the baseline, or changing it repeatedly after inspecting test results."],
  exercises: [
    { task: "Calculate the trainable parameter count for hidden widths 8 and 8, keeping two inputs and one output.", success: "You obtain (2+1)*8 + (8+1)*8 + (8+1)*1 = 105 trainable Dense parameters." },
    { task: "Compare widths 8 and 16 using only training and validation data. Keep the test evaluation for the final chosen experiment.", success: "You record validation loss and explain whether the additional parameters helped in this experiment." },
    { task: "Run the saved model on the same raw feature rows, then explain what would happen if the input columns were swapped.", success: "Saved-model predictions match before swapping, and you identify the swapped schema as a different input rather than a serialization failure." },
  ],
  review: [
    { question: "Why does compile not count as training?", answer: "It chooses the loss, optimizer, and metrics. Parameter updates happen during fit or an explicit custom training loop." },
    { question: "Why use separate validation and test sets?", answer: "Early stopping and architecture choices use validation feedback. A test set must remain outside those decisions to estimate the performance of the final chosen procedure." },
    { question: "What loss setting matches Dense(1, activation='sigmoid')?", answer: "BinaryCrossentropy(from_logits=False) matches binary probabilities. A linear output would instead use from_logits=True, with sigmoid applied separately when probabilities are needed." },
    { question: "Why include Normalization inside the model?", answer: "It keeps the fitted training statistics with the saved model, so raw new features receive the same transformation at inference. Their schema and units must still match." },
    { question: "Does restore_best_weights restore the optimizer to the best epoch?", answer: "It restores model weights, not a complete optimizer checkpoint for that epoch. This lesson checks inference after restoration and saving; exact training resumption from a chosen epoch requires an appropriate full checkpoint." },
  ],
};

export default lesson;
