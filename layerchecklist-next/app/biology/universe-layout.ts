import { branches, ideas, type BranchId } from "./universe";

export const CENTRE = 480;
export const RADII = [92, 168, 244, 318, 390];

/** A green and blue palette for the biology atlas. */
export const HUES: Record<BranchId, number> = {
  molecules: 150, cell: 172, genes: 194, central: 215, development: 255, evolution: 290,
  physiology: 325, neuro: 20, immune: 45, ecology: 80, medicine: 112, methods: 135,
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

/** Routes connect study stops rather than claiming a causal chain. */
export const routes = [
  { id: "cell", label: "Build a living cell", description: "From chemistry to boundaries, energy and communication.", stops: ["water", "carbon", "macromolecule", "protein", "lipid", "membrane", "transport", "atp", "signalling"] },
  { id: "inherit", label: "Follow information", description: "Connect a sequence with expression, variation and inheritance.", stops: ["dna", "gene", "rna", "transcription", "translation", "protein", "mutation", "allele", "natural-selection"] },
  { id: "ecosystem", label: "Zoom out to ecosystems", description: "Move from organisms to populations and interacting communities.", stops: ["cell-theory", "organ-systems", "homeostasis", "behaviour", "population", "predator-prey", "ecosystem", "biodiversity"] },
  { id: "compute", label: "Where biology meets computing", description: "Visit real analysis and prediction tasks, alongside the experiments that check them.", stops: ["experiment-bio", "stats-bio", "sequencing", "alignment-bio", "bioinformatics", "structure-bio", "single-cell", "ml-biology"] },
] as const;
