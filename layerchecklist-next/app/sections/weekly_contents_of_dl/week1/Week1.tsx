"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { dlRoadmap } from "../roadmap";
import "../../Section.css";
import "./Week1.css";

// The demonstrations use the same scalar network as the Python examples.
type Parameters = { w1: number; b1: number; w2: number; b2: number };
type Phase = "forward" | "backward" | "update";
const INITIAL: Parameters = { w1: 0.3, b1: 0.1, w2: -0.5, b2: 0.2 };
const KEYS: (keyof Parameters)[] = ["w1", "b1", "w2", "b2"];
const INPUT = 2;
const TARGET = 1;
const RATES = [0.01, 0.1, 1] as const;

function evaluate(p: Parameters) {
  const z = p.w1 * INPUT + p.b1;
  const h = Math.tanh(z);
  const prediction = p.w2 * h + p.b2;
  const error = prediction - TARGET;
  const loss = 0.5 * error ** 2;
  const gradZ = error * p.w2 * (1 - h ** 2);
  const gradients: Parameters = { w1: gradZ * INPUT, b1: gradZ, w2: error * h, b2: error };
  return { z, h, prediction, error, loss, gradZ, gradients };
}

function update(p: Parameters, rate: number): Parameters {
  const { gradients: g } = evaluate(p);
  // All four gradients use the old parameters, then all four are updated.
  return { w1: p.w1 - rate * g.w1, b1: p.b1 - rate * g.b1, w2: p.w2 - rate * g.w2, b2: p.b2 - rate * g.b2 };
}

function train(rate: number) {
  let parameters = { ...INITIAL };
  const history = [{ step: 0, ...evaluate(parameters) }];
  for (let step = 1; step <= 200; step++) {
    parameters = update(parameters, rate);
    history.push({ step, ...evaluate(parameters) });
  }
  return history;
}

// Deterministic, inexpensive traces; no timer or background training loop.
const RUNS = RATES.map(rate => ({ rate, history: train(rate) }));
const fixed = (value: number) => value.toFixed(4);
const scientific = (value: number) => value === 0 ? "0" : Math.abs(value) < 0.0001 ? value.toExponential(2) : value.toFixed(6);

