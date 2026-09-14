"use client";

import { useState } from "react";
import "./PythonLibraries.css";

type LibraryKey =
  | "pandas"
  | "numpy"
  | "sklearn"
  | "pytorch"
  | "matplotlib";

type LibraryData = {
  key: LibraryKey;
  name: string;
  subtitle: string;
  icon: string;
  stage: string;
  description: string;
  code: string;
  remember: string;
};

const libraries: LibraryData[] = [
  {
    key: "pandas",
    name: "pandas",
    subtitle: "Data loading & cleaning",
    icon: "▦",
    stage: "Load & Clean",
    description:
      "pandas turns raw tabular data into a structured DataFrame that is easy to inspect and clean.",
    code: `import pandas as pd

df = pd.read_csv("titanic.csv")

df["age"] = df["age"].fillna(
  df["age"].median()
)

df.head()`,
    remember: "rows + columns of data",
  },

  {
    key: "numpy",
    name: "NumPy",
    subtitle: "Array & matrix math",
    icon: "◇",
    stage: "Prepare Numbers",
    description:
      "NumPy turns numerical data into fast arrays and matrices that models can work with efficiently.",
    code: `import numpy as np

ages = np.array([
  22, 38, 29, 35, 4
])

mean_age = np.mean(ages)

print(mean_age)`,
    remember: "arrays + fast numerical operations",
  },

  {
    key: "sklearn",
    name: "scikit-learn",
    subtitle: "Classical ML models",
    icon: "⌘",
    stage: "Train Model",
    description:
      "scikit-learn takes prepared features and uses them to train classical machine-learning models.",
    code: `from sklearn.linear_model import LogisticRegression

model = LogisticRegression()

model.fit(X_train, y_train)

predictions = model.predict(X_test)`,
    remember: "fit → predict",
  },

  {
    key: "pytorch",
    name: "PyTorch",
    subtitle: "Deep learning & autodiff",
    icon: "◉",
    stage: "Deep Learning",
    description:
      "PyTorch represents data as tensors and automatically calculates gradients for neural-network training.",
    code: `import torch

x = torch.tensor(
  [2.0],
  requires_grad=True
)

y = x ** 2

y.backward()

print(x.grad)`,
    remember: "tensors + backpropagation",
  },

  {
    key: "matplotlib",
    name: "Matplotlib",
    subtitle: "Plotting & visualization",
    icon: "▥",
    stage: "Visualize",
    description:
      "Matplotlib turns numbers and model results into visual patterns you can actually inspect.",
    code: `import matplotlib.pyplot as plt

plt.plot(losses)

plt.xlabel("Epoch")
plt.ylabel("Loss")

plt.show()`,
    remember: "turn numbers into visual understanding",
  },
];

