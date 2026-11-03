import type { Metadata } from "next";
import Link from "next/link";
import { chapters, equationCount } from "./content";
import EquationReference from "./EquationReference";
import NetworkTrace from "./NetworkTrace";
import "./mathematics.css";

export const metadata: Metadata = {
  title: "Deep Learning Mathematics & Notation — Layerchecklist",
  description: `A complete companion to the 14-week DL course: ${equationCount} explained equation entries, symbols and dimensions, worked examples, and an interactive backpropagation trace.`,
};

export default function MathematicsPage() {
  return <main className="dm-page">
    <Link href="/dl#mathematics" className="dm-back">← Back to the deep learning map</Link>
    <header className="dm-hero"><div><p className="dm-eyebrow">DEEP LEARNING / THE FINAL REFERENCE</p><h1>The mathematics<br /><span>behind the network.</span></h1><p className="dm-lead">Connect every stage of the course through its equations. Read what each symbol means, check the dimensions, and follow the numbers from a first neuron to attention, generation, and learning through experience.</p><nav aria-label="Mathematics page sections"><a href="#network-trace">Trace a network ↓</a><a href="#equation-reference">Browse all equations ↓</a><a href="#notation-key">Look up notation ↓</a></nav></div><div className="dm-hero-stats"><div><strong>{equationCount}</strong><span>equation entries</span></div><div><strong>{chapters.length}</strong><span>connected topics</span></div><div><strong>14</strong><span>course weeks</span></div><div><strong>1</strong><span>complete gradient trace</span></div></div></header>
    <aside className="dm-conventions"><h2>A way to read any equation.</h2><ol><li><strong>Identify the output.</strong> Is it a prediction, a probability, a loss, a gradient, or an update?</li><li><strong>Read the definitions.</strong> Check what each symbol means locally and which dimensions it carries.</li><li><strong>Check the operation.</strong> Distinguish sums from averages, matrix products from elementwise products, and samples from expectations.</li><li><strong>Substitute simple numbers.</strong> Work through an example and check the assumptions before interpreting a result.</li></ol><p>This reference covers the equations in Weeks 0–13, with generative and actor–critic connections discussed in the lessons. Architecture variants and software defaults can change a formula; each entry states the convention it uses.</p></aside>
    <NetworkTrace />
    <EquationReference />
    <footer className="dm-footer"><Link href="/dl/week-13">← Revisit the final course week</Link><a href="#equation-reference">Back to the equation index ↑</a><Link href="/math">Explore the Mathematics atlas ↗</Link></footer>
  </main>;
}
