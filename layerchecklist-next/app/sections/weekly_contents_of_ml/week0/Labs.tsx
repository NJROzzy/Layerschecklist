"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, ScrollTable, Slider } from "../Lab";
import { format, prepareColumn } from "../lab-math";

export function SplitLab() {
  const [grouped, setGrouped] = useState(false);
  const rows = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, group: "ABCD"[Math.floor(i / 3)], held: grouped ? i >= 9 : [2, 5, 8].includes(i) }));
  const trainGroups = new Set(rows.filter(row => !row.held).map(row => row.group));
  const shared = [...new Set(rows.filter(row => row.held && trainGroups.has(row.group)).map(row => row.group))];
  return <Lab id="ml0-split" title="Does the same machine appear on both sides?" question="Why can a row split look better than a group split?" answer="Repeated measurements from one machine can share recognizable patterns. If the intended task is prediction for new machines, mixing a machine across training and evaluation can make the result too optimistic. Grouping addresses that overlap; it does not remove every kind of leakage.">
    <p>Four machines each supply three readings. Both illustrated splits hold out three of the twelve rows. The goal here is to predict for machines absent from training.</p>
    <Choices label="Split strategy" value={grouped ? "group" : "row"} onChange={value => setGrouped(value === "group")} options={[{ value: "row", label: "Split individual rows" }, { value: "group", label: "Keep machines together" }]} />
    <div className="ml-split-rows">{rows.map(row => <div key={row.id} className={row.held ? "ml-data-cell is-validation" : "ml-data-cell"}><strong>{row.group}{(row.id - 1) % 3 + 1}</strong><span>{row.held ? "Held out" : "Train"}</span></div>)}</div>
    <Metrics items={[["Training rows", 9], ["Held-out rows", 3], ["Machines in both sets", shared.length]]} />
    <p className="ml-lab-note">{shared.length ? "Machines " + shared.join(", ") + " appear in both sets. This evaluation does not isolate new-machine generalization." : "Machine D appears only in the held-out set. Its readings cannot supply training information."} These assignments are fixed illustrations, not random draws.</p>
  </Lab>;
}

export function PreprocessingLab() {
  const [strategy, setStrategy] = useState<"median" | "mean" | "zero">("median");
  const [held, setHeld] = useState(80);
  const [leak, setLeak] = useState(false);
  const train = [10, 20, null, 30, 40];
  const result = prepareColumn(train, [held, held + 10], strategy, leak);
  return <Lab id="ml0-preprocess" title="Fit on training rows. Transform everything else." question="Should moving a held-out value change a training statistic?" answer="No. A training-only imputer and scaler remain fixed when held-out inputs change. In the leaking mode, held-out information influences the imputation value or scaling statistics. Better-looking transformed values do not make that evaluation valid.">
    <p>A numeric training column contains 10, 20, missing, 30, and 40. Choose an imputation policy, then move the held-out measurements. Standardization uses the population standard deviation after imputation.</p>
    <Choices label="Missing-value policy" value={strategy} onChange={setStrategy} options={[{ value: "median", label: "Median" }, { value: "mean", label: "Mean" }, { value: "zero", label: "Zero" }]} />
    <Choices label="Rows used to fit preprocessing" value={leak ? "all" : "train"} onChange={value => setLeak(value === "all")} options={[{ value: "train", label: "Fit training rows only" }, { value: "all", label: "Include held-out rows: leakage" }]} />
    <Slider id="ml0-held" label="First held-out measurement" value={held} min={0} max={120} onChange={setHeld} />
    <p className="ml-lab-note">Held-out inputs: {held} and {held + 10}. {leak ? "Both now influence the fitted scaler. Compare the numbers with the correct mode." : "Neither supplies the imputer or scaler statistics."}</p>
    <Metrics items={[["Imputation value", format(result.fill)], ["Fitted mean", format(result.center)], ["Fitted standard deviation", format(result.deviation)]]} />
    <ScrollTable label="Training column before and after preprocessing"><table><thead><tr><th scope="col">Training row</th><th scope="col">Raw</th><th scope="col">Imputed</th><th scope="col">Standardized</th></tr></thead><tbody>{train.map((value, i) => <tr key={i}><th scope="row">{i + 1}</th><td>{value ?? "Missing"}</td><td>{format(result.imputed[i])}</td><td>{format(result.scaled[i])}</td></tr>)}</tbody></table></ScrollTable>
    <div className="ml-lab-formula">z = (imputed value − fitted mean) / fitted standard deviation</div>
  </Lab>;
}

export function EncodingLab() {
  const [category, setCategory] = useState("B");
  return <Lab id="ml0-encoding" title="A new category should not change the input shape." question="Does an all-zero vector mean the model understands category D?" answer="No. It only means D did not match the fitted vocabulary. Ignoring unknown categories avoids an encoding error; it does not learn their behavior. A missing category needs its own imputation policy before encoding.">
    <p>The encoder was fitted on machine models A, B, and C with no dropped column. Select a new row. This demonstrates OneHotEncoder with handle_unknown=&apos;ignore&apos;.</p>
    <Choices label="New machine model" value={category} onChange={setCategory} options={["A", "B", "C", "D"].map(value => ({ value, label: value === "D" ? "D · unseen" : value }))} />
    <div className="ml-encoding-vector" aria-live="polite">{["A", "B", "C"].map(value => <div key={value} className={category === value ? "is-active" : ""}><span>model_{value}</span><strong>{Number(category === value)}</strong></div>)}</div>
    <p className="ml-lab-note">Output width: always 3. {category === "D" ? "D produces three zeros because the training vocabulary stays fixed." : "Only model_" + category + " is active."}</p>
  </Lab>;
}

