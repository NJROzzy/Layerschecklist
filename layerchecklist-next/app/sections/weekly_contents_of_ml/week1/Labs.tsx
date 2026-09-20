"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, ScrollTable, Slider } from "../Lab";
import { classificationSamples, confusion, format, px, sigmoid } from "../lab-math";

export function BoundaryLab() {
  const [weight, setWeight] = useState(1);
  const [bias, setBias] = useState(0);
  const [mode, setMode] = useState<"linear" | "logistic">("logistic");
  const probability = sigmoid(weight + bias);
  const yPixel = (y: number) => mode === "linear" ? 125 - y * 15 : 205 - y * 165;
  const path = Array.from({ length: 121 }, (_, i) => {
    const x = -3 + i / 20;
    return (i ? "L" : "M") + px(50 + (x + 3) * 70) + "," + px(yPixel(mode === "linear" ? weight * x + bias : sigmoid(weight * x + bias)));
  }).join(" ");
  return <Lab id="ml1-model" title="One score, two prediction tasks." question="Does sigmoid make the 0.5 decision boundary nonlinear?" answer="The sigmoid curve is nonlinear, but p = 0.5 occurs where the affine score is zero. With several raw input features that boundary is a hyperplane. Nonlinear engineered features can change the boundary in the original input space.">
    <p>Change the same weight and bias in a linear numeric predictor and a logistic probability predictor. These controls set parameters by hand; they do not fit a dataset.</p>
    <Choices label="Prediction task" value={mode} onChange={setMode} options={[{ value: "linear", label: "Linear regression" }, { value: "logistic", label: "Logistic classification" }]} />
    <div className="ml-lab-grid"><div><Slider id="ml1-weight" label="Weight w" value={weight} min={-2} max={2} step={.1} onChange={setWeight} /><Slider id="ml1-bias" label="Bias b" value={bias} min={-2} max={2} step={.1} onChange={setBias} /><div className="ml-lab-formula">{mode === "linear" ? "ŷ = wx + b" : "p = 1 / (1 + exp(−(wx + b)))"}</div><p className="ml-lab-note">At x = 1: {mode === "linear" ? "prediction " + format(weight + bias) : "p = " + format(probability) + "; predicted class " + Number(probability >= .5)}</p></div>
    <figure><svg viewBox="0 0 530 255" role="img" aria-label={mode + " output curve with weight " + weight + " and bias " + bias + ". At x one, output " + format(mode === "linear" ? weight + bias : probability)}><defs><clipPath id="ml1-curve-clip"><rect x="50" y="15" width="420" height="205" /></clipPath></defs><path className="ml-axis" d="M50 15 V220 H470" />{[-3, 0, 3].map(x => <text key={x} x={50 + (x + 3) * 70} y="241" textAnchor="middle">{x}</text>)}{(mode === "linear" ? [-4, 0, 4] : [0, .5, 1]).map(y => <g key={y}><line className="ml-gridline" x1="50" x2="470" y1={yPixel(y)} y2={yPixel(y)} /><text x="40" y={yPixel(y) + 4} textAnchor="end">{y}</text></g>)}<path className="ml-curve" d={path} clipPath="url(#ml1-curve-clip)" /><text x="490" y="242">x</text></svg><figcaption>{mode === "linear" ? "Numeric output is unbounded." : "Class 1 when p ≥ 0.5; the horizontal gridline marks the threshold."}</figcaption></figure></div>
  </Lab>;
}

