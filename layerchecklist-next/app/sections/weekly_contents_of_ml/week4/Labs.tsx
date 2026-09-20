"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, ScrollTable, Slider } from "../Lab";
import { binaryCrossEntropy, denseParameters, earlyStop, format, px, sigmoid, trainingLosses, validationLosses } from "../lab-math";

export function ShapeLab() {
  const [hidden1, setHidden1] = useState(16);
  const [hidden2, setHidden2] = useState(16);
  const widths = [2, hidden1, hidden2, 1];
  const params = denseParameters(2, [hidden1, hidden2], 1);
  const total = params.reduce((sum, n) => sum + n, 0);
  return <Lab id="ml4-tensors" title="Every arrow is a Dense layer's weights and biases." question="Does doubling a hidden layer's width double the network's trainable parameters?" answer="Not exactly. A layer's parameter count is (input width + 1) × output width, so widening that layer's own output roughly scales its own parameters — but it also changes the input width the next layer sees, which changes that layer's count too.">
    <p>Two inputs feed two hidden Dense(ReLU) layers and a one-unit sigmoid output. Each Dense layer contributes (input width + 1) × output width trainable parameters — the +1 is the bias per output unit.</p>
    <div className="ml-lab-grid">
      <div>
        <Slider id="ml4-hidden1" label="Hidden layer 1 width" value={hidden1} min={4} max={32} step={4} onChange={setHidden1} />
        <Slider id="ml4-hidden2" label="Hidden layer 2 width" value={hidden2} min={4} max={32} step={4} onChange={setHidden2} />
        <Metrics items={[["Total trainable parameters", total]]} />
      </div>
      <div className="ml-shape-flow" aria-label={"(batch, 2) through Dense " + hidden1 + ", Dense " + hidden2 + ", Dense 1"}>
        {widths.map((width, i) => <div className="ml-shape-step" key={i}>
          <div className="ml-shape-node">{i === 0 ? "Input" : "Dense"}<strong>{"(batch, " + width + ")"}</strong></div>
          {i < widths.length - 1 && <div className="ml-shape-arrow">{params[i]} params</div>}
        </div>)}
      </div>
    </div>
  </Lab>;
}

export function LossMismatchLab() {
  const [z, setZ] = useState(1);
  const [label, setLabel] = useState(1);
  const probability = sigmoid(z);
  const mismatched = sigmoid(probability);
  return <Lab id="ml4-output-loss" title="A sigmoid output paired with the wrong loss." question="Why is the mismatched probability always above 0.5, regardless of z?" answer="sigmoid(z) is already a probability in (0, 1). Applying a from_logits loss to it applies sigmoid a second time, and sigmoid of anything between 0 and 1 always lands between 0.5 and about 0.731 — so the mismatched pairing predicts class 1 almost no matter what the network computed.">
    <p>Dense(1, activation=&apos;sigmoid&apos;) already outputs a probability. Pairing it correctly with BinaryCrossentropy(from_logits=False) applies sigmoid once; pairing it with from_logits=True applies sigmoid again inside the loss.</p>
    <Slider id="ml4-z" label="Raw score z" value={z} min={-4} max={4} step={.1} onChange={setZ} />
    <Choices label="True label" value={label} onChange={setLabel} options={[{ value: 0, label: "y = 0" }, { value: 1, label: "y = 1" }]} />
    <ScrollTable label="Correct versus mismatched sigmoid/loss pairing"><table><thead><tr><th scope="col">Pairing</th><th scope="col">Probability used</th><th scope="col">Predicted class</th><th scope="col">Loss</th></tr></thead><tbody><tr><th scope="row">sigmoid + from_logits=False</th><td>{format(probability)}</td><td>{Number(probability >= .5)}</td><td>{format(binaryCrossEntropy(probability, label))}</td></tr><tr><th scope="row">sigmoid + from_logits=True</th><td>{format(mismatched)}</td><td>{Number(mismatched >= .5)}</td><td>{format(binaryCrossEntropy(mismatched, label))}</td></tr></tbody></table></ScrollTable>
    <Metrics items={[["p = sigmoid(z)", format(probability)], ["Mismatched: sigmoid(p)", format(mismatched)]]} />
    <p className="ml-lab-formula">Correct: p = sigmoid(z) · Mismatched: sigmoid(sigmoid(z))</p>
  </Lab>;
}

export function RestoreWeightsLab() {
  const [patience, setPatience] = useState(3);
  const result = earlyStop(validationLosses, patience, validationLosses.length);
  const xPixel = (e: number) => 50 + ((e - 1) / (validationLosses.length - 1)) * 420;
  const yMax = .75;
  const yPixel = (y: number) => 220 - (y / yMax) * 205;
  const linePath = (values: number[]) => values.slice(0, result.end).map((v, i) => (i ? "L" : "M") + px(xPixel(i + 1)) + "," + px(yPixel(v))).join(" ");
  return <Lab id="ml4-early-stopping" title="restore_best_weights restores a weight snapshot, not the last epoch." question="Are the restored weights the same as the weights from the run's last logged epoch?" answer="Only when the last epoch happens to be the best one. Otherwise EarlyStopping keeps the weights from the best monitored epoch and discards the ones from the patience-waiting epochs that followed — the run's last history entry describes a worse checkpoint than what actually gets restored.">
    <p>EarlyStopping(monitor=&apos;val_loss&apos;, restore_best_weights=True) stops once validation loss goes patience epochs without improving, then restores the weights from its best epoch — not the epoch training happened to stop on.</p>
    <Slider id="ml4-patience" label="Patience" value={patience} min={1} max={6} onChange={setPatience} />
    <div className="ml-lab-grid">
      <Metrics items={[["Best epoch (restored)", result.bestEpoch], ["Training stopped at epoch", result.end], ["Best validation loss", format(result.best)]]} />
      <figure><svg viewBox="0 0 530 255" role="img" aria-label={"Patience " + patience + ". Restored epoch " + result.bestEpoch + " of " + result.end + " logged epochs"}><path className="ml-axis" d="M50 15 V220 H470" />{[1, 8, 16].map(e => <text key={e} x={xPixel(e)} y="241" textAnchor="middle">{e}</text>)}<path className="ml-curve" d={linePath(trainingLosses)} /><path className="ml-curve-secondary" d={linePath(validationLosses)} /><circle className="ml-marker" cx={xPixel(result.bestEpoch)} cy={yPixel(validationLosses[result.bestEpoch - 1])} r="7" /><circle className="ml-hollow-dot" cx={xPixel(result.end)} cy={yPixel(validationLosses[result.end - 1])} r="6" /><text x="490" y="242">epoch</text></svg><figcaption>Filled marker: restored best epoch · Hollow: last logged epoch</figcaption></figure>
    </div>
  </Lab>;
}
