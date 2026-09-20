"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, ScrollTable, Slider } from "../Lab";
import { cyclicDistance, cyclicPoint, featureTrain, featureValidation, fitPolynomial, format, polynomialCount, px } from "../lab-math";

export function PolynomialFitLab() {
  const [degree, setDegree] = useState(2);
  const [alpha, setAlpha] = useState(1);
  const fit = fitPolynomial(degree, alpha);
  const yMin = -1, yMax = 7;
  const xPixel = (x: number) => 50 + (x + 3) * 70;
  const yPixel = (y: number) => 220 - ((y - yMin) / (yMax - yMin)) * 205;
  const path = Array.from({ length: 113 }, (_, i) => {
    const x = -2.8 + i * 0.05;
    return (i ? "L" : "M") + px(xPixel(x)) + "," + px(yPixel(fit.predict(x)));
  }).join(" ");
  return <Lab id="ml2-representation" title="Same estimator, richer input representation." question="Why can validation MAE rise again at a higher degree even though training MAE keeps falling?" answer="More polynomial terms let the fit track the fifteen training points more closely, including their noise. Training error keeps dropping while the fit increasingly disagrees with the held-out validation points. Ridge's alpha resists this by shrinking coefficients; it does not limit the degree itself.">
    <p>Fifteen training points follow a noisy quadratic pattern. Raise the polynomial degree to add x², x³, and x⁴ columns before the same Ridge estimator, or raise alpha to shrink the fitted coefficients.</p>
    <div className="ml-lab-grid">
      <div>
        <Slider id="ml2-degree" label="Polynomial degree" value={degree} min={1} max={4} onChange={setDegree} />
        <Slider id="ml2-alpha" label="Ridge alpha" value={alpha} min={.1} max={5} step={.1} onChange={setAlpha} />
        <Metrics items={[["Train MAE", format(fit.trainMAE)], ["Validation MAE", format(fit.validationMAE)]]} />
      </div>
      <figure><svg viewBox="0 0 530 255" role="img" aria-label={"Degree " + degree + " fit. Train MAE " + format(fit.trainMAE) + ", validation MAE " + format(fit.validationMAE)}><defs><clipPath id="ml2-fit-clip"><rect x="50" y="15" width="420" height="205" /></clipPath></defs><path className="ml-axis" d="M50 15 V220 H470" />{[-3, 0, 3].map(x => <text key={x} x={xPixel(x)} y="241" textAnchor="middle">{x}</text>)}{[0, 3, 6].map(y => <g key={y}><line className="ml-gridline" x1="50" x2="470" y1={yPixel(y)} y2={yPixel(y)} /><text x="40" y={yPixel(y) + 4} textAnchor="end">{y}</text></g>)}{featureTrain.map((p, i) => <circle key={"t" + i} className="ml-dot" cx={px(xPixel(p.x))} cy={px(yPixel(p.y))} r="4" />)}{featureValidation.map((p, i) => <circle key={"v" + i} className="ml-hollow-dot" cx={px(xPixel(p.x))} cy={px(yPixel(p.y))} r="4" />)}<path className="ml-curve" d={path} clipPath="url(#ml2-fit-clip)" /><text x="490" y="242">x</text></svg><figcaption>Filled: training points · Hollow: validation points · Line: fitted curve.</figcaption></figure>
    </div>
  </Lab>;
}

