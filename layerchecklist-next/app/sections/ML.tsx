export default function ML() {
    return (
      <section id="ml" className="fade-section">
        <h2>ML Fundamentals</h2>
  
        <p>
          These are the core ML concepts that come up in almost every interview and
          every real project — the ideas underneath the libraries and frameworks.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every concept below, ask yourself: What problem does this solve?
            What happens if I skip it? How would I explain this to someone non-technical?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Supervised vs. Unsupervised Learning</strong>
              <p>
                Supervised learning trains on labeled data. Unsupervised learning
                finds structure in data with no labels — clustering, dimensionality
                reduction.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Have an example of each — spam detection (supervised) vs. customer
                segmentation (unsupervised).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`# Supervised
  model.fit(X, y)
  
  # Unsupervised
  from sklearn.cluster import KMeans
  KMeans(n_clusters=3).fit(X)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Train/Test Split</strong>
              <p>
                Data is split so the model is evaluated on examples it has never
                seen — otherwise you can&apos;t tell if it actually learned.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why you never train on your test set.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`from sklearn.model_selection import train_test_split
  
  X_train, X_test, y_train, y_test = train_test_split(
      X, y, test_size=0.2, random_state=42
  )`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Overfitting & Underfitting</strong>
              <p>
                Overfitting: the model memorizes training data but fails on new data.
                Underfitting: the model is too simple to learn the pattern at all.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Describe the train-vs-validation loss curve for each case.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`# Overfitting: train_loss drops,
  # val_loss rises
  
  # Underfitting: both stay high`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Loss Functions</strong>
              <p>
                A loss function measures how wrong a prediction is. Training adjusts
                parameters to make this number smaller.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know when to use MSE (regression) vs. cross-entropy (classification).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import torch.nn as nn
  
  loss_fn = nn.CrossEntropyLoss()
  loss = loss_fn(predictions, labels)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Gradient Descent</strong>
              <p>
                Adjusts model parameters step by step in the direction that reduces
                loss, using the gradient of the loss function.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Explain what the learning rate controls and what happens if it&apos;s
                too high or too low.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
  
  optimizer.zero_grad()
  loss.backward()
  optimizer.step()`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Evaluation Metrics</strong>
              <p>
                Accuracy alone can be misleading, especially with imbalanced data.
                Precision, recall, and F1 give a fuller picture.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why accuracy is misleading when one class dominates the data.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`from sklearn.metrics import precision_score, recall_score, f1_score
  
  precision_score(y_true, y_pred)
  recall_score(y_true, y_pred)`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>ML Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>What is the difference between supervised and unsupervised learning?</li>
            <li>What is overfitting, and how do you detect it?</li>
            <li>What is the bias-variance tradeoff?</li>
            <li>Why do we split data into training and test sets?</li>
            <li>What is the difference between precision and recall?</li>
            <li>What does a loss function measure?</li>
            <li>How does gradient descent work?</li>
            <li>What is regularization, and why would you use it?</li>
            <li>How would you handle an imbalanced dataset?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>
          You should be able to explain why a model might be overfitting just from a
          loss curve, choose the right metric for a given problem, and connect each
          concept back to a real dataset.
        </p>
  
        <p>
          <strong>
            Anyone can name these terms. Interview-ready means you can reason with them.
          </strong>
        </p>
      </section>
    );
  }