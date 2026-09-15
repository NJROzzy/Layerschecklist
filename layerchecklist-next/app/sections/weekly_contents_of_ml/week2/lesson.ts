import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 2,
  summary: "Improve the information a model can use by changing how inputs are represented. You will construct meaningful transformations, distinguish feature creation from feature selection, and compare raw and polynomial features without contaminating evaluation data.",
  prerequisites: "Weeks 0–1: pipelines, regression versus classification, and cross-validation. Be comfortable with arrays and simple algebra.",
  objectives: ["Explain why the same model can behave differently with different features.", "Choose transformations with a clear domain meaning and handle their edge cases.", "Measure the value of an added feature group using the same validation folds."],
  workflow: ["State a hypothesis", "Construct features", "Compare on folds", "Keep useful changes"],
  sections: [
    {
      id: "representation", title: "Change the representation, not the evidence",
      paragraphs: ["A linear model on x can only represent a weighted sum of its input columns. Give it x squared as an additional column, and it can represent a quadratic relationship in the original input while remaining linear in its coefficients. The learning algorithm did not become nonlinear in its parameters; its representation changed.", "Feature engineering should express a plausible relationship, such as a rate, interaction, or recurring time pattern. It cannot create independent evidence that was never measured. A feature computed from the target or a future event can appear extremely useful while making evaluation invalid."],
      formula: "Raw features: y_hat = b + w1*x1 + w2*x2\nExpanded features: y_hat = b + w1*x1 + w2*x2\n                          + w3*x1^2 + w4*x1*x2 + w5*x2^2",
      reference: { title: "Polynomial feature expansion", href: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html" },
    },
    {
      id: "domain-transformations", title: "Choose transformations with explicit assumptions",
      paragraphs: ["A ratio such as completed tasks per hour may be more meaningful than either count alone. Define what happens when the denominator is zero: keep a missing value and an indicator, or use a domain-specific rule. Silently adding an arbitrary constant changes the meaning of the feature.", "For nonnegative counts, log1p(x) computes log(1+x), including zero, and compresses large values. It does not guarantee normality or better predictions. For periodic features, a sine/cosine pair can represent adjacency across the cycle boundary: hour 23 is near hour 0. Both coordinates are needed to identify positions around the cycle."],
      formula: "hour_sin = sin(2*pi*hour/24)\nhour_cos = cos(2*pi*hour/24)\ninteraction = feature_a * feature_b",
    },
    {
      id: "categories-and-scale", title: "Match encoding and scale to the model",
      paragraphs: ["One-hot encoding is a useful starting point for nominal categories. Ordinal encoding is appropriate when order has a justified meaning, but it still assigns numeric spacing that a model may interpret. A category vocabulary fitted on training rows must be reused on new rows.", "After expansion, numeric columns may have very different magnitudes. Scale them inside the pipeline before fitting a regularized linear model so that the penalty is not dominated merely by units. StandardScaler can be sensitive to extreme values; robustness requires a considered choice of representation and estimator, not an automatic cleaning recipe."],
      reference: { title: "Encoding, scaling, and transformations", href: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    },
    {
      id: "selection", title: "Separate feature selection from feature creation",
      paragraphs: ["Feature creation adds or transforms columns. Feature selection retains a subset. More columns can increase cost, variance, and accidental correlations. Polynomial expansion grows quickly as both the number of inputs and degree increase, so a small useful expansion is a better starting experiment than every possible interaction.", "A supervised selector such as SelectKBest uses y during fitting and must be inside the cross-validation pipeline. Selecting features on all rows before validation leaks labels. A low univariate score does not prove a feature is useless: two features may matter through an interaction even if either one has little individual association with the target."],
      reference: { title: "Feature-selection methods", href: "https://scikit-learn.org/stable/modules/feature_selection.html" },
    },
    {
      id: "ablation", title: "Test the contribution with an ablation",
      paragraphs: ["An ablation compares a model with and without a particular component. Here, compare the same Ridge estimator on raw features and degree-two features, using identical training folds and the same error metric. This isolates the representation change more clearly than changing features, estimator, and split together.", "Use mean validation error to choose the representation, then fit that choice on all training rows. Inspect the reserved test set only after the choice. Coefficients and feature importance describe a fitted predictive model; they do not establish that changing a feature would cause the target to change."],
      reference: { title: "Pipelines and composite estimators", href: "https://scikit-learn.org/stable/modules/compose.html" },
    },
  ],
  example: {
    title: "Expose a hidden quadratic relationship",
    description: "Generate a regression target containing a squared term and an interaction. Compare two otherwise identical Ridge pipelines, select the representation by validation MAE, and inspect its feature names and final test error.",
    install: "python -m pip install numpy scikit-learn",
    code: `import numpy as np
from sklearn.base import clone
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

rng = np.random.default_rng(7)
X = rng.uniform(-3, 3, size=(500, 2))
y = (2 * X[:, 0] ** 2 + 0.7 * X[:, 1]
     + 1.2 * X[:, 0] * X[:, 1] + rng.normal(0, 0.5, 500))
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
cv = KFold(n_splits=5, shuffle=True, random_state=42)
folds = list(cv.split(X_train))
models = {
    "raw": Pipeline([
        ("scale", StandardScaler()),
        ("regressor", Ridge(alpha=1.0)),
    ]),
    "degree_2": Pipeline([
        ("features", PolynomialFeatures(degree=2, include_bias=False)),
        ("scale", StandardScaler()),
        ("regressor", Ridge(alpha=1.0)),
    ]),
}
validation_mae = {}
for name, estimator in models.items():
    # sklearn scorers are larger-is-better, so MAE is negated.
    errors = -cross_val_score(estimator, X_train, y_train,
                              cv=folds, scoring="neg_mean_absolute_error")
    validation_mae[name] = errors.mean()
    print(name, "validation MAE:", round(errors.mean(), 3),
          "fold std:", round(errors.std(), 3))

selected_name = min(validation_mae, key=validation_mae.get)
selected = clone(models[selected_name]).fit(X_train, y_train)
prediction = selected.predict(X_test)
assert np.isfinite(prediction).all()
print("Selected:", selected_name)
print("Test MAE:", mean_absolute_error(y_test, prediction))
print("Test RMSE:", np.sqrt(mean_squared_error(y_test, prediction)))
print("Features:", selected[:-1].get_feature_names_out(["x1", "x2"]))

hours = np.array([23.0, 0.0])
cyclic = np.column_stack([
    np.sin(2 * np.pi * hours / 24),
    np.cos(2 * np.pi * hours / 24),
])
print("23:00-to-00:00 cyclic distance:", np.linalg.norm(cyclic[0] - cyclic[1]))
`,
    observations: ["Degree-two features should substantially improve validation MAE on this deliberately quadratic dataset. That result does not imply polynomial features help every dataset.", "The expanded representation contains x1, x2, x1^2, x1 x2, and x2^2. include_bias=False avoids an extra constant column because Ridge already fits an intercept.", "The cyclic distance between hour 23 and hour 0 is approximately 0.261, reflecting their proximity around the daily cycle."],
  },
  pitfalls: ["Engineering a feature using an outcome that becomes available only after prediction time.", "Applying supervised feature selection before cross-validation rather than inside each fold.", "Adding many features and interpreting a small validation improvement as proof of a general rule."],
  exercises: [
    { task: "Add a degree-three candidate using the same folds. Compare its validation MAE with degree two without inspecting the test set.", success: "You can justify a representation using validation results and complexity, without assuming that a higher degree must win." },
    { task: "Replace the target-generating equation with a purely linear equation and rerun model selection as a separate experiment.", success: "You explain why the advantage of the quadratic representation may disappear." },
    { task: "Design a tasks-per-hour feature for rows with zero, missing, and positive recorded hours.", success: "Every case has a documented policy, and no infinite values reach the estimator." },
  ],
  review: [
    { question: "Is Ridge with polynomial features still linear?", answer: "It is linear in its fitted coefficients, but its predictions can be nonlinear in the original inputs. The feature transformation supplies powers and interactions before the linear estimator." },
    { question: "Why keep a selector inside the pipeline?", answer: "A selector may learn from X and y. Keeping it inside the pipeline ensures it is refitted using only each training fold, rather than seeing validation labels in advance." },
    { question: "Why use both sine and cosine for hour?", answer: "One coordinate alone maps multiple hours to the same value. The pair locates the hour around a circle and preserves the wraparound relationship." },
    { question: "Does a useful predictive feature establish causation?", answer: "No. Predictive relationships can reflect correlation, confounding, or collection artifacts. A causal conclusion needs a suitable causal design and assumptions." },
  ],
};

export default lesson;
