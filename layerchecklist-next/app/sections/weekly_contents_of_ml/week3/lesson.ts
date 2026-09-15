import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 3,
  summary: "Understand what optimization changes, what regularization controls, and how validation guides model selection. You will tune a small support-vector classifier search while keeping the final test set outside every fitting and selection decision.",
  prerequisites: "Weeks 0–2: preprocessing pipelines, validation metrics, model families, and feature representations.",
  objectives: ["Separate learned parameters, hyperparameters, and an optimizer's update rule.", "Recognize evidence of underfitting, overfitting, and optimization trouble.", "Run a bounded cross-validation search and evaluate the selected configuration."],
  workflow: ["Choose an objective", "Set a small search", "Validate candidates", "Refit and evaluate"],
  sections: [
    {
      id: "objective-and-updates", title: "Define the objective and the update",
      paragraphs: ["Training minimizes an objective over model parameters. A common form combines average training loss with a regularization penalty. Gradient descent updates parameters in the direction opposite the gradient, with the learning rate setting the step size. Mini-batch training estimates that gradient from a subset of examples.", "For one weight with no bias, x=2, y=4, and loss=0.5*(w*x-y)^2, starting at w=0 gives loss 8 and derivative -8. A learning rate of 0.1 updates w to 0.8 and reduces the loss to 2.88. A step that is too large can overshoot. Lower training loss still does not guarantee better performance on new data."],
      formula: "J(w) = mean(training_loss) + (lambda / 2) * sum(w_j^2)\nw_next = w - learning_rate * gradient(J, w)",
      reference: { title: "Stochastic gradient descent", href: "https://scikit-learn.org/stable/modules/sgd.html" },
    },
    {
      id: "parameters-and-controls", title: "Separate parameters from hyperparameters",
      paragraphs: ["Parameters are learned during fit, such as coefficients or split thresholds. Hyperparameters configure the model or fitting procedure, such as regularization strength, tree depth, or a kernel setting. Searching hyperparameters repeatedly trains new candidate models; it is different from a gradient update inside one fit.", "The example uses an RBF support-vector classifier. C controls the trade-off between a wider margin and training violations; smaller C means stronger regularization. Gamma controls how local the RBF influence is: larger gamma makes influence more localized. Neither is a learning-rate parameter. Scaling belongs before this distance-sensitive estimator."],
      reference: { title: "SVC parameters", href: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html" },
    },
    {
      id: "diagnose-first", title: "Use training and validation evidence",
      paragraphs: ["If training and validation performance are both poor, the representation or capacity may be insufficient, but optimization problems or bad data are also possible. If training performance is strong and validation performance is much weaker, investigate overfitting and distribution mismatch. These patterns are clues, not complete diagnoses.", "Before making a model larger, verify the labels, split, preprocessing, and metric. For gradient-trained models, inspect finite losses, feature magnitudes, learning rate, and convergence. For a flexible model that learns training noise, try stronger regularization, simpler features, or additional representative data."],
      table: { caption: "Evidence and next checks", headers: ["Observation", "Possible explanation", "Next check"], rows: [
        ["Weak training and validation scores", "Underfitting, unsuitable features, or failed fitting", "Check data and convergence before increasing capacity"],
        ["Strong training, weak validation", "Overfitting or mismatch between splits", "Check split design and regularization"],
        ["Large variation across folds", "Unstable estimates or heterogeneous data", "Inspect fold composition and sample size"],
      ] },
      reference: { title: "Validation and learning curves", href: "https://scikit-learn.org/stable/modules/learning_curve.html" },
    },
    {
      id: "search-budget", title: "Search a small, meaningful space",
      paragraphs: ["GridSearchCV evaluates each parameter combination on the chosen folds. Three C values and three gamma values with five folds require 45 validation fits, followed by a refit of the selected setting. The double-underscore name, such as model__C, addresses the parameter of a named pipeline step.", "Use a metric chosen for the task before looking at results. Grid search is reasonable for a small space; randomized search can cover a larger space with an explicit candidate budget. Repeated adaptive searching can overfit validation results too. Nested cross-validation is an option when you need to estimate the performance of the entire selection procedure."],
      reference: { title: "Hyperparameter search", href: "https://scikit-learn.org/stable/modules/grid_search.html" },
    },
    {
      id: "final-evaluation", title: "Refit, evaluate, and keep the experiment interpretable",
      paragraphs: ["With refit=True, GridSearchCV fits the selected configuration on all supplied training rows and exposes it as best_estimator_. Its best_score_ is the mean validation score, not a final test result. Evaluate the selected estimator on the reserved test set after finishing the search.", "Keep the seed, split strategy, candidate values, metric, and package versions with your results. A fixed seed helps repeat an experiment but does not remove sampling uncertainty. These course scripts are separate teaching experiments: repeatedly using the same test results to choose changes makes that holdout part of development, so a real combined study needs an untouched final evaluation set."],
      reference: { title: "GridSearchCV results and refitting", href: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html" },
    },
  ],
  example: {
    title: "Tune a scaled RBF classifier",
    description: "Search nine configurations on the same two-moons classification task used earlier. Print training and validation results separately, select a configuration through cross-validation, and then calculate final test metrics.",
    install: "python -m pip install numpy scikit-learn",
    code: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.metrics import balanced_accuracy_score, confusion_matrix, f1_score
from sklearn.model_selection import GridSearchCV, StratifiedKFold, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = make_moons(n_samples=1000, noise=0.25, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
pipeline = Pipeline([
    ("scale", StandardScaler()),
    ("model", SVC(kernel="rbf")),
])
parameters = {
    "model__C": [0.1, 1.0, 10.0],
    "model__gamma": [0.1, 1.0, "scale"],
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
search = GridSearchCV(
    pipeline, parameters, scoring="balanced_accuracy", cv=cv,
    return_train_score=True, refit=True, n_jobs=1, error_score="raise"
)
search.fit(X_train, y_train)
results = search.cv_results_
assert len(results["params"]) == 9
for index in np.argsort(results["mean_test_score"])[::-1]:
    # mean_test_score here refers to CV validation folds.
    print(results["params"][index],
          "train", round(results["mean_train_score"][index], 3),
          "validation", round(results["mean_test_score"][index], 3))

print("Selected parameters:", search.best_params_)
print("Mean validation score:", search.best_score_)
prediction = search.best_estimator_.predict(X_test)
print("Final test balanced accuracy:", balanced_accuracy_score(y_test, prediction))
print("Final test F1:", f1_score(y_test, prediction))
print("Confusion matrix, classes=[0, 1]:")
print(confusion_matrix(y_test, prediction, labels=[0, 1]))

# Check the one-weight gradient-descent example from the lesson.
w, x, target, learning_rate = 0.0, 2.0, 4.0, 0.1
loss_before = 0.5 * (w * x - target) ** 2
gradient = (w * x - target) * x
w -= learning_rate * gradient
loss_after = 0.5 * (w * x - target) ** 2
print("One gradient step:", loss_before, "->", loss_after)
`,
    observations: ["The search evaluates nine configurations. Validation is performed using training rows only.", "The selected parameters maximize this search's mean validation score. They are not universal settings for SVC.", "The standalone arithmetic check prints a loss change from 8.0 to approximately 2.88."],
  },
  pitfalls: ["Confusing C, gamma, regularization strength, and learning rate as interchangeable controls.", "Selecting settings from mean training score or from the final test result.", "Reporting the highest validation score as an unbiased estimate after a long adaptive search."],
  exercises: [
    { task: "Calculate the number of validation fits for four C values, five gamma values, and three folds.", success: "You count 60 validation fits, plus one final refit when refit=True." },
    { task: "Use only the training folds to investigate whether very large C and gamma increase the training/validation gap.", success: "You report the observed evidence without assuming a setting must overfit on every dataset." },
    { task: "Repeat the one-weight update with learning rates 0.01, 0.1, and 1.0.", success: "You explain why the largest step raises this example's loss to 72 instead of improving it." },
  ],
  review: [
    { question: "Is best_score_ a final test score?", answer: "No. It is the selected candidate's mean cross-validation score on the training data supplied to search.fit. The separate test set is evaluated afterward." },
    { question: "Does lowering training loss always improve generalization?", answer: "No. A model can fit training noise or exploit artifacts. Generalization must be estimated using suitable held-out data." },
    { question: "What does model__C mean?", answer: "It addresses the C hyperparameter of the pipeline step named model. The double underscore connects a pipeline step to one of its parameters." },
    { question: "Can validation data also be overused?", answer: "Yes. Repeated choices based on the same validation results can adapt to that sample. Limit and document the search, and preserve a final test set or use an appropriate nested evaluation." },
  ],
};

export default lesson;
