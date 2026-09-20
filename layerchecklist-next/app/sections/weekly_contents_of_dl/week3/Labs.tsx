"use client";

import { useState, type ReactNode } from "react";
import { batchEvidence, decayStep, fixedGradientTrace, fmt, learningRate, optimizers, pixel, schedules, selectCheckpoint, targets, training, trajectory, validation, type Optimizer, type Schedule } from "./math";

function Lab({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <div className="w3-lab" id={id} aria-labelledby={id + "-title"}><span className="w3-eyebrow">EXPLORE THE MECHANISM</span><h3 id={id + "-title"}>{title}</h3>{children}</div>;
}
function Slider({ id, label, value, min, max, step = 1, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="w3-slider" htmlFor={id}><span>{label}<output htmlFor={id}>{value}</output></span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}
function Metrics({ items }: { items: [string, string | number][] }) {
  return <div className="w3-metrics" aria-live="polite" aria-atomic="true">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
function Table({ label, children }: { label: string; children: ReactNode }) {
  return <div className="w3-table-scroll" tabIndex={0} role="region" aria-label={label}>{children}</div>;
}

export function BatchLab() {
  const [size, setSize] = useState(2);
  const [weight, setWeight] = useState(3);
  const [draw, setDraw] = useState(0);
  const evidence = batchEvidence(weight, size);
  const selected = draw % evidence.batches.length;
  const batch = evidence.batches[selected];
  return <Lab id="w3-batch-lab" title="The gradient changes when the batch changes.">
    <p>For six observations, Lᵢ(θ) = ½(θ − yᵢ)², so gᵢ = θ − yᵢ. Every equally sized subset is equally likely in this illustration. We enumerate them all, without sampling with replacement.</p>
    <div className="w3-choices" role="group" aria-label="Batch size">{[1, 2, 3, 6].map(value => <button key={value} type="button" aria-pressed={size === value} onClick={() => { setSize(value); setDraw(0); }}>{value === 6 ? "Full batch · 6" : "Batch · " + value}</button>)}</div>
    <Slider id="w3-batch-weight" label="Current parameter θ" value={weight} min={-3} max={6} step={.5} onChange={setWeight} />
    <div className="w3-batch-cells">{targets.map((target, i) => <div className={batch.includes(i) ? "is-selected" : ""} key={i}><span>y = {target}</span><strong>g = {fmt(evidence.gradients[i])}</strong><small>{batch.includes(i) ? "In this batch" : "Outside this batch"}</small></div>)}</div>
    <div className="w3-actions"><button type="button" onClick={() => setDraw(d => d + 1)} disabled={evidence.batches.length === 1}>Inspect next batch</button><span>Batch {selected + 1} of {evidence.batches.length}</span></div>
    <Metrics items={[["Current batch gradient", fmt(evidence.estimates[selected])], ["Full-data gradient", fmt(evidence.full)], ["Mean of all batch gradients", fmt(evidence.expected)], ["Batch-gradient standard deviation", fmt(evidence.deviation)]]} />
    <p className="w3-small">The mean matches the full gradient; individual batches need not. At θ = 2 the full gradient is zero, yet small batches can still produce updates. This is noise in an estimator of the empirical gradient, not a guarantee of better generalization.</p>
  </Lab>;
}

export function TrajectoryLab() {
  const [method, setMethod] = useState<Optimizer>("SGD");
  const [rate, setRate] = useState(.08);
  const [curvature, setCurvature] = useState(20);
  const [steps, setSteps] = useState(20);
  const traces = optimizers.map(name => ({ name, points: trajectory(name, rate, curvature, steps) }));
  const active = traces.find(trace => trace.name === method)!;
  const current = active.points[active.points.length - 1];
  const xPixel = (x: number) => 270 + x * 70;
  const yPixel = (y: number) => 165 - y * 45;
  const path = (points: typeof active.points) => {
    const firstOutside = points.findIndex(p => Math.abs(p.x) > 3 || Math.abs(p.y) > 3);
    const shown = firstOutside < 0 ? points : points.slice(0, firstOutside + 1);
    return shown.map((p, i) => (i ? "L" : "M") + pixel(xPixel(p.x)) + "," + pixel(yPixel(p.y))).join(" ");
  };
  const leftPlot = active.points.some(p => Math.abs(p.x) > 3 || Math.abs(p.y) > 3);
  return <Lab id="w3-trajectory-lab" title="One bowl, four update rules.">
    <p>L(x, y) = ½(x² + c·y²), starting at (2, 1). The same initial gradient goes into different optimizers. After they move, each evaluates the gradient at its own position.</p>
    <div className="w3-choices" role="group" aria-label="Highlighted optimizer">{optimizers.map(name => <button key={name} type="button" aria-pressed={method === name} onClick={() => setMethod(name)}>{name}</button>)}</div>
    <div className="w3-controls"><Slider id="w3-trajectory-rate" label="Shared learning rate η" value={rate} min={.01} max={.2} step={.01} onChange={setRate} /><Slider id="w3-curvature" label="Steep-direction curvature c" value={curvature} min={1} max={40} onChange={setCurvature} /><Slider id="w3-steps" label="Number of updates" value={steps} min={0} max={40} onChange={setSteps} /></div>
    <figure><svg viewBox="0 0 540 340" role="img" aria-label={method + " after " + steps + " updates. Loss " + fmt(current.loss) + ". " + (leftPlot ? "Trajectory left the plotted range." : "Trajectory stays in the plotted range.")}><defs><clipPath id="w3-bowl-clip"><rect x="60" y="30" width="420" height="270" /></clipPath></defs><g clipPath="url(#w3-bowl-clip)">{[.5, 2, 5, 12, 25].map(level => <ellipse key={level} className="w3-contour" cx="270" cy="165" rx={Math.sqrt(2 * level) * 70} ry={Math.sqrt(2 * level / curvature) * 45} />)}<path className="w3-axis" d="M60 165 H480 M270 30 V300" />{traces.map((trace, i) => <path key={trace.name} className={"w3-run w3-run-" + i} d={path(trace.points)} opacity={trace.name === method ? 1 : .2} strokeWidth={trace.name === method ? 3 : 2} />)}{!leftPlot && <circle className="w3-dot" cx={xPixel(current.x)} cy={yPixel(current.y)} r="6" />}<circle className="w3-start" cx={xPixel(2)} cy={yPixel(1)} r="5" /></g>{[-3, 0, 3].map(value => <g key={value}><text x={xPixel(value)} y="320" textAnchor="middle">{value}</text><text x="46" y={yPixel(value) + 4} textAnchor="end">{value}</text></g>)}<text x="503" y="320">x</text><text x="45" y="18">y</text></svg><figcaption>Contours show equal loss. Hollow marker: common start · Filled marker: selected final point, when the path remains in view.</figcaption></figure>
    <Metrics items={[["Selected optimizer", method], ["Final x", fmt(current.x)], ["Final y", fmt(current.y)], ["Loss", fmt(current.loss)]]} />
    <p className="w3-small">{leftPlot ? "The path is clipped after its first exit from the plot; the numerical readout continues through every update. " : ""}For plain SGD on this bowl, convergence requires 0 &lt; η &lt; 2 / max(1, c). At c = {curvature}, that upper bound is {fmt(2 / curvature)}. A common learning rate illustrates mechanisms; it is not a tuned optimizer benchmark or a generalization study.</p>
  </Lab>;
}

export function HistoryLab() {
  const [method, setMethod] = useState<Optimizer>("Momentum");
  const [sequence, setSequence] = useState(0);
  const sequences = [[-3, -2, -1], [4, 2, 1], [2, -2, 2, -2], [2, 2, 2]];
  const trace = fixedGradientTrace(method, sequences[sequence]);
  return <Lab id="w3-history-lab" title="Hold the gradients fixed. Inspect the optimizer’s memory.">
    <p>Every method receives the selected gradient sequence, starts at θ = 2, and uses η = 0.1 with zero initial state. These supplied gradients isolate the update arithmetic; they are not recomputed from a loss surface.</p>
    <div className="w3-choices" role="group" aria-label="Optimizer arithmetic">{optimizers.map(name => <button type="button" key={name} aria-pressed={method === name} onClick={() => setMethod(name)}>{name}</button>)}</div>
    <label className="w3-select" htmlFor="w3-gradient-sequence">Gradient sequence<select id="w3-gradient-sequence" value={sequence} onChange={e => setSequence(Number(e.target.value))}><option value={0}>Momentum trace: −3, −2, −1</option><option value={1}>RMSProp trace: 4, 2, 1</option><option value={2}>Alternating: 2, −2, 2, −2</option><option value={3}>Constant: 2, 2, 2</option></select></label>
    <Table label="Optimizer state and parameter updates"><table><thead><tr><th scope="col">t</th><th scope="col">gₜ</th><th scope="col">Direction state</th><th scope="col">Squared-gradient state</th><th scope="col">Update Δθ</th><th scope="col">θ after update</th></tr></thead><tbody>{trace.map(row => <tr key={row.step}><th scope="row">{row.step}</th><td>{fmt(row.gradient)}</td><td>{method === "SGD" || method === "RMSProp" ? "—" : fmt(row.direction)}</td><td>{method === "SGD" || method === "Momentum" ? "—" : fmt(row.square)}</td><td>{fmt(row.delta)}</td><td>{fmt(row.weight)}</td></tr>)}</tbody></table></Table>
    {method === "Adam" && <div className="w3-formula">First step: m₁ = {fmt(.1 * sequences[sequence][0])}, v₁ = {fmt(.001 * sequences[sequence][0] ** 2)}<br />After correction: m̂₁ = {fmt(sequences[sequence][0])}, v̂₁ = {fmt(sequences[sequence][0] ** 2)}</div>}
    <p className="w3-small">Momentum uses vₜ = 0.9vₜ₋₁ + gₜ. RMSProp uses α = 0.9 with no momentum. Adam uses β₁ = 0.9, β₂ = 0.999 and bias correction. Both adaptive denominators use √state + 10⁻⁸, matching the PyTorch convention. The lecture’s RMSProp shorthand places ε inside the root; the rounded three-step trace is unchanged here.</p>
  </Lab>;
}

export function DecayLab() {
  const [decay, setDecay] = useState(.1);
  const [gradient, setGradient] = useState(0);
  const result = decayStep(2, gradient, decay);
  return <Lab id="w3-decay-lab" title="The same decay coefficient can produce different updates.">
    <p>Start at w = 2 with zero optimizer state and η = 0.1. Compare a first Adam step on Ldata + (λ/2)w² with a first AdamW step using decoupled decay λ.</p>
    <div className="w3-controls"><Slider id="w3-decay" label="Decay coefficient λ" value={decay} min={0} max={.5} step={.01} onChange={setDecay} /><Slider id="w3-data-gradient" label="Data gradient" value={gradient} min={-1} max={1} step={.1} onChange={setGradient} /></div>
    <Metrics items={[["Gradient entering coupled Adam", fmt(result.coupledGradient)], ["w after Adam + L2", fmt(result.coupled)], ["w after AdamW", fmt(result.decoupled)]]} />
    <div className="w3-formula">Coupled: g′ = gdata + λw; update using Adam(g′)<br />Decoupled: wnew = (1 − ηλ)w + Adam update from gdata</div>
    <p className="w3-small">With zero data gradient, AdamW still shrinks w when λ &gt; 0. With λ = 0 the two computations agree. The lesson uses λ/2 in the penalty so its derivative is λw; the slides’ λw² convention instead gives 2λw. Equal numeric settings do not imply equal regularization across algorithms.</p>
  </Lab>;
}

export function ScheduleLab() {
  const [kind, setKind] = useState<Schedule>("Warmup + cosine");
  const [epoch, setEpoch] = useState(1);
  const values = Array.from({ length: 40 }, (_, i) => learningRate(kind, i + 1));
  const x = (i: number) => 55 + (i - 1) / 39 * 435;
  const y = (value: number) => 225 - value / .1 * 180;
  return <Lab id="w3-schedule-lab" title="Choose how the learning rate changes over time.">
    <p>These are explicit example schedules over 40 epochs, with peak rate 0.1. The plot shows the rate used for each epoch; it does not simulate training or guarantee that a schedule will work better.</p>
    <div className="w3-choices" role="group" aria-label="Learning rate schedule">{schedules.map(name => <button key={name} type="button" aria-pressed={kind === name} onClick={() => setKind(name)}>{name}</button>)}</div>
    <Slider id="w3-schedule-epoch" label="Inspect epoch" value={epoch} min={1} max={40} onChange={setEpoch} />
    <figure><svg viewBox="0 0 540 275" role="img" aria-label={kind + " schedule, epoch " + epoch + ", learning rate " + fmt(values[epoch - 1])}><path className="w3-axis" d="M55 25 V225 H490" />{[0, .05, .1].map(value => <g key={value}><line className="w3-gridline" x1="55" x2="490" y1={y(value)} y2={y(value)} /><text x="45" y={y(value) + 4} textAnchor="end">{value}</text></g>)}<path className="w3-run w3-run-0" strokeWidth="3" d={values.map((value, i) => (i ? "L" : "M") + pixel(x(i + 1)) + "," + pixel(y(value))).join(" ")} /><circle className="w3-dot" cx={x(epoch)} cy={y(values[epoch - 1])} r="6" />{[1, 20, 40].map(i => <text key={i} x={x(i)} y="248" textAnchor="middle">{i}</text>)}<text x="490" y="270" textAnchor="end">Epoch</text></svg><figcaption>Step: drops after epochs 20 and 30 · Exponential: ×0.95 each epoch · Warmup: first 5 epochs.</figcaption></figure>
    <Metrics items={[["Epoch", epoch], ["Learning rate", fmt(values[epoch - 1])], ["Schedule", kind]]} />
    <p className="w3-small">Reduce-on-plateau differs: its drops depend on an observed metric, so an epoch-only plot cannot determine its shape. In PyTorch, call most schedulers after the optimizer’s update at the intended frequency; ReduceLROnPlateau receives the monitored metric.</p>
  </Lab>;
}

export function EarlyStoppingLab() {
  const [patience, setPatience] = useState(3);
  const [future, setFuture] = useState(false);
  const result = selectCheckpoint(patience);
  const x = (epoch: number) => 55 + (epoch - 1) / 15 * 435;
  const y = (loss: number) => 230 - loss * 200;
  const line = (values: number[], count: number) => values.slice(0, count).map((value, i) => (i ? "L" : "M") + pixel(x(i + 1)) + "," + pixel(y(value))).join(" ");
  return <Lab id="w3-stopping-lab" title="The last epoch is not necessarily the model to keep.">
    <p>These curves are invented to illustrate checkpoint selection. Improvement means a strictly lower validation loss. Stop after the selected number of consecutive non-improving epochs and restore the best checkpoint seen so far.</p>
    <Slider id="w3-patience" label="Patience" value={patience} min={1} max={6} onChange={setPatience} />
    <button type="button" className="w3-secondary" aria-pressed={future} onClick={() => setFuture(value => !value)}>{future ? "Hide hypothetical later epochs" : "Reveal hypothetical later epochs"}</button>
    <figure><svg viewBox="0 0 540 280" role="img" aria-label={"Patience " + patience + ". Stop at epoch " + result.end + "; restore epoch " + result.bestEpoch + " with validation loss " + fmt(result.best)}><path className="w3-axis" d="M55 25 V230 H490" />{[0, .5, 1].map(value => <g key={value}><line className="w3-gridline" x1="55" x2="490" y1={y(value)} y2={y(value)} /><text x="43" y={y(value) + 4} textAnchor="end">{value}</text></g>)}{future && <g opacity=".25"><path className="w3-run w3-run-0" d={line(training, training.length)} strokeWidth="2" /><path className="w3-run w3-run-1" d={line(validation, validation.length)} strokeWidth="2" strokeDasharray="6 5" /></g>}<path className="w3-run w3-run-0" d={line(training, result.end)} strokeWidth="3" /><path className="w3-run w3-run-1" d={line(validation, result.end)} strokeWidth="3" strokeDasharray="6 5" /><circle className="w3-dot" cx={x(result.bestEpoch)} cy={y(result.best)} r="6" /><circle className="w3-start" cx={x(result.end)} cy={y(validation[result.end - 1])} r="6" />{[1, 8, 16].map(epoch => <text key={epoch} x={x(epoch)} y="253" textAnchor="middle">{epoch}</text>)}<text x="490" y="275" textAnchor="end">Epoch</text></svg><figcaption>Solid: training · Dashed: validation · Filled marker: retained checkpoint · Hollow marker: last observed epoch.</figcaption></figure>
    <Metrics items={[["Stop at epoch", result.end], ["Restore epoch", result.bestEpoch], ["Retained validation loss", fmt(result.best)], ["Test evaluations used for selection", 0]]} />
    <p className="w3-small">{future ? "Faint future values are revealed only for teaching; the stopping decision never reads them. " : ""}A short patience may stop before a later recovery. Tune patience using development data. The checkpoint here means model weights; exact training resumption also requires optimizer, scheduler, and relevant random-generator state.</p>
    <details className="w3-detail"><summary>Inspect only the epochs this run observed</summary><Table label="Observed training and validation losses"><table><thead><tr><th scope="col">Epoch</th><th scope="col">Training loss</th><th scope="col">Validation loss</th><th scope="col">Checkpoint</th></tr></thead><tbody>{validation.slice(0, result.end).map((loss, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{fmt(training[i])}</td><td>{fmt(loss)}</td><td>{i + 1 === result.bestEpoch ? "Retained" : "—"}</td></tr>)}</tbody></table></Table></details>
  </Lab>;
}
