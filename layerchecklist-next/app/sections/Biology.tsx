import Link from "next/link";
import { branches, ideas } from "../biology/universe";
import { chapters } from "../biology/content";
import "./Section.css";
import "./Biology.css";

export default function Biology() {
  return <section id="biology" className="learning-section fade-section" aria-labelledby="biology-title">
    <p className="bio-home-eyebrow">FOUNDATION THREE / THE LIVING WORLD</p>
    <h2 id="biology-title">Biology</h2>
    <p>After the language of Math and the physical rules of Physics, explore living systems: how cells use energy, how information is inherited, how populations evolve, and how organisms shape their environment.</p>
    <div className="bio-home-atlas"><div><span className="bio-home-eyebrow">THE BIOLOGY ATLAS</span><strong>{ideas.length} ideas across {branches.length} connected branches.</strong><p>Follow a route from molecules to cells, from genetic information to evolution, or from organisms to ecosystems. Each idea has an explanation and connections to explore.</p></div><Link href="/biology#atlas">Open the biology atlas →</Link></div>
    <ol className="bio-home-path">{chapters.map(([id, label], i) => <li key={id}><Link href={"/biology#" + id}><span>{String(i + 1).padStart(2, "0")}</span><strong>{label}</strong></Link></li>)}</ol>
    <Link className="bio-home-start" href="/biology">Explore Biology →</Link>
    <p className="bio-home-note">{chapters.length} chapters · 3 interactive models · 4 guided atlas routes · Cells, genes, evolution, ecology and computation</p>
  </section>;
}
