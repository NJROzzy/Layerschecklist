export const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
export const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));
export const px = (value: number) => Math.round(value * 100) / 100;
export const format = (value: number | null) => value === null ? "Undefined" : Math.abs(value) >= 1e5 || (value !== 0 && Math.abs(value) < 0.001) ? value.toExponential(2) : value.toFixed(3);

export function prepareColumn(train: (number | null)[], heldOut: number[], strategy: "median" | "mean" | "zero", leak: boolean) {
  const observed = train.filter((value): value is number => value !== null);
  const fittedRows = leak ? [...observed, ...heldOut] : observed;
  const sorted = [...fittedRows].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  const fill = strategy === "zero" ? 0 : strategy === "mean" ? mean(fittedRows) : median;
  const imputed = train.map(value => value ?? fill);
  const scalingRows = leak ? [...imputed, ...heldOut] : imputed;
  const center = mean(scalingRows);
  const deviation = Math.sqrt(mean(scalingRows.map(value => (value - center) ** 2)));
  return { fill, center, deviation, imputed, scaled: imputed.map(value => (value - center) / (deviation || 1)) };
}

export const classificationSamples = [
  { score: .05, label: 0 }, { score: .12, label: 0 }, { score: .18, label: 1 },
  { score: .23, label: 0 }, { score: .31, label: 0 }, { score: .39, label: 1 },
  { score: .44, label: 0 }, { score: .48, label: 1 }, { score: .54, label: 0 },
  { score: .61, label: 1 }, { score: .68, label: 1 }, { score: .73, label: 0 },
  { score: .79, label: 1 }, { score: .85, label: 1 }, { score: .92, label: 1 },
  { score: .97, label: 1 },
];

export function confusion(threshold: number) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (const { score, label } of classificationSamples) {
    if (score >= threshold) { if (label === 1) tp++; else fp++; }
    else { if (label === 1) fn++; else tn++; }
  }
  return { tp, fp, tn, fn, accuracy: (tp + tn) / classificationSamples.length,
    precision: tp + fp ? tp / (tp + fp) : null, recall: tp / (tp + fn),
    f1: 2 * tp / (2 * tp + fp + fn) };
}

export type Point = { x: number; y: number };
export const featureTrain: Point[] = Array.from({ length: 15 }, (_, i) => {
  const x = -2.8 + i * .4;
  return { x, y: .65 * x * x + .4 * x + .7 * Math.sin(i * 2.3) };
});
export const featureValidation: Point[] = Array.from({ length: 14 }, (_, i) => {
  const x = -2.6 + i * .4;
  return { x, y: .65 * x * x + .4 * x + .35 * Math.cos(i * 1.7) };
});

// A small, deterministic ridge fit for the one-dimensional teaching dataset.
// Powers are standardized using training rows; the intercept is unpenalized.
export function fitPolynomial(degree: number, alpha: number, data: Point[] = featureTrain) {
  const columns = Array.from({ length: degree }, (_, j) => data.map(p => (p.x / 3) ** (j + 1)));
  const centers = columns.map(mean);
  const scales = columns.map((column, j) => Math.sqrt(mean(column.map(value => (value - centers[j]) ** 2))) || 1);
  const features = (x: number) => [1, ...centers.map((center, j) => ((x / 3) ** (j + 1) - center) / scales[j])];
  const rows = data.map(p => features(p.x));
  const matrix = Array.from({ length: degree + 1 }, (_, i) => [
    ...Array.from({ length: degree + 1 }, (_, j) => rows.reduce((sum, row) => sum + row[i] * row[j], 0) + (i === j && i > 0 ? alpha : 0)),
    rows.reduce((sum, row, k) => sum + row[i] * data[k].y, 0),
  ]);
  for (let i = 0; i <= degree; i++) {
    let pivot = i;
    for (let j = i + 1; j <= degree; j++) if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivot][i])) pivot = j;
    [matrix[i], matrix[pivot]] = [matrix[pivot], matrix[i]];
    const divisor = matrix[i][i];
    if (Math.abs(divisor) < 1e-12) throw new Error("The feature matrix is singular.");
    for (let j = i; j <= degree + 1; j++) matrix[i][j] /= divisor;
    for (let row = 0; row <= degree; row++) {
      if (row === i) continue;
      const factor = matrix[row][i];
      for (let j = i; j <= degree + 1; j++) matrix[row][j] -= factor * matrix[i][j];
    }
  }
  const coefficients = matrix.map(row => row[degree + 1]);
  const predict = (x: number) => features(x).reduce((sum, value, i) => sum + value * coefficients[i], 0);
  const mae = (points: Point[]) => mean(points.map(p => Math.abs(predict(p.x) - p.y)));
  return { predict, coefficients, trainMAE: mae(data), validationMAE: mae(featureValidation) };
}

export function polynomialCount(inputs: number, degree: number) {
  let count = 1;
  for (let i = 1; i <= degree; i++) count = count * (inputs + i) / i;
  return Math.round(count) - 1; // Exclude the constant column.
}

export function gradientTrace(rate: number, steps: number) {
  let weight = 0;
  return Array.from({ length: steps + 1 }, (_, step) => {
    if (step > 0) weight -= rate * (2 * weight - 4) * 2;
    return { step, weight, loss: .5 * (2 * weight - 4) ** 2, gradient: (2 * weight - 4) * 2 };
  });
}

export const validationLosses = [.69, .60, .52, .45, .39, .35, .33, .34, .32, .33, .35, .37, .40, .43, .46, .49];
export const trainingLosses = validationLosses.map((_, i) => .65 * Math.exp(-i / 5) + .025);

export function earlyStop(losses: number[], patience: number, budget: number) {
  let best = Infinity, bestEpoch = 0, wait = 0, stopped = false, end = 0;
  for (let i = 0; i < Math.min(budget, losses.length); i++) {
    end = i + 1;
    if (losses[i] < best) { best = losses[i]; bestEpoch = end; wait = 0; }
    else { wait++; if (wait >= patience) { stopped = true; break; } }
  }
  return { best, bestEpoch, end, stopped, wait };
}

export function denseParameters(inputs: number, hidden: number[], outputs = 1) {
  const widths = [inputs, ...hidden, outputs];
  return widths.slice(1).map((width, i) => (widths[i] + 1) * width);
}

export const cyclicPoint = (hour: number) => ({ x: Math.sin((2 * Math.PI * hour) / 24), y: Math.cos((2 * Math.PI * hour) / 24) });
export function cyclicDistance(a: number, b: number) {
  const p = cyclicPoint(a), q = cyclicPoint(b);
  return Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);
}

export function binaryCrossEntropy(probability: number, label: number) {
  const clamped = Math.min(Math.max(probability, 1e-7), 1 - 1e-7);
  return -(label * Math.log(clamped) + (1 - label) * Math.log(1 - clamped));
}
