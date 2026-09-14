import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 0,
  summary: "Turn raw observations into model inputs without letting evaluation data influence training. You will inspect a small table, separate its target, split the observations, and build a preprocessing pipeline that also works on new rows.",
  prerequisites: "Python variables, lists, functions, and basic pandas DataFrame operations. No previous model training is required.",
  objectives: ["Define a prediction target and identify inputs available at prediction time.", "Choose a split that reflects how the model will be used.", "Fit imputation, scaling, and category encoding on training data only."],
  workflow: ["Inspect the data", "Separate and split", "Fit preprocessing", "Transform new rows"],
  sections: [
    {
      id: "define-the-row", title: "Define the row and the prediction",
      paragraphs: ["A supervised dataset contains input features X and a target y. If each row describes a machine today and y records whether it needs service next week, the inputs must be available today. A repair invoice created next week would reveal the future and cannot be an input.", "Write down what one row represents, when the prediction happens, and which outcome you want to predict. Inspect column types, missing counts, impossible values, duplicate records, and target frequencies. An identifier is not automatically a useful feature. Repeated measurements are not automatically duplicate mistakes: understand their meaning before removing them."],
      formula: "X.shape = (number_of_rows, number_of_features)\ny.shape = (number_of_rows,)\nEach X row must stay aligned with its y value.",
    },
    {
      id: "split-before-fitting", title: "Split before learning from the data",
      paragraphs: ["The training set supplies fitted parameters. Validation data supports choices such as model type or hyperparameters. The test set is reserved for a final evaluation after those choices are fixed. Even a median or scaling constant is learned information.", "A random stratified split approximately preserves class proportions and is appropriate for this independent synthetic classification example. It does not prevent the same person or machine appearing in both sets. Use a group-aware split for repeated entities and a chronological split when predicting the future. Apply predetermined schema rules consistently; learn distribution-based cleaning decisions from training data."],
      reference: { title: "Splitting and cross-validation strategies", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    },
    {
      id: "missing-and-invalid", title: "Handle missing and invalid values deliberately",
      paragraphs: ["Missing does not mean zero. A sensor reading of zero can be a real measurement, while a missing reading means no measurement was recorded. For numeric columns, median imputation is a simple baseline. For categories, the most frequent category or an explicit missing category may be appropriate.", "Do not invent supervised labels for rows whose targets are unknown. Do not delete valid rare examples merely because they are unusual. Document the rule for impossible values, such as a negative elapsed time. If missingness itself matters, an indicator can preserve that signal. An imputed value remains an estimate, not a recovered observation."],
      reference: { title: "Missing-value imputation", href: "https://scikit-learn.org/stable/modules/impute.html" },
    },
    {
      id: "numeric-and-categorical", title: "Treat numeric and categorical inputs differently",
      paragraphs: ["StandardScaler subtracts the training mean and divides by the training standard deviation for each numeric feature. It does not make an arbitrary distribution Gaussian or remove outliers. Scaling is useful for models sensitive to feature magnitudes; ordinary decision trees usually do not need it.", "One-hot encoding creates indicator columns for nominal categories. Assigning arbitrary integers to model names would imply an order or distance that may not exist. With handle_unknown='ignore', a category not seen during fitting produces zeros in that feature's one-hot columns. That prevents an exception; it does not teach the model what the new category means."],
      formula: "scaled_value = (value - training_mean) / training_standard_deviation",
      reference: { title: "Scaling and categorical encoding", href: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    },
    {
      id: "compose-the-pipeline", title: "Make preprocessing part of the model",
      paragraphs: ["ColumnTransformer sends named columns through different transformations. Pipeline chains the resulting features into an estimator. Calling fit on this combined object fits its transformers and estimator together. Calling predict on raw new rows applies the already-fitted transformations before prediction.", "This also matters during cross-validation: each fold must fit its own preprocessing using only that fold's training rows. Scaling the entire table before cross-validation leaks information between folds. In the example, logistic regression is only a simple consumer of the processed inputs; model comparison comes in Week 1."],
      reference: { title: "Common pitfalls and data leakage", href: "https://scikit-learn.org/stable/common_pitfalls.html" },
    },
  ],
  example: {
    title: "A pipeline for a mixed table",
    description: "Create synthetic machine observations with missing values. Fit numeric and categorical preprocessing inside a classifier, inspect the transformed shape, and predict for a new machine model that was not present in training.",
    install: "python -m pip install numpy pandas scikit-learn",
    code: `import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

rng = np.random.default_rng(7)
n = 160
X = pd.DataFrame({
    "hours": rng.normal(100, 20, n),
    "temperature": rng.normal(35, 5, n),
    "model": rng.choice(["A", "B", "C"], n),
})
# A synthetic outcome, generated before measurements go missing.
signal = (X["hours"] + 3 * X["temperature"]
          + 10 * (X["model"] == "B") + rng.normal(0, 20, n))
y = (signal > 210).astype(int)
X.loc[::11, "hours"] = np.nan
X.loc[::17, "model"] = np.nan
print("Missing values:", X.isna().sum().to_dict())

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
numeric = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
])
categorical = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore",
                             sparse_output=False)),
])
prepare = ColumnTransformer([
    ("numeric", numeric, ["hours", "temperature"]),
    ("categorical", categorical, ["model"]),
])
model = Pipeline([
    ("prepare", prepare),
    ("classifier", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)
fitted = model.named_steps["prepare"]
train_ready = fitted.transform(X_train)
test_ready = fitted.transform(X_test)
assert train_ready.shape[1] == test_ready.shape[1]
assert np.isfinite(train_ready).all()
assert np.isfinite(test_ready).all()

print("Shapes:", train_ready.shape, test_ready.shape)
print("Features:", fitted.get_feature_names_out())
print("Test balanced accuracy:", round(balanced_accuracy_score(
    y_test, model.predict(X_test)), 3))

new_row = pd.DataFrame({"hours": [np.nan],
                        "temperature": [36.0], "model": ["D"]})
print("New row prediction:", model.predict(new_row))
`,
    observations: ["The transformed train and test tables have identical feature counts and contain no missing numeric values.", "The new category D does not cause an encoding error. Its category indicators are all zero.", "The evaluation score describes this synthetic split only. Changing preprocessing after inspecting it would turn that test set into development data."],
  },
  pitfalls: ["Fitting an imputer or scaler on the entire table before splitting.", "Including a target-derived or future-only column in X.", "Treating missing values, zero values, rare observations, and duplicate entities as the same problem."],
  exercises: [
    { task: "Inspect the numeric imputer's statistics_ through fitted.named_transformers_['numeric'].named_steps['impute'] and compare them with X_train[['hours', 'temperature']].median().", success: "Both medians match the training columns. Explain why the full-table medians are not used." },
    { task: "Add a second unseen category to new_row, then try a row with a missing temperature.", success: "Prediction still works and transformed feature counts remain unchanged." },
    { task: "Describe how you would split data containing ten readings from each physical machine.", success: "Your evaluation keeps the same machine out of both training and evaluation when the goal is generalization to new machines." },
  ],
  review: [
    { question: "What is the difference between fit and transform?", answer: "fit learns quantities such as medians, means, or category vocabularies. transform applies those quantities to rows without relearning them. Test rows receive transform, never a fresh fit." },
    { question: "Does stratification prevent all leakage?", answer: "No. It approximately preserves label proportions. It does not separate repeated entities, remove future information, or stop preprocessing from being fitted on evaluation rows." },
    { question: "Does a pipeline make every feature safe?", answer: "No. It can keep preprocessing inside the training folds, but it cannot recognize a feature that reveals the future or a split that mixes related observations." },
    { question: "Why not encode A, B, and C as 1, 2, and 3?", answer: "For nominal labels, those numbers introduce an arbitrary order and spacing. One-hot encoding represents membership without imposing that numeric relationship." },
  ],
};

export default lesson;
