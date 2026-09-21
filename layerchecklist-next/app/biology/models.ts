/** Equal, fixed-volume compartments with passive exchange and no sources. */
export function diffusion(initialA: number, rate: number, time: number) {
  const mean = 10;
  const a = mean + (initialA - mean) * Math.exp(-2 * rate * time);
  return { a, b: 20 - a };
}
/** Two alleles in the Hardy–Weinberg random-mating baseline. */
export function genotypeFrequencies(p: number) {
  const q = 1 - p;
  return { aa: p * p, ab: 2 * p * q, bb: q * q };
}
/** Continuous logistic growth with fixed r, K and positive N0. */
export function logistic(n0: number, rate: number, capacity: number, time: number) {
  return capacity / (1 + (capacity / n0 - 1) * Math.exp(-rate * time));
}
