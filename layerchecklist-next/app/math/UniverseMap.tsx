"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { at } from "./Lab";
import { concepts, conceptById, ringNames, sectors, type Concept, type SectorId } from "./universe";

const CENTRE = 480;
const SIZE = 960;
const RING_RADIUS = [66, 148, 230, 312, 394];
const NAME_COLUMN = 452;   // where the two label columns sit

/** A hue per branch, spaced around the wheel and skipping the unreadable yellows. */
const HUES: Record<SectorId, number> = {
  number: 265, algebra: 230, analysis: 200, geometry: 175, linear: 150, calculus: 120,
  probability: 85, statistics: 45, information: 25, optimization: 355, discrete: 325, computation: 295,
};

/** Deterministic 0–1 from a string, so the server and the browser place every dot identically. */
function jitter(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/**
 * Concepts sharing a branch and a depth are spread evenly along their arc, then
 * nudged, so the map reads as a scatter rather than a grid but never moves.
 */
const positions = (() => {
  const wedge = (Math.PI * 2) / sectors.length;
  const placed = new Map<string, { x: number; y: number; angle: number }>();

  sectors.forEach((sector, sectorIndex) => {
    const start = -Math.PI / 2 + sectorIndex * wedge;
    for (let ring = 0; ring <= 4; ring++) {
      const group = concepts.filter(c => c.sector === sector.id && c.ring === ring);
      group.forEach((concept, i) => {
        const pad = wedge * 0.1;
        const usable = wedge - pad * 2;
        const slot = group.length === 1 ? 0.5 : (i + 0.5) / group.length;
        const wobble = (jitter(concept.id + "a") - 0.5) * (usable / group.length) * 0.55;
        const angle = start + pad + slot * usable + wobble;
        const radius = RING_RADIUS[ring] + (jitter(concept.id) - 0.5) * 44;
        placed.set(concept.id, { x: at(CENTRE + Math.cos(angle) * radius), y: at(CENTRE + Math.sin(angle) * radius), angle });
      });
    }
  });
  return placed;
})();

const dependents = (() => {
  const map = new Map<string, string[]>();
  for (const concept of concepts) {
    for (const need of concept.needs ?? []) {
      map.set(need, [...(map.get(need) ?? []), concept.id]);
    }
  }
  return map;
})();

/** Edges where both ends are ideas AI leans on — the constellation inside the universe. */
const aiEdges = concepts.flatMap(concept =>
  concept.ai ? (concept.needs ?? []).filter(need => conceptById.get(need)?.ai).map(need => [need, concept.id] as const) : []);

type Mode = "all" | "ai" | "taught";

export default function UniverseMap() {
  const [mode, setMode] = useState<Mode>("all");
  const [sector, setSector] = useState<SectorId | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("gradient");
  const [labels, setLabels] = useState(false);

  const search = query.trim().toLowerCase();
  const matches = useMemo(() => new Set(concepts.filter(concept =>
    (mode === "all" || (mode === "ai" ? Boolean(concept.ai) : Boolean(concept.taught)))
    && (!sector || concept.sector === sector)
    && (!search || (concept.name + " " + concept.what + " " + (concept.ai ?? "") + " " + (concept.world ?? "")).toLowerCase().includes(search))
  ).map(concept => concept.id)), [mode, sector, search]);

  const chosen = selected ? conceptById.get(selected) ?? null : null;
  const related = chosen ? new Set([...(chosen.needs ?? []), ...(dependents.get(chosen.id) ?? [])]) : new Set<string>();

  /**
   * Names would pile on top of each other where dots cluster, so each side of the
   * circle gets a greedy vertical spread: sort by height, push anything closer
   * than a line apart, then pull the column back inside the band if it overran.
   * When more names are showing than a square canvas can hold, the canvas grows
   * rather than letting labels spill off the top — a leader line joins each one
   * to its dot.
   */
  const GAP = 23;
  const sideCounts = [-1, 1].map(side =>
    concepts.filter(concept => matches.has(concept.id) && (positions.get(concept.id)!.x < CENTRE ? -1 : 1) === side).length);
  const needed = Math.max(...sideCounts) * GAP + 60;
  const viewHeight = labels ? Math.max(SIZE + 20, needed) : SIZE + 20;
  const viewTop = at(CENTRE - viewHeight / 2);

  const nameLayout = useMemo(() => {
    if (!labels) return [];
    const top = viewTop + 24, bottom = viewTop + viewHeight - 24;
    const rows = concepts.filter(concept => matches.has(concept.id)).map(concept => {
      const dot = positions.get(concept.id)!;
      return { concept, dot, side: dot.x < CENTRE ? -1 : 1, y: dot.y };
    });
    const out: typeof rows = [];
    for (const side of [-1, 1]) {
      const column = rows.filter(row => row.side === side).sort((a, b) => a.y - b.y);
      if (column.length) column[0].y = Math.max(column[0].y, top);
      for (let i = 1; i < column.length; i++) {
        if (column[i].y < column[i - 1].y + GAP) column[i].y = column[i - 1].y + GAP;
      }
      const overrun = column.length ? column[column.length - 1].y - bottom : 0;
      if (overrun > 0) {
        for (const row of column) row.y -= overrun;
        for (let i = column.length - 2; i >= 0; i--) {
          if (column[i].y > column[i + 1].y - GAP) column[i].y = column[i + 1].y - GAP;
        }
      }
      out.push(...column);
    }
    return out;
  }, [labels, matches, viewTop, viewHeight]);

  const dotRadius = (concept: Concept) => at(4.4 + (concept.ai ? 1.7 : 0) + (concept.ring === 0 ? 1.2 : 0));
  const classOf = (concept: Concept) => {
    const parts = ["um-dot"];
    if (concept.ai) parts.push("is-ai");
    if (concept.taught) parts.push("is-taught");
    if (!matches.has(concept.id)) parts.push("is-dim");
    if (chosen?.id === concept.id) parts.push("is-selected");
    else if (related.has(concept.id)) parts.push("is-related");
    return parts.join(" ");
  };

  return <div className="universe">
    <div className="um-controls">
      <div className="math-choice-row" role="group" aria-label="What to highlight">
        {([["all", `Everything · ${concepts.length}`], ["ai", `Used by AI · ${concepts.filter(c => c.ai).length}`], ["taught", `Taught here · ${concepts.filter(c => c.taught).length}`]] as [Mode, string][])
          .map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}
      </div>
      <div className="um-controls-right">
        <button type="button" className="um-labels-toggle" aria-pressed={labels} onClick={() => setLabels(!labels)}>
          {labels ? "Hide names" : "Show every name"}
        </button>
        <label className="math-select um-search" htmlFor="um-search">Search the universe
          <input id="um-search" type="search" value={query} placeholder="entropy, eigen, curvature…" onChange={event => setQuery(event.target.value)} />
        </label>
      </div>
    </div>

    <div className="um-legend" role="group" aria-label="Filter by branch">
      <button type="button" aria-pressed={sector === null} className="um-legend-all" onClick={() => setSector(null)}>All branches</button>
      {sectors.map(item => <button key={item.id} type="button" aria-pressed={sector === item.id}
        style={{ "--h": HUES[item.id] } as CSSProperties} onClick={() => setSector(sector === item.id ? null : item.id)}>
        <span className="um-swatch" aria-hidden="true" />{item.short}
      </button>)}
    </div>

    <p className="math-note um-count" role="status">{matches.size} of {concepts.length} ideas lit{sector ? ` · ${sectors.find(s => s.id === sector)?.label}` : ""}{search ? ` · matching “${query.trim()}”` : ""}</p>

    <a className="um-skip" href="#um-detail">Skip the map</a>

    <div className="um-stage">
      <svg viewBox={labels ? `-300 ${viewTop} 1560 ${viewHeight}` : `-110 -10 1180 ${viewHeight}`} aria-label={`A circle representing the universe of mathematics, with ${concepts.length} ideas plotted by branch and depth. ${concepts.filter(c => c.ai).length} of them are used by AI.`}>
        <circle className="um-void" cx={CENTRE} cy={CENTRE} r={430} />
        {RING_RADIUS.map((radius, i) => <circle key={radius} className="um-ring" cx={CENTRE} cy={CENTRE} r={at(radius + 40)} data-ring={i} />)}

        {sectors.map((item, i) => {
          const angle = -Math.PI / 2 + i * (Math.PI * 2 / sectors.length);
          const mid = angle + Math.PI / sectors.length;
          const lx = at(CENTRE + Math.cos(mid) * 452);
          const ly = at(CENTRE + Math.sin(mid) * 452);
          return <g key={item.id} style={{ "--h": HUES[item.id] } as CSSProperties}>
            <line className="um-spoke" x1={CENTRE} y1={CENTRE} x2={at(CENTRE + Math.cos(angle) * 430)} y2={at(CENTRE + Math.sin(angle) * 430)} />
            {!labels && <text className="um-sector-label" x={lx} y={ly} textAnchor={Math.cos(mid) > 0.25 ? "start" : Math.cos(mid) < -0.25 ? "end" : "middle"} dominantBaseline="middle">{item.short}</text>}
          </g>;
        })}

        {/* The constellation: every dependency between two ideas AI depends on. */}
        {mode === "ai" && aiEdges.map(([from, to]) => {
          const a = positions.get(from)!, b = positions.get(to)!;
          return <line key={from + to} className="um-constellation" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}

        {/* Lines from the selected idea to what it needs and what needs it. */}
        {chosen && [...related].map(other => {
          const a = positions.get(chosen.id)!, b = positions.get(other);
          if (!b) return null;
          return <line key={other} className="um-link" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}

        {concepts.map(concept => {
          const p = positions.get(concept.id)!;
          return <circle key={concept.id} className={classOf(concept)} cx={p.x} cy={p.y} r={dotRadius(concept)}
            style={{ "--h": HUES[concept.sector] } as CSSProperties}
            role="button" tabIndex={matches.has(concept.id) ? 0 : -1}
            aria-label={`${concept.name}. ${sectors.find(s => s.id === concept.sector)?.label}. ${ringNames[concept.ring]}.`}
            aria-pressed={chosen?.id === concept.id}
            onClick={() => setSelected(concept.id)}
            onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(concept.id); } }}>
            <title>{concept.name}</title>
          </circle>;
        })}

        {nameLayout.map(({ concept, dot, side, y }) => {
          const x = at(CENTRE + side * NAME_COLUMN);
          return <g key={concept.id}>
            <line className="um-leader" x1={at(dot.x + side * (dotRadius(concept) + 2))} y1={dot.y} x2={at(x - side * 5)} y2={at(y)} />
            <text className={"um-name" + (chosen?.id === concept.id ? " is-selected" : "")}
              x={x} y={at(y + 4)} textAnchor={side < 0 ? "end" : "start"}>{concept.name}</text>
          </g>;
        })}
        <text className="um-centre-label" x={CENTRE} y={CENTRE - 4} textAnchor="middle">the</text>
        <text className="um-centre-label is-big" x={CENTRE} y={CENTRE + 18} textAnchor="middle">universe</text>
      </svg>

      <ol className="um-rings-key" aria-label="What distance from the centre means">
        {ringNames.map((name, i) => <li key={name}><span>{i}</span>{name}</li>)}
      </ol>
    </div>

    <details className="um-index" open>
      <summary>Every idea, listed · {concepts.length}</summary>
      <div className="um-index-body">
        {sectors.map(item => {
          const group = concepts.filter(concept => concept.sector === item.id);
          return <section key={item.id} style={{ "--h": HUES[item.id] } as CSSProperties}>
            <h5><span className="um-swatch" aria-hidden="true" /><span className="um-index-name">{item.label}</span><em>{group.length}</em></h5>
            <ul>{group.map(concept => <li key={concept.id}>
              <button type="button" className={(concept.ai ? "is-ai " : "") + (chosen?.id === concept.id ? "is-selected" : "")}
                onClick={() => setSelected(concept.id)}>{concept.name}</button>
            </li>)}</ul>
          </section>;
        })}
      </div>
      <p className="math-note">Bold names are the ones AI leans on. Pick any to light it up on the map above.</p>
    </details>

    <div className="um-detail" id="um-detail" aria-live="polite" aria-atomic="true">
      {chosen ? <>
        <div className="um-detail-head" style={{ "--h": HUES[chosen.sector] } as CSSProperties}>
          <span className="um-swatch" aria-hidden="true" />
          <span className="math-eyebrow">{sectors.find(s => s.id === chosen.sector)?.label} · {ringNames[chosen.ring]}</span>
        </div>
        <h4>{chosen.name}{chosen.taught && <em className="um-flag">taught in this guide</em>}</h4>
        <p>{chosen.what}</p>
        {chosen.ai && <p className="um-ai"><strong>In AI:</strong> {chosen.ai}</p>}
        {chosen.world && <p className="um-world"><strong>In the world:</strong> {chosen.world}</p>}
        {!chosen.ai && <p className="math-note">No direct role in how today&apos;s AI is built — which most of this circle shares.</p>}
        {(chosen.needs?.length ?? 0) > 0 && <div className="um-links"><span className="math-eyebrow">BUILT ON</span>
          <div>{chosen.needs!.map(id => <button key={id} type="button" onClick={() => setSelected(id)}>{conceptById.get(id)?.name}</button>)}</div></div>}
        {(dependents.get(chosen.id)?.length ?? 0) > 0 && <div className="um-links"><span className="math-eyebrow">LEADS TO</span>
          <div>{dependents.get(chosen.id)!.map(id => <button key={id} type="button" onClick={() => setSelected(id)}>{conceptById.get(id)?.name}</button>)}</div></div>}
      </> : <p className="math-note">Pick any dot to see what it is, what it rests on, and whether AI uses it.</p>}
    </div>
  </div>;
}