const topics = [
  {
    title: "Start With One Neuron",
    explanation: "A neuron multiplies each input by a weight, adds a bias, and applies an activation. Weights control how inputs contribute; the bias shifts the result. The activation lets the neuron contribute a nonlinear transformation.",
    code: `from math import tanh

x = 2.0
w, b = 0.3, 0.1
z = w * x + b
h = tanh(z)
print(round(h, 4))  # 0.6044`,
    check: "Which quantities come from the example, and which quantities can training change?",
  },
  {
    title: "Compose a Forward Pass",
    explanation: "Feed the hidden activation into a second weighted sum. This tiny regression network has one input, one hidden neuron, and one linear output. A forward pass calculates a prediction using the current parameters; it does not update them.",
    code: `# Same hidden neuron as above:
# h = tanh(w1 * x + b1)

w2, b2 = -0.5, 0.2
prediction = w2 * h + b2

# x -> weighted sum -> tanh
#   -> weighted sum -> prediction`,
    check: "Why does the output use a linear function here? What output would a binary classifier need instead?",
  },
  {
    title: "Measure Error With a Loss",
    explanation: "For this regression example, use half the squared error. It is zero when the prediction equals the target, and its derivative with respect to the prediction is simply prediction minus target. The factor of one half makes that derivative easier to read.",
    code: `target = 1.0
error = prediction - target
loss = 0.5 * error ** 2

# d(loss) / d(prediction)
grad_prediction = error`,
    check: "A loss is a number. A gradient tells us how that number changes. Why do we need both?",
  },
  {
    title: "Backpropagation Is the Chain Rule",
    explanation: "Follow the calculation backward. The output depends on the hidden activation, and the hidden activation depends on its weighted input. Multiply those local derivatives to find how each parameter affects the loss. Compute every gradient using the same forward pass before changing any weights.",
    code: `# Gradients for the output parameters:
grad_w2 = error * h
grad_b2 = error

# tanh derivative: 1 - h**2
grad_z = error * w2 * (1 - h ** 2)

# Gradients for the hidden parameters:
grad_w1 = grad_z * x
grad_b1 = grad_z`,
    check: "Why must grad_z use the old w2 rather than a weight that has already been updated?",
  },
  {
    title: "Train the Network Without Autograd",
    explanation: "Run this complete example with Python. Gradient descent subtracts the learning rate times each gradient. Repeating the forward pass, backward pass, and update reduces the error on this one example. This demonstrates the training mechanics; one example cannot establish that a model generalizes.",
    code: `from math import tanh

x, target = 2.0, 1.0
w1, b1 = 0.3, 0.1
w2, b2 = -0.5, 0.2
learning_rate = 0.1

for step in range(200):
    h = tanh(w1 * x + b1)
    prediction = w2 * h + b2
    error = prediction - target

    grad_w2 = error * h
    grad_b2 = error
    grad_z = error * w2 * (1 - h ** 2)
    grad_w1 = grad_z * x
    grad_b1 = grad_z

    w1 -= learning_rate * grad_w1
    b1 -= learning_rate * grad_b1
    w2 -= learning_rate * grad_w2
    b2 -= learning_rate * grad_b2

prediction = w2 * tanh(w1 * x + b1) + b2
print("Prediction:", round(prediction, 4))
print("Loss:", 0.5 * (prediction - target) ** 2)`,
    check: "Which lines compute gradients, and which lines actually learn by updating parameters?",
  },
];

const questions = [
  ["What are weights, biases, and activations responsible for?", "Weights scale incoming values, biases shift the weighted sum, and nonlinear activations change the kinds of functions the network can represent. Training adjusts weights and biases; this example fixes the activation to tanh."],
  ["What changes during the forward pass, backward pass, and update?", "Forward computes activations, a prediction, and a loss using current parameters. Backward computes gradients at those parameter values. The update changes the parameters using those gradients."],
  ["How does the chain rule connect an early weight to the final loss?", "For w1, multiply four local derivatives: (prediction − target) × w2 × (1 − h²) × x. If a quantity affects the loss through multiple paths, add the contributions from those paths."],
  ["Why do we calculate all gradients before updating any parameter?", "All components of the gradient must describe the same parameter state and forward pass. Updating w2 before calculating the hidden gradient mixes two different parameter states."],
  ["Why does a low loss on one training example say little about new examples?", "The network may fit that one pair without learning a useful rule for other inputs. Evaluate on held-out examples; use validation data for model choices and reserve test data for final evaluation."],
];

function Code({ children }: { children: string }) {
  return <div className="w1-code"><div className="w1-code-heading"><span>PYTHON</span><span>STANDARD LIBRARY ONLY</span></div><pre tabIndex={0} aria-label="Python code"><code>{children}</code></pre></div>;
}

function LessonTopic({ index, children }: { index: number; children?: ReactNode }) {
  const topic = topics[index];
  return <section className="w1-topic" aria-labelledby={`w1-topic-${index}`}>
    <div className="w1-topic-grid"><div><span className="w1-eyebrow">CONCEPT {String(index + 1).padStart(2, "0")}</span><h2 id={`w1-topic-${index}`}>{topic.title}</h2><p>{topic.explanation}</p><p className="w1-check"><strong>Think it through</strong>{topic.check}</p></div><Code>{topic.code}</Code></div>{children}
  </section>;
}

