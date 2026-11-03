"use client";
import { useState } from "react";
import { initialNetwork, traceNetwork, type NetworkInputs } from "./network-math";

const controls: { key: keyof NetworkInputs; label: string; min: number; max: number; step: number }[] = [
  { key: "input", label: "Input x", min: -2, max: 2, step: .1 },
  { key: "target", label: "Target y", min: -2, max: 2, step: .1 },
  { key: "weight1", label: "Hidden weight w₁", min: -2, max: 2, step: .1 },
  { key: "bias1", label: "Hidden bias b₁", min: -1, max: 1, step: .1 },
  { key: "weight2", label: "Output weight w₂", min: -2, max: 2, step: .1 },
  { key: "bias2", label: "Output bias b₂", min: -1, max: 1, step: .1 },
  { key: "rate", label: "Learning rate η", min: 0, max: 1, step: .01 },
];

export default function NetworkTrace() {
  const [values, setValues] = useState(initialNetwork);
  const result = traceNetwork(values);
  return <section className="dm-trace" id="network-trace" aria-labelledby="network-trace-title">
    <header><span className="dm-eyebrow">WORK THROUGH ONE COMPLETE NETWORK</span><h2 id="network-trace-title">From numbers to gradients.</h2><p>Two affine layers, one tanh hidden unit, a scalar regression output, and half squared-error loss. Change a value and follow the forward pass, backward pass, and proposed simultaneous update.</p></header>
    <pre className="dm-formula" tabIndex={0}>ŷ = w₂ tanh(w₁x + b₁) + b₂{`\n`}L = ½(ŷ − y)²</pre>
    <div className="dm-trace-controls">{controls.map(control => <label key={control.key}><span>{control.label}<output>{values[control.key].toFixed(2)}</output></span><input type="range" aria-label={control.label} min={control.min} max={control.max} step={control.step} value={values[control.key]} onChange={event => setValues(previous => ({ ...previous, [control.key]: Number(event.target.value) }))}/></label>)}</div>
    <button type="button" className="dm-secondary" onClick={() => setValues(initialNetwork)}>Reset example</button>
    <ol className="dm-forward"><li><span>01 / PRE-ACTIVATION</span><strong>a = {result.activation.toFixed(5)}</strong><small>w₁x + b₁</small></li><li><span>02 / HIDDEN OUTPUT</span><strong>h = {result.hidden.toFixed(5)}</strong><small>tanh(a)</small></li><li><span>03 / PREDICTION</span><strong>ŷ = {result.prediction.toFixed(5)}</strong><small>w₂h + b₂</small></li><li><span>04 / LOSS</span><strong>L = {result.loss.toFixed(5)}</strong><small>½(ŷ − y)²</small></li></ol>
    <p className="dm-trace-equation">Output error e = <strong>{result.error.toFixed(5)}</strong>. Hidden sensitivity δ₁ = ew₂(1−h²) = <strong>{result.hiddenDelta.toFixed(5)}</strong>.</p>
    <div className="dm-table-scroll" tabIndex={0} role="region" aria-label="Gradients and proposed parameter updates"><table><thead><tr><th scope="col">Parameter</th><th scope="col">Gradient calculation</th><th scope="col">Gradient</th><th scope="col">Next value: θ − η∇L</th></tr></thead><tbody>{([
      ["weight1", "w₁", "δ₁x"], ["bias1", "b₁", "δ₁"], ["weight2", "w₂", "eh"], ["bias2", "b₂", "e"],
    ] as const).map(([key, symbol, formula]) => <tr key={key}><th scope="row">{symbol}</th><td>{formula}</td><td>{result.gradients[key].toFixed(6)}</td><td>{result.next[key].toFixed(6)}</td></tr>)}</tbody></table></div>
    <p className="dm-trace-result" aria-live="polite">Proposed next loss: <strong>{result.nextLoss.toFixed(6)}</strong> · Current loss: <strong>{result.loss.toFixed(6)}</strong>. {values.rate === 0 ? "A zero rate leaves every parameter unchanged." : result.nextLoss < result.loss ? "This step lowers this example’s loss." : result.nextLoss > result.loss ? "This step raises the loss. Try a smaller learning rate." : "The loss is unchanged."}</p>
    <p className="dm-note">All four gradients use the same current parameters. The table shows one proposed update, without repeatedly training a model. Lowering one example’s loss does not establish generalization.</p>
  </section>;
}
