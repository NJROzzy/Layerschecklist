export type Optimizer = "SGD" | "Momentum" | "RMSProp" | "Adam";
export const optimizers: Optimizer[] = ["SGD", "Momentum", "RMSProp", "Adam"];
export type State = { direction: number; square: number; step: number };
export const emptyState = (): State => ({ direction: 0, square: 0, step: 0 });
export const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
export const fmt = (value: number) => !Number.isFinite(value) ? "Non-finite" : Math.abs(value) >= 1e5 || (value !== 0 && Math.abs(value) < .0001) ? value.toExponential(2) : value.toFixed(4);
export const pixel = (value: number) => Number(value.toFixed(3));

export function optimizerStep(method: Optimizer, gradient: number, previous: State, rate: number) {
  const step = previous.step + 1;
  let direction = 0, square = 0, scaled = gradient;
  if (method === "Momentum") {
    direction = .9 * previous.direction + gradient;
    scaled = direction;
  } else if (method === "RMSProp") {
    square = .9 * previous.square + .1 * gradient ** 2;
    scaled = gradient / (Math.sqrt(square) + 1e-8);
  } else if (method === "Adam") {
    direction = .9 * previous.direction + .1 * gradient;
    square = .999 * previous.square + .001 * gradient ** 2;
    scaled = (direction / (1 - .9 ** step)) / (Math.sqrt(square / (1 - .999 ** step)) + 1e-8);
  }
  return { state: { direction, square, step }, scaled, delta: -rate * scaled };
}

export function fixedGradientTrace(method: Optimizer, gradients: number[], rate = .1) {
  let state = emptyState(), weight = 2;
  return gradients.map(gradient => {
    const result = optimizerStep(method, gradient, state, rate);
    state = result.state;
    weight += result.delta;
    return { gradient, weight, delta: result.delta, scaled: result.scaled, ...state };
  });
}

export function trajectory(method: Optimizer, rate: number, curvature: number, steps: number) {
  let x = 2, y = 1, sx = emptyState(), sy = emptyState();
  const history = [{ x, y, loss: .5 * (x * x + curvature * y * y) }];
  for (let i = 0; i < steps; i++) {
    const dx = optimizerStep(method, x, sx, rate);
    const dy = optimizerStep(method, curvature * y, sy, rate);
    x += dx.delta; y += dy.delta; sx = dx.state; sy = dy.state;
    history.push({ x, y, loss: .5 * (x * x + curvature * y * y) });
  }
  return history;
}

export function combinations(n: number, size: number): number[][] {
  const result: number[][] = [];
  function visit(start: number, current: number[]) {
    if (current.length === size) { result.push(current); return; }
    for (let i = start; i <= n - (size - current.length); i++) visit(i + 1, [...current, i]);
  }
  visit(0, []);
  return result;
}
export const targets = [-3, -1, 0, 2, 5, 9];
export function batchEvidence(weight: number, size: number) {
  const gradients = targets.map(target => weight - target);
  const batches = combinations(targets.length, size);
  const estimates = batches.map(batch => mean(batch.map(i => gradients[i])));
  const expected = mean(estimates);
  return { gradients, batches, estimates, full: mean(gradients), expected,
    deviation: Math.sqrt(mean(estimates.map(value => (value - expected) ** 2))) };
}

export function decayStep(weight: number, dataGradient: number, decay: number, rate = .1) {
  // L2 convention: L_total = L_data + (lambda / 2) * w^2.
  // A first Adam step with zero-initialized moments and bias correction.
  const coupledGradient = dataGradient + decay * weight;
  const coupled = weight - rate * coupledGradient / (Math.abs(coupledGradient) + 1e-8);
  const decoupled = (1 - rate * decay) * weight - rate * dataGradient / (Math.abs(dataGradient) + 1e-8);
  return { coupledGradient, coupled, decoupled };
}

export type Schedule = "Constant" | "Step" | "Exponential" | "Cosine" | "Warmup + cosine";
export const schedules: Schedule[] = ["Constant", "Step", "Exponential", "Cosine", "Warmup + cosine"];
export function learningRate(kind: Schedule, epoch: number, peak = .1) {
  if (kind === "Step") return peak * (epoch <= 20 ? 1 : epoch <= 30 ? .1 : .01);
  if (kind === "Exponential") return peak * .95 ** (epoch - 1);
  if (kind === "Cosine") return peak * .5 * (1 + Math.cos(Math.PI * (epoch - 1) / 39));
  if (kind === "Warmup + cosine") return epoch <= 5 ? peak * epoch / 5 : peak * .5 * (1 + Math.cos(Math.PI * (epoch - 5) / 35));
  return peak;
}

export const validation = [.90, .70, .56, .50, .48, .49, .50, .44, .42, .43, .44, .46, .49, .52, .55, .58];
export const training = validation.map((_, i) => .84 * Math.exp(-i / 4) + .025);
export function selectCheckpoint(patience: number) {
  let best = Infinity, bestEpoch = 0, wait = 0, end = 0;
  for (let i = 0; i < validation.length; i++) {
    end = i + 1;
    if (validation[i] < best) { best = validation[i]; bestEpoch = end; wait = 0; }
    else { wait++; if (wait >= patience) break; }
  }
  return { best, bestEpoch, end, wait, stopped: wait >= patience };
}