function ActivationLab() {
  const [weight, setWeight] = useState(INITIAL.w1);
  const [bias, setBias] = useState(INITIAL.b1);
  const z = weight * INPUT + bias;
  const h = Math.tanh(z);
  const path = Array.from({ length: 121 }, (_, i) => {
    const input = -3 + i * .05;
    return `${i === 0 ? "M" : "L"}${40 + i * 2.5},${(120 - Math.tanh(input) * 85).toFixed(2)}`;
  }).join(" ");
  return <div className="w1-lab"><span className="w1-eyebrow">NEURON EXPLORER</span><h3>Change the parameters. Watch tanh respond.</h3><div className="w1-lab-grid"><div><p>Input x stays at 2. Move w₁ or b₁ to change z. Near the ends of the curve, tanh saturates and its derivative becomes small.</p>
    <label className="w1-slider" htmlFor="w1-weight"><span>Weight w₁ <output>{weight.toFixed(2)}</output></span><input id="w1-weight" type="range" min="-1" max="1" step=".05" value={weight} onChange={e => setWeight(Number(e.target.value))} /></label>
    <label className="w1-slider" htmlFor="w1-bias"><span>Bias b₁ <output>{bias.toFixed(2)}</output></span><input id="w1-bias" type="range" min="-1" max="1" step=".05" value={bias} onChange={e => setBias(Number(e.target.value))} /></label>
    <div className="w1-formula">z = {weight.toFixed(2)} × 2 + ({bias.toFixed(2)}) = {z.toFixed(2)}<br />h = tanh(z) = {fixed(h)}<br /><strong>dh/dz = 1 − h² = {fixed(1 - h * h)}</strong></div>
    <button type="button" className="w1-secondary" onClick={() => { setWeight(INITIAL.w1); setBias(INITIAL.b1); }}>Reset neuron</button>
    </div><figure><svg viewBox="0 0 380 250" role="img" aria-label={`Tanh activation: at z ${z.toFixed(2)}, output ${fixed(h)}, derivative ${fixed(1-h*h)}`}>
      <path className="w1-axis" d="M40 120 H340 M190 22 V215" />
      {[-1, 0, 1].map(v => <text key={v} x="18" y={125-v*85}>{v}</text>)}
      {[-3, 0, 3].map(v => <text key={v} x={190 + v*50} y="236" textAnchor="middle">{v}</text>)}
      <text x="356" y="237">z</text><path className="w1-curve" d={path} /><line className="w1-guide" x1={190+z*50} x2={190+z*50} y1="120" y2={Number((120-h*85).toFixed(2))} /><circle className="w1-dot" cx={190+z*50} cy={Number((120-h*85).toFixed(2))} r="7" />
    </svg><figcaption>tanh(z) ranges between −1 and 1.</figcaption></figure></div></div>;
}

