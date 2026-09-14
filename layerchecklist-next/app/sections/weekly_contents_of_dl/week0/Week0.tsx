import Link from "next/link";
import { dlRoadmap } from "../roadmap";
import "../../Section.css";
import "./Week0.css";

export default function Week0() {
  return (
    <section id="week-0" className="week-block learning-section" aria-labelledby="week-0-title">
      <h1 id="week-0-title">Week 0 — {dlRoadmap[0].title}</h1>

      <p>
        Classical ML models (linear regression, logistic regression, decision
        trees) learn a fixed, hand-shaped function. Neural networks learn the
        shape of the function itself. This week is about seeing why that
        shift matters — not new math, just a new way of thinking about what
        &quot;learning&quot; means.
      </p>

      <div className="interview-note">
        <strong>Core idea:</strong>
        <p>
          A statistical model assumes a form (linear, logistic) and fits
          parameters to it. A neural network doesn&apos;t assume the form —
          it learns it, by composing many simple functions together.
        </p>
      </div>

      <div className="topic-grid">

        <div className="topic-row">
          <div className="topic-explain">
            <strong>Linear Regression as a Single Neuron</strong>
            <p>
              A single linear regression model — <code>y = wx + b</code> — is
              mathematically identical to one neuron with no activation
              function. Neural networks start exactly where statistical
              learning left off.
            </p>
            <p className="interview-tip">
              <strong>Interview check:</strong>
              Be able to say precisely why a neural net with no activation
              function and one layer is just linear regression.
            </p>
          </div>
          <div className="topic-code">
            <pre><code>{`# Linear regression
y = w * x + b

# One neuron, no activation — same thing
import torch.nn as nn
neuron = nn.Linear(in_features=1, out_features=1)`}</code></pre>
          </div>
        </div>

        <div className="topic-row">
          <div className="topic-explain">
            <strong>Logistic Regression as a Single Neuron</strong>
            <p>
              Logistic regression adds a sigmoid to squash output into a
              probability. A single neuron with a sigmoid activation is,
              again, exactly the same model.
            </p>
            <p className="interview-tip">
              <strong>Interview check:</strong>
              Know that &quot;neural network&quot; isn&apos;t a totally separate
              category from what you already know — it&apos;s a generalization
              of it.
            </p>
          </div>
          <div className="topic-code">
            <pre><code>{`import torch.nn as nn

neuron = nn.Sequential(
    nn.Linear(in_features=10, out_features=1),
    nn.Sigmoid()
)`}</code></pre>
          </div>
        </div>

        <div className="topic-row">
          <div className="topic-explain">
            <strong>The Limitation of a Single Layer</strong>
            <p>
              A single layer (with or without activation) can only learn
              patterns that are linearly separable. It can&apos;t solve
              problems like XOR — no straight line can separate the classes.
            </p>
            <p className="interview-tip">
              <strong>Interview check:</strong>
              Be able to explain, on a whiteboard, why XOR can&apos;t be solved
              by a single linear boundary.
            </p>
          </div>
          <div className="topic-code">
            <pre><code>{`# XOR truth table
# (0,0) -> 0   (0,1) -> 1
# (1,0) -> 1   (1,1) -> 0
# No single straight line separates
# the 0s from the 1s here.`}</code></pre>
          </div>
        </div>

        <div className="topic-row">
          <div className="topic-explain">
            <strong>Why Stacking Layers Changes Everything</strong>
            <p>
              Stack two layers with a non-linear activation in between, and
              the network can now bend and combine linear boundaries into
              curved, complex decision regions — this is what &quot;deep&quot;
              in deep learning refers to.
            </p>
            <p className="interview-tip">
              <strong>Interview check:</strong>
              Know that depth (multiple layers) is what gives networks the
              ability to approximate arbitrarily complex functions — this
              is the intuition behind the Universal Approximation Theorem.
            </p>
          </div>
          <div className="topic-code">
            <pre><code>{`import torch.nn as nn

model = nn.Sequential(
    nn.Linear(2, 4),
    nn.ReLU(),
    nn.Linear(4, 1),
    nn.Sigmoid()
)
# This CAN solve XOR`}</code></pre>
          </div>
        </div>

        <div className="topic-row">
          <div className="topic-explain">
            <strong>What Actually Changed: Feature Engineering vs. Feature Learning</strong>
            <p>
              In classical ML, you hand-design features (e.g. &quot;age squared,&quot;
              &quot;ratio of X to Y&quot;) before fitting a model. In neural networks,
              the hidden layers learn useful features automatically during
              training — no one hand-designs them.
            </p>
            <p className="interview-tip">
              <strong>Interview check:</strong>
              This is the single most important interview answer for &quot;why
              neural networks&quot; — be able to say it clearly and confidently.
            </p>
          </div>
          <div className="topic-code">
            <pre><code>{`# Classical ML: you engineer this
df["bmi"] = df["weight"] / df["height"]**2

# Neural net: hidden layers learn
# useful combinations on their own,
# with no manual feature engineering`}</code></pre>
          </div>
        </div>

      </div>

      <h3>Week 0 Interview Questions</h3>

      <div className="interview-questions">
        <ul>
          <li>What is the mathematical relationship between linear regression and a single neuron?</li>
          <li>Why can&apos;t a single-layer network solve XOR?</li>
          <li>What does adding a hidden layer actually give you, conceptually?</li>
          <li>What is the key difference between feature engineering and feature learning?</li>
          <li>Why is a non-linear activation function necessary between layers?</li>
        </ul>
      </div>

      <h3>The Standard You Want</h3>

      <p>
        By the end of Week 0, you should be able to explain to someone who
        only knows classical ML exactly why neural networks are a natural
        extension of what they already know — not a totally different field.
      </p>
      <Link className="week-back-to-map" href="/dl#week-0">Back to the learning map &uarr;</Link>
    </section>
  );
}
