"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { dlRoadmap } from "../roadmap";
import "../../Section.css";
import "./Week0.css";

const questions = [
  ["How is linear regression related to a single neuron?", "Both compute an affine function: ŷ = wᵀx + b. A neuron with an identity output has the same model form. Linear regression also specifies how those parameters are fitted, commonly using squared error."],
  ["Why can’t logistic regression on the original inputs solve XOR?", "At a probability threshold of 0.5, its boundary is wᵀx + b = 0. XOR places equal labels on opposite corners of a square, so no single straight line separates them."],
  ["What does a hidden layer give you?", "With a nonlinear activation, it can transform the inputs into features that make the final prediction easier. Without nonlinearity, stacked affine layers collapse to one affine transformation."],
  ["What is feature learning?", "Hidden layers learn intermediate representations through the training objective. You still choose inputs, preprocessing, architecture, and training data; useful features and generalization are not guaranteed."],
  ["Does universal approximation require many hidden layers?", "No. Under suitable conditions, one sufficiently wide hidden layer with an appropriate nonlinear activation can approximate continuous functions on a compact domain. The theorem does not guarantee that training will find the solution or that it will generalize."],
  ["Does loss.backward() update the weights?", "No. It computes and accumulates gradients. optimizer.step() uses those gradients to update parameters. Reset gradients between ordinary training steps with optimizer.zero_grad()."],
];

function Code({ children }: { children: string }) {
  return <div className="w0-code"><span className="w0-code-label">PYTHON / PYTORCH</span><pre><code>{children}</code></pre></div>;
}

function Topic({ number, title, children, code }: { number: string; title: string; children: ReactNode; code: string }) {
  return <article className="w0-topic" aria-labelledby={`w0-topic-${number}`}>
    <div className="w0-topic-copy"><span className="w0-eyebrow">CONCEPT {number}</span><h2 id={`w0-topic-${number}`}>{title}</h2>{children}</div>
    <Code>{code}</Code>
  </article>;
}

function Network() {
  const layers = [[70, [76, 154]], [210, [46, 115, 184]], [350, [115]]] as const;
  return <svg viewBox="0 0 420 240" role="img" aria-label="Two inputs connect to three hidden neurons with nonlinear activations, then to one output." className="w0-network">
    {layers.slice(0, -1).flatMap(([x, ys], layer) => ys.flatMap((y, i) => layers[layer + 1][1].map((nextY, j) =>
      <line className="w0-wire" key={`${layer}-${i}-${j}`} x1={x} y1={y} x2={layers[layer + 1][0]} y2={nextY} style={{ animationDelay: `${(i + j) * .25}s` }} />
    )))}
    {layers.map(([x, ys], layer) => ys.map((y, i) => <g key={`${layer}-${i}`}><circle cx={x} cy={y} r="21" className={`w0-neuron w0-neuron-${layer}`} /><text x={x} y={y + 5} textAnchor="middle">{layer === 0 ? `x${i + 1}` : layer === 1 ? "φ" : "ŷ"}</text></g>))}
    <text x="70" y="229" textAnchor="middle">Inputs</text><text x="210" y="229" textAnchor="middle">Hidden features</text><text x="350" y="229" textAnchor="middle">Output</text>
  </svg>;
}