export function FoldLab() {
  const [fold, setFold] = useState(0);
  return <Lab id="ml1-folds" title="Rotate validation. Keep the final test set reserved." question="Does each fold reuse the same fitted scaler?" answer="No. Each fit starts with a fresh pipeline. Its scaler and model learn only from that fold's training rows. After selection, refit the chosen pipeline on all development rows and evaluate the reserved test set.">
    <p>Twenty development rows form five illustrative folds. Four additional rows are reserved for final testing. Select which development block provides validation for this fit.</p>
    <Choices label="Validation fold" value={fold} onChange={setFold} options={Array.from({ length: 5 }, (_, i) => ({ value: i, label: "Fold " + (i + 1) }))} />
    <div className="ml-fold-blocks">{Array.from({ length: 6 }, (_, i) => <div key={i} className={"ml-fold-block " + (i === 5 ? "is-reserved" : i === fold ? "is-validation" : "")}><strong>{i === 5 ? "Final test" : "Block " + (i + 1)}</strong><span>4 rows</span><small>{i === 5 ? "Reserved" : i === fold ? "Score only" : "Fit pipeline"}</small></div>)}</div>
    <Metrics items={[["Fit this fold", "16 rows"], ["Validate this fold", "4 rows"], ["Test rows used", 0]]} />
    <p className="ml-lab-note">Repeat all five fits for every candidate using the same assignments. Each development row supplies validation once. Real splitting must also respect class balance, groups, or time when applicable.</p>
  </Lab>;
}

export function ThresholdLab() {
  const [threshold, setThreshold] = useState(.5);
  const metrics = confusion(threshold);
  return <Lab id="ml1-threshold" title="Move the threshold. Watch the mistakes change." question="What changes when you raise the threshold?" answer="For these fixed scores, fewer rows are predicted positive. True and false positives can only decrease, and recall cannot increase. Precision need not increase at every step. The ranking of scores is unchanged. Choose a threshold on validation data, not the final test set.">
    <p>These sixteen labeled validation examples have fixed illustrative scores. Moving the decision threshold changes predictions without retraining a model.</p>
    <Slider id="ml1-threshold-control" label="Predict class 1 when score ≥ threshold" value={threshold} min={0} max={1} step={.01} display={threshold.toFixed(2)} onChange={setThreshold} />
    <figure><svg viewBox="0 0 610 200" role="img" aria-label={"Threshold " + threshold + ". True positives " + metrics.tp + ", false positives " + metrics.fp + ", false negatives " + metrics.fn + ", true negatives " + metrics.tn}><line className="ml-axis" x1="60" x2="550" y1="160" y2="160" />{[0, .25, .5, .75, 1].map(x => <text key={x} x={60 + x * 490} y="185" textAnchor="middle">{x}</text>)}<text x="55" y="65" textAnchor="end">y = 1</text><text x="55" y="123" textAnchor="end">y = 0</text>{classificationSamples.map(({ score, label }, i) => <circle key={i} className={score >= threshold ? "ml-dot" : "ml-hollow-dot"} cx={60 + score * 490} cy={label === 1 ? 60 : 118} r="7" />)}<line className="ml-threshold-line" x1={60 + threshold * 490} x2={60 + threshold * 490} y1="25" y2="160" /></svg><figcaption>Filled: predicted 1 · Hollow: predicted 0 · Rows show actual labels.</figcaption></figure>
    <div className="ml-lab-grid"><ScrollTable label="Confusion matrix with actual classes as rows"><table><caption>Rows = actual · Columns = predicted</caption><thead><tr><th scope="col">Actual</th><th scope="col">Predicted 0</th><th scope="col">Predicted 1</th></tr></thead><tbody><tr><th scope="row">0</th><td>TN = {metrics.tn}</td><td>FP = {metrics.fp}</td></tr><tr><th scope="row">1</th><td>FN = {metrics.fn}</td><td>TP = {metrics.tp}</td></tr></tbody></table></ScrollTable><Metrics items={[["Precision", format(metrics.precision)], ["Recall", format(metrics.recall)], ["F1", format(metrics.f1)], ["Accuracy", format(metrics.accuracy)]]} /></div>
    <p className="ml-lab-note">Precision = TP / (TP + FP). It is undefined when no rows are predicted positive; the display preserves that distinction.</p>
  </Lab>;
}

