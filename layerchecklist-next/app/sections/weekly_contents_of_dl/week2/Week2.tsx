"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { dlRoadmap } from "../roadmap";
import "../../Section.css";
import "./Week2.css";

const topics = [
  {
    title: "Depth Needs Nonlinearity",
    explanation: "Depth adds successive transformations. If every layer is affine, their composition is still one affine transformation. Nonlinear activations between layers allow the representation to change in ways a single affine map cannot express. Extra depth can be useful, but it does not guarantee better results.",
    code: `# Two affine layers:
# h = W1 @ x + b1
# y = W2 @ h + b2

# Substitute h:
# y = (W2 @ W1) @ x + (W2 @ b1 + b2)

# With an activation between them:
# y = W2 @ tanh(W1 @ x + b1) + b2
# This generally cannot collapse the same way.`,
    check: "If you stack ten linear layers without activations, have you expanded the set of affine functions you can represent?",
  },
  {
    title: "Compare Activations and Their Slopes",
    explanation: "Sigmoid maps values into (0, 1), while tanh maps them into (-1, 1). Both become nearly flat for large input magnitudes. ReLU is zero for negative inputs and has slope one for positive inputs. Its derivative is undefined at zero; implementations commonly choose zero there.",
    code: `from math import exp, tanh

for z in [-6.0, -1.0, 0.0, 1.0, 6.0]:
    sigmoid = 1 / (1 + exp(-z))
    sigmoid_slope = sigmoid * (1 - sigmoid)
    tanh_slope = 1 - tanh(z) ** 2
    relu_slope = 1.0 if z > 0 else 0.0
    print(z, round(sigmoid_slope, 4),
          round(tanh_slope, 4), relu_slope)`,
    check: "Which activations can have a very small slope even when their outputs are far from zero?",
  },
  {
    title: "Gradients Can Shrink or Grow With Depth",
    explanation: "Backpropagation repeatedly multiplies local derivatives. In a scalar chain, factors below one can shrink the gradient, while factors above one can amplify it. In a network, weight matrices and activation derivatives both matter; looking only at the activation does not predict the full behaviour.",
    code: `# Illustrative scalar products:
for depth in [1, 5, 10, 20]:
    shrinking = 0.25 ** depth
    growing = 1.5 ** depth
    print(depth, shrinking, growing)

# These are local-derivative products,
# not a prediction for every neural network.`,
    check: "What happens to an early layer's update when its gradient is tiny? What can a very large gradient do?",
  },
  {
    title: "Initialization and Inactive ReLUs",
    explanation: "Weight scale affects both activations and gradients. He initialization uses a variance of 2/fan_in as a useful starting point for ReLU layers. This is not a guarantee of stable training. A ReLU unit that remains negative for every training input gets no gradient through that activation and may stay inactive.",
    code: `from math import sqrt
from random import Random

rng = Random(0)
fan_in, fan_out = 16, 8
std = sqrt(2 / fan_in)

# Rows are output neurons; columns are inputs.
weights = [
    [rng.gauss(0, std) for _ in range(fan_in)]
    for _ in range(fan_out)
]`,
    check: "Why is 'ReLU solves vanishing gradients' too strong a claim?",
  },
  {
    title: "Inspect a Tiny Chain Yourself",
    explanation: "This experiment computes the output and its derivative with respect to the input through a scalar chain. Each layer has the same weight and no bias. It isolates the effect of depth, weight scale, and activation; a full network has many interacting paths and parameters.",
    code: `from math import tanh

def chain(depth, weight, activation, x=0.1):
    gradient = 1.0
    for _ in range(depth):
        z = weight * x
        if activation == "tanh":
            x = tanh(z)
            slope = 1 - x ** 2
        else:  # ReLU, with slope 0 at z = 0
            x = max(0.0, z)
            slope = 1.0 if z > 0 else 0.0
        gradient *= weight * slope
    return x, gradient

for activation in ["tanh", "relu"]:
    for depth in [1, 5, 20]:
        output, gradient = chain(depth, 1.5, activation)
        print(activation, depth,
              round(output, 6), round(gradient, 6))`,
    check: "Why can the same weight scale produce different gradient behaviour with tanh and ReLU?",
  },
  {
    title: "Batch Normalization",
    explanation: "Batch normalization standardizes each layer's activations using the current mini-batch's mean and variance, then applies a learned scale (gamma) and shift (beta) so the network can undo the normalization if that turns out to be useful. With the default track_running_stats=True, evaluation uses running averages collected during training in place of mini-batch statistics — this is why model.eval() changes behavior, not just a formality.",
    code: `# x_hat = (x - mean_B) / sqrt(var_B + eps)
# y = gamma * x_hat + beta

import torch.nn as nn

layer = nn.BatchNorm1d(num_features=64)

layer.train()  # uses current batch statistics
layer.eval()   # uses stored running statistics
# Defaults: affine=True, track_running_stats=True`,
    check: "Why does switching between model.train() and model.eval() change a BatchNorm layer's output for the exact same input?",
  },
  {
    title: "Dropout and Inverted Dropout",
    explanation: "Dropout randomly zeroes a fraction of activations during training so the network can't rely on any fixed set of units firing together — this targets generalization, not training loss directly. Inverted dropout scales surviving activations by 1/(1-p) during training itself, so no rescaling is needed at evaluation time — dropout is simply turned off.",
    code: `# h_tilde = mask * h / (1 - p)
# mask_j ~ Bernoulli(1 - p)

import torch.nn as nn

dropout = nn.Dropout(p=0.5)

dropout.train()  # dropout active, scaled
dropout.eval()   # dropout disabled entirely`,
    check: "If training loss isn't decreasing, does adding dropout make sense as a fix? Why or why not?",
  },
  {
    title: "The Jacobian View: Why Some Directions Vanish and Others Explode",
    explanation: "Each layer contributes a Jacobian matrix to the gradient calculation. Directions aligned with the Jacobian's large singular values get amplified; directions aligned with small singular values get attenuated. Multiplying many layers' Jacobians together can produce a highly anisotropic result — some directions vanish while others explode, inside the very same network, at the very same time.",
    code: `# Conceptual, not literal code:
# dL/dh_0 = (J_1^T J_2^T ... J_k^T) dL/dh_k
#
# Each J_i has its own singular values.
# A direction aligned with a small singular
# value in every J_i shrinks toward zero.
# A direction aligned with a large one grows.`,
    check: "Why can a single deep network have some gradient directions vanishing and others exploding at the same time?",
  },
  {
    title: "Diagnosing a Dead ReLU",
    explanation: "A 'dead' ReLU is a unit that outputs zero — and has a derivative of zero — for every training example, so the loss sends no gradient through that unit to its incoming weights; a nearly always inactive unit receives sparse gradient signals. This is an optimization symptom, not a mysterious separate failure. Common causes include a learning rate that's too large, poor initialization, or unscaled inputs pushing pre-activations permanently negative.",
    code: `import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Linear(32, 32),
    nn.ReLU(),
    nn.Linear(32, 1)
)

x = torch.randn(64, 10)
y = torch.randn(64, 1)
loss_fn = nn.MSELoss()

prediction = model(x)
loss = loss_fn(prediction, y)

model.zero_grad()
loss.backward()

for name, p in model.named_parameters():
    if p.grad is not None:
        print(name, p.grad.norm().item())`,
    check: "This snippet doesn't tell you if the model is good — what does it actually tell you?",
  },
  {
    title: "Three Failure Modes That Look Similar From Outside",
    explanation: "Poor final accuracy can come from three very different underlying problems, and each needs a different fix. High training and validation losses can suggest under-capacity, but can also reflect optimization, data, or objective problems. Flat or erratic training loss calls for optimization checks. Improving training loss with deteriorating validation loss suggests overfitting. Use gradient and activation measurements plus controlled experiments to distinguish causes; several can coexist.",
    code: `# Under-capacity:
#   train_loss high, val_loss high
#   -> test capacity after checking optimization/data

# Optimization failure:
#   train_loss flat, erratic, or NaN
#   -> inspect gradients, init, lr

# Overfitting:
#   train_loss low, val_loss high
#   -> regularize, dropout, more data`,
    check: "If training loss falls while validation loss rises, what does that suggest, and why does it not rule out every other problem?",
  },
];

