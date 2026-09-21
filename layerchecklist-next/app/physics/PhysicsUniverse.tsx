"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { branches, ideaById, ideas, levels, type BranchId, type Idea } from "./universe";
import { CENTRE, HUES, RADII, branchAngle, noise, polar, positions, round, routes } from "./universe-layout";

type Mode = "all" | "compute" | "world" | "life";
const tint = (branch: BranchId) => ({ "--h": HUES[branch] } as CSSProperties);
const chapterFor: Record<BranchId, string> = {
  mechanics: "conserved", waves: "fields", fluids: "scales", thermo: "chance",
  em: "fields", optics: "fields", relativity: "scales", quantum: "quantum",
  particle: "quantum", matter: "quantum", cosmos: "scales", methods: "method",
};

const links = ideas.flatMap(i => (i.needs ?? []).map(from => [from, i.id] as const));
const followers = (() => {
  const map = new Map<string, string[]>();
  for (const idea of ideas) for (const need of idea.needs ?? []) map.set(need, [...(map.get(need) ?? []), idea.id]);
  return map;
})();

const dust = Array.from({ length: 420 }, (_, i) => {
  const r = 40 + noise("r" + i) ** 0.6 * 400;
  return { ...polar(r, noise("a" + i) * Math.PI * 2), s: round(0.4 + noise("s" + i) * 1.2), o: round(0.06 + noise("o" + i) * 0.34) };
});
const computeCount = ideas.filter(i => i.compute).length;
const worldCount = ideas.filter(i => i.world).length;
const lifeCount = ideas.filter(i => i.life).length;