function NeuronLab() {
  const [weight, setWeight] = useState(1);
  const [bias, setBias] = useState(0);
  const [sigmoid, setSigmoid] = useState(false);
  const prediction = (x: number) => sigmoid ? 1 / (1 + Math.exp(-(weight * x + bias))) : weight * x + bias;
  const yPixel = (y: number) => sigmoid ? 190 - y * 150 : 115 - y * 18;
  const curve = Array.from({ length: 121 }, (_, i) => {
    const x = -3 + i / 20;
    return `${i === 0 ? "M" : "L"}${40 + (x + 3) * 50},${yPixel(prediction(x))}`;
  }).join(" ");
  return <section className="w0-lab" aria-labelledby="w0-neuron-title">
    <div className="w0-lab-heading"><div><span className="w0-eyebrow">TRY IT</span><h3 id="w0-neuron-title">One neuron. Two familiar models.</h3></div><button type="button" aria-pressed={sigmoid} onClick={() => setSigmoid(!sigmoid)}>{sigmoid ? "Sigmoid: on" : "Sigmoid: off"}</button></div>
    <div className="w0-lab-grid"><div>
      <p>Move the weight to change the slope and the bias to shift the output. Turn on sigmoid to map the score to a probability.</p>
      <label className="w0-slider" htmlFor="w0-weight"><span>Weight w <output>{weight.toFixed(1)}</output></span><input id="w0-weight" type="range" min="-2" max="2" step="0.1" value={weight} onChange={e => setWeight(Number(e.target.value))} /></label>
      <label className="w0-slider" htmlFor="w0-bias"><span>Bias b <output>{bias.toFixed(1)}</output></span><input id="w0-bias" type="range" min="-2" max="2" step="0.1" value={bias} onChange={e => setBias(Number(e.target.value))} /></label>
      <div className="w0-result">At x = 1: <strong>{sigmoid ? "p" : "ŷ"} = {prediction(1).toFixed(3)}</strong></div>
    </div><figure className="w0-figure"><svg viewBox="0 0 380 240" role="img" aria-label={`${sigmoid ? "Sigmoid probability" : "Linear output"} curve with weight ${weight} and bias ${bias}`}>
      <defs><clipPath id="w0-plot-clip"><rect x="40" y="20" width="300" height="190" /></clipPath></defs>
      <line className="w0-axis" x1="40" y1={yPixel(0)} x2="340" y2={yPixel(0)} /><line className="w0-axis" x1="190" y1="20" x2="190" y2="210" />
      {[-3, 0, 3].map(x => <text key={x} x={40 + (x + 3) * 50} y="231" textAnchor="middle">{x}</text>)}
      <text x="356" y="231">x</text><text x="10" y={yPixel(sigmoid ? 1 : 4) + 5}>{sigmoid ? "1" : "4"}</text><text x="10" y={yPixel(0) + 5}>0</text>
      <path className="w0-curve" d={curve} clipPath="url(#w0-plot-clip)" /><circle className="w0-point" cx="240" cy={yPixel(prediction(1))} r="6" />
    </svg><figcaption>{sigmoid ? "p = σ(wx + b) · logistic regression" : "ŷ = wx + b · linear model"}</figcaption></figure></div>
  </section>;
}

function XorLab() {
  const [transformed, setTransformed] = useState(false);
  const samples = [{ x: 0, y: 0, label: 0 }, { x: 0, y: 1, label: 1 }, { x: 1, y: 0, label: 1 }, { x: 1, y: 1, label: 0 }];
  return <section className="w0-lab" aria-labelledby="w0-xor-title"><div className="w0-lab-heading"><div><span className="w0-eyebrow">SEE THE REPRESENTATION CHANGE</span><h3 id="w0-xor-title">Give XOR a new coordinate system.</h3></div><button type="button" aria-pressed={transformed} onClick={() => setTransformed(!transformed)}>{transformed ? "Show original inputs" : "Apply hidden layer"}</button></div>
    <div className="w0-lab-grid"><div><p>{transformed ? "The two class-1 inputs map to the same point, (1, 0). A straight line now separates them from both class-0 points." : "The class-1 points sit on opposite corners. Any single straight boundary leaves at least one point on the wrong side."}</p>
      <div className="w0-formula">h₁ = ReLU(x₁ + x₂)<br />h₂ = ReLU(x₁ + x₂ − 1)<br /><strong>score = h₁ − 2h₂</strong></div>
      <p className="w0-small">Class 1 when score &gt; 0.5. These are hand-picked weights that demonstrate a solution; this button does not train a network.</p>
      <div className="w0-legend"><span>○ Class 0</span><span>◆ Class 1</span></div>
    </div><figure className="w0-figure"><svg viewBox="0 0 400 260" role="img" aria-label={transformed ? "Hidden space: class zero at (0,0) and (2,1); both class one samples overlap at (1,0). Boundary h1 minus 2 h2 equals 0.5 separates the classes." : "Original XOR inputs: class zero at (0,0) and (1,1), class one at (0,1) and (1,0)."}>
      <path className="w0-axis" d="M55 25 V210 H365" />
      {[0, 1, 2].filter(v => transformed || v < 2).map(v => <text key={v} x={65 + v * (transformed ? 135 : 265)} y="233" textAnchor="middle">{v}</text>)}
      <text x="34" y="205">0</text><text x="34" y="65">1</text><text x="351" y="253">{transformed ? "h₁" : "x₁"}</text><text x="14" y="30">{transformed ? "h₂" : "x₂"}</text>
      {transformed && <path className="w0-boundary" d="M132.5 200 L362 81" />}
      {samples.map(({x, y, label}, i) => {
        const px = 65 + (transformed ? (x + y) * 135 : x * 265);
        const py = 200 - (transformed ? Math.max(0, x + y - 1) : y) * 140;
        return <g key={i} className="w0-sample" style={{ transform: `translate(${px}px, ${py}px)` }}>{label ? <path className="w0-class-one" d="M0 -11 L11 0 L0 11 L-11 0 Z" /> : <circle className="w0-class-zero" r="10" />}</g>;
      })}
      {transformed && <text x="180" y="178">2 inputs overlap</text>}
    </svg><figcaption>{transformed ? "Hidden feature space · dashed line: score = 0.5" : "Original input space · no separating straight line"}</figcaption></figure></div>
  </section>;
}