const contributors = [
  {
    name: "George Cybenko",
    year: "1989",
    contribution: "Proved the universal approximation theorem for sigmoid networks — a formal reason why a single hidden layer with nonlinearity can approximate a wide class of functions.",
  },
  {
    name: "Kurt Hornik",
    year: "1991",
    contribution: "Extended the universal approximation theorem to a broader class of activation functions, strengthening the theoretical case for nonlinear multilayer networks.",
  },
  {
    name: "Sepp Hochreiter",
    year: "1991",
    contribution: "Identified the vanishing gradient problem in his diploma thesis, explaining why gradients can shrink to near-zero through long chains of multiplication — this directly motivated later architectures like LSTMs.",
  },
  {
    name: "Xavier Glorot & Yoshua Bengio",
    year: "2010",
    contribution: "Introduced Xavier/Glorot initialization, choosing initial weight variance to keep activation and gradient variance stable across layers, primarily for tanh-like activations.",
  },
  {
    name: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
    year: "2015",
    contribution: "Introduced He initialization, adjusting Xavier's approach specifically to account for how ReLU suppresses roughly half of its input distribution.",
  },
  {
    name: "Sergey Ioffe & Christian Szegedy",
    year: "2015",
    contribution: "Introduced batch normalization, making it standard practice to normalize intermediate activations during training as a trainable part of the architecture.",
  },
  {
    name: "Nitish Srivastava, Geoffrey Hinton, et al.",
    year: "2014",
    contribution: "Coauthored the 2014 JMLR paper on dropout, randomly disabling units during training to reduce overfitting. Earlier dropout work appeared in 2012.",
  },
];