function TrainingLab() {
  const [parameters, setParameters] = useState<Parameters>({ ...INITIAL });
  const [phase, setPhase] = useState<Phase>("forward");
  const [steps, setSteps] = useState(0);
  const value = evaluate(parameters);
  const next = update(parameters, .1);
  const after = evaluate(next);
  const descriptions: Record<Phase, string> = {
    forward: "Read left to right. Current parameters produce the intermediate values, prediction, and loss. No parameter has changed.",
    backward: "Read the derivatives from the loss toward the early weight. Multiply local derivatives along the path. The current parameters still have not changed.",
    update: "Preview each new parameter using θnew = θold − 0.1 × gradient. Applying the update changes all four parameters together, then recomputes the prediction.",
  };
  return <section className="w1-lab" aria-labelledby="w1-trace-title"><span className="w1-eyebrow">THE COMPUTATIONAL GRAPH</span><h3 id="w1-trace-title">Trace one complete learning step.</h3><div className="w1-toolbar"><div className="w1-phase-buttons" role="group" aria-label="Inspect a training phase">{(["forward", "backward", "update"] as const).map((name, i) => <button key={name} type="button" aria-pressed={phase === name} onClick={() => setPhase(name)}>{i + 1}. {name === "forward" ? "Forward" : name === "backward" ? "Backward" : "Update"}</button>)}</div><span className="w1-small">Completed updates: {steps}</span></div>
    <p className="w1-phase-description" aria-live="polite">{descriptions[phase]}</p>
    <figure className={`w1-graph w1-graph-${phase}`} tabIndex={0} aria-label="Scrollable computational graph"><svg viewBox="0 0 690 225" role="img" aria-label={`Input 2 produces z ${fixed(value.z)}, tanh activation ${fixed(value.h)}, prediction ${fixed(value.prediction)}, and loss ${scientific(value.loss)}. Target is 1.`}>
      {[130, 260, 390, 520].map(x => <g key={x}><line className="w1-flow-line" x1={x} x2={x+34} y1="85" y2="85" /><path className="w1-arrow" d={phase === "backward" ? `M${x+8} 80 L${x} 85 L${x+8} 90` : `M${x+26} 80 L${x+34} 85 L${x+26} 90`} /></g>)}
      {[{ label: "INPUT x", text: "2.0000", sub: "fixed example" }, { label: "z = w₁x + b₁", text: fixed(value.z), sub: "weighted sum" }, { label: "h = tanh(z)", text: fixed(value.h), sub: "activation" }, { label: "ŷ = w₂h + b₂", text: fixed(value.prediction), sub: "prediction" }, { label: "L = ½(ŷ − 1)²", text: scientific(value.loss), sub: "loss" }].map((node, i) => <g key={node.label}><rect className="w1-node" x={i*130+16} y="44" width="114" height="84" rx="12" /><text x={i*130+73} y="67" textAnchor="middle">{node.label}</text><text className="w1-node-value" x={i*130+73} y="98" textAnchor="middle">{node.text}</text><text x={i*130+73} y="150" textAnchor="middle">{node.sub}</text></g>)}
      <text x="345" y="200" textAnchor="middle">{phase === "backward" ? "Derivative information travels backward" : phase === "update" ? "The optimizer changes w₁, b₁, w₂, and b₂" : "Values travel forward using the current parameters"}</text>
    </svg><figcaption>Fixed x = 2 and target = 1. This lab starts independently of the neuron explorer.</figcaption></figure>
    {phase === "backward" && <div className="w1-derivatives"><p><strong>The path to w₁</strong></p><div className="w1-formula">∂L/∂w₁ = (ŷ − y) × w₂ × (1 − h²) × x<br />= ({fixed(value.error)}) × ({fixed(parameters.w2)}) × {fixed(1-value.h**2)} × 2<br /><strong>= {fixed(value.gradients.w1)}</strong></div><p className="w1-small">For b₁, the final factor is 1. For w₂, the gradient is (ŷ − y)h. For b₂, it is ŷ − y.</p></div>}
    {phase !== "forward" && <div className="w1-table-scroll" role="region" aria-label="Parameter gradients and updates" tabIndex={0}><table><thead><tr><th scope="col">Parameter</th><th scope="col">Current</th><th scope="col">Gradient</th>{phase === "update" && <th scope="col">After update</th>}</tr></thead><tbody>{KEYS.map(key => <tr key={key}><th scope="row">{key}</th><td>{fixed(parameters[key])}</td><td>{fixed(value.gradients[key])}</td>{phase === "update" && <td>{fixed(next[key])}</td>}</tr>)}</tbody></table></div>}
    {phase === "update" && <p className="w1-preview">Loss after the proposed update: <strong>{scientific(after.loss)}</strong></p>}
    <div className="w1-actions"><button type="button" disabled={phase !== "update" || steps >= 200} onClick={() => { setParameters(next); setSteps(s => s+1); setPhase("forward"); }}>Apply update · η = 0.1</button><button type="button" className="w1-secondary" onClick={() => { setParameters({ ...INITIAL }); setSteps(0); setPhase("forward"); }}>Reset all parameters</button></div>
    <p className="w1-small w1-status" role="status">{steps >= 200 ? "200 updates complete. Reset to start again." : phase !== "update" ? "Inspect Update to enable the parameter update." : "The update is a preview until you apply it."}</p>
  </section>;
}