export default function PythonLibraries() {
  const [selected, setSelected] = useState<LibraryKey>("pandas");

  const current =
    libraries.find((library) => library.key === selected) ?? libraries[0];

  return (
    <section
      id="python-libraries"
      className="python-libraries-section fade-section"
    >
      {/* HEADER */}

      <div className="libraries-heading">
        <span className="libraries-eyebrow">PYTHON TOOLBOX</span>

        <h2>Python Libraries</h2>

        <p>
          Same data. Different tools. Choose a library and see exactly what role
          it plays in the machine-learning workflow.
        </p>
      </div>

      {/* MAIN LEARNING AREA */}

      <div className="library-learning-layout">
        {/* LEFT SELECTOR */}

        <aside className="library-selector">
          {libraries.map((library) => (
            <button
              key={library.key}
              type="button"
              className={`library-select-button ${
                selected === library.key ? "active" : ""
              }`}
              onClick={() => setSelected(library.key)}
            >
              <span className="selector-icon">{library.icon}</span>

              <span className="selector-text">
                <strong>{library.name}</strong>
                <small>{library.subtitle}</small>
              </span>
            </button>
          ))}
        </aside>

        {/* CENTRAL VISUAL FRAME */}

        <div className="library-visual-area">
          <div className="workflow-bar">
            <div className={selected === "pandas" ? "active" : ""}>
              <span>1</span>
              <p>
                Data
                <small>Load & clean</small>
              </p>
            </div>

            <span className="workflow-arrow">→</span>

            <div className={selected === "numpy" ? "active" : ""}>
              <span>2</span>
              <p>
                Prepare
                <small>Arrays</small>
              </p>
            </div>

            <span className="workflow-arrow">→</span>

            <div
              className={
                selected === "sklearn" || selected === "pytorch"
                  ? "active"
                  : ""
              }
            >
              <span>3</span>
              <p>
                Model
                <small>Learn</small>
              </p>
            </div>

            <span className="workflow-arrow">→</span>

            <div className={selected === "matplotlib" ? "active" : ""}>
              <span>4</span>
              <p>
                Visualize
                <small>Understand</small>
              </p>
            </div>
          </div>

          <div className="visual-frame">
            {selected === "pandas" && <PandasVisual />}

            {selected === "numpy" && <NumPyVisual />}

            {selected === "sklearn" && <SklearnVisual />}

            {selected === "pytorch" && <PyTorchVisual />}

            {selected === "matplotlib" && <MatplotlibVisual />}
          </div>

          <p className="visual-caption">{current.description}</p>
        </div>

        {/* RIGHT INFO PANEL */}

        <aside className="library-info-panel">
          <div className="info-title">
            <span className="info-icon">{current.icon}</span>

            <div>
              <h3>{current.name}</h3>
              <p>{current.subtitle}</p>
            </div>
          </div>

          <div className="info-stage">
            <span>ROLE</span>
            <strong>{current.stage}</strong>
          </div>

          <div className="example-title">Example</div>

          <pre className="library-example-code">
            <code>{current.code}</code>
          </pre>

          <div className="remember-box">
            <span>💡</span>

            <div>
              <small>REMEMBER</small>
              <strong>Think: {current.remember}</strong>
            </div>
          </div>
        </aside>
      </div>

      {/* QUICK REFERENCE */}

      <div className="library-quick-reference">
        <h3>When should I use each one?</h3>

        <div className="quick-reference-grid">
          <QuickItem icon="▦" name="pandas" text="CSV, Excel & tabular data" />
          <QuickItem icon="◇" name="NumPy" text="Fast numerical operations" />
          <QuickItem
            icon="⌘"
            name="scikit-learn"
            text="Regression & classification"
          />
          <QuickItem
            icon="◉"
            name="PyTorch"
            text="Building neural networks"
          />
          <QuickItem
            icon="▥"
            name="Matplotlib"
            text="Visualizing data & results"
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   VISUALS
========================================================= */

function PandasVisual() {
  return (
    <div className="visual-content pandas-visual">
      <div className="file-box">
        <div className="file-icon">▤</div>

        <strong>titanic.csv</strong>
        <span>891 rows × 12 columns</span>
      </div>

      <div className="big-arrow">→</div>

      <div className="dataframe-window">
        <div className="visual-window-title">
          <strong>pandas DataFrame</strong>
          <span>pandas</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>age</th>
              <th>sex</th>
              <th>survived</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Braund</td>
              <td>22</td>
              <td>male</td>
              <td>0</td>
            </tr>

            <tr>
              <td>Cumings</td>
              <td>38</td>
              <td>female</td>
              <td>1</td>
            </tr>

            <tr className="missing-row">
              <td>Heikkinen</td>
              <td>NaN</td>
              <td>female</td>
              <td>1</td>
            </tr>

            <tr>
              <td>Futrelle</td>
              <td>35</td>
              <td>female</td>
              <td>0</td>
            </tr>

            <tr>
              <td>Allen</td>
              <td>4</td>
              <td>male</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NumPyVisual() {
  return (
    <div className="visual-content numpy-visual">
      <div className="visual-label">Python values</div>

      <div className="python-list">[22, 38, 29, 35, 4]</div>

      <div className="vertical-arrow">↓</div>

      <div className="numpy-transform">
        <span>NumPy array</span>

        <div className="matrix">
          <span>22</span>
          <span>38</span>
          <span>29</span>
          <span>35</span>
          <span>4</span>
        </div>
      </div>

      <div className="math-output">
        <div>
          <small>Mean</small>
          <strong>25.6</strong>
        </div>

        <div>
          <small>Min</small>
          <strong>4</strong>
        </div>

        <div>
          <small>Max</small>
          <strong>38</strong>
        </div>
      </div>
    </div>
  );
}

function SklearnVisual() {
  return (
    <div className="visual-content sklearn-visual">
      <div className="training-data">
        <span>Training Data</span>

        <div className="mini-data">
          <div>age</div>
          <div>fare</div>
          <div>class</div>
        </div>
      </div>

      <div className="big-arrow">→</div>

      <div className="model-box">
        <span>scikit-learn</span>
        <strong>MODEL</strong>
        <small>Logistic Regression</small>
      </div>

      <div className="big-arrow">→</div>

      <div className="prediction-box">
        <span>Prediction</span>
        <strong>Survived</strong>
        <small>82% probability</small>
      </div>
    </div>
  );
}

function PyTorchVisual() {
  return (
    <div className="visual-content pytorch-visual">
      <div className="network-label">Input</div>

      <div className="neural-network">
        <div className="network-column">
          <span />
          <span />
          <span />
        </div>

        <div className="network-lines">⟶</div>

        <div className="network-column hidden">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="network-lines">⟶</div>

        <div className="network-column output">
          <span />
        </div>
      </div>

      <div className="network-result">
        <div>
          <small>Prediction</small>
          <strong>0.87</strong>
        </div>

        <div className="backprop-arrow">← gradient</div>

        <div>
          <small>Loss</small>
          <strong>0.13</strong>
        </div>
      </div>
    </div>
  );
}

function MatplotlibVisual() {
  const points = [95, 78, 66, 51, 41, 34, 30, 27];

  return (
    <div className="visual-content matplotlib-visual">
      <div className="chart-title">Training Loss</div>

      <div className="fake-chart">
        <div className="y-axis">
          <span>1.0</span>
          <span>0.5</span>
          <span>0.0</span>
        </div>

        <div className="chart-area">
          <svg viewBox="0 0 400 180" preserveAspectRatio="none">
            <polyline
              className="loss-line"
              points={points
                .map(
                  (value, index) =>
                    `${index * (400 / (points.length - 1))},${value}`
                )
                .join(" ")}
            />
          </svg>

          <div className="x-axis">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
          </div>
        </div>
      </div>

      <div className="chart-caption">Epoch →</div>
    </div>
  );
}

function QuickItem({
  icon,
  name,
  text,
}: {
  icon: string;
  name: string;
  text: string;
}) {
  return (
    <div className="quick-reference-item">
      <span>{icon}</span>

      <div>
        <strong>{name}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}