export default function PhysicsUniverse() {
  const [mode, setMode] = useState<Mode>("all");
  const [branch, setBranch] = useState<BranchId | null>(null);
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState("entropy");
  const [named, setNamed] = useState(true);
  const [rings, setRings] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const activeRoute = routes.find(r => r.id === route);
  const search = query.trim().toLowerCase();
  const matches = useMemo(() => ideas.filter(i =>
    (mode === "all" || Boolean(i[mode]))
    && (!branch || i.branch === branch)
    && (!activeRoute || (activeRoute.stops as readonly string[]).includes(i.id))
    && (!search || [i.id, i.name, i.what, i.compute, i.world, i.life?.detail].join(" ").toLowerCase().includes(search))
  ), [mode, branch, activeRoute, search]);
  const lit = new Set(matches.map(i => i.id));

  const chosen: Idea | undefined = matches.find(i => i.id === chosenId) ?? matches[0];
  const parents = chosen?.needs ?? [];
  const children = chosen ? followers.get(chosen.id) ?? [] : [];
  const near = new Set([...parents, ...children]);

  const clear = () => { setMode("all"); setBranch(null); setQuery(""); setRoute(null); };
  const pick = (id: string) => { if (!lit.has(id)) clear(); setChosenId(id); };

  // Route lines connect consecutive stops; otherwise draw the prerequisite web.
  const routeLine = activeRoute
    ? (activeRoute.stops as readonly string[]).map(id => { const p = positions.get(id)!; return `${p.x},${p.y}`; }).join(" ")
    : "";

  // Taking the first N in array order would label one wedge and ignore the rest,
  // so walk the branches round-robin, with the selected idea and its neighbours first.
  const labelled = ((): Idea[] => {
    if (!named) return [];
    if (matches.length <= 26) return matches;
    const priority = matches.filter(i => i.id === chosenId || near.has(i.id));
    const queues = branches.map(b => matches.filter(i => i.branch === b.id && !priority.includes(i)));
    const spread: Idea[] = [];
    for (let round = 0; spread.length < 18 && round < 40; round++) {
      for (const queue of queues) if (queue[round] && spread.length < 18) spread.push(queue[round]);
    }
    return [...priority, ...spread].slice(0, 18);
  })();
  // Reserve the centre title before placing any star labels.
  const taken: { x: number; y: number; w: number }[] = [{ x: 392, y: 475, w: 176 }, { x: 392, y: 493, w: 176 }];
  const labels = labelled.flatMap(idea => {
    const p = positions.get(idea.id)!;
    const w = Math.min(idea.name.length, 26) * 8.5 + 14;
    for (const dy of [-17, 21, -37, 41, -57]) {
      const x = Math.max(12, Math.min(948 - w, p.x + 12)), y = p.y + dy;
      if (taken.some(t => Math.abs(t.y - y) < 20 && x < t.x + t.w && x + w > t.x)) continue;
      taken.push({ x, y, w });
      return [{ idea, p, x, y, w }];
    }
    return [];
  });

  return <div className="pu">
    <div className="pu-controls">
      <div className="pu-modes" role="group" aria-label="What to highlight">
        {([["all", `Everything · ${ideas.length}`], ["life", `Leads into biology · ${lifeCount}`], ["compute", `Touches computing · ${computeCount}`], ["world", `You meet it daily · ${worldCount}`]] as [Mode, string][])
          .map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => { setMode(value); setRoute(null); }}>{label}</button>)}
      </div>
      <label className="pu-search" htmlFor="pu-search">Search the atlas
        <input id="pu-search" type="search" value={query} placeholder="entropy, diffusion, membranes…" onChange={e => setQuery(e.target.value)} />
      </label>
    </div>

    <div className="pu-routes" role="group" aria-label="Guided routes">
      <span className="phys-eyebrow">WALK A ROUTE</span>
      {routes.map(r => <button key={r.id} type="button" aria-pressed={route === r.id}
        onClick={() => { clear(); setRoute(route === r.id ? null : r.id); setChosenId(r.stops[0]); }}>{r.label}</button>)}
    </div>

    <div className="pu-legend" role="group" aria-label="Filter by branch">
      <button type="button" aria-pressed={branch === null} onClick={() => setBranch(null)}>All branches</button>
      {branches.map(b => <button key={b.id} type="button" style={tint(b.id)} aria-pressed={branch === b.id}
        onClick={() => { setBranch(branch === b.id ? null : b.id); setRoute(null); }}><i className="pu-dot" aria-hidden="true" />{b.short}</button>)}
    </div>

    <div className="pu-status">
      <p role="status">{matches.length} of {ideas.length} ideas lit{branch ? ` · ${branches.find(b => b.id === branch)?.label}` : ""}{search ? ` · “${query.trim()}”` : ""}</p>
      {(mode !== "all" || branch || query || route) && <button type="button" className="pu-clear" onClick={clear}>Clear</button>}
      <a className="pu-skip" href="#pu-detail">Skip to the selected idea ↓</a>
    </div>
    {activeRoute && <div className="pu-route-note">
      <p>{activeRoute.description}</p>
      <ol className="pu-route-stops" aria-label="Stops on the selected route">
        {activeRoute.stops.map((id, index) => <li key={id}><button type="button" aria-pressed={chosen?.id === id} onClick={() => pick(id)}><span>{index + 1}</span>{ideaById.get(id)!.name}</button></li>)}
      </ol>
    </div>}
    <p className="phys-note pu-help" id="pu-help">Choose a star to explore its connections. Use arrow keys on the map, follow a route, or browse the idea list below. Zoom in to read more closely and scroll around the map.</p>

    <div className="pu-observatory">
      <div className="pu-head"><div><span>THE PHYSICAL UNIVERSE</span><strong>{branches.length} branches. From matter to living systems.</strong></div><i className="pu-live" aria-hidden="true" /></div>
      <div className={"pu-stage" + (zoomed ? " is-zoomed" : "")} tabIndex={zoomed ? 0 : undefined} role="region" aria-label="Physics universe map" aria-describedby="pu-help">
        <svg viewBox="-70 -10 1100 980" aria-label={`A constellation of ${ideas.length} physics ideas, arranged by branch and approximate study level.`}>
          <defs>
            <radialGradient id="pu-space"><stop stopColor="#231630" /><stop offset=".55" stopColor="#120c1e" /><stop offset="1" stopColor="#08060f" /></radialGradient>
            <radialGradient id="pu-core"><stop stopColor="#ffd9a8" stopOpacity=".55" /><stop offset=".2" stopColor="#ff9d6e" stopOpacity=".14" /><stop offset="1" stopColor="#c46bff" stopOpacity="0" /></radialGradient>
            {branches.map(b => <radialGradient id={"pu-neb-" + b.id} key={b.id}>
              <stop stopColor={`hsl(${HUES[b.id]} 85% 62%)`} stopOpacity=".17" /><stop offset="1" stopColor={`hsl(${HUES[b.id]} 75% 42%)`} stopOpacity="0" />
            </radialGradient>)}
          </defs>
          <g aria-hidden="true" pointerEvents="none">
            <rect x="-70" y="-10" width="1100" height="980" fill="url(#pu-space)" />
            <circle cx={CENTRE} cy={CENTRE} r="428" className="pu-horizon" />
            {branches.map((b, i) => { const p = polar(272, branchAngle(i)); return <ellipse key={b.id} cx={p.x} cy={p.y} rx="178" ry="104"
              transform={`rotate(${round(branchAngle(i) * 180 / Math.PI)} ${p.x} ${p.y})`} fill={`url(#pu-neb-${b.id})`} />; })}
            {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} opacity={d.o} fill={i % 3 ? "#ffd2a8" : "#cfa8ff"} />)}
            <circle cx={CENTRE} cy={CENTRE} r="168" fill="url(#pu-core)" />
            {RADII.map((r, i) => <g key={r}>
              <circle cx={CENTRE} cy={CENTRE} r={r} className={"pu-ring" + (rings ? " is-strong" : "")} />
              {rings && <text x={CENTRE} y={round(CENTRE - r + 13)} className="pu-ring-label">{i}</text>}
            </g>)}
            {!activeRoute && links.filter(([a, b]) => lit.has(a) && lit.has(b)).map(([a, b]) => {
              const p = positions.get(a)!, q = positions.get(b)!;
              return <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="pu-web" />;
            })}
            {activeRoute && <polyline className="pu-route-line" points={routeLine} />}
            {chosen && [...near].map(id => {
              const p = positions.get(chosen.id)!, q = positions.get(id);
              if (!q) return null;
              return <line key={id} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={parents.includes(id) ? "pu-link is-up" : "pu-link is-down"} />;
            })}
            {branches.map((b, i) => { const p = polar(452, branchAngle(i)); return <text key={b.id} x={round(Math.max(58, Math.min(902, p.x)))} y={p.y}
              textAnchor="middle" dominantBaseline="middle" className="pu-branch-label" style={tint(b.id)}>{b.short.toUpperCase()}</text>; })}
          </g>

          {ideas.map(idea => {
            const p = positions.get(idea.id)!;
            const active = chosen?.id === idea.id;
            const on = lit.has(idea.id);
            return <g key={idea.id} role="button" tabIndex={on && active ? 0 : -1} aria-pressed={active} aria-controls="pu-detail"
              aria-label={`${idea.name}. ${branches.find(b => b.id === idea.branch)?.label}. ${levels[idea.ring]}.`}
              className={"pu-star" + (on ? "" : " is-off") + (active ? " is-active" : "") + (near.has(idea.id) ? " is-near" : "")}
              style={tint(idea.branch)} onClick={() => pick(idea.id)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(idea.id); }
                if (e.key.startsWith("Arrow")) {
                  e.preventDefault();
                  const at = matches.findIndex(m => m.id === idea.id);
                  const next = matches[(at + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + matches.length) % matches.length];
                  if (next) { setChosenId(next.id); document.getElementById("pu-star-" + next.id)?.focus(); }
                }
              }} id={"pu-star-" + idea.id}>
              <title>{idea.name}</title>
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
              <circle cx={p.x} cy={p.y} r={active ? 17 : idea.compute ? 9 : 6} className="pu-halo" />
              {active && <circle cx={p.x} cy={p.y} r="13" className="pu-active-ring" />}
              <circle cx={p.x} cy={p.y} r={active ? 5 : idea.ring === 0 ? 4 : 2.9} className="pu-core-dot" />
            </g>;
          })}

          <g aria-hidden="true" pointerEvents="none">
            {labels.map(({ idea, p, x, y, w }) => <g key={idea.id}>
              <line x1={p.x} y1={p.y} x2={round(x - 4)} y2={round(y - 4)} className="pu-leader" />
              <rect x={round(x - 5)} y={round(y - 14)} width={round(w)} height="20" rx="5" fill="#120c1ee0" />
              <text x={round(x)} y={round(y)} className={"pu-name" + (chosen?.id === idea.id ? " is-active" : "")}>{idea.name.length > 26 ? idea.name.slice(0, 25) + "…" : idea.name}</text>
            </g>)}
            <text x={CENTRE} y="475" textAnchor="middle" className="pu-core-title">PHYSICS</text>
            <text x={CENTRE} y="493" textAnchor="middle" className="pu-core-sub">one set of rules</text>
          </g>
        </svg>
      </div>
      <div className="pu-toolbar">
        <div>
          <button type="button" aria-pressed={named} onClick={() => setNamed(!named)}>{named ? `Names · ${labels.length}` : "Show names"}</button>
          <button type="button" aria-pressed={rings} onClick={() => setRings(!rings)}>Level rings</button>
          <button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>{zoomed ? "Fit whole universe" : "Zoom in"}</button>
        </div>
        <ol className="pu-levels" aria-label="What distance from the centre means">
          {levels.map((name, i) => <li key={name}><span>{i}</span>{name}</li>)}
        </ol>
      </div>
    </div>

    <div className="pu-detail" id="pu-detail" tabIndex={-1} aria-live="polite" aria-atomic="true">
      {chosen ? <>
        <span className="phys-eyebrow" style={tint(chosen.branch)}>{branches.find(b => b.id === chosen.branch)?.label} / {levels[chosen.ring]}</span>
        <h3>{chosen.name}</h3>
        <p>{chosen.what}</p>
        {chosen.world && <p className="pu-world"><strong>Where you meet it</strong> · {chosen.world}</p>}
        {chosen.compute && <p className="pu-compute"><strong>Where it touches computing</strong> · {chosen.compute}</p>}
        {chosen.life && <div className="pu-life"><p><strong>Where it leads into biology</strong> · {chosen.life.detail}</p><Link href={chosen.life.href}>Explore this in Biology →</Link></div>}
        <a className="pu-chapter-link" href={"#" + chapterFor[chosen.branch]}>Read the related Physics chapter ↓</a>
        <div className="pu-links">
          {([["Rests on", parents], ["Leads to", children]] as const).map(([title, list]) => <div key={title}>
            <span className="phys-eyebrow">{title}</span>
            <div>{list.length ? list.map(id => <button key={id} type="button" onClick={() => pick(id)}>{ideaById.get(id)!.name}</button>) : <em>nothing listed here</em>}</div>
          </div>)}
        </div>
      </> : <><p className="phys-note">No ideas match these filters.</p><button type="button" onClick={clear}>Show all ideas</button></>}
    </div>

    <details className="pu-index">
      <summary>Browse every idea · {matches.length} matching</summary>
      <div className="pu-index-body">
        {branches.map(b => { const group = matches.filter(i => i.branch === b.id); return group.length ? <section key={b.id} style={tint(b.id)}>
          <h4><i className="pu-dot" aria-hidden="true" /><span>{b.label}</span><em>{group.length}</em></h4>
          <ul>{group.map(i => <li key={i.id}><button type="button" className={i.compute ? "is-compute" : ""} aria-pressed={chosen?.id === i.id} onClick={() => pick(i.id)}>{i.name}</button></li>)}</ul>
        </section> : null; })}
      </div>
    </details>
  </div>;
}