function RateLab() {
  const [selected, setSelected] = useState<number>(.1);
  const [step, setStep] = useState(200);
  const run = RUNS.find(item => item.rate === selected) ?? RUNS[1];
  const current = run.history[step];
  // Log scale preserves visibility across many orders of magnitude.
  const yPixel = (loss: number) => Number((36 + (-Math.log10(Math.max(1e-12, Math.min(1, loss)))) / 12 * 192).toFixed(2));
  return <section className="w1-lab" aria-labelledby="w1-rate-title"><span className="w1-eyebrow">COMPARE THE TRAINING RUNS</span><h3 id="w1-rate-title">Same network. Different step sizes.</h3><p>Every curve starts from the same four parameters and trains on the same example. Select a learning rate and scrub through its first 200 updates.</p>
    <div className="w1-toolbar"><div className="w1-rate-buttons" role="group" aria-label="Learning rate">{RATES.map(rate => <button key={rate} type="button" aria-pressed={selected === rate} onClick={() => setSelected(rate)}>η = {rate}</button>)}</div><span className="w1-small">All three runs converge here; η = 1.0 is not guaranteed to diverge.</span></div>
    <figure className="w1-loss-chart" tabIndex={0} aria-label="Scrollable training loss chart"><svg viewBox="0 0 650 275" role="img" aria-label={`Training loss on a logarithmic scale for learning rates 0.01, 0.1, and 1. Selected rate ${selected}, step ${step}, loss ${scientific(current.loss)}. Values below 1e-12 are plotted at the chart floor.`}>
      {[0, 3, 6, 9, 12].map(power => <g key={power}><line className="w1-gridline" x1="70" x2="615" y1={36+power*16} y2={36+power*16} /><text x="59" y={40+power*16} textAnchor="end">{power === 0 ? "1" : `1e−${power}`}</text></g>)}
      {[0, 50, 100, 150, 200].map(s => <text key={s} x={70+s/200*545} y="251" textAnchor="middle">{s}</text>)}
      <text x="70" y="20">Loss (log scale)</text><text x="615" y="271" textAnchor="end">Updates</text>
      {RUNS.map((item, i) => <path key={item.rate} className={`w1-loss-line w1-run-${i}`} style={{ opacity: selected === item.rate ? 1 : .3, strokeWidth: selected === item.rate ? 3 : 2 }} strokeDasharray={i === 0 ? "7 4" : i === 2 ? "2 4" : undefined} d={item.history.map((v, j) => `${j === 0 ? "M" : "L"}${70+j/200*545},${yPixel(v.loss)}`).join(" ")} />)}
      <line className="w1-guide" x1={70+step/200*545} x2={70+step/200*545} y1="36" y2="228" /><circle className="w1-dot" cx={70+step/200*545} cy={yPixel(current.loss)} r="5" />
    </svg><figcaption>Dashed: η = 0.01 · Solid: η = 0.1 · Dotted: η = 1.0. Plot floor: 10⁻¹²; numbers below remain visible in the table.</figcaption></figure>
    <label className="w1-slider" htmlFor="w1-training-step"><span>Inspect update <output>{step} / 200</output></span><input id="w1-training-step" type="range" min="0" max="200" step="1" value={step} onChange={e => setStep(Number(e.target.value))} /></label>
    <div className="w1-metrics"><div><span>Selected rate</span><strong>{selected}</strong></div><div><span>Prediction at step {step}</span><strong>{fixed(current.prediction)}</strong></div><div><span>Loss at step {step}</span><strong>{scientific(current.loss)}</strong></div></div>
    <div className="w1-table-scroll" role="region" aria-label="Learning rate results" tabIndex={0}><table><thead><tr><th scope="col">Learning rate</th><th scope="col">Starting loss</th><th scope="col">Loss after 200 updates</th></tr></thead><tbody>{RUNS.map(item => <tr key={item.rate} className={selected === item.rate ? "w1-selected-row" : undefined}><th scope="row">{item.rate}</th><td>{scientific(item.history[0].loss)}</td><td>{scientific(item.history[200].loss)}</td></tr>)}</tbody></table></div>
    <p className="w1-small">Near-zero values can differ slightly between Python and JavaScript due to floating-point arithmetic. Successful fitting here says nothing about performance on new inputs.</p>
  </section>;
}

