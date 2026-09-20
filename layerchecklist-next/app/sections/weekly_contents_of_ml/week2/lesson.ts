import type { MLLesson } from "../types";

const lesson: MLLesson = {
  week: 2,
  summary: "Feature Engineering for ML: improve what a model can learn by changing how its inputs are represented. You'll build meaningful transformations, tell feature creation apart from feature selection, and compare raw versus polynomial features without leaking information into your evaluation.",
  prerequisites: "Weeks 0–1: pipelines, regression versus classification, and cross-validation. You should be comfortable with arrays and basic algebra.",
  objectives: [
    "Explain why the same model can behave differently depending on its features.",
    "Choose transformations that have a clear real-world meaning, and handle their edge cases.",
    "Measure whether an added feature group actually helps, using the same validation folds each time.",
  ],
  workflow: ["State a hypothesis", "Construct features", "Compare on folds", "Keep useful changes"],
  sections: [
    {
      id: "representation",
      title: "Change the representation, not the evidence",
      paragraphs: [
        "A linear model on x can only represent a weighted sum of its input columns. Give it x-squared as an extra column, and it can now represent a quadratic relationship in the original input — while still being linear in its coefficients. The algorithm itself didn't become nonlinear; only its representation of the input changed.",
        "Good feature engineering expresses a plausible relationship — a rate, an interaction, a recurring time pattern. It can't manufacture evidence that was never actually measured. A feature computed from the target, or from a future event, can look extremely useful while quietly making your evaluation invalid.",
      ],
      formula: "Raw features: y_hat = b + w1*x1 + w2*x2\nExpanded features: y_hat = b + w1*x1 + w2*x2\n                          + w3*x1^2 + w4*x1*x2 + w5*x2^2",
      reference: { title: "Polynomial feature expansion", href: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html" },
    },
    {
      id: "domain-transformations",
      title: "Choose transformations with explicit assumptions",
      paragraphs: [
        "A ratio like completed-tasks-per-hour can be more meaningful than either count on its own — but you need to decide up front what happens when the denominator is zero: keep a missing value plus an indicator flag, or apply a domain-specific rule. Silently adding an arbitrary constant just to avoid the error quietly changes what the feature means.",
        "For nonnegative counts, log1p(x) computes log(1+x), handles zero cleanly, and compresses large values — but it doesn't guarantee normality or better predictions on its own. For periodic features, a sine/cosine pair captures adjacency across the cycle boundary: hour 23 sits right next to hour 0. You need both coordinates together to correctly identify a position around the cycle — either one alone loses that information.",
      ],
      formula: "hour_sin = sin(2*pi*hour/24)\nhour_cos = cos(2*pi*hour/24)\ninteraction = feature_a * feature_b",
    },
    {
      id: "categories-and-scale",
      title: "Match encoding and scale to the model",
      paragraphs: [
        "One-hot encoding is a solid default for nominal categories with no inherent order. Ordinal encoding makes sense when order genuinely matters — but it still imposes numeric spacing that a model may read too literally. Whatever category vocabulary you fit on training rows has to be reused unchanged on new rows.",
        "After expansion, numeric columns can end up on very different scales. Scale them inside the pipeline before fitting a regularized linear model, so the penalty isn't dominated purely by units rather than actual importance. StandardScaler is sensitive to extreme values — robustness comes from choosing the right representation and estimator, not from an automatic cleaning step.",
      ],
      reference: { title: "Encoding, scaling, and transformations", href: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    },
    {
      id: "selection",
      title: "Separate feature selection from feature creation",
      paragraphs: [
        "Feature creation adds or transforms columns. Feature selection keeps a subset of what's already there. More columns cost more, add variance, and increase the chance of accidental correlations. Polynomial expansion grows fast as both input count and degree increase — a small, deliberate expansion is a better first experiment than generating every possible interaction.",
        "A supervised selector like SelectKBest looks at y while fitting, so it must live inside the cross-validation pipeline, not run beforehand. Selecting features on all rows before validation leaks label information. And a low univariate score doesn't prove a feature is useless — two features can matter together through an interaction even when neither shows much value alone.",
      ],
      reference: { title: "Feature-selection methods", href: "https://scikit-learn.org/stable/modules/feature_selection.html" },
    },
    {
      id: "ablation",
      title: "Test the contribution with an ablation",
      paragraphs: [
        "An ablation compares a model with a component present versus absent. Here, compare the same Ridge estimator on raw features against degree-two features, using identical training folds and the same error metric. That isolates the effect of the representation change far more clearly than changing the features, the estimator, and the split all at once.",
        "Use mean validation error to choose the representation, then fit that choice on all training rows. Only look at the reserved test set after you've made that decision. Coefficients and feature importance describe how the fitted model behaves — they don't establish that changing a feature would actually change the real-world target.",
      ],
      reference: { title: "Pipelines and composite estimators", href: "https://scikit-learn.org/stable/modules/compose.html" },
    },
  ],
  example: {
    title: "Expose a hidden quadratic relationship",
    description: "Generate a regression target containing a squared term and an interaction. Compare two otherwise identical Ridge pipelines, pick the representation using validation MAE, then inspect its feature names and final test error.",
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
    observations: [
      "Degree-two features should substantially improve validation MAE on this deliberately quadratic dataset — that doesn't mean polynomial features will help every dataset you try this on.",
      "The expanded representation contains x1, x2, x1^2, x1*x2, and x2^2. include_bias=False skips an extra constant column since Ridge already fits an intercept on its own.",
      "The cyclic distance between hour 23 and hour 0 comes out to roughly 0.261 — reflecting how close they actually are around the daily cycle.",
    ],
  },
  pitfalls: [
    "Engineering a feature from an outcome that only becomes available after prediction time.",
    "Running supervised feature selection before cross-validation instead of inside each fold.",
    "Adding many features and treating a small validation improvement as proof of a general rule.",
  ],
  exercises: [
    { task: "Add a degree-three candidate using the same folds. Compare its validation MAE against degree two, without looking at the test set.", success: "You can justify a representation choice using validation results and complexity — without assuming a higher degree automatically wins." },
    { task: "Swap the target-generating equation for a purely linear one, then rerun model selection as a separate experiment.", success: "You can explain why the quadratic representation's advantage disappears." },
    { task: "Design a tasks-per-hour feature that handles rows with zero, missing, and positive recorded hours.", success: "Every case has a documented policy, and no infinite values ever reach the estimator." },
  ],
  review: [
    { question: "Is Ridge with polynomial features still linear?", answer: "It's linear in its fitted coefficients, but its predictions can be nonlinear in the original inputs. The feature transformation supplies the powers and interactions before the linear estimator ever sees them." },
    { question: "Why keep a selector inside the pipeline?", answer: "A selector can learn from both X and y. Keeping it inside the pipeline ensures it's refit using only each training fold — never peeking at validation labels ahead of time." },
    { question: "Why use both sine and cosine for hour?", answer: "A single coordinate maps multiple hours to the same value. The pair together locates the hour uniquely around a circle and preserves the wraparound relationship at the boundary." },
    { question: "Does a useful predictive feature prove causation?", answer: "No. A predictive relationship can just as easily reflect correlation, confounding, or an artifact of how the data was collected. A causal conclusion needs its own causal design and assumptions." },
  ],
};

export default lesson;