function GradientLab() {
  const [step, setStep] = useState(0);
  const weight = (7 - Math.pow(0.1, step)) / 3;
  // Closed form of w <- w - 0.1 * ((3w + 1) - 8) * 3; only w is trained.
  const prediction = 3 * weight + 1;
  const loss = .5 * (prediction - 8) ** 2;
  const gradient = (prediction - 8) * 3;
  return <section className="w0-lab" aria-labelledby="w0-gradient-title"><span className="w0-eyebrow">FOLLOW THE UPDATE</span><h3 id="w0-gradient-title">A gradient points. An optimizer steps.</h3><p>Fixed input x = 3, target y = 8, bias b = 1, learning rate η = 0.1. Only the weight changes in this demo.</p>
    <div className="w0-stats" aria-live="polite" aria-atomic="true"><div><span>Step</span><strong>{step}</strong></div><div><span>Weight</span><strong>{weight.toFixed(4)}</strong></div><div><span>Prediction</span><strong>{prediction.toFixed(4)}</strong></div><div><span>Loss</span><strong>{loss === 0 ? "0" : loss.toPrecision(3)}</strong></div></div>
    <div className="w0-formula">L = ½(ŷ − y)²<br />∂L/∂w = (ŷ − y)x = {gradient.toFixed(5)}<br />w<sub>next</sub> = {weight.toFixed(4)} − 0.1 × ({gradient.toFixed(5)})</div>
    <div className="w0-actions"><button type="button" onClick={() => setStep(s => s + 1)} disabled={step >= 5}>Take one gradient step</button><button type="button" className="w0-secondary" onClick={() => setStep(0)} disabled={step === 0}>Reset</button><span className="w0-small">{step >= 5 ? "Five steps complete. Reset to explore again." : "First step: loss falls from 0.5 to 0.005."}</span></div>
  </section>;
}

