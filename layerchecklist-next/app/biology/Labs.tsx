"use client";

import { useState, type ReactNode } from "react";
import { diffusion, genotypeFrequencies, logistic } from "./models";
const round = (n: number) => Number(n.toFixed(3));
const fmt = (n: number) => n.toFixed(3);

function Slider({ id, label, value, min, max, step = 1, onChange }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return <label className="bio-slider" htmlFor={id}><span>{label}<output htmlFor={id}>{value}</output></span><input id={id} type="range" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))} /></label>;
}
function Metrics({ items }: { items: [string, number | string][] }) {
  return <div className="bio-metrics" aria-live="polite" aria-atomic="true">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{typeof value === "number" ? fmt(value) : value}</strong></div>)}</div>;
}
function Lab({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <div id={id} className="bio-lab" aria-labelledby={id + "-title"}><span className="bio-eyebrow">CHANGE A PARAMETER. EXPLAIN THE RESULT.</span><h3 id={id + "-title"}>{title}</h3>{children}</div>;
}
export function DiffusionLab() {
  const [initial, setInitial] = useState(18), [rate, setRate] = useState(.2), [time, setTime] = useState(5);
  const result = diffusion(initial, rate, time);
  const x = (t: number) => round(50 + t / 12 * 470), y = (c: number) => round(235 - c / 20 * 200);
  const path = (side: "a" | "b") => Array.from({ length: 121 }, (_, i) => (i ? "L" : "M") + x(i / 10) + "," + y(diffusion(initial, rate, i / 10)[side])).join(" ");
  return <Lab id="bio-diffusion" title="A boundary can slow exchange without stopping it."><p>Two equal, fixed-volume compartments exchange a dissolved substance. Their initial concentrations sum to 20. This simplified model assumes passive transport proportional to the concentration difference, with no reaction, pumping or volume change.</p><div className="bio-formula">dA/dt = −k(A − B), dB/dt = k(A − B)<br />A(t) = 10 + (A₀ − 10)e⁻²ᵏᵗ; B(t) = 20 − A(t)</div>
    <div className="bio-sliders"><Slider id="bio-initial" label="Initial concentration in A" value={initial} min={0} max={20} onChange={setInitial} /><Slider id="bio-permeability" label="Exchange rate k · time⁻¹" value={rate} min={0} max={1} step={.05} onChange={setRate} /><Slider id="bio-diffusion-time" label="Inspect time" value={time} min={0} max={12} step={.5} onChange={setTime} /></div>
    <figure><svg viewBox="0 0 560 275" role="img" aria-label={`Concentration A ${fmt(result.a)}, B ${fmt(result.b)} at time ${time}.`}><path className="bio-axis" d="M50 25 V235 H520" /><path className="bio-line-a" d={path("a")} /><path className="bio-line-b" d={path("b")} /><line className="bio-axis" x1={x(time)} x2={x(time)} y1="25" y2="235" />{[0, 10, 20].map(c => <text className="bio-chart-label" key={c} x="40" y={y(c) + 4} textAnchor="end">{c}</text>)}{[0, 6, 12].map(t => <text className="bio-chart-label" key={t} x={x(t)} y="258" textAnchor="middle">{t}</text>)}</svg><figcaption>Solid: A. Dashed: B. Time runs horizontally; concentration vertically. The equal-volume total is conserved.</figcaption></figure>
    <Metrics items={[["Concentration A", result.a], ["Concentration B", result.b], ["A + B", result.a + result.b]]} /><details className="bio-check"><summary>What happens when k = 0?</summary><p>Exchange stops: both compartments retain their initial concentrations. When k is positive, they approach equal concentrations. Molecules can still move in both directions at equilibrium; the net flux is zero.</p></details>
  </Lab>;
}
export function InheritanceLab() {
  const [p, setP] = useState(.5), frequencies = genotypeFrequencies(p);
  const values = [frequencies.aa, frequencies.ab, frequencies.bb];
  return <Lab id="bio-inheritance" title="Allele frequency and genotype frequency are different."><p>At a diploid locus with alleles A and a, let p be the frequency of A and q = 1 − p. Random pairing of gametes gives the Hardy–Weinberg proportions p², 2pq and q². The equilibrium model also assumes a large population with no selection, mutation or migration.</p><div className="bio-sliders"><Slider id="bio-allele-p" label="Frequency of allele A · p" value={p} min={0} max={1} step={.01} onChange={setP} /></div>
    <div className="bio-genotypes" role="img" aria-label={`AA ${fmt(values[0] * 100)} percent, Aa ${fmt(values[1] * 100)} percent, aa ${fmt(values[2] * 100)} percent.`}>{values.map((value, i) => <span key={i} style={{ width: (value * 100).toFixed(3) + "%" }} />)}</div>
    <Metrics items={[["AA · p²", frequencies.aa], ["Aa · 2pq", frequencies.ab], ["aa · q²", frequencies.bb], ["Total frequency", values.reduce((a, b) => a + b, 0)]]} />
    <p className="bio-note">Green: AA. Lime: Aa. Blue: aa. These are expected proportions, not exact counts in a finite population. Dominance describes a heterozygote&apos;s phenotype; it does not determine which allele is common or favored by selection.</p><details className="bio-check"><summary>Why is the heterozygote term 2pq?</summary><p>The A allele can come from either parent: A then a contributes pq, and a then A contributes qp. Their sum is 2pq, maximized at p = q = 0.5.</p></details>
  </Lab>;
}
export function PopulationLab() {
  const [rate, setRate] = useState(.5), [capacity, setCapacity] = useState(200), [time, setTime] = useState(8);
  const n0 = 20, current = logistic(n0, rate, capacity, time);
  const x = (t: number) => round(50 + t / 15 * 470), y = (n: number) => round(235 - n / 500 * 200);
  const path = Array.from({ length: 151 }, (_, i) => (i ? "L" : "M") + x(i / 10) + "," + y(logistic(n0, rate, capacity, i / 10))).join(" ");
  return <Lab id="bio-population" title="A growth model needs an account of its limits."><p>Start with N₀ = 20 and model continuous population growth as dN/dt = rN(1 − N/K). The per-capita growth rate falls as N approaches carrying capacity K. Here r and K stay fixed; this is a teaching model, not a forecast for a species.</p>
    <div className="bio-sliders"><Slider id="bio-growth-rate" label="Growth rate r · time⁻¹" value={rate} min={0} max={1.5} step={.05} onChange={setRate} /><Slider id="bio-capacity" label="Carrying capacity K" value={capacity} min={50} max={500} step={10} onChange={setCapacity} /><Slider id="bio-population-time" label="Inspect time" value={time} min={0} max={15} step={.5} onChange={setTime} /></div>
    <figure><svg viewBox="0 0 560 275" role="img" aria-label={`Population ${fmt(current)} at time ${time}; capacity ${capacity}.`}><path className="bio-axis" d="M50 25 V235 H520" /><line className="bio-line-b" x1="50" x2="520" y1={y(capacity)} y2={y(capacity)} /><path className="bio-line-a" d={path} /><circle cx={x(time)} cy={y(current)} r="5" fill="var(--b-accent)" />{[0, 250, 500].map(n => <text className="bio-chart-label" key={n} x="40" y={y(n) + 4} textAnchor="end">{n}</text>)}{[0, 5, 10, 15].map(t => <text className="bio-chart-label" key={t} x={x(t)} y="258" textAnchor="middle">{t}</text>)}</svg><figcaption>Solid: modeled population. Dashed: fixed carrying capacity. This continuous model does not produce chaos.</figcaption></figure>
    <Metrics items={[["Population N(t)", current], ["Growth dN/dt", rate * current * (1 - current / capacity)], ["Fraction of capacity", current / capacity]]} /><details className="bio-check"><summary>Why does exponential growth work only as an approximation here?</summary><p>When N is small relative to K, the factor 1 − N/K is close to one, so dN/dt ≈ rN. Near K that approximation fails. Real populations may also face delays, seasonal resources, migration and stochastic events absent from this model.</p></details>
  </Lab>;
}