export function CyclicFeatureLab() {
  const [hourA, setHourA] = useState(23);
  const [hourB, setHourB] = useState(0);
  const rawGap = Math.min(Math.abs(hourA - hourB), 24 - Math.abs(hourA - hourB));
  const cyclic = cyclicDistance(hourA, hourB);
  const point = (hour: number) => { const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2; return { x: px(110 + 90 * Math.cos(angle)), y: px(110 + 90 * Math.sin(angle)) }; };
  const a = point(hourA), b = point(hourB);
  const options = [0, 6, 12, 18, 23].map(h => ({ value: h, label: h + ":00" }));
  return <Lab id="ml2-cyclic" title="Hour 23 and hour 0 sit one step apart." question="Why does a single numeric hour column mislead a model near midnight?" answer="Hour as one raw number places 23 and 0 at opposite ends of the scale, twenty-three apart. sin/cos together map every hour to a position on a circle, so adjacent hours stay close together across the midnight boundary — this needs both coordinates; either alone maps some other pair of hours to the same value.">
    <p>Choose two hours on the 24-hour clock. Compare the raw numeric gap against the distance between their sin/cos coordinates.</p>
    <Choices label="Hour A" value={hourA} onChange={setHourA} options={options} />
    <Choices label="Hour B" value={hourB} onChange={setHourB} options={options} />
    <div className="ml-lab-grid">
      <div>
        <div className="ml-lab-formula">hour_sin = sin(2π·hour/24) · hour_cos = cos(2π·hour/24)</div>
        <Metrics items={[["Raw numeric gap", rawGap + " h"], ["Cyclic-encoded distance", format(cyclic)]]} />
        <p className="ml-lab-note">Point A: ({format(cyclicPoint(hourA).x)}, {format(cyclicPoint(hourA).y)}) · Point B: ({format(cyclicPoint(hourB).x)}, {format(cyclicPoint(hourB).y)})</p>
      </div>
      <figure><svg viewBox="0 0 220 220" role="img" aria-label={"Hour " + hourA + " and hour " + hourB + " on the 24-hour circle. Raw gap " + rawGap + " hours, cyclic distance " + format(cyclic)}><circle className="ml-axis" cx="110" cy="110" r="90" fill="none" /><path className="ml-curve" d={"M" + a.x + "," + a.y + " L" + b.x + "," + b.y} /><circle className="ml-dot" cx={a.x} cy={a.y} r="6" /><circle className="ml-hollow-dot" cx={b.x} cy={b.y} r="6" /></svg><figcaption>Filled: hour A · Hollow: hour B</figcaption></figure>
    </div>
  </Lab>;
}

export function AblationLab() {
  const [degree, setDegree] = useState(2);
  const raw = fitPolynomial(1, 1);
  const expanded = fitPolynomial(degree, 1);
  const rawColumns = polynomialCount(2, 1);
  const columns = polynomialCount(2, degree);
  return <Lab id="ml2-ablation" title="Isolate one change: the representation." question="Does a lower validation MAE at degree four prove that representation is the best general choice?" answer="It shows this ablation's evidence for this dataset, split, and alpha only. Holding the estimator and folds fixed is what makes the comparison meaningful — but a different dataset, sample size, or regularization strength could favor a different degree.">
    <p>Compare a fixed Ridge estimator on the raw two-column input against the same estimator on degree-expanded features, holding the folds and alpha fixed. More columns cost more to fit and can add variance even when they help on average.</p>
    <Choices label="Expanded degree" value={degree} onChange={setDegree} options={[2, 3, 4].map(d => ({ value: d, label: "Degree " + d }))} />
    <ScrollTable label="Ablation: raw features versus expanded features"><table><thead><tr><th scope="col">Representation</th><th scope="col">Feature columns</th><th scope="col">Train MAE</th><th scope="col">Validation MAE</th></tr></thead><tbody><tr><th scope="row">Raw (degree 1)</th><td>{rawColumns}</td><td>{format(raw.trainMAE)}</td><td>{format(raw.validationMAE)}</td></tr><tr><th scope="row">Expanded (degree {degree})</th><td>{columns}</td><td>{format(expanded.trainMAE)}</td><td>{format(expanded.validationMAE)}</td></tr></tbody></table></ScrollTable>
    <p className="ml-lab-note">{expanded.validationMAE < raw.validationMAE ? "Degree " + degree + " lowers validation MAE here, at the cost of " + (columns - rawColumns) + " extra columns." : "Degree " + degree + " does not improve validation MAE over the raw representation in this comparison."}</p>
  </Lab>;
}
