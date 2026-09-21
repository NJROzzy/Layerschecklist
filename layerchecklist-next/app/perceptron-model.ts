/** The deterministic training model used by the homepage illustration. */
export const INPUTS = 4;
export const LEARNING_RATE = .12;
export const CYCLE_SECONDS = 2.6;
export const NODE_X = 214, NEURON_X = 600, OUT_X = 744, MID_Y = 350;
export const NODE_Y = [166, 288, 412, 534];
export const CURVE_X = (NODE_X + NEURON_X) / 2;
export type Sample = { x: number[]; y: number };
export type Run = { data: Sample[]; w: number[]; b: number; cursor: number; clean: number; updates: number };
export type Prediction = { sample: Sample; activation: number; output: number; error: number };
export const step = (value: number) => value >= 0 ? 1 : 0;
export const round = (value: number) => Number(value.toFixed(2));
export const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function makeRun(seed: number): Run {
  const random = seeded(seed), data: Sample[] = [], targetWeights = [.9, -.7, .5, -1.1];
  while (data.length < 14) {
    const x = Array.from({ length: INPUTS }, () => random() * 2 - 1);
    const margin = x.reduce((sum, value, i) => sum + value * targetWeights[i], .15);
    if (Math.abs(margin) >= .18) data.push({ x, y: step(margin) });
  }
  return { data, w: Array.from({ length: INPUTS }, () => random() * 1.6 - .8), b: random() * .6 - .3, cursor: 0, clean: 0, updates: 0 };
}
export function predict(run: Run): Prediction {
  const sample = run.data[run.cursor % run.data.length];
  const activation = sample.x.reduce((sum, value, i) => sum + value * run.w[i], run.b);
  const output = step(activation);
  return { sample, activation, output, error: sample.y - output };
}
/** The animation commits each displayed prediction exactly once. */
export function learn(run: Run, prediction: Prediction) {
  if (prediction.error) {
    for (let i = 0; i < INPUTS; i++) run.w[i] += LEARNING_RATE * prediction.error * prediction.sample.x[i];
    run.b += LEARNING_RATE * prediction.error;
    run.clean = 0;
    run.updates++;
  } else run.clean++;
  run.cursor++;
}
export const curve = (i: number) => `M ${NODE_X} ${NODE_Y[i]} C ${CURVE_X} ${NODE_Y[i]}, ${CURVE_X} ${MID_Y}, ${NEURON_X} ${MID_Y}`;
/** Match the cubic Bezier of the connection, also used in reverse for feedback. */
export function pointOnConnection(i: number, progress: number) {
  const t = clamp(progress), u = 1 - t;
  return {
    x: u ** 3 * NODE_X + 3 * u * u * t * CURVE_X + 3 * u * t * t * CURVE_X + t ** 3 * NEURON_X,
    y: u ** 3 * NODE_Y[i] + 3 * u * u * t * NODE_Y[i] + 3 * u * t * t * MID_Y + t ** 3 * MID_Y,
  };
}
