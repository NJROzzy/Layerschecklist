"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { branches, ideaById, ideas, levels, type BranchId, type Idea } from "./universe";
import { CENTRE, HUES, RADII, branchAngle, noise, polar, positions, round, routes } from "./universe-layout";

const chapterForBranch: Record<BranchId, string> = {
  molecules: "#energy", cell: "#cells", genes: "#genes", central: "#genes", development: "#systems", evolution: "#evolution", physiology: "#systems", neuro: "#systems", immune: "#systems", ecology: "#ecology", medicine: "#computing", methods: "#computing",
};

type Mode = "all" | "compute" | "world";
const tint = (branch: BranchId) => ({ "--h": HUES[branch] } as CSSProperties);

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

export default function BiologyUniverse() {
  const [mode, setMode] = useState<Mode>("all");
  const [branch, setBranch] = useState<BranchId | null>(null);
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState("cell-theory");
  const [named, setNamed] = useState(true);
  const [rings, setRings] = useState(false);

  const activeRoute = routes.find(r => r.id === route);
  const search = query.trim().toLowerCase();
  const matches = useMemo(() => ideas.filter(i =>
    (mode === "all" || (mode === "compute" ? Boolean(i.compute) : Boolean(i.world)))
    && (!branch || i.branch === branch)
    && (!activeRoute || (activeRoute.stops as readonly string[]).includes(i.id))
    && (!search || [i.name, i.what, i.compute, i.world].join(" ").toLowerCase().includes(search))
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
  // Reserve the central title so nearby concept labels do not cover it.
  const taken: { x: number; y: number; w: number }[] = [{ x: 400, y: 477, w: 160 }, { x: 400, y: 495, w: 160 }];
  const labels = labelled.flatMap(idea => {
    const p = positions.get(idea.id)!;
    const w = Math.min(idea.name.length, 26) * 6.6 + 14;
    for (const dy of [-17, 21, -37, 41, -57]) {
      const x = Math.max(12, Math.min(948 - w, p.x + 12)), y = p.y + dy;
      if (taken.some(t => Math.abs(t.y - y) < 20 && x < t.x + t.w && x + w > t.x)) continue;
      taken.push({ x, y, w });
      return [{ idea, p, x, y, w }];
    }
    return [];
  });

  return <div className="bu">
    <div className="bu-controls">
      <div className="bu-modes" role="group" aria-label="What to highlight">
        {([["all", `Everything · ${ideas.length}`], ["compute", `Touches computing · ${computeCount}`], ["world", `You meet it daily · ${worldCount}`]] as [Mode, string][])
          .map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => { setMode(value); setRoute(null); }}>{label}</button>)}
      </div>
      <label className="bu-search" htmlFor="bu-search">Search the atlas
        <input id="bu-search" type="search" value={query} placeholder="DNA, evolution, neurons…" onChange={e => setQuery(e.target.value)} />
      </label>
    </div>

    <div className="bu-routes" role="group" aria-label="Guided routes">
      <span className="bio-eyebrow">WALK A ROUTE</span>
      {routes.map(r => <button key={r.id} type="button" aria-pressed={route === r.id}
        onClick={() => { clear(); setRoute(route === r.id ? null : r.id); setChosenId(r.stops[0]); }}>{r.label}</button>)}
    </div>

    <div className="bu-legend" role="group" aria-label="Filter by branch">
      <button type="button" aria-pressed={branch === null} onClick={() => setBranch(null)}>All branches</button>
      {branches.map(b => <button key={b.id} type="button" style={tint(b.id)} aria-pressed={branch === b.id}
        onClick={() => { setBranch(branch === b.id ? null : b.id); setRoute(null); }}><i className="bu-dot" aria-hidden="true" />{b.short}</button>)}
    </div>

    <div className="bu-status">
      <p role="status">{matches.length} of {ideas.length} ideas lit{branch ? ` · ${branches.find(b => b.id === branch)?.label}` : ""}{search ? ` · “${query.trim()}”` : ""}</p>
      {(mode !== "all" || branch || query || route) && <button type="button" className="bu-clear" onClick={clear}>Clear</button>}
      <a className="bu-skip" href="#bu-detail">Skip to the selected idea ↓</a>
    </div>
    {activeRoute && <p className="bu-route-note">{activeRoute.description} The route line joins suggested stops; it is not a claim that one idea causes the next.</p>}

    <div className="bu-observatory">
      <div className="bu-head"><div><span>THE LIVING WORLD</span><strong>{branches.length} branches. Life at every scale.</strong></div><i className="bu-live" aria-hidden="true" /></div>
      <div className="bu-stage">
        <svg viewBox="-70 -10 1100 980" aria-label={`A circle of ${ideas.length} biology ideas, arranged by branch and approximate study level.`}>
          <defs>
            <radialGradient id="bu-space"><stop stopColor="#12362d" /><stop offset=".55" stopColor="#0a1e1b" /><stop offset="1" stopColor="#050f11" /></radialGradient>
            <radialGradient id="bu-core"><stop stopColor="#d4f9b1" stopOpacity=".55" /><stop offset=".2" stopColor="#75dfb4" stopOpacity=".14" /><stop offset="1" stopColor="#61bbc4" stopOpacity="0" /></radialGradient>
            {branches.map(b => <radialGradient id={"bu-neb-" + b.id} key={b.id}>
              <stop stopColor={`hsl(${HUES[b.id]} 85% 62%)`} stopOpacity=".17" /><stop offset="1" stopColor={`hsl(${HUES[b.id]} 75% 42%)`} stopOpacity="0" />
            </radialGradient>)}
          </defs>
          <g aria-hidden="true" pointerEvents="none">
            <rect x="-290" y="-10" width="1540" height="980" fill="url(#bu-space)" />
            <circle cx={CENTRE} cy={CENTRE} r="428" className="bu-horizon" />
            {branches.map((b, i) => { const p = polar(272, branchAngle(i)); return <ellipse key={b.id} cx={p.x} cy={p.y} rx="178" ry="104"
              transform={`rotate(${round(branchAngle(i) * 180 / Math.PI)} ${p.x} ${p.y})`} fill={`url(#bu-neb-${b.id})`} />; })}
            {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} opacity={d.o} fill={i % 3 ? "#cdf5ca" : "#8bd6de"} />)}
            <circle cx={CENTRE} cy={CENTRE} r="168" fill="url(#bu-core)" />
            {RADII.map((r, i) => <g key={r}>
              <circle cx={CENTRE} cy={CENTRE} r={r} className={"bu-ring" + (rings ? " is-strong" : "")} />
              {rings && <text x={CENTRE} y={round(CENTRE - r + 13)} className="bu-ring-label">{i}</text>}
            </g>)}
            {!activeRoute && links.filter(([a, b]) => lit.has(a) && lit.has(b)).map(([a, b]) => {
              const p = positions.get(a)!, q = positions.get(b)!;
              return <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="bu-web" />;
            })}
            {activeRoute && <polyline className="bu-route-line" points={routeLine} />}
            {chosen && [...near].map(id => {
              const p = positions.get(chosen.id)!, q = positions.get(id);
              if (!q) return null;
              return <line key={id} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className={parents.includes(id) ? "bu-link is-up" : "bu-link is-down"} />;
            })}
            {branches.map((b, i) => { const p = polar(452, branchAngle(i)); return <text key={b.id} x={round(Math.max(58, Math.min(902, p.x)))} y={p.y}
              textAnchor="middle" dominantBaseline="middle" className="bu-branch-label" style={tint(b.id)}>{b.short.toUpperCase()}</text>; })}
          </g>

          {ideas.map(idea => {
            const p = positions.get(idea.id)!;
            const active = chosen?.id === idea.id;
            const on = lit.has(idea.id);
            return <g key={idea.id} role="button" tabIndex={on && active ? 0 : -1} aria-pressed={active} aria-controls="bu-detail"
              aria-label={`${idea.name}. ${branches.find(b => b.id === idea.branch)?.label}. ${levels[idea.ring]}.`}
              className={"bu-star" + (on ? "" : " is-off") + (active ? " is-active" : "") + (near.has(idea.id) ? " is-near" : "")}
              style={tint(idea.branch)} onClick={() => pick(idea.id)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(idea.id); }
                if (e.key.startsWith("Arrow")) {
                  e.preventDefault();
                  const at = matches.findIndex(m => m.id === idea.id);
                  const next = matches[(at + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + matches.length) % matches.length];
                  if (next) { setChosenId(next.id); document.getElementById("bu-star-" + next.id)?.focus(); }
                }
              }} id={"bu-star-" + idea.id}>
              <title>{idea.name}</title>
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
              <circle cx={p.x} cy={p.y} r={active ? 17 : idea.compute ? 9 : 6} className="bu-halo" />
              {active && <circle cx={p.x} cy={p.y} r="13" className="bu-active-ring" />}
              <circle cx={p.x} cy={p.y} r={active ? 5 : idea.ring === 0 ? 4 : 2.9} className="bu-core-dot" />
            </g>;
          })}

          <g aria-hidden="true" pointerEvents="none">
            {labels.map(({ idea, p, x, y, w }) => <g key={idea.id}>
              <line x1={p.x} y1={p.y} x2={round(x - 4)} y2={round(y - 4)} className="bu-leader" />
              <rect x={round(x - 5)} y={round(y - 14)} width={round(w)} height="20" rx="5" fill="#0a1e1be0" />
              <text x={round(x)} y={round(y)} className={"bu-name" + (chosen?.id === idea.id ? " is-active" : "")}>{idea.name.length > 26 ? idea.name.slice(0, 25) + "…" : idea.name}</text>
            </g>)}
            <text x={CENTRE} y="475" textAnchor="middle" className="bu-core-title">BIOLOGY</text>
            <text x={CENTRE} y="493" textAnchor="middle" className="bu-core-sub">life in context</text>
          </g>
        </svg>
      </div>
      <div className="bu-toolbar">
        <div>
          <button type="button" aria-pressed={named} onClick={() => setNamed(!named)}>{named ? `Names · ${labels.length}` : "Show names"}</button>
          <button type="button" aria-pressed={rings} onClick={() => setRings(!rings)}>Level rings</button>
        </div>
        <ol className="bu-levels" aria-label="What distance from the centre means">
          {levels.map((name, i) => <li key={name}><span>{i}</span>{name}</li>)}
        </ol>
      </div>
    </div>

    <div className="bu-detail" id="bu-detail" tabIndex={-1} aria-live="polite" aria-atomic="true">
      {chosen ? <>
        <span className="bio-eyebrow" style={tint(chosen.branch)}>{branches.find(b => b.id === chosen.branch)?.label} / {levels[chosen.ring]}</span>
        <h3>{chosen.name}</h3>
        <p>{chosen.what}</p>
        {chosen.world && <p className="bu-world"><strong>Where you meet it</strong> · {chosen.world}</p>}
        {chosen.compute && <p className="bu-compute"><strong>Where it touches computing</strong> · {chosen.compute}</p>}
        {!chosen.compute && <p className="bio-note">This atlas does not list a direct computing application for this idea.</p>}
        <a className="bio-study-link" href={chapterForBranch[chosen.branch]}>Continue with the related chapter →</a>
        <div className="bu-links">
          {([["Rests on", parents], ["Leads to", children]] as const).map(([title, list]) => <div key={title}>
            <span className="bio-eyebrow">{title}</span>
            <div>{list.length ? list.map(id => <button key={id} type="button" onClick={() => pick(id)}>{ideaById.get(id)!.name}</button>) : <em>nothing listed here</em>}</div>
          </div>)}
        </div>
      </> : <p className="bio-note">No ideas match these filters.</p>}
    </div>

    <details className="bu-index">
      <summary>Browse every idea · {matches.length} matching</summary>
      <div className="bu-index-body">
        {branches.map(b => { const group = matches.filter(i => i.branch === b.id); return group.length ? <section key={b.id} style={tint(b.id)}>
          <h4><i className="bu-dot" aria-hidden="true" /><span>{b.label}</span><em>{group.length}</em></h4>
          <ul>{group.map(i => <li key={i.id}><button type="button" className={i.compute ? "is-compute" : ""} aria-pressed={chosen?.id === i.id} onClick={() => pick(i.id)}>{i.name}</button></li>)}</ul>
        </section> : null; })}
      </div>
    </details>
  </div>;
}