export default function Week0() {
  return <section id="week-0" className="week-block learning-section w0" aria-labelledby="week-0-title">
    <header className="w0-hero"><div><span className="w0-eyebrow">DEEP LEARNING / THE FOUNDATION</span><h1 id="week-0-title">Week 0 — {dlRoadmap[0].title}</h1><p>Start with a model you know. Add a nonlinear transformation. Discover how a network can learn a more useful representation of its inputs.</p><a className="w0-jump" href="#w0-neuron-title">Explore a neuron <span aria-hidden="true">↓</span></a></div><Network /></header>
    <aside className="w0-callout"><strong>Core idea</strong><p>Linear and logistic regression choose a simple relationship between inputs and predictions. Neural networks compose trainable transformations to learn intermediate features. We still choose the architecture and its assumptions. Classical models such as decision trees can also learn nonlinear patterns.</p></aside>
    <Topic number="01" title="Linear regression as a single neuron" code={`# A linear model: one affine transformation\ny = w * x + b\n\nimport torch.nn as nn\nneuron = nn.Linear(in_features=1, out_features=1)\n# nn.Linear includes a bias by default.\n# Choose a loss and fit its parameters to train it.`}><p>A neuron without an activation computes <code>ŷ = wᵀx + b</code>: exactly the model form used by linear regression. The weight controls each input’s contribution; the bias shifts the output.</p><p className="w0-tip"><strong>Interview check:</strong> Distinguish the model’s equation from the loss and fitting procedure.</p></Topic>
    <Topic number="02" title="Logistic regression as a single neuron" code={`import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(10, 1),\n    nn.Sigmoid()\n)\n# Ten input features, one probability.\n# For training with BCEWithLogitsLoss,\n# omit Sigmoid: that loss handles it internally.`}><p>Binary logistic regression applies sigmoid to the affine score: <code>p = σ(wᵀx + b)</code>. The probability curve is nonlinear, but its 0.5 decision boundary is still linear in the supplied features.</p><p className="w0-tip"><strong>Interview check:</strong> Why does sigmoid change the output range without making that boundary curved?</p></Topic>
    <NeuronLab />
    <Topic number="03" title="The limitation: one straight boundary" code={`# XOR: output 1 only when inputs differ\n# x1  x2  target\n#  0   0     0\n#  0   1     1\n#  1   0     1\n#  1   1     0\n\n# Logistic regression on raw x1, x2\n# cannot separate these four points.`}><p>XOR puts matching labels on opposite corners of a square. A single affine score followed by a sigmoid or threshold cannot separate the classes in the original input space.</p><p className="w0-tip"><strong>Interview check:</strong> This is a statement about the model and its features. Engineered nonlinear features can also make XOR separable.</p></Topic>
    <XorLab />
    <Topic number="04" title="Why nonlinear hidden layers matter" code={`import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(2, 4),\n    nn.ReLU(),\n    nn.Linear(4, 1)\n)\nloss_fn = nn.BCEWithLogitsLoss()\n# This architecture can represent XOR.\n# It still needs training; success is not automatic.\n# Use torch.sigmoid(model(x)) for probabilities.`}><p>Two affine layers alone collapse into one: <code>W₂(W₁x + b₁) + b₂ = (W₂W₁)x + W₂b₁ + b₂</code>. A nonlinear activation between them allows new kinds of functions.</p><p>ReLU networks form piecewise linear functions. Other activations can produce smooth curves. Depth can help represent some functions efficiently.</p><p className="w0-tip"><strong>Theory check:</strong> Universal approximation can hold with one sufficiently wide hidden layer under suitable conditions. It guarantees representational capacity, not easy training or good generalization.</p></Topic>
    <Topic number="05" title="Feature engineering and feature learning" code={`# An engineered feature (height measured in meters)\ndf["bmi"] = df["weight"] / df["height"] ** 2\n\n# A learned representation\nencoder = nn.Sequential(\n    nn.Linear(10, 16),\n    nn.ReLU()\n)\n# During training, these weights can adapt\n# to produce features useful for the objective.`}><p>Feature engineering uses domain knowledge to construct inputs. Feature learning adjusts hidden transformations through training. Both can be useful in the same system.</p><p>You still select data, preprocessing, architecture, and objectives. A hidden unit is not guaranteed to discover a named concept such as BMI.</p><p className="w0-tip"><strong>Interview check:</strong> Explain how the loss influences both the final prediction layer and the earlier feature transformations.</p></Topic>
    <Topic number="06" title="The learning loop stays familiar" code={`for x, y in loader:\n    optimizer.zero_grad()   # Clear old gradients\n    logits = model(x)       # Forward pass\n    loss = loss_fn(logits, y)\n    loss.backward()        # Compute gradients\n    optimizer.step()       # Update parameters\n\n# Use validation data for model selection.\n# Reserve test data for final evaluation.`}><p>Prediction, loss, gradient calculation, and parameter updates remain the basic loop. Backpropagation applies the chain rule through the computational graph. Automatic differentiation performs that calculation for you.</p><p>Weights and biases are parameters. Learning rate and layer widths are hyperparameters. Optimizers can also track state such as momentum.</p><p className="w0-tip"><strong>Interview check:</strong> Calculating a gradient and changing a parameter are separate operations.</p></Topic>
    <GradientLab />
    <section className="w0-review" aria-labelledby="w0-review-title"><span className="w0-eyebrow">EXPLAIN IT IN YOUR OWN WORDS</span><h2 id="w0-review-title">Week 0 interview questions</h2><p>Try answering aloud before opening the explanation.</p>{questions.map(([question, answer], i) => <details key={question}><summary><span className="w0-question-number">{String(i + 1).padStart(2, "0")}</span>{question}</summary><p>{answer}</p></details>)}</section>
    <aside className="w0-callout w0-finish"><strong>The standard you want</strong><p>Explain how linear models lead naturally to neural networks, demonstrate why nonlinear hidden layers change what a model can represent, and distinguish gradient calculation from parameter updates.</p></aside>
    <Link className="week-back-to-map w0-back" href="/dl#week-0">Back to the learning map ↑</Link>
  </section>;
}
