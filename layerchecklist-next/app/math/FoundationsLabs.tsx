"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, Slider, at, show } from "./Lab";

export function SetsLab() {
  const [operation, setOperation] = useState("intersection");
  const universe = [1, 2, 3, 4, 5, 6];
  const result = universe.filter(x => operation === "intersection" ? x % 2 === 0 && x > 3 : operation === "union" ? x % 2 === 0 || x > 3 : operation === "difference" ? x % 2 === 0 && x <= 3 : x % 2 !== 0);
  return <Lab id="math-sets" eyebrow="SETS BECOME CONDITIONS IN CODE" title="Which observations pass the rule?" question="Is A ∩ B the same as A ∪ B?" answer={<p>Intersection requires both conditions, giving {'{4, 6}'}. Union requires at least one, giving {'{2, 4, 5, 6}'}. Logical OR includes the case where both conditions hold.</p>}>
    <p>Universe U = {'{1, 2, 3, 4, 5, 6}'}. Let A contain the even numbers and B contain the numbers greater than 3. A complement is always relative to a stated universe.</p>
    <Choices label="Set operation" value={operation} onChange={setOperation} options={[{ value: "intersection", label: "A ∩ B · AND" }, { value: "union", label: "A ∪ B · OR" }, { value: "difference", label: "A ∖ B · AND NOT" }, { value: "complement", label: "U ∖ A · NOT" }]} />
    <div className="math-set-members">{universe.map(x => <div key={x} className={result.includes(x) ? "is-included" : ""}><strong>{x}</strong><span>{x % 2 === 0 ? "In A" : "Outside A"} · {x > 3 ? "In B" : "Outside B"}</span><small>{result.includes(x) ? "Included" : "Excluded"}</small></div>)}</div>
    <Metrics items={[["Resulting set", "{" + result.join(", ") + "}"], ["Cardinality · number of elements", result.length]]} />
  </Lab>;
}

// Fixed standard-normal draws make comparisons reproducible. Changing n reuses
// the same standardized draws, isolating the sigma/sqrt(n) scaling.
const normalDraws = Array.from({ length: 40 }, (_, i) => {
  const u = ((i * 37 + 13) % 101 + .5) / 101;
  const v = ((i * 53 + 29) % 103 + .5) / 103;
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
});
export function UncertaintyLab() {
  const [n, setN] = useState(25);
  const [sample, setSample] = useState(1);
  const sigma = 2, truth = 10, se = sigma / Math.sqrt(n);
  const means = normalDraws.map(z => truth + se * z);
  const selected = means[sample - 1], margin = 1.959963984540054 * se;
  const covered = means.filter(mean => Math.abs(mean - truth) <= margin).length;
  const x = (value: number) => at(60 + (value - 5) / 10 * 460);
  return <Lab id="math-uncertainty" eyebrow="SPREAD IS NOT THE SAME AS UNCERTAINTY" title="Watch the uncertainty in a mean shrink." question="Does a 95% confidence interval assign a 95% probability to the fixed true mean?" answer={<p>In this frequentist model, the mean is fixed and the interval varies with the sample. The procedure covers the true mean in 95% of repeated independent samples under the model. A realized interval either covers it or does not.</p>}>
    <p>Assume IID normal observations with mean μ = 10 and known standard deviation σ = 2. Each line is an illustrative interval x̄ ± 1.96σ/√n from a simulated sample mean. We reuse 40 fixed standardized draws as n changes to isolate the effect of sample size.</p>
    <div className="math-input-row"><Slider id="math-sample-size" label="Observations per sample · n" value={n} min={5} max={200} step={5} onChange={setN} /><Slider id="math-inspect-sample" label="Inspect interval" value={sample} min={1} max={40} onChange={setSample} /></div>
    <figure><svg viewBox="0 0 560 420" role="img" aria-label={`${covered} of 40 illustrative intervals cover the true mean. Standard error ${show(se)}.`}><line className="math-guide" x1={x(truth)} x2={x(truth)} y1="20" y2="380" />{means.map((m, i) => <g key={i} opacity={i + 1 === sample ? 1 : .5}><line x1={x(m - margin)} x2={x(m + margin)} y1={28 + i * 8.5} y2={28 + i * 8.5} stroke={Math.abs(m - truth) <= margin ? "var(--m-accent)" : "var(--m-second)"} strokeWidth={i + 1 === sample ? 3 : 1.5} /><circle className="math-point" cx={x(m)} cy={28 + i * 8.5} r={i + 1 === sample ? 3.5 : 1.5} /></g>)}{[5, 10, 15].map(v => <text className="math-axis-label" key={v} x={x(v)} y="405" textAnchor="middle">{v}</text>)}</svg><figcaption>Vertical line: true mean. Amber intervals miss it. This small, fixed simulation need not have exactly 95% coverage.</figcaption></figure>
    <Metrics items={[["Individual-observation SD", show(sigma)], ["Standard error of the mean", show(se)], ["Selected sample mean", show(selected)], ["Selected 95% interval", `[${show(selected - margin)}, ${show(selected + margin)}]`]]} />
    <p className="math-note">Four times as many observations halves the standard error under these assumptions. With unknown σ, estimate it from the sample and use an appropriate method, such as a t interval for IID normal data. Dependence or a biased sample needs additional care.</p>
  </Lab>;
}

export function StabilityLab() {
  const [offset, setOffset] = useState(0);
  const logits = [1, 2, 3].map(z => z + offset);
  const direct = logits.map(Math.exp), total = direct.reduce((a, b) => a + b, 0);
  const naive = direct.map(w => w / total);
  const max = Math.max(...logits), shifted = logits.map(z => Math.exp(z - max));
  const denominator = shifted.reduce((a, b) => a + b, 0), stable = shifted.map(w => w / denominator);
  const loss = (max - logits[2]) + Math.log(denominator);
  return <Lab id="math-stable-softmax" eyebrow="SAME FORMULA, DIFFERENT NUMERICAL BEHAVIOR" title="Add 1,000 to every score. What should change?" question="Why does subtracting the maximum preserve softmax?" answer={<p>Every numerator and the denominator are multiplied by the same positive factor e⁻ᵐ, so the ratio is unchanged in exact arithmetic. The shifted exponents are at most zero, avoiding exponential overflow. Very small probabilities can still underflow; log-sum-exp lets us compute log losses directly.</p>}>
    <p>Start with scores [1, 2, 3]. Adding the same constant to all scores cannot change their softmax probabilities mathematically. Direct exponentiation can overflow in the browser&apos;s floating-point arithmetic.</p>
    <Slider id="math-logit-offset" label="Shared logit offset" value={offset} min={0} max={1000} step={10} onChange={setOffset} />
    <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Direct and stable softmax"><table><thead><tr><th scope="col">Class</th><th scope="col">Logit</th><th scope="col">Direct softmax</th><th scope="col">Shifted softmax</th></tr></thead><tbody>{logits.map((z, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{z}</td><td>{Number.isFinite(naive[i]) ? show(naive[i], 6) : "NaN · overflow"}</td><td>{show(stable[i], 6)}</td></tr>)}</tbody></table></div>
    <Metrics items={[["Stable probability sum", show(stable.reduce((a, b) => a + b, 0), 6)], ["Log loss for class 3 · nats", show(loss, 6)], ["Direct computation", naive.every(Number.isFinite) ? "Finite" : "Overflow", !naive.every(Number.isFinite)]]} />
  </Lab>;
}
