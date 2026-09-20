import { concepts, sectors, type SectorId } from "./universe";
export const CENTRE = 480;
export const RADII = [88, 164, 238, 313, 386];
export const HUES: Record<SectorId, number> = {
  number: 265, "number-theory": 249, algebra: 229, analysis: 208, geometry: 187,
  linear: 163, calculus: 144, dynamics: 115, probability: 78, statistics: 48,
  information: 28, optimization: 5, learning: 346, discrete: 323, foundations: 302, computation: 280,
};
export const round = (value: number) => Number(value.toFixed(2));
export function noise(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}
export function polar(radius: number, angle: number) {
  return { x: round(CENTRE + radius * Math.cos(angle)), y: round(CENTRE + radius * Math.sin(angle)) };
}
export const branchAngle = (index: number) => -Math.PI / 2 + (index + .5) * Math.PI * 2 / sectors.length;
export const positions = (() => {
  const placed = new Map<string, { x: number; y: number }>();
  const wedge = Math.PI * 2 / sectors.length;
  for (const concept of concepts) {
    const middle = branchAngle(sectors.findIndex(s => s.id === concept.sector));
    let best = polar(RADII[concept.ring], middle), bestGap = -1;
    // Deterministic candidate placement keeps crowded branches legible.
    for (let attempt = 0; attempt < 36; attempt++) {
      // Keep each level inside its own band: wide enough to scatter, narrow enough to read.
      const radius = RADII[concept.ring] + (noise(concept.id + attempt) - .5) * 34;
      const angle = middle + (noise(concept.id + "angle" + attempt) - .5) * wedge * .9;
      const candidate = polar(radius, angle);
      const gap = Math.min(...[...placed.values()].map(p => Math.hypot(candidate.x - p.x, candidate.y - p.y)), 50);
      if (gap > bestGap) { best = candidate; bestGap = gap; }
    }
    placed.set(concept.id, best);
  }
  return placed;
})();
export const trails = [
  { id: "training", label: "Train a network", description: "Follow the ideas from a vector to a loss, a gradient and an optimizer.", nodes: ["vector", "matmul", "composition", "softmax", "cross-entropy", "chain", "gradient", "sgd", "momentum", "adam", "adamw"] },
  { id: "uncertainty", label: "Reason with uncertainty", description: "Connect observations, probability, estimation and the evidence for generalization.", nodes: ["set", "event", "conditional", "bayes", "expectation", "variance", "estimator", "standard-error", "confidence", "empirical-risk", "pac"] },
  { id: "generative", label: "Explore generative models", description: "Visit distributions, information, latent variables and continuous-time dynamics.", nodes: ["distribution", "gaussian", "kl", "elbo", "jacobian", "change-variables", "stochastic-process", "brownian", "sde", "fokker-planck"] },
  { id: "reading", label: "Read a research paper", description: "The vocabulary a methods section assumes you already have.", nodes: ["quantifiers", "expectation", "variance", "norm", "matmul", "gradient", "convexity", "empirical-risk", "concentration", "pac"] },
  { id: "efficiency", label: "Make a model smaller", description: "Why compression, low-rank updates and reduced precision work at all.", nodes: ["array", "matrix", "rank", "eigen", "svd", "pca", "norm", "regularization", "precision", "stability"] },
  { id: "structure", label: "Discover structure", description: "See how connections and symmetry lead to spectral and geometric methods.", nodes: ["set", "graph", "matrix", "eigen", "graph-laplacian", "symmetry", "group", "representation", "manifold", "topology", "homology"] },
] as const;