type Activation = "sigmoid" | "tanh" | "relu";
const activationNames: Activation[] = ["sigmoid", "tanh", "relu"];
const number = (value: number) => value === 0 ? "0" : Math.abs(value) < .0001 || Math.abs(value) >= 10000 ? value.toExponential(3) : value.toFixed(4);

function activate(z: number, kind: Activation) {
  if (kind === "sigmoid") {
    const output = 1 / (1 + Math.exp(-z));
    return { output, slope: output * (1 - output) };
  }
  if (kind === "tanh") {
    const output = Math.tanh(z);
    return { output, slope: 1 - output ** 2 };
  }
  return { output: Math.max(0, z), slope: z > 0 ? 1 : 0 };
}

function chainTrace(depth: number, weight: number, kind: Activation, input: number) {
  let output = input;
  const layers = [];
  for (let i = 0; i < depth; i++) {
    const z = weight * output;
    const result = activate(z, kind);
    output = result.output;
    layers.push({ layer: i + 1, z, output, slope: result.slope, local: weight * result.slope });
  }
  const backward = Array<number>(depth + 1).fill(1);
  for (let i = depth - 1; i >= 0; i--) backward[i] = backward[i + 1] * layers[i].local;
  return { layers, backward, output, gradient: backward[0] };
}

function normalizeBatch(batch: number[], training: boolean, gamma: number, beta: number) {
  const batchMean = batch.reduce((a, b) => a + b, 0) / batch.length;
  const batchVariance = batch.reduce((sum, x) => sum + (x - batchMean) ** 2, 0) / batch.length;
  const mean = training ? batchMean : 3;
  const variance = training ? batchVariance : 4;
  return { mean, variance, outputs: batch.map(x => gamma * (x - mean) / Math.sqrt(variance + 1e-5) + beta) };
}

// Seeded uniform samples keep the initial render deterministic for hydration.
function dropoutValues(probability: number, sample: number, training: boolean) {
  let state = sample >>> 0;
  return Array.from({ length: 8 }, (_, i) => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const keep = state / 4294967296 >= probability;
    const input = i + 1;
    return { input, kept: !training || keep, output: training ? (keep ? input / (1 - probability) : 0) : input };
  });
}