function GradientCheck() {
  const [parameter, setParameter] = useState<keyof Parameters>("w1");
  const [epsilon, setEpsilon] = useState(.0001);
  const analytical = evaluate(INITIAL).gradients[parameter];
  const upper = evaluate({ ...INITIAL, [parameter]: INITIAL[parameter] + epsilon }).loss;
  const lower = evaluate({ ...INITIAL, [parameter]: INITIAL[parameter] - epsilon }).loss;
  const numerical = (upper - lower) / (2 * epsilon);
  return <section className="w1-lab" aria-labelledby="w1-check-title"><span className="w1-eyebrow">CHECK YOUR DERIVATIVES</span><h3 id="w1-check-title">Does a small perturbation agree?</h3><p>At the initial parameters, compare backpropagation with a central finite difference. Only the selected parameter changes for the two test evaluations; this does not train the model.</p>
    <div className="w1-selects"><label htmlFor="w1-check-parameter">Parameter<select id="w1-check-parameter" value={parameter} onChange={e => setParameter(e.target.value as keyof Parameters)}>{KEYS.map(key => <option key={key} value={key}>{key}</option>)}</select></label><label htmlFor="w1-check-epsilon">Perturbation ε<select id="w1-check-epsilon" value={epsilon} onChange={e => setEpsilon(Number(e.target.value))}>{[.1, .01, .0001, .000001, 1e-10, 1e-14].map(e => <option key={e} value={e}>{e.toExponential(0)}</option>)}</select></label></div>
    <div className="w1-formula">g<sub>numeric</sub> = [L(θ + ε) − L(θ − ε)] / (2ε)</div>
    <div className="w1-metrics" aria-live="polite" aria-atomic="true"><div><span>Backpropagation</span><strong>{analytical.toFixed(8)}</strong></div><div><span>Finite difference</span><strong>{numerical.toFixed(8)}</strong></div><div><span>Absolute difference</span><strong>{Math.abs(analytical-numerical).toExponential(2)}</strong></div></div>
    <p className="w1-small">A large ε can hide local behavior; a very small ε can amplify rounding error. Numerical checking supports correctness, but it is too costly to replace backpropagation in large networks.</p>
  </section>;
}

