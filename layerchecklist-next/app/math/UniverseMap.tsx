"use client";

import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { concepts, conceptById, ringNames, sectors, type SectorId } from "./universe";
import { CENTRE, RADII, HUES, branchAngle, noise, polar, positions, round, trails } from "./universe-layout";
import "./universe.css";

type Mode = "all" | "ai" | "taught";
const color = (sector: SectorId) => ({ "--h": HUES[sector] } as CSSProperties);
const edges = concepts.flatMap(c => (c.needs ?? []).map(from => [from, c.id] as const));
const backgroundStars = Array.from({ length: 460 }, (_, i) => ({ x: round(noise("sx" + i) * 960), y: round(noise("sy" + i) * 960), r: round(.35 + noise("sr" + i) * 1.1), opacity: round(.12 + noise("so" + i) * .5) }));
const dust = Array.from({ length: 550 }, (_, i) => {
  const radius = 35 + noise("dr" + i) ** .65 * 380;
  return { ...polar(radius, i % 4 * Math.PI / 2 + radius / 170 + (noise("da" + i) - .5) * .55), r: round(.4 + noise("ds" + i)), opacity: round(.08 + noise("do" + i) * .3) };
});
const aiCount = concepts.filter(c => c.ai).length;
const lessonCount = concepts.filter(c => c.lesson).length;

