"use client";
import Link from "next/link";
import { useState } from "react";
import { chapters, equationCount, notation, readings } from "./content";
import { dlRoadmap } from "../../sections/weekly_contents_of_dl/roadmap";

const names: Record<string, string> = { θ: " theta ", φ: " phi ", Φ: " phi ", ϕ: " phi ", ψ: " psi ", μ: " mu ", σ: " sigma ", Σ: " sum ", β: " beta ", γ: " gamma ", η: " eta ", λ: " lambda ", ε: " epsilon ", τ: " tau ", π: " pi ", δ: " delta ", "∇": " gradient " };
const normalize = (text: string) => text.normalize("NFKC").replace(/[θφΦϕψμσΣβγηλετπδ∇]/g, symbol => names[symbol]).toLowerCase();

export default function EquationReference() {
  const [query, setQuery] = useState("");
  const [week, setWeek] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const visible = chapters.filter(chapter => week === "all" || chapter.weeks.includes(Number(week))).map(chapter => ({
    ...chapter,
    equations: chapter.equations.filter(equation => {
      const text = normalize([chapter.title, equation.id, equation.title, equation.formula, equation.explanation, ...equation.symbols.flat(), ...equation.steps, equation.note ?? ""].join(" "));
      return terms.every(term => text.includes(term));
    }),
  })).filter(chapter => chapter.equations.length);
  const count = visible.reduce((total, chapter) => total + chapter.equations.length, 0);

  return <div id="equation-reference" className="dm-reference">
    <header className="dm-reference-header"><span className="dm-eyebrow">THE COMPLETE COURSE REFERENCE</span><h2>Read the equation.<br />Understand every symbol.</h2><p>Each entry defines its symbols, explains the operation, and works through numbers. Start with the foundations or filter by the week you are studying.</p></header>
    <details className="dm-notation" id="notation-key"><summary>Open the notation key <span>{notation.length} symbol groups</span></summary><p>The same letter can mean different things in different models. Definitions below each equation take precedence. Natural logarithms use nats; vectors are columns unless an entry explicitly uses row-oriented batches or tokens.</p><div className="dm-table-scroll" tabIndex={0} role="region" aria-label="Deep learning notation key"><table><thead><tr><th scope="col">Notation</th><th scope="col">Read it</th><th scope="col">Meaning</th></tr></thead><tbody>{notation.map(([symbol, name, meaning]) => <tr key={symbol}><th scope="row">{symbol}</th><td>{name}</td><td>{meaning}</td></tr>)}</tbody></table></div></details>
    <div className="dm-search-controls"><label htmlFor="dm-search">Find an equation or symbol<input id="dm-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try chain rule, KL, θ, attention, DDPG…"/></label><label htmlFor="dm-week">Course week<select id="dm-week" aria-label="Course week" value={week} onChange={event => setWeek(event.target.value)}><option value="all">All weeks</option>{dlRoadmap.map(item => <option value={item.week} key={item.week}>Week {item.week} · {item.title}</option>)}</select></label><button type="button" className="dm-secondary" onClick={() => { setQuery(""); setWeek("all"); }}>Reset filters</button></div>
    <div className="dm-reference-options"><p role="status" aria-live="polite">Showing <strong>{count}</strong> of {equationCount} equation entries across {visible.length} topics.</p><label><input type="checkbox" checked={expanded} onChange={event => setExpanded(event.target.checked)}/>Expand all worked examples</label></div>
    <div className="dm-reference-layout">
      <nav className="dm-contents" aria-label="Mathematics topics"><span className="dm-eyebrow">JUMP TO A TOPIC</span><ol>{visible.map(chapter => <li key={chapter.id}><a href={`#${chapter.id}`}>{chapter.title}<span>{chapter.equations.length}</span></a></li>)}</ol><Link href="/notation">Need a gentler start with symbols? ↗</Link></nav>
      <div className="dm-chapters">{visible.length ? visible.map(chapter => <section key={chapter.id} id={chapter.id} className="dm-chapter" aria-labelledby={`${chapter.id}-title`}><header className="dm-chapter-heading"><span className="dm-eyebrow">{chapter.weeks.map(number => `WEEK ${number}`).join(" / ")}</span><h2 id={`${chapter.id}-title`}>{chapter.title}</h2><p>{chapter.intro}</p><div className="dm-week-links">{chapter.weeks.map(number => <Link href={`/dl/week-${number}`} key={number}>Return to Week {number} ↗</Link>)}</div></header>
        {chapter.equations.map(equation => <article key={equation.id} id={equation.id} className="dm-equation" aria-labelledby={`${equation.id}-title`}><header><span className="dm-equation-number">{String(chapters.flatMap(item => item.equations).findIndex(item => item.id === equation.id) + 1).padStart(2, "0")}</span><h3 id={`${equation.id}-title`}><a href={`#${equation.id}`}>{equation.title}</a></h3></header><pre className="dm-formula" tabIndex={0} aria-label={`${equation.title} equations`}>{equation.formula}</pre><p>{equation.explanation}</p><div className="dm-table-scroll" tabIndex={0} role="region" aria-label={`${equation.title} notation`}><table><caption>Symbols and dimensions</caption><thead><tr><th scope="col">Symbol</th><th scope="col">Meaning in this equation</th></tr></thead><tbody>{equation.symbols.map(([symbol, meaning]) => <tr key={symbol}><th scope="row">{symbol}</th><td>{meaning}</td></tr>)}</tbody></table></div><details className="dm-worked" open={expanded}><summary>Work through the numbers</summary><ol>{equation.steps.map(step => <li key={step}>{step}</li>)}</ol></details>{equation.note && <p className="dm-equation-note">{equation.note}</p>}</article>)}
        <p className="dm-reading">Original ideas and definitions: {readings.filter(reading => reading.chapters.includes(chapter.id)).map((reading, index) => <span key={reading.url}>{index > 0 && " · "}<a href={reading.url}>{reading.title} ↗</a></span>)}</p>
      </section>) : <div className="dm-empty"><h2>No equations match these filters.</h2><p>Try a symbol name such as “theta,” a topic such as “convolution,” or reset the filters to return to the full reference.</p><button type="button" className="dm-secondary" onClick={() => { setQuery(""); setWeek("all"); }}>Show all equations</button></div>}</div>
    </div>
  </div>;
}