export default function Week1() {
  return <section id="week-1" className="week-block learning-section w1" aria-labelledby="week-1-title">
    <header className="w1-hero"><span className="w1-eyebrow">DEEP LEARNING / BUILD IT FROM FIRST PRINCIPLES</span><h1 id="week-1-title">Week 1 — {dlRoadmap[1].title}</h1><p>Build a tiny neural network from arithmetic and derivatives. Start with a neuron, connect it to an output, measure the error, and work backward to update every parameter. The examples use Python&apos;s standard library.</p><nav className="w1-navigation" aria-label="Week 1 sections"><a href="#w1-topic-0">One neuron ↓</a><a href="#w1-trace-title">Trace the gradient ↓</a><a href="#w1-rate-title">Compare training ↓</a></nav><div className="w1-hero-equation" aria-label="Prediction equals w2 times tanh of w1 x plus b1, plus b2"><span>ŷ =</span> w₂ <span>tanh(</span>w₁x + b₁<span>) +</span> b₂</div></header>
    <aside className="w1-callout"><strong>Core idea</strong><p>A neural network is a composition of parameterized functions. Learning means calculating how the loss changes with each parameter, then using that information to adjust the parameters.</p></aside>
    <LessonTopic index={0}><ActivationLab /></LessonTopic>
    <LessonTopic index={1} />
    <LessonTopic index={2} />
    <LessonTopic index={3}><TrainingLab /></LessonTopic>
    <LessonTopic index={4}><RateLab /></LessonTopic>
    <GradientCheck />
    <section className="w1-scaling" aria-labelledby="w1-scaling-title"><span className="w1-eyebrow">CONNECT TO THE LECTURE</span><h2 id="w1-scaling-title">More neurons, the same operations.</h2><p>A dense layer computes many weighted sums together. With observations stored as rows, the batch calculation is <code>Z = XWᵀ + b</code>, with the bias broadcast across observations.</p><div className="w1-table-scroll" role="region" aria-label="Tensor dimensions for a batch" tabIndex={0}><table><caption>Example: B observations, 3 inputs, 4 hidden units, 2 outputs</caption><thead><tr><th scope="col">Object</th><th scope="col">Shape</th><th scope="col">Meaning</th></tr></thead><tbody><tr><th scope="row">X</th><td>B × 3</td><td>Input observations</td></tr><tr><th scope="row">W₁ / b₁</th><td>4 × 3 / 4</td><td>Hidden weights / biases</td></tr><tr><th scope="row">H = g(XW₁ᵀ + b₁)</th><td>B × 4</td><td>Hidden activations</td></tr><tr><th scope="row">W₂ / b₂</th><td>2 × 4 / 2</td><td>Output weights / biases</td></tr><tr><th scope="row">HW₂ᵀ + b₂</th><td>B × 2</td><td>Output scores</td></tr></tbody></table></div><p><strong>26 trainable parameters:</strong> (3 × 4 + 4) + (4 × 2 + 2). Changing batch size changes the amount of computation, not this parameter count.</p><details className="w1-detail"><summary>Why not initialize every hidden unit identically?</summary><p>If hidden units and their corresponding outgoing connections start symmetrically, they can receive identical gradients and keep learning the same feature. Random weight initialization breaks that symmetry. Our one-hidden-neuron demo uses fixed parameters so every calculation is reproducible.</p></details></section>
    <section className="w1-exercise" aria-labelledby="w1-exercise-title"><span className="w1-eyebrow">YOUR TURN</span><h2 id="w1-exercise-title">Run it. Compare it. Explain it.</h2><ol><li>Run the complete Python example, then reset the parameters and compare learning rates of 0.01, 0.1, and 1.0. Record the starting and final losses.</li><li>Before training, perturb w1 slightly. Does the change in loss agree with the sign of its calculated gradient?</li><li>Use the numerical gradient checker to compare the analytical and numerical gradients. Try an extremely small ε and explain the discrepancy.</li></ol></section>
    <section className="w1-review" aria-labelledby="w1-review-title"><span className="w1-eyebrow">EXPLAIN IT WITHOUT THE CODE</span><h2 id="w1-review-title">Week 1 interview questions</h2><p>Answer aloud, then open the explanation.</p>{questions.map(([question, answer], i) => <details key={question} className="w1-detail"><summary><span className="w1-question-number">{String(i+1).padStart(2,"0")}</span>{question}</summary><p>{answer}</p></details>)}</section>
    <aside className="w1-callout"><strong>The standard you want</strong><p>You should be able to trace a prediction by hand, derive the gradients for this two-layer network, and explain every line of its training loop.</p></aside>
    <p className="w1-source">Further reading: <a href="https://www.deeplearningbook.org/contents/mlp.html" target="_blank" rel="noopener noreferrer">Deep Learning — Deep Feedforward Networks<span className="w1-sr-only"> (opens in a new tab)</span></a></p>
    <Link className="week-back-to-map w1-back" href="/dl#week-1">Back to the learning map ↑</Link>
  </section>;
}