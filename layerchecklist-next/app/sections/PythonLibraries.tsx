export default function PythonLibraries() {
    return (
      <section id="python-libraries" className="fade-section">
        <h2>Python Libraries</h2>
  
        <p>
          You don&apos;t need to know every library in the ecosystem — you need to know
          the handful that show up in almost every AI/ML/DL project, and understand
          what job each one is doing.
        </p>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>NumPy</strong>
              <p>
                The foundation almost everything else is built on. Handles fast
                array math — vectors, matrices, broadcasting — without writing
                manual loops.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why NumPy operations are faster than plain Python loops
                (vectorization, contiguous memory).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import numpy as np
  
  a = np.array([1, 2, 3])
  b = np.array([4, 5, 6])
  
  dot = np.dot(a, b)
  # 32`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>pandas</strong>
              <p>
                The go-to tool for loading, cleaning, filtering, and exploring
                tabular data before it ever touches a model.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the difference between a Series and a DataFrame, and how
                <code>.loc</code> differs from <code>.iloc</code>.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import pandas as pd
  
  df = pd.read_csv("data.csv")
  df.head()
  
  df[df["age"] > 30]`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>scikit-learn</strong>
              <p>
                The standard library for classical ML — regression, classification,
                clustering — plus preprocessing and evaluation tools.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the standard pattern: <code>fit()</code>, <code>predict()</code>,
                and why you split data into train/test sets.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`from sklearn.linear_model import LinearRegression
  
  model = LinearRegression()
  model.fit(X_train, y_train)
  
  preds = model.predict(X_test)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>PyTorch</strong>
              <p>
                The core deep learning framework for building and training neural
                networks, with automatic differentiation built in.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Understand what a tensor is, and what <code>.backward()</code>
                actually computes.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import torch
  
  x = torch.tensor([2.0], requires_grad=True)
  y = x ** 2
  
  y.backward()
  print(x.grad)
  # 4.0`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Matplotlib</strong>
              <p>
                The default plotting library — used constantly to visualize data
                distributions, training curves, and model outputs.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know how to plot a simple line/scatter and label axes without
                looking it up.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import matplotlib.pyplot as plt
  
  plt.plot(losses)
  plt.xlabel("Epoch")
  plt.ylabel("Loss")
  plt.show()`}</code></pre>
            </div>
          </div>
  
        </div>
      </section>
    );
  }