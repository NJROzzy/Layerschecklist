import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 1,
  summary: "Choose a model for a clearly defined task, compare it with a baseline, and evaluate it on observations it has not learned from. You will use scikit-learn's shared estimator interface to compare linear and nonlinear classifiers fairly.",
  prerequisites: "Week 0: feature/target separation, train/test splits, scaling, and pipelines.",
  objectives: ["Distinguish regression, classification, and clustering.", "Explain what several foundational models learn and when scaling matters.", "Select a classifier with cross-validation and report appropriate final metrics."],
  workflow: ["Define the task", "Build a baseline", "Compare with CV", "Evaluate once"],
  sections: [
    {
      id: "choose-the-task", title: "Start with the output you need",
      paragraphs: ["Regression predicts a numeric quantity, such as duration. Classification predicts a label or class probabilities, such as whether an event occurs. Clustering groups observations without supervised target labels. A clustering label is not automatically a known class label.", "Linear regression models a numeric target as a weighted sum plus a bias. Binary logistic regression instead maps a weighted sum through a sigmoid to estimate the probability of class 1. Despite its name, LogisticRegression is a classifier. A threshold turns its probability estimate into a class decision."],
      formula: "Linear regression: prediction = w · x + b\nLogistic regression: P(y = 1 | x) = 1 / (1 + exp(-(w · x + b)))",
      reference: { title: "Linear and logistic models", href: "https://scikit-learn.org/stable/modules/linear_model.html" },
    },
    {
      id: "model-families", title: "Know what each model can express",
      paragraphs: ["A model is a set of possible prediction rules plus a procedure for fitting one of them. Simpler rules may miss nonlinear structure; flexible rules may fit noise. Start with a small number of models whose assumptions you can explain. These are starting points, not a universal ranking."],
      table: { caption: "Foundational models at a glance", headers: ["Model", "Prediction rule", "Useful controls"], rows: [
        ["Linear / logistic regression", "Weighted inputs; logistic adds a probability mapping", "Regularization; feature scaling"],
        ["k-nearest neighbors", "Average or vote among nearby examples", "Neighbor count; distance; scaling"],
        ["Decision tree", "A sequence of feature-based splits", "Maximum depth; minimum leaf size"],
        ["Random forest", "Aggregate predictions from randomized trees", "Tree count; depth; minimum leaf size"],
      ] },
      reference: { title: "Choosing an estimator", href: "https://scikit-learn.org/stable/machine_learning_map.html" },
    },
    {
      id: "estimator-interface", title: "Use the estimator interface consistently",
      paragraphs: ["fit(X_train, y_train) learns from training examples. predict(X_new) returns labels or numeric predictions. Classifiers that implement predict_proba return one column per class, in classes_ order. That order must be checked before interpreting a probability column.", "A DummyClassifier ignores the inputs and follows a simple rule, such as always choosing the most frequent training class. Beating that baseline is a minimum useful comparison. It can already achieve high accuracy when one class dominates. Each candidate's preprocessing belongs inside its pipeline."],
      reference: { title: "DummyClassifier", href: "https://scikit-learn.org/stable/modules/generated/sklearn.dummy.DummyClassifier.html" },
    },
    {
      id: "evaluate-fairly", title: "Compare models on the same validation folds",
      paragraphs: ["First reserve a test set. Then divide the remaining training data into folds. For each candidate and fold, fit on the other folds and score on the held-out fold. Reusing the same folds makes the comparisons easier to interpret. Pick the model using mean validation performance, refit it on all training data, and evaluate it on the reserved test set.", "The fold standard deviation describes variation across those folds; it is not automatically a confidence interval. Training scores can reveal a large training/validation gap, but a good training score alone says little about generalization. Model selection uses validation scores, never the final test score."],
      reference: { title: "Cross-validation and model evaluation", href: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    },
    {
      id: "read-the-metrics", title: "Read errors as well as scores",
      paragraphs: ["For a chosen positive class, a true positive is a correctly detected positive; a false positive is a negative incorrectly flagged positive. A false negative is a missed positive. Precision asks how many positive predictions are correct. Recall asks how many actual positives were found.", "Suppose TP=8, FP=2, FN=4, and TN=6. Precision is 8/10=0.80, recall is 8/12≈0.67, and accuracy is 14/20=0.70. Choose metrics according to the mistakes that matter. Balanced accuracy averages recall across classes. ROC AUC evaluates ranking from scores across thresholds; it is not the accuracy at a particular threshold."],
      table: { caption: "Metric choices", headers: ["Metric", "Definition or interpretation", "Watch for"], rows: [
        ["Accuracy", "Correct predictions / all predictions", "Dominant classes can hide missed minorities"],
        ["Precision / recall", "TP/(TP+FP) / TP/(TP+FN)", "Specify the positive class and threshold"],
        ["F1", "2TP/(2TP+FP+FN)", "Does not include true negatives"],
        ["MAE / RMSE", "Regression errors in target units", "RMSE gives larger errors more influence"],
      ] },
      reference: { title: "Metrics and scoring", href: "https://scikit-learn.org/stable/modules/model_evaluation.html" },
    },
  ],
  example: {
    title: "Compare classifiers on two curved classes",
    description: "The two-moons dataset has two numeric features and two curved classes. Compare a dummy baseline, logistic regression, a tree, and a random forest using five-fold cross-validation. Only the selected model sees the final test evaluation.",
    install: "python -m pip install numpy scikit-learn",
    code: `import numpy as np
from sklearn.base import clone
from sklearn.datasets import make_moons
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (balanced_accuracy_score, confusion_matrix,
                             f1_score, roc_auc_score)
from sklearn.model_selection import (StratifiedKFold, cross_validate,
                                     train_test_split)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

X, y = make_moons(n_samples=1000, noise=0.25, random_state=7)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
folds = list(cv.split(X_train, y_train))
models = {
    "dummy": DummyClassifier(strategy="most_frequent"),
    "logistic": make_pipeline(StandardScaler(),
                              LogisticRegression(max_iter=1000)),
    "tree": DecisionTreeClassifier(max_depth=4, random_state=42),
    "forest": RandomForestClassifier(n_estimators=100,
                                    min_samples_leaf=3,
                                    random_state=42, n_jobs=1),
}
means = {}
for name, estimator in models.items():
    scores = cross_validate(estimator, X_train, y_train, cv=folds,
                            scoring="balanced_accuracy",
                            return_train_score=True)
    means[name] = scores["test_score"].mean()
    # Here test_score means each CV validation fold, not X_test.
    print(name, "train", round(scores["train_score"].mean(), 3),
          "validation", round(means[name], 3),
          "fold std", round(scores["test_score"].std(), 3))

winner_name = max(means, key=means.get)
winner = clone(models[winner_name]).fit(X_train, y_train)
prediction = winner.predict(X_test)
positive_column = np.flatnonzero(winner.classes_ == 1)[0]
probability = winner.predict_proba(X_test)[:, positive_column]
assert prediction.shape == y_test.shape
assert np.isfinite(probability).all()
print("Selected:", winner_name)
print("Test balanced accuracy:", balanced_accuracy_score(y_test, prediction))
print("Test F1:", f1_score(y_test, prediction))
print("Test ROC AUC:", roc_auc_score(y_test, probability))
print("Confusion matrix; rows=true, columns=predicted, classes=[0, 1]:")
print(confusion_matrix(y_test, prediction, labels=[0, 1]))
`,
    observations: ["The dummy classifier's balanced accuracy is 0.5 when both classes are present.", "The selected candidate has the highest mean validation score among these choices, not a guaranteed advantage on every future dataset.", "The confusion matrix counts sum to the 200 test observations. The held-out evaluation happens after model selection."],
  },
  pitfalls: ["Choosing a model because it has the best final test score after repeatedly trying alternatives.", "Comparing candidates on different random splits and attributing every score change to the model.", "Using regression metrics for class labels, or reporting accuracy without examining class proportions."],
  exercises: [
    { task: "Use only cross-validation on X_train to compare tree depths 1, 4, and unrestricted. Record training and validation scores.", success: "You can explain the gap for each depth without choosing settings from X_test." },
    { task: "Calculate accuracy, precision, recall, and F1 by hand for TP=8, FP=2, FN=4, TN=6.", success: "You obtain 0.70, 0.80, approximately 0.667, and approximately 0.727, respectively." },
    { task: "Describe a regression version of the workflow with DummyRegressor and a numeric target.", success: "Your baseline uses training data, your comparison uses validation MAE or RMSE, and your test set remains reserved." },
  ],
  review: [
    { question: "Is LogisticRegression a regression estimator?", answer: "In scikit-learn it is a classifier. It estimates class probabilities from a linear score; LinearRegression predicts a numeric target directly." },
    { question: "Why fit the selected model again after cross-validation?", answer: "Each fold trained on only part of the development data. Refitting learns one final model from all available training rows using the selected configuration." },
    { question: "Why can 99% accuracy be unhelpful?", answer: "If 99% of examples belong to one class, predicting that class for every row gets 99% accuracy while detecting none of the other class. Compare a baseline and inspect per-class errors." },
    { question: "Can a random forest always beat logistic regression?", answer: "No. Performance depends on the data, features, sample size, hyperparameters, and evaluation design. Compare candidates under the same validation procedure." },
  ],
};

export default lesson;
