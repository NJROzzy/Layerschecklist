"use client";

import { useState } from "react";
import { Lab, Metrics, ScrollTable, Slider } from "../Lab";
import { earlyStop, format, gradientTrace, px, trainingLosses, validationLosses } from "../lab-math";

export function GradientStepLab() {
  const [rate, setRate] = useState(.1);
  const trace = gradientTrace(rate, 5);
  const diverging = trace[trace.length - 1].loss > trace[0].loss;
  return <Lab id="ml3-objective" title="One weight, one gradient step at a time." question="Why can raising the learning rate make the loss go up instead of down?" answer="The update subtracts learning_rate times the gradient. A large enough step overshoots the minimum and lands somewhere with a larger loss than before — at rate 1.0 this example's loss rises from 8 to 72 in a single step. A smaller, well-chosen rate keeps each step moving toward lower loss.">
    <p>One weight w, fixed x = 2 and target y = 4, loss = 0.5·(wx − y)². Choose a learning rate and watch each gradient-descent step.</p>
    <Slider id="ml3-rate" label="Learning rate" value={rate} min={.01} max={1.2} step={.01} onChange={setRate} />
    <ScrollTable label="Gradient descent steps"><table><thead><tr><th scope="col">Step</th><th scope="col">Weight</th><th scope="col">Gradient</th><th scope="col">Loss</th></tr></thead><tbody>{trace.map(row => <tr key={row.step}><th scope="row">{row.step}</th><td>{format(row.weight)}</td><td>{format(row.gradient)}</td><td>{format(row.loss)}</td></tr>)}</tbody></table></ScrollTable>
    <p className="ml-lab-note">{diverging ? "This rate raises the loss above where it started — the step size is overshooting." : "Loss decreases with each step at this rate."}</p>
  </Lab>;
}

export function DiagnoseLab() {
  const [epoch, setEpoch] = useState(6);
  const xPixel = (e: number) => 50 + ((e - 1) / (trainingLosses.length - 1)) * 420;
  const yMax = .75;
  const yPixel = (y: number) => 220 - (y / yMax) * 205;
  const linePath = (values: number[]) => values.map((v, i) => (i ? "L" : "M") + px(xPixel(i + 1)) + "," + px(yPixel(v))).join(" ");
  const gap = validationLosses[epoch - 1] - trainingLosses[epoch - 1];
  return <Lab id="ml3-diagnose" title="Read the gap, not just the score." question="What does a growing gap between the two curves suggest here?" answer="Training loss keeps improving while validation loss stops improving and then rises — the pattern the lesson's evidence table calls overfitting or a split/regularization issue, not something a single epoch's numbers can diagnose alone. A small early gap that stays small is a weaker signal than a gap that keeps widening.">
    <p>Sixteen illustrative epochs of training and validation loss. Move the epoch marker to compare the two curves at that point.</p>
    <Slider id="ml3-epoch" label="Epoch" value={epoch} min={1} max={trainingLosses.length} onChange={setEpoch} />
    <div className="ml-lab-grid">
      <Metrics items={[["Training loss", format(trainingLosses[epoch - 1])], ["Validation loss", format(validationLosses[epoch - 1])], ["Gap", format(gap)]]} />
      <figure><svg viewBox="0 0 530 255" role="img" aria-label={"Epoch " + epoch + ". Training loss " + format(trainingLosses[epoch - 1]) + ", validation loss " + format(validationLosses[epoch - 1])}><path className="ml-axis" d="M50 15 V220 H470" />{[1, 8, 16].map(e => <text key={e} x={xPixel(e)} y="241" textAnchor="middle">{e}</text>)}{[0, .375, .75].map(y => <g key={y}><line className="ml-gridline" x1="50" x2="470" y1={yPixel(y)} y2={yPixel(y)} /><text x="40" y={yPixel(y) + 4} textAnchor="end">{format(y)}</text></g>)}<path className="ml-curve" d={linePath(trainingLosses)} /><path className="ml-curve-secondary" d={linePath(validationLosses)} /><line className="ml-threshold-line" x1={xPixel(epoch)} x2={xPixel(epoch)} y1="15" y2="220" /><text x="490" y="242">epoch</text></svg><figcaption>Solid: training loss · Dashed: validation loss</figcaption></figure>
    </div>
  </Lab>;
}

export function EarlyStopLab() {
  const [patience, setPatience] = useState(3);
  const [budget, setBudget] = useState(validationLosses.length);
  const result = earlyStop(validationLosses, patience, budget);
  return <Lab id="ml3-final-evaluation" title="Stop on validation evidence, not the full budget." question="Does the run always use its full epoch budget?" answer="No. Once validation loss fails to improve for the chosen patience of consecutive epochs, the run stops early and reports the best epoch seen so far — refitting decisions should use that best epoch, not whichever epoch the run happened to end on.">
    <p>Sixteen illustrative validation-loss epochs. Choose a patience (epochs without improvement before stopping) and an epoch budget.</p>
    <Slider id="ml3-patience" label="Patience" value={patience} min={1} max={6} onChange={setPatience} />
    <Slider id="ml3-budget" label="Epoch budget" value={budget} min={4} max={validationLosses.length} onChange={setBudget} />
    <Metrics items={[["Best validation loss", format(result.best)], ["Best epoch", result.bestEpoch], ["Run ends at epoch", result.end], ["Stopped early", result.stopped ? "Yes" : "No"]]} />
    <ScrollTable label="Validation loss by epoch, run truncated at the epoch budget"><table><thead><tr><th scope="col">Epoch</th>{validationLosses.slice(0, budget).map((_, i) => <th scope="col" key={i}>{i + 1}</th>)}</tr></thead><tbody><tr><th scope="row">Validation loss</th>{validationLosses.slice(0, budget).map((v, i) => <td key={i} className={i + 1 === result.bestEpoch ? "is-best" : ""}>{format(v)}</td>)}</tr></tbody></table></ScrollTable>
    <p className="ml-lab-note">{result.stopped ? "Training stopped after " + patience + " epochs without improvement, at epoch " + result.end + ". The best weights were seen at epoch " + result.bestEpoch + "." : "The budget ran out before " + patience + " epochs without improvement occurred."}</p>
  </Lab>;
}