function Slider({ id, label, value, min, max, step = 1, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="w2-slider" htmlFor={id}><span>{label}<output>{value}</output></span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}
function Code({ children, python = true }: { children: string; python?: boolean }) {
  return <div className="w2-code"><div className="w2-code-heading"><span>{python ? "PYTHON" : "CONCEPTUAL"}</span><span>READ · RUN · EXPLAIN</span></div><pre tabIndex={0} aria-label="Code example"><code>{children}</code></pre></div>;
}
function Lab({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return <section className="w2-lab" aria-labelledby={id}><span className="w2-eyebrow">EXPLORE THE MECHANISM</span><h3 id={id}>{title}</h3>{children}</section>;
}
function Topic({ index, children }: { index: number; children?: ReactNode }) {
  const item = topics[index];
  return <section className="w2-topic" aria-labelledby={`w2-topic-${index}`}><div className="w2-topic-grid"><div><span className="w2-eyebrow">CONCEPT {String(index + 1).padStart(2, "0")}</span><h2 id={`w2-topic-${index}`}>{item.title}</h2><p>{item.explanation}</p><p className="w2-check"><strong>Think it through</strong>{item.check}</p></div><Code python={index !== 7}>{item.code}</Code></div>{children}</section>;
}

function ActivationLab() {
  const [kind, setKind] = useState<Activation>("tanh");
  const [z, setZ] = useState(1);
  const { output, slope } = activate(z, kind);
  const range = kind === "tanh" ? [-1, 1] : kind === "relu" ? [0, 6] : [0, 1];
  return <Lab id="w2-activation-title" title="Inspect the output and its slope together."><div className="w2-toolbar" role="group" aria-label="Activation function">{activationNames.map(name => <button type="button" key={name} aria-pressed={kind === name} onClick={() => setKind(name)}>{name}</button>)}</div><Slider id="w2-z" label="Pre-activation z" min={-6} max={6} step={.1} value={z} onChange={setZ} />
    <div className="w2-dual-plots">{[false, true].map(derivative => {
      const bounds = derivative ? [0, 1] : range;
      const py = (y: number) => 188 - (y - bounds[0]) / (bounds[1] - bounds[0]) * 146;
      const path = Array.from({ length: 241 }, (_, i) => { const x = -6 + i * .05; const a = activate(x, kind); return `${i === 0 || (derivative && kind === "relu" && i === 121) ? "M" : "L"}${42+i/240*296},${py(derivative ? a.slope : a.output)}`; }).join(" ");
      return <figure key={String(derivative)}><svg viewBox="0 0 375 240" role="img" aria-label={`${kind} ${derivative ? "slope" : "output"} at ${z}: ${number(derivative ? slope : output)}`}><path className="w2-axis" d={`M42 ${py(0)} H338 M190 30 V195`} />{bounds.map(y => <text key={y} x="30" y={py(y)+4} textAnchor="end">{y}</text>)}{[-6,0,6].map(x => <text key={x} x={42+(x+6)/12*296} y="216" textAnchor="middle">{x}</text>)}<text x="350" y="216">z</text><path className="w2-curve" d={path} /><circle className="w2-dot" cx={42+(z+6)/12*296} cy={py(derivative ? slope : output)} r="6" /></svg><figcaption>{derivative ? "Derivative g′(z) · vertical scale 0 to 1" : `Activation g(z) · vertical scale ${range[0]} to ${range[1]}`}</figcaption></figure>;
    })}</div><div className="w2-metrics"><div><span>Input z</span><strong>{z.toFixed(1)}</strong></div><div><span>Output g(z)</span><strong>{number(output)}</strong></div><div><span>Slope g′(z)</span><strong>{number(slope)}</strong></div></div><p className="w2-small">At zero, ReLU has no mathematical derivative. This demo uses the conventional choice of zero; the derivative plot has a jump. Saturation concerns slope, not whether the output itself is near zero.</p></Lab>;
}

function ChainLab() {
  const [kind, setKind] = useState<Activation>("tanh");
  const [depth, setDepth] = useState(10);
  const [weight, setWeight] = useState(1.5);
  const [input, setInput] = useState(.1);
  const trace = chainTrace(depth, weight, kind, input);
  const plotY = (g: number) => 140 - Math.max(-12, Math.min(12, Math.log10(Math.max(Math.abs(g), 1e-12)))) * 8;
  return <Lab id="w2-chain-title" title="Follow a gradient through a deep scalar chain."><p>Every layer uses the selected activation, the same scalar weight, and zero bias. We calculate <strong>∂hfinal/∂hᵢ</strong>, starting with a gradient of 1 at the output. This is an output derivative, not a loss gradient or a full network simulation.</p><div className="w2-toolbar" role="group" aria-label="Chain activation">{activationNames.map(name => <button key={name} type="button" aria-pressed={kind === name} onClick={() => setKind(name)}>{name}</button>)}</div><div className="w2-controls"><Slider id="w2-depth" label="Depth" min={1} max={30} value={depth} onChange={setDepth} /><Slider id="w2-weight" label="Shared weight" min={-2} max={2} step={.1} value={weight} onChange={setWeight} /><Slider id="w2-input" label="Input h₀" min={-1} max={1} step={.1} value={input} onChange={setInput} /></div>
    <figure className="w2-wide-chart" tabIndex={0} aria-label="Scrollable gradient magnitude chart"><svg viewBox="0 0 670 285" role="img" aria-label={`Depth ${depth}, ${kind}, weight ${weight}, input ${input}. Final output ${number(trace.output)}. Input gradient ${number(trace.gradient)}.`}>{[-12,-6,0,6,12].map(power => <g key={power}><line className="w2-gridline" x1="75" x2="620" y1={140-power*8} y2={140-power*8} /><text x="65" y={144-power*8} textAnchor="end">{power === 0 ? "1" : `1e${power}`}</text></g>)}<text x="75" y="20">|∂hfinal / ∂hᵢ| · log scale</text><text x="620" y="273" textAnchor="end">Input (0) to output ({depth})</text><path className="w2-curve" d={trace.backward.map((g,i) => `${i === 0 ? "M" : "L"}${75+i/depth*545},${plotY(g)}`).join(" ")} />{trace.backward.map((g,i) => <circle key={i} className={g === 0 ? "w2-zero-dot" : "w2-dot"} cx={75+i/depth*545} cy={plotY(g)} r="4" />)}{[0,Math.floor(depth/2),depth].filter((v,i,a) => a.indexOf(v) === i).map(i => <text key={i} x={75+i/depth*545} y="255" textAnchor="middle">{i}</text>)}</svg><figcaption>Read backward from right to left. Hollow points mark exact zero. Magnitudes below 10⁻¹² or above 10¹² are clipped to the plot; the values below are not clipped.</figcaption></figure>
    <div className="w2-metrics"><div><span>Final activation</span><strong>{number(trace.output)}</strong></div><div><span>Input derivative (signed)</span><strong>{number(trace.gradient)}</strong></div><div><span>Zero local factors</span><strong>{trace.layers.filter(layer => layer.local === 0).length} / {depth}</strong></div></div>
    <details className="w2-detail"><summary>Inspect every local derivative</summary><div className="w2-table-scroll" tabIndex={0} role="region" aria-label="Chain derivative values"><table><thead><tr><th>Layer i</th><th>zᵢ</th><th>hᵢ</th><th>g′(zᵢ)</th><th>w × g′(zᵢ)</th><th>∂hfinal/∂hᵢ</th></tr></thead><tbody>{trace.layers.map((row,i) => <tr key={row.layer}><th scope="row">{row.layer}</th><td>{number(row.z)}</td><td>{number(row.output)}</td><td>{number(row.slope)}</td><td>{number(row.local)}</td><td>{number(trace.backward[i+1])}</td></tr>)}</tbody></table></div></details><p className="w2-small">A zero ReLU slope anywhere in this single path blocks its input derivative. Negative weights may reverse the gradient sign. The plot shows magnitude; the readout preserves sign.</p></Lab>;
}

function InitializationLab() {
  const [fanIn, setFanIn] = useState(16);
  const [fanOut, setFanOut] = useState(8);
  return <Lab id="w2-init-title" title="Scale the starting weights to the layer."><div className="w2-controls"><Slider id="w2-fanin" label="Inputs per neuron (fan_in)" min={4} max={128} step={4} value={fanIn} onChange={setFanIn} /><Slider id="w2-fanout" label="Output neurons (fan_out)" min={4} max={128} step={4} value={fanOut} onChange={setFanOut} /></div><div className="w2-table-scroll" tabIndex={0} role="region" aria-label="Initialization scale comparison"><table><thead><tr><th>Method</th><th>Weight variance</th><th>Normal-distribution standard deviation</th></tr></thead><tbody><tr><th scope="row">Glorot / Xavier (gain 1)</th><td>2 / (fan_in + fan_out) = {number(2/(fanIn+fanOut))}</td><td>{number(Math.sqrt(2/(fanIn+fanOut)))}</td></tr><tr><th scope="row">He (ReLU, fan_in mode)</th><td>2 / fan_in = {number(2/fanIn)}</td><td>{number(Math.sqrt(2/fanIn))}</td></tr></tbody></table></div><p className="w2-small">These are target distribution scales, not measured sample variances. Xavier can use an activation-specific gain. He’s factor of two accounts for the loss of second moment after rectifying a symmetric distribution; the assumptions are approximate.</p></Lab>;
}

function BatchNormLab() {
  const [training, setTraining] = useState(true);
  const [batchIndex, setBatchIndex] = useState(0);
  const [gamma, setGamma] = useState(1);
  const [beta, setBeta] = useState(0);
  const batches = [[1,2,3,4],[1,6,8,9]];
  const batch = batches[batchIndex];
  const result = normalizeBatch(batch, training, gamma, beta);
  return <Lab id="w2-bn-title" title="Keep one input fixed. Change its batch neighbors."><p>The highlighted input is always 1. Training uses statistics from the selected batch. Evaluation uses an illustrative, frozen running mean of 3 and running variance of 4.</p><div className="w2-toolbar"><div role="group" aria-label="BatchNorm mode" className="w2-phase-buttons"><button type="button" aria-pressed={training} onClick={() => setTraining(true)}>Training</button><button type="button" aria-pressed={!training} onClick={() => setTraining(false)}>Evaluation</button></div><button type="button" className="w2-secondary" onClick={() => setBatchIndex(i => 1-i)}>Switch to batch {batchIndex === 0 ? "B" : "A"}</button></div><div className="w2-controls"><Slider id="w2-gamma" label="Scale γ" min={-2} max={2} step={.1} value={gamma} onChange={setGamma} /><Slider id="w2-beta" label="Shift β" min={-2} max={2} step={.1} value={beta} onChange={setBeta} /></div><div className="w2-formula">y = γ × (x − μ) / √(variance + 0.00001) + β<br />μ = {number(result.mean)} · variance = {number(result.variance)}</div><div className="w2-table-scroll" tabIndex={0} role="region" aria-label="Batch normalization values"><table><thead><tr><th>Input in batch {batchIndex === 0 ? "A" : "B"}</th><th>Output</th></tr></thead><tbody>{batch.map((x,i) => <tr key={i} className={i === 0 ? "w2-selected-row" : undefined}><th scope="row">{x}{i === 0 ? " (fixed input)" : ""}</th><td>{number(result.outputs[i])}</td></tr>)}</tbody></table></div><p className="w2-small">The demo does not update running statistics. It models the default track_running_stats=True behavior for one feature. Setting track_running_stats=False uses batch statistics in both modes. The training forward pass uses biased variance; PyTorch’s running variance update uses an unbiased estimate.</p></Lab>;
}

function DropoutLab() {
  const [training, setTraining] = useState(true);
  const [probability, setProbability] = useState(.5);
  const [sample, setSample] = useState(42);
  const values = dropoutValues(probability, sample, training);
  return <Lab id="w2-dropout-title" title="Drop units during training. Restore them for evaluation."><div className="w2-toolbar"><div className="w2-phase-buttons" role="group" aria-label="Dropout mode"><button type="button" aria-pressed={training} onClick={() => setTraining(true)}>Training</button><button type="button" aria-pressed={!training} onClick={() => setTraining(false)}>Evaluation</button></div><button type="button" className="w2-secondary" disabled={!training} onClick={() => setSample(s => s+1)}>Draw a new mask</button></div><Slider id="w2-drop-probability" label="Drop probability p" min={0} max={.75} step={.25} value={probability} onChange={setProbability} /><div className="w2-drop-grid">{values.map((v,i) => <div key={i} className={`w2-drop-unit ${v.kept ? "w2-kept" : "w2-dropped"}`}><span>h{i+1} = {v.input}</span><strong>{number(v.output)}</strong><span>{training ? v.kept ? "kept + scaled" : "dropped" : "unchanged"}</span></div>)}</div><div className="w2-formula">{training ? `Survivor scale = 1 / (1 − ${probability}) = ${number(1/(1-probability))}` : "Evaluation: output = input; no mask and no scaling."}</div><p>For each fixed activation, inverted dropout preserves its expected value across masks: E[mh/(1−p)] = h. A single mask does not have to preserve the mean or drop exactly p of the units.</p><p className="w2-small">Masks use a seeded pseudorandom generator for reproducibility. Evaluation leaves the values unchanged regardless of p. Dropout does not repair incorrect gradients or guarantee better validation performance.</p></Lab>;
}

function JacobianLab() {
  const [depth, setDepth] = useState(8);
  return <Lab id="w2-jacobian-title" title="One network can shrink one direction and amplify another."><p>Consider the same diagonal Jacobian at each layer: J = diag(0.5, 1.5). Its axes stay aligned, so an upstream gradient (1, 1) becomes (0.5ᵈ, 1.5ᵈ) after d layers.</p><Slider id="w2-jacobian-depth" label="Number of Jacobian factors d" min={1} max={20} value={depth} onChange={setDepth} /><div className="w2-direction-grid"><div><span>Direction 1 · shrinking</span><strong>{number(.5**depth)}</strong><div className="w2-direction-track"><span style={{width:`${(1+Math.log10(.5**depth)/7)*50}%`}} /></div></div><div><span>Direction 2 · growing</span><strong>{number(1.5**depth)}</strong><div className="w2-direction-track"><span style={{width:`${(1+Math.log10(1.5**depth)/7)*50}%`}} /></div></div></div><p className="w2-small">The bar length encodes log₁₀ magnitude on a fixed −7 to +7 scale; halfway is magnitude 1. Real Jacobians can rotate and mix directions. Multiplying individual singular values is generally insufficient without considering that alignment.</p></Lab>;
}

const cases = [
  { name: "High losses", text: "Both losses plateau high. Under-capacity is one hypothesis, but poor optimization, noisy labels, preprocessing, or a mismatched objective can produce similar curves.", action: "First test whether the model can overfit a tiny clean batch. Inspect gradients and inputs, then test a capacity change while holding the split and training budget fixed." },
  { name: "Unstable training", text: "Training loss oscillates without settling. Investigate learning rate, gradients, numerical behavior, and data before concluding that the architecture lacks capacity.", action: "Check for non-finite values and gradient spikes. Change one factor, such as learning rate, and compare the same diagnostics with controlled seeds." },
  { name: "Growing validation gap", text: "Training loss falls while validation loss rises after an early improvement. This is evidence consistent with overfitting; it does not establish a unique cause or rule out other problems.", action: "Check the split and evaluation procedure. Then compare early stopping, regularization, or additional representative data using validation results." },
];
function DiagnosticLab() {
  const [selected, setSelected] = useState(2);
  const lines = Array.from({ length: 41 }, (_, i) => {
    const train = selected === 0 ? .65+.3*Math.exp(-i/6) : selected === 1 ? .57+.2*Math.sin(i*1.6)+.08*Math.cos(i*.4) : .07+.84*Math.exp(-i/9);
    const validation = selected === 0 ? .72+.26*Math.exp(-i/6) : selected === 1 ? .69+.13*Math.sin(i*1.4+.7) : .25+.65*Math.exp(-i/7)+Math.max(0,i-12)*.017;
    return { train, validation };
  });
  return <Lab id="w2-diagnostic-title" title="Use the curve to choose the next experiment."><p>These curves are synthetic illustrations, not measured training results. Select a pattern and decide what evidence you would collect next.</p><div className="w2-toolbar" role="group" aria-label="Loss curve scenario">{cases.map((item,i) => <button key={item.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{item.name}</button>)}</div><figure><svg viewBox="0 0 610 260" role="img" aria-label={`Illustrative ${cases[selected].name} loss curves: ${cases[selected].text}`}><path className="w2-axis" d="M55 25 V220 H570" />{[0,.5,1].map(y => <g key={y}><line className="w2-gridline" x1="55" x2="570" y1={220-y*185} y2={220-y*185} /><text x="43" y={224-y*185} textAnchor="end">{y}</text></g>)}<text x="55" y="18">Illustrative loss</text><text x="570" y="249" textAnchor="end">Training progress →</text>{(["train","validation"] as const).map(key => <path key={key} className={`w2-loss-line ${key === "train" ? "w2-run-1" : "w2-run-0"}`} strokeWidth="3" strokeDasharray={key === "validation" ? "7 5" : undefined} d={lines.map((p,i) => `${i === 0 ? "M" : "L"}${55+i/40*515},${220-p[key]*185}`).join(" ")} />)}</svg><figcaption>Solid teal: training loss · Dashed purple: validation loss</figcaption></figure><div className="w2-callout" aria-live="polite"><strong>What the pattern suggests</strong><p>{cases[selected].text}</p><strong className="w2-next-test">Next experiment</strong><p>{cases[selected].action}</p></div></Lab>;
}

const questions = [
  ["Why do affine layers collapse without nonlinear activations?", "Substitution combines their weight matrices and biases into one affine map. Ten affine layers still represent an affine function; intermediate bottlenecks may further restrict the available maps."],
  ["What does saturation mean for sigmoid and tanh derivatives?", "The function becomes nearly flat at large input magnitudes. Its derivative approaches zero, even when the output is near 1 or −1."],
  ["How do weights and activation derivatives both influence gradients?", "Each scalar layer contributes weight × activation slope. In a network, the corresponding Jacobian combines the weight matrix and activation derivatives. Products and direction alignment control the final signal."],
  ["When can a ReLU unit stop receiving a useful gradient?", "If its pre-activation is nonpositive for all examples, the conventional ReLU derivative is zero on those examples. Inspect per-unit activity over representative batches. One zero activation or a small layer gradient norm does not prove a unit is permanently dead."],
  ["Why does adding depth sometimes make optimization harder?", "It adds more Jacobian factors and interactions. Gradients can become tiny, large, or uneven across directions. Extra representational capacity alone does not guarantee effective optimization."],
  ["Why does model.eval() change BatchNorm and Dropout?", "With default running-statistics tracking, BatchNorm uses stored running statistics at evaluation. Dropout becomes the identity. eval() changes module behavior; it does not disable autograd. Use no_grad() or inference_mode() separately when appropriate."],
  ["Why can gradient directions vanish and explode simultaneously?", "The full Jacobian product can attenuate some directions and amplify others. A diagonal example makes this visible, but real networks also rotate and mix directions between layers."],
  ["Can loss curves distinguish under-capacity from overfitting conclusively?", "No. Low training loss and worsening validation loss suggest overfitting. High losses on both sets can reflect inadequate capacity, unsuccessful optimization, or data problems. Combine curves with diagnostics and controlled experiments."],
];

export default function Week2() {
  return <section id="week-2" className="week-block learning-section w2" aria-labelledby="week-2-title"><header className="w2-hero"><span className="w2-eyebrow">DEEP LEARNING / DEPTH AND GRADIENT FLOW</span><h1 id="week-2-title">Week 2 — {dlRoadmap[2].title}</h1><p>Week 1 followed gradients through a tiny network. Now extend that calculation through more layers, and inspect the tools used to keep deeper networks trainable: initialization, normalization, dropout, and diagnostics.</p><nav className="w2-navigation" aria-label="Week 2 sections"><a href="#w2-activation-title">Activation slopes ↓</a><a href="#w2-chain-title">Gradient flow ↓</a><a href="#w2-bn-title">Train vs. evaluate ↓</a><a href="#w2-diagnostic-title">Diagnose a failure ↓</a></nav><div className="w2-signal-hero" aria-hidden="true">{[1,.78,.6,.43,.29,.18,.1,.06].map((v,i) => <span key={i} style={{height:`${22+v*66}px`, opacity:.25+v*.75, animationDelay:`${i*.18}s`}} />)}<p>What reaches the early layers?</p></div></header><aside className="w2-callout"><strong>Core idea</strong><p>Depth changes both what a network can represent and how gradients travel through it. A useful architecture needs expressive power, a training signal that reaches its parameters, and diagnostics that help explain failures.</p></aside>
    <Topic index={0} /><Topic index={1}><ActivationLab /></Topic><Topic index={2} /><Topic index={3}><InitializationLab /></Topic><Topic index={4}><ChainLab /></Topic><Topic index={5}><BatchNormLab /></Topic><Topic index={6}><DropoutLab /></Topic><Topic index={7}><JacobianLab /></Topic><Topic index={8}><aside className="w2-callout"><strong>Gradient norms alone do not identify dead units</strong><p>The code measures parameter-gradient norms for one random batch. A near-zero norm can have several causes. Track each unit’s fraction of positive pre-activations across representative batches, compare activation distributions, and inspect upstream gradients before diagnosing a dead ReLU.</p></aside><Code>{`# Run after defining model and x in the diagnostic example.
# Inspect activity for each hidden unit, not only a layer norm.
with torch.no_grad():
    hidden = x
    for i, layer in enumerate(model):
        hidden = layer(hidden)
        if isinstance(layer, nn.ReLU):
            active_fraction = (hidden > 0).float().mean(dim=0)
            print("ReLU layer", i, active_fraction)
# Repeat over representative batches and training steps.
# A zero fraction on one batch does not prove permanent death.`}</Code></Topic><Topic index={9}><DiagnosticLab /></Topic>
    <section className="w2-exercise" aria-labelledby="w2-exercise-title"><span className="w2-eyebrow">YOUR TURN</span><h2 id="w2-exercise-title">Predict the signal before running the code.</h2><ol><li>Run the scalar-chain experiment with weights 0.5, 1.0, and 1.5. Compare depths 1, 5, and 20, then repeat with a negative input. Predict the ReLU gradient before running each case.</li><li>Run the PyTorch diagnostic example. Print each parameter’s gradient norm and per-unit active fractions across several batches. Explain what a near-zero early-layer norm does and does not establish.</li><li>Switch the normalization and dropout demos between training and evaluation. Explain the different reasons their outputs change.</li><li>Choose one failing baseline. Change one factor at a time, keeping the data split and seed policy fixed. Record training loss, validation loss, gradient norms, and compute cost.</li></ol></section>
    <section className="w2-review" aria-labelledby="w2-review-title"><span className="w2-eyebrow">EXPLAIN THE MECHANISM</span><h2 id="w2-review-title">Week 2 interview questions</h2><p>Answer aloud before opening the explanation.</p>{questions.map(([q,a],i) => <details key={q} className="w2-detail"><summary><span className="w2-question-number">{String(i+1).padStart(2,"0")}</span>{q}</summary><p>{a}</p></details>)}</section>
    <section className="w2-contributors" aria-labelledby="w2-contributors-title"><span className="w2-eyebrow">PEOPLE BEHIND THE IDEAS</span><h2 id="w2-contributors-title">Research milestones</h2><div className="w2-table-scroll" tabIndex={0} role="region" aria-label="Contributors and research contributions"><table><thead><tr><th>Year</th><th>Contributors</th><th>Contribution</th></tr></thead><tbody>{[...contributors].sort((a,b) => a.year.localeCompare(b.year)).map(person => <tr key={person.name}><td>{person.year}</td><th scope="row">{person.name}</th><td>{person.contribution}</td></tr>)}</tbody></table></div><p className="w2-small">Universal approximation results assume suitable activations, function classes, and approximation domains; they do not guarantee successful training.</p></section>
    <aside className="w2-callout"><strong>The standard you want</strong><p>Reason about gradients as products of local derivatives, compare activations, investigate inactive ReLUs using evidence, and use loss curves with controlled experiments to separate capacity, optimization, and generalization problems.</p></aside>
    <details className="w2-detail w2-sources"><summary>Further reading and implementation references</summary><ul><li><a href="https://www.deeplearningbook.org/contents/optimization.html">Deep Learning — Optimization for Training Deep Models</a></li><li><a href="https://docs.pytorch.org/docs/stable/generated/torch.nn.modules.batchnorm.BatchNorm1d.html">PyTorch: BatchNorm1d</a></li><li><a href="https://docs.pytorch.org/docs/stable/generated/torch.nn.Dropout.html">PyTorch: Dropout</a></li><li><a href="https://arxiv.org/abs/1502.01852">He et al. (2015): Delving Deep into Rectifiers</a></li><li><a href="https://arxiv.org/abs/1502.03167">Ioffe &amp; Szegedy (2015): Batch Normalization</a></li><li><a href="https://www.jmlr.org/papers/v15/srivastava14a.html">Srivastava et al. (2014): Dropout</a></li></ul></details><Link className="week-back-to-map w2-back" href="/dl#week-2">Back to the learning map ↑</Link>
  </section>;
}