export default function UniverseMap() {
  const [mode, setMode] = useState<Mode>("all");
  const [sector, setSector] = useState<SectorId | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("gradient");
  const [trail, setTrail] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [guides, setGuides] = useState(false);
  const [web, setWeb] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [indexOpen, setIndexOpen] = useState(false);
  const drag = useRef<{ x: number; y: number; px: number; py: number; moved: boolean } | null>(null);
  const activeTrail = trails.find(t => t.id === trail);
  const matches = useMemo(() => concepts.filter(c =>
    (mode === "all" || (mode === "ai" ? Boolean(c.ai) : Boolean(c.lesson))) && (!sector || sector === c.sector)
    && (!activeTrail || (activeTrail.nodes as readonly string[]).includes(c.id))
    && (!query.trim() || [c.id, c.name, c.what, c.ai, c.world].join(" ").toLowerCase().includes(query.trim().toLowerCase()))
  ), [mode, sector, query, activeTrail]);
  const matchIds = new Set(matches.map(c => c.id));
  const chosen = matches.find(c => c.id === selected) ?? matches[0];
  const parents = chosen?.needs ?? [];
  const children = chosen ? concepts.filter(c => c.needs?.includes(chosen.id)).map(c => c.id) : [];
  const related = new Set([...parents, ...children]);
  const shownEdges = edges.filter(([a, b]) => matchIds.has(a) && matchIds.has(b));
  const limit = (z: number) => 480 - 480 / z;
  const changeZoom = (value: number) => {
    const next = Math.min(2.5, Math.max(1, value)); setZoom(next);
    setPan(p => ({ x: Math.max(-limit(next), Math.min(limit(next), p.x)), y: Math.max(-limit(next), Math.min(limit(next), p.y)) }));
  };
  const clearFilters = () => { setMode("all"); setSector(null); setQuery(""); setTrail(null); };
  const choose = (id: string) => { if (!matchIds.has(id)) clearFilters(); setSelected(id); };
  const focusStar = (id: string) => {
    choose(id);
    if (zoom > 1) { const p = positions.get(id)!; setPan({ x: Math.max(-limit(zoom), Math.min(limit(zoom), p.x - CENTRE)), y: Math.max(-limit(zoom), Math.min(limit(zoom), p.y - CENTRE)) }); }
  };
  const pointerDown = (e: PointerEvent<SVGSVGElement>) => { drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, moved: false }; };
  const pointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !e.buttons || zoom === 1) return;
    const d = drag.current, dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.hypot(dx, dy) < 5 && !d.moved) return;
    d.moved = true; e.currentTarget.setPointerCapture(e.pointerId);
    const scale = 960 / zoom / e.currentTarget.getBoundingClientRect().width;
    setPan({ x: round(Math.max(-limit(zoom), Math.min(limit(zoom), d.px - dx * scale))), y: round(Math.max(-limit(zoom), Math.min(limit(zoom), d.py - dy * scale))) });
  };
  const named = labels ? [...matches].sort((a, b) => Number(b.id === chosen?.id) - Number(a.id === chosen?.id) || Number(related.has(b.id)) - Number(related.has(a.id))).slice(0, matches.length <= 30 ? matches.length : 16) : [];
  const labelBoxes: { x: number; y: number; w: number }[] = [];
  const nameLayout = named.flatMap(c => {
    const p = positions.get(c.id)!, w = Math.min(c.name.length, 25) * 6.7 + 14;
    for (const offset of [-18, 22, -38, 42]) {
      const x = Math.max(14, Math.min(946 - w, p.x + 11)), y = p.y + offset;
      if (labelBoxes.some(b => Math.abs(b.y - y) < 21 && x < b.x + b.w && x + w > b.x)) continue;
      labelBoxes.push({ x, y, w }); return [{ concept: c, point: p, x, y, w }];
    }
    return [];
  });

  return <div className="universe">
    <div className="um-controls">
      <div className="math-choice-row" role="group" aria-label="Ideas to explore">
        {([["all", `All ideas · ${concepts.length}`], ["ai", `AI connections · ${aiCount}`], ["taught", `With lessons · ${lessonCount}`]] as [Mode, string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={mode === value} onClick={() => { setMode(value); setTrail(null); }}>{label}</button>)}
      </div>
      <label className="um-search" htmlFor="um-search">Find an idea<input id="um-search" type="search" placeholder="PCA, logic, diffusion…" value={query} onChange={e => setQuery(e.target.value)} /></label>
    </div>
    <div className="um-trails" role="group" aria-label="Guided paths"><span className="math-eyebrow">FOLLOW A PATH</span>{trails.map(t => <button type="button" key={t.id} aria-pressed={trail === t.id} onClick={() => { clearFilters(); setTrail(trail === t.id ? null : t.id); setSelected(t.nodes[0]); }}>{t.label}<span aria-hidden="true">↗</span></button>)}</div>
    <div className="um-legend" role="group" aria-label="Filter by branch"><button type="button" aria-pressed={sector === null} onClick={() => setSector(null)}>All constellations</button>{sectors.map(s => <button type="button" key={s.id} style={color(s.id)} aria-pressed={sector === s.id} onClick={() => { setSector(sector === s.id ? null : s.id); setTrail(null); }}><span className="um-swatch" aria-hidden="true" />{s.short}</button>)}</div>
    <div className="um-status"><p role="status">{matches.length} of {concepts.length} matching ideas{sector ? ` · ${sectors.find(s => s.id === sector)?.label}` : ""}{query.trim() ? ` · “${query.trim()}”` : ""}</p>{(mode !== "all" || sector || query || trail) && <button type="button" onClick={clearFilters}>Clear filters</button>}<a href="#um-detail" className="um-skip">Skip to the selected idea ↓</a></div>
    {activeTrail && <p className="um-trail-description">{activeTrail.description} These are suggested study stops; the solid connections show the catalogue&apos;s prerequisite links.</p>}
    <div className={"um-observatory" + (animate ? " is-animated" : "")}>
      <div className="um-observatory-head"><div><span>THE MATHEMATICAL UNIVERSE</span><strong>{sectors.length} constellations. Endless connections.</strong></div><span className="um-live-dot" aria-hidden="true" /></div>
      <div className="um-stage"><svg className={zoom > 1 ? "is-zoomed" : ""} viewBox={`${round(480 - 480 / zoom + pan.x)} ${round(480 - 480 / zoom + pan.y)} ${round(960 / zoom)} ${round(960 / zoom)}`} role="group" aria-label="Interactive mathematical star map" aria-describedby="um-map-help" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }} onPointerCancel={() => { drag.current = null; }}>
        <defs><radialGradient id="um-space"><stop stopColor="#172347" /><stop offset=".6" stopColor="#0b1026" /><stop offset="1" stopColor="#060a17" /></radialGradient><radialGradient id="um-core"><stop stopColor="#d6ddff" stopOpacity=".7" /><stop offset=".17" stopColor="#a6a2ff" stopOpacity=".18" /><stop offset="1" stopColor="#737bff" stopOpacity="0" /></radialGradient>{sectors.map(s => <radialGradient id={"um-nebula-" + s.id} key={s.id}><stop stopColor={`hsl(${HUES[s.id]} 80% 65%)`} stopOpacity=".18" /><stop offset="1" stopColor={`hsl(${HUES[s.id]} 70% 40%)`} stopOpacity="0" /></radialGradient>)}</defs>
        <g aria-hidden="true" pointerEvents="none">
          <rect width="960" height="960" fill="url(#um-space)" /><g className="um-background-stars">{backgroundStars.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} opacity={p.opacity} fill="#c5d8ff" />)}</g>
          <circle cx="480" cy="480" r="426" className="um-horizon" /><ellipse cx="480" cy="480" rx="435" ry="162" transform="rotate(-32 480 480)" className="um-orbit" /><ellipse cx="480" cy="480" rx="435" ry="207" transform="rotate(37 480 480)" className="um-orbit" />
          {sectors.map((s, i) => { const p = polar(280, branchAngle(i)); return <ellipse key={s.id} cx={p.x} cy={p.y} rx="175" ry="105" transform={`rotate(${round(branchAngle(i) * 180 / Math.PI)} ${p.x} ${p.y})`} fill={`url(#um-nebula-${s.id})`} />; })}
          <g className="um-galaxy-dust">{dust.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} opacity={p.opacity} fill={i % 2 ? "#a6b5ff" : "#d9cbff"} />)}</g><circle cx="480" cy="480" r="170" fill="url(#um-core)" />
          {RADII.map((r, i) => <g key={r}><circle cx="480" cy="480" r={r} className={"um-guide-ring" + (guides ? " is-strong" : "")} />{guides && <text x="480" y={480 - r + 12} className="um-level-label">{i}</text>}</g>)}
          {web && shownEdges.map(([a, b]) => <line key={a + ":" + b} x1={positions.get(a)!.x} y1={positions.get(a)!.y} x2={positions.get(b)!.x} y2={positions.get(b)!.y} className="um-constellation" />)}
          {chosen && [...related].map(id => <line key={id} x1={positions.get(chosen.id)!.x} y1={positions.get(chosen.id)!.y} x2={positions.get(id)!.x} y2={positions.get(id)!.y} className={parents.includes(id) ? "um-link is-parent" : "um-link is-child"} />)}
          {sectors.map((s, i) => { const p = polar(451, branchAngle(i)); const x = round(Math.max(56, Math.min(904, p.x))); return <text key={s.id} x={x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="um-sector-label" style={color(s.id)}>{s.short.toUpperCase()}</text>; })}
        </g>
        {concepts.map(c => { const p = positions.get(c.id)!, active = c.id === chosen?.id, visible = matchIds.has(c.id); return <g key={c.id} role="button" aria-label={c.name} aria-pressed={active} aria-controls="um-detail" tabIndex={visible && active ? 0 : -1} className={"um-star" + (!visible ? " is-dim" : "") + (active ? " is-selected" : "") + (related.has(c.id) ? " is-related" : "")} style={color(c.sector)} onClick={() => { if (!drag.current?.moved) choose(c.id); }} onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(c.id); }
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) { e.preventDefault(); const index = matches.findIndex(m => m.id === c.id), next = matches[(index + (e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1) + matches.length) % matches.length]; if (next) { focusStar(next.id); document.getElementById("um-star-" + next.id)?.focus(); } }
        }} id={"um-star-" + c.id}><title>{c.name}</title><circle cx={p.x} cy={p.y} r="11" fill="transparent" /><circle cx={p.x} cy={p.y} r={active ? 18 : c.ai ? 9 : 6} className="um-star-halo" />{active && <circle cx={p.x} cy={p.y} r="14" className="um-selected-ring" />}<circle cx={p.x} cy={p.y} r={active ? 5 : c.ai ? 3.4 : 2.6} className="um-star-core" />{c.lesson && <circle cx={p.x} cy={p.y} r="6.5" className="um-lesson-ring" />}</g>; })}
        <g aria-hidden="true" pointerEvents="none">{nameLayout.map(({ concept: c, point, x, y, w }) => <g key={c.id}><line x1={point.x} y1={point.y} x2={x} y2={y - 4} className="um-name-leader" /><rect x={x - 5} y={y - 14} width={w} height="21" rx="5" fill="#0b1028" fillOpacity=".9" /><text x={x} y={y} className={"um-name" + (c.id === chosen?.id ? " is-selected" : "")}>{c.name.length > 25 ? c.name.slice(0, 24) + "…" : c.name}</text></g>)}<text x="480" y="477" textAnchor="middle" className="um-core-title">MATHEMATICS</text><text x="480" y="494" textAnchor="middle" className="um-core-subtitle">a universe of ideas</text></g>
      </svg></div>
      <div className="um-map-toolbar"><div role="group" aria-label="Map zoom"><button type="button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => changeZoom(zoom - .5)}>−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" aria-label="Zoom in" disabled={zoom === 2.5} onClick={() => changeZoom(zoom + .5)}>+</button><button type="button" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>Reset view</button></div><div><button type="button" aria-pressed={labels} onClick={() => setLabels(!labels)}>{labels ? `Names · ${nameLayout.length}` : "Star names"}</button><button type="button" aria-pressed={guides} onClick={() => setGuides(!guides)}>Study rings</button><button type="button" aria-pressed={web} onClick={() => setWeb(!web)}>Connections</button><button type="button" aria-pressed={animate} onClick={() => setAnimate(!animate)}>{animate ? "Pause shimmer" : "Resume shimmer"}</button></div></div>
      <p id="um-map-help">Select a star to explore. Zoom in, then drag to travel. Arrow keys move between matching stars. Rings mark study level; narrow the filters to name every matching star, or read them all in the topic index below.</p>
      <div className="um-map-key"><span><i className="um-key-star" />Idea</span><span><i className="um-key-glow" />AI connection</span><span><i className="um-key-ring" />Lesson available</span><span><i className="um-key-line" />Built on</span><span><i className="um-key-line is-child" />Leads to</span></div>
    </div>
    <ol className="um-rings-key" aria-label="Approximate study levels">{ringNames.map((name, i) => <li key={name}><span>{i}</span>{name}</li>)}</ol><p className="math-note um-scale-note">Distance suggests a study level, not a difficulty score or a count of prerequisites. Stars in the background are decorative; the selectable stars are catalogue entries.</p>
    <div className="um-detail" id="um-detail" tabIndex={-1}>{chosen ? <>
      <div className="um-detail-copy" aria-live="polite" aria-atomic="true"><span className="math-eyebrow" style={color(chosen.sector)}>{sectors.find(s => s.id === chosen.sector)?.label} / {ringNames[chosen.ring]}</span><h3>{chosen.name}</h3><p>{chosen.what}</p>{chosen.ai && <p className="um-ai"><strong>In AI</strong> · {chosen.ai}</p>}{chosen.world && <p className="um-world"><strong>In the world</strong> · {chosen.world}</p>}{!chosen.ai && <p className="math-note">This atlas does not list a direct AI application for this idea.</p>}{chosen.lesson && <a className="um-lesson-link" href={chosen.lesson}>Study this idea {chosen.lesson.startsWith("/") ? "in the DL course" : "in this guide"} →</a>}</div>
      <div className="um-detail-connections">{([{ title: "Built on", ids: parents }, { title: "Leads to", ids: children }]).map(({ title, ids }) => <div className="um-links" key={title}><span className="math-eyebrow">{title}</span><div>{ids.length ? ids.map(id => <button type="button" key={id} onClick={() => focusStar(id)}>{conceptById.get(id)!.name}</button>) : <p>No {title === "Built on" ? "prerequisites" : "further connections"} listed in this atlas.</p>}</div></div>)}</div>
    </> : <div role="status"><h3>No matching ideas</h3><p>Try a broader search or clear the filters to return to the whole map.</p><button type="button" onClick={clearFilters}>Show all ideas</button></div>}</div>
    <details className="um-index" open={indexOpen} onToggle={e => setIndexOpen(e.currentTarget.open)}><summary>Browse the topic index · {matches.length} matching ideas</summary><div className="um-index-body">{sectors.map(s => { const group = matches.filter(c => c.sector === s.id); return group.length ? <div key={s.id} style={color(s.id)}><h4><span className="um-swatch" aria-hidden="true" />{s.label}<small>{group.length}</small></h4><ul>{group.map(c => <li key={c.id}><button type="button" aria-pressed={chosen?.id === c.id} onClick={() => { focusStar(c.id); document.getElementById("um-detail")?.focus({ preventScroll: true }); document.getElementById("um-detail")?.scrollIntoView({ block: "nearest" }); }}>{c.name}{c.lesson && <span aria-label="Lesson available"> ↗</span>}</button></li>)}</ul></div> : null; })}</div>{!matches.length && <p>No topics match the current filters.</p>}</details>
  </div>;
}
