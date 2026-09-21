import { branches, ideas, type BranchId } from "./universe";

export const CENTRE = 480;
export const RADII = [92, 168, 244, 318, 390];

/** A warm, plasma-leaning wheel, so physics reads as a sibling of the maths atlas rather than a copy. */
export const HUES: Record<BranchId, number> = {
  mechanics: 22, waves: 44, fluids: 172, thermo: 8, em: 268, optics: 62,
  relativity: 214, quantum: 288, particle: 330, matter: 140, cosmos: 240, methods: 194,
};

export const round = (value: number) => Number(value.toFixed(2));

export function noise(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

export const polar = (radius: number, angle: number) => ({
  x: round(CENTRE + radius * Math.cos(angle)),
  y: round(CENTRE + radius * Math.sin(angle)),
});

export const branchAngle = (index: number) => -Math.PI / 2 + (index + 0.5) * Math.PI * 2 / branches.length;

/**
 * Deterministic placement. Each idea stays inside its own level band — the radius
 * is the one measurement this picture makes, so it must survive the scatter — and
 * within the band we pick the candidate furthest from everything already placed.
 */
export const positions = (() => {
  const placed = new Map<string, { x: number; y: number }>();
  const wedge = Math.PI * 2 / branches.length;
  for (const idea of ideas) {
    const middle = branchAngle(branches.findIndex(b => b.id === idea.branch));
    let best = polar(RADII[idea.ring], middle), bestGap = -1;
    for (let attempt = 0; attempt < 34; attempt++) {
      const radius = RADII[idea.ring] + (noise(idea.id + attempt) - 0.5) * 32;
      const angle = middle + (noise(idea.id + "a" + attempt) - 0.5) * wedge * 0.88;
      const candidate = polar(radius, angle);
      const gap = Math.min(...[...placed.values()].map(p => Math.hypot(candidate.x - p.x, candidate.y - p.y)), 60);
      if (gap > bestGap) { best = candidate; bestGap = gap; }
    }
    placed.set(idea.id, best);
  }
  return placed;
})();

/** Routes worth walking, rather than a list to memorise. */
export const routes = [
  { id: "conserve", label: "Follow a conservation law", description: "From a symmetry nobody chose to the quantity it protects.", stops: ["position", "velocity", "newton", "momentum", "energy", "lagrangian", "noether", "symmetry-p"] },
  { id: "heat", label: "Why time has a direction", description: "Temperature to entropy to the one law that is not reversible.", stops: ["hot-cold", "temperature", "heat", "first-law", "entropy", "second-law", "boltzmann", "maxwell-demon"] },
  { id: "light", label: "What light turned out to be", description: "A wave, then a field, then a particle, and the trouble that caused.", stops: ["light-shadow", "wave", "interference", "maxwell", "em-wave", "photon", "wave-particle", "wavefunction"] },
  { id: "ai-bridge", label: "Where physics meets machine learning", description: "The places the two subjects share an equation rather than a metaphor.", stops: ["entropy", "boltzmann", "partition", "free-energy", "ising", "spin-glass", "langevin", "stochastic-p", "ml-physics"] },
  { id: "scale", label: "From the tabletop to the cosmos", description: "The same laws, applied across thirty orders of magnitude.", stops: ["newton", "gravitation", "orbits", "stars", "general-rel", "black-hole", "expansion", "dark-energy"] },
  { id: "living", label: "From physics to living systems", description: "Follow thermal motion into transport, then connect cellular work and ion gradients to the Biology course.", stops: ["temperature", "brownian", "diffusion", "osmosis", "free-energy", "molecular-motors", "electrochemical", "noneq"] },
] as const;
