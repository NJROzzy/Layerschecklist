import type { Metadata } from "next";
import Link from "next/link";
import ScienceFlow from "../ScienceFlow";
import ChapterNav from "./ChapterNav";
import PhysicsUniverse from "./PhysicsUniverse";
import { bridges, chapters, lifeBridges, openQuestions, pillars, resources, reviewedOn, reviewedOnISO, scales, startHere } from "./content";
import { ideas, branches } from "./universe";
import { routes } from "./universe-layout";

export const metadata: Metadata = {
  title: "Physics: An Atlas of How the World Works — Layerchecklist",
  description: `Explore ${ideas.length} physics ideas across ${branches.length} branches, with guided routes into Biology, interactive simulations and connections to computing.`,
};

function Heading({ number, title, children }: { number: string; title: string; children?: React.ReactNode }) {
  return <header className="phys-chapter-heading"><span className="phys-eyebrow">CHAPTER {number}</span><h2>{title}</h2>{children}</header>;
}

export default function PhysicsPage() {
  return <main className="phys-page">
    <Link className="phys-back" href="/#physics">← Back to the learning path</Link>

    <ScienceFlow current="physics" />

    <header className="phys-hero">
      <div>
        <p className="phys-eyebrow">FOUNDATION 02 / MATH → PHYSICS → BIOLOGY</p>
        <h1>Everything obeys<br /><span>a very short list of rules.</span></h1>
        <p className="phys-lead">Use the language of Math to explore matter, energy, motion and chance. Then follow those mechanisms into Biology: molecules move, membranes hold gradients, and cells exchange energy with their surroundings. The same physical ideas also connect to simulations and machine learning. Start with the map.</p>
        <div className="phys-hero-actions"><a className="phys-button" href="#atlas">Open the atlas ↓</a><a href="#life">How physics leads into Biology ↓</a></div>
      </div>
      <div className="phys-hero-stats">
        {[[String(ideas.length), "ideas mapped", "from everyday to unresolved"], [String(branches.length), "branches", "one circle, twelve wedges"],
          [String(routes.length), "guided routes", "including physics → biology"], [String(openQuestions.length), "open questions", "with the level each one asks"]].map(([n, l, d]) =>
          <div key={l}><strong>{n}</strong><span>{l}</span><small>{d}</small></div>)}
      </div>
    </header>

    <section id="atlas" className="phys-atlas">
      <header className="phys-atlas-head">
        <span className="phys-eyebrow">BEFORE ANY OF THE DETAIL</span>
        <h2>A universe of connected ideas.</h2>
        <p>Every star is one idea; each constellation is a branch. Move outward from everyday observations toward deeper theory and research. The rings suggest a study level, and the lines show useful connections across branches. The outer ring includes both established results and open questions.</p>
      </header>
      <PhysicsUniverse />
      <div className="phys-card-grid">
        <article><span className="phys-eyebrow">READ IT OUTWARD</span><h3>Build your foundations</h3><p>Begin with familiar observations, then use the links and guided routes to find supporting ideas. A topic can be introduced at several levels, so its ring is a guide rather than a fixed prerequisite order.</p></article>
        <article><span className="phys-eyebrow">READ IT AROUND</span><h3>Branches are administrative</h3><p>The wedges are how departments are organised, not how nature is. The harmonic oscillator appears in mechanics, waves, circuits, quantum and condensed matter, and it is the same object every time.</p></article>
        <article><span className="phys-eyebrow">FOLLOW A CONNECTION</span><h3>Continue into living systems</h3><p>Choose <em>Leads into biology</em> to explore diffusion, cellular energy and electrical signals. Each highlighted idea links to a Biology lesson or model. Use the computing filter to explore another connection.</p></article>
      </div>
      <aside className="phys-callout">
        <strong>What this atlas is not</strong>
        <p>This is a selected learning map. Biophysics now has several entry points; geophysics, metrology and experimental practice still deserve fuller treatment. The connections help you explore, and the chapter on open questions identifies unresolved problems.</p>
      </aside>
    </section>

    <div className="phys-meta">
      <span>No prior physics assumed</span><span>{chapters.length} chapters</span><span>{ideas.length} ideas mapped</span>
      <span>Reviewed <time dateTime={reviewedOnISO}>{reviewedOn}</time></span>
    </div>

    <ChapterNav />

    <section id="method" className="phys-chapter">
      <Heading number="01" title="Physics is a method before it is a body of facts.">
        <p>What makes it work is not that physicists are clever about the world. It is a short list of moves that keep turning out to be the right ones, applied with unusual stubbornness about measurement.</p>
      </Heading>
      <div className="phys-table-wrap" tabIndex={0} role="region" aria-label="The recurring moves of physics">
        <table>
          <caption>Five habits that do most of the work.</caption>
          <thead><tr><th scope="col">Move</th><th scope="col">The idea</th><th scope="col">Why it pays</th></tr></thead>
          <tbody>{pillars.map(p => <tr key={p.name}><th scope="row">{p.name}</th><td>{p.idea}</td><td>{p.why}</td></tr>)}</tbody>
        </table>
      </div>
      <aside className="phys-callout">
        <strong>The part that is easy to skip</strong>
        <p>A measurement is not a number, it is a number with an uncertainty, and the uncertainty is part of the result. Physics has been rigorous about this for two centuries; machine learning benchmarks still routinely report a single figure with no error bar and no seed count. It is the cheapest good habit either field has.</p>
      </aside>
    </section>

    <section id="scales" className="phys-chapter">
      <Heading number="02" title="The same laws, across sixty orders of magnitude.">
        <p>What changes across scales is not the rules but which of them you can afford to ignore. That is the single most useful idea for knowing which physics a problem needs.</p>
      </Heading>
      <ol className="phys-scale">
        {scales.map(s => <li key={s.power}>
          <span className="phys-scale-power">10<sup>{s.power}</sup> m</span>
          <div><strong>{s.label}</strong><p>{s.note}</p></div>
        </li>)}
      </ol>
      <p>Scale separation is why you can design a bridge without quantum mechanics and model a galaxy without tracking atoms. It is also precisely what fails in the hard problems: turbulence refuses to separate, which is why it is unsolved, and a phase transition is the moment when every scale starts to matter at once.</p>
    </section>

    <section id="conserved" className="phys-chapter">
      <Heading number="03" title="Find what cannot change, and the rest follows.">
        <p>The most powerful technique in the subject is not solving the equations. It is noticing a quantity that the equations cannot alter, and using it to skip the middle entirely.</p>
      </Heading>
      <div className="phys-card-grid">
        <article><h3>Energy</h3><p>Conserved because the laws do not change from one moment to the next. A ball at the bottom of a ramp has a speed you can state without following the ramp.</p></article>
        <article><h3>Momentum</h3><p>Conserved because the laws do not change from one place to another. Collisions become arithmetic.</p></article>
        <article><h3>Angular momentum</h3><p>Conserved because the laws do not care which way you face. Skaters, gyroscopes and galaxies all follow.</p></article>
      </div>
      <p>Noether&apos;s theorem makes the pattern exact: every continuous symmetry of the action produces a conserved quantity. This is the deepest idea in classical physics, and it is the same argument that justifies equivariant neural networks — bake in the symmetry and you no longer have to learn the invariance from data.</p>
    </section>

    <section id="fields" className="phys-chapter">
      <Heading number="04" title="Nothing acts at a distance.">
        <p>Newton described gravity precisely and was openly uncomfortable that it appeared to reach across empty space instantly. The resolution took two centuries: there is no reaching. There is a field, defined everywhere, and things respond to it locally.</p>
      </Heading>
      <p>Maxwell&apos;s four equations were the moment this became unavoidable. They unified electricity and magnetism, then predicted a self-sustaining wave whose speed fell out of two constants measured in laboratory experiments that had nothing to do with light. The number matched the measured speed of light, and the conclusion was inescapable.</p>
      <aside className="phys-callout">
        <strong>Why that matters beyond physics</strong>
        <p>The field idea — a quantity defined at every point, with behaviour determined locally — is the mental model behind continuous representations generally, including the neural fields used to represent shapes and scenes. Locality is also exactly what a convolution assumes.</p>
      </aside>
    </section>

    <section id="chance" className="phys-chapter">
      <Heading number="05" title="Stop tracking the particles.">
        <p>A litre of air holds around 10²⁵ molecules. No computer will ever track them, and it would not help: the useful quantities — temperature, pressure, entropy — are properties of the distribution, not of any molecule.</p>
      </Heading>
      <p>That move, from following individuals to describing a distribution, is the whole of statistical mechanics. It also produces the most consequential shared idea between physics and machine learning. Boltzmann&apos;s result that the probability of a state falls exponentially with its energy over temperature <em>is</em> the softmax function, with logits in place of negative energies and sampling temperature in place of temperature.</p>
      <aside className="phys-callout">
        <strong>Entropy, twice</strong>
        <p>Boltzmann arrived at entropy counting microscopic arrangements in the 1870s. Shannon arrived at the same expression in 1948 measuring information, reportedly taking the name on von Neumann&apos;s advice because nobody understood it and he would win every argument. They are not analogous quantities. They are the same quantity, and the cross-entropy loss in your training script is it.</p>
      </aside>
    </section>

    <section id="quantum" className="phys-chapter">
      <Heading number="06" title="The rules change, and the predictions get better.">
        <p>By 1900 classical physics was describing heat radiation with an answer that went to infinity. The fix — energy in discrete packets — was introduced reluctantly and turned out to be how the world is.</p>
      </Heading>
      <div className="phys-card-grid">
        <article><h3>Discreteness</h3><p>Energy, angular momentum and charge come in fixed amounts. Atoms are stable and have spectra because of it.</p></article>
        <article><h3>Amplitudes, not probabilities</h3><p>Quantum states add as complex amplitudes, which can cancel. Interference of possibilities has no classical counterpart.</p></article>
        <article><h3>Limits on joint knowledge</h3><p>Position and momentum cannot both be sharp. This is a property of the objects, not of the apparatus.</p></article>
      </div>
      <p>It is worth being precise about where the difficulty actually lies. The mathematics is learnable and the predictions are the most accurately confirmed in science. What remains genuinely unsettled is what a measurement <em>is</em> and why one outcome occurs. Anyone who tells you that part is resolved is describing an interpretation they prefer.</p>
      <p className="phys-note">A practical note: the wavefunction of n particles lives in a space whose dimension grows exponentially with n. That single fact is why quantum chemistry is hard, why quantum computers are interesting, and why tensor networks and neural wavefunctions exist.</p>
    </section>

    <section id="life" className="phys-chapter">
      <Heading number="07" title="From physical mechanisms to living systems.">
        <p>Biology adds organization, heredity and evolution to the physical picture.
          These three connections give you a starting point for the next foundation.</p>
      </Heading>
      <div className="phys-card-grid">
        {lifeBridges.map(item => <article key={item.title}><span className="phys-eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.detail}</p><Link className="pu-chapter-link" href={item.href}>{item.link} →</Link><p className="phys-note"><a href={item.source}>Read the source</a></p></article>)}
      </div>
      <aside className="phys-callout"><strong>A model needs a scale and assumptions</strong><p>The Biology diffusion lab uses two equal-volume compartments and a fixed transport rate. It helps explain concentration changes; a living membrane also has selective channels, pumps and regulation. Use the model to ask a clear question, then identify what it leaves out.</p></aside>
      <p className="phys-note">Further reading: <a href="https://www.ncbi.nlm.nih.gov/books/NBK26888/">molecular motors</a>, <a href="https://openstax.org/books/college-physics-2e/pages/12-4-viscosity-and-laminar-flow-poiseuilles-law">flow and viscosity</a>, and <a href="https://www.nobelprize.org/prizes/physics/1926/perrin/lecture/">the experimental study of Brownian motion</a>.</p>
    </section>

    <section id="bridge" className="phys-chapter">
      <Heading number="08" title="Physics and machine learning share mathematical tools.">
        <p>It is easy to overclaim here, and popular accounts usually do. Below are the places where the connection is an actual shared formalism, with the one well-known analogy that is <em>not</em> established marked as such.</p>
      </Heading>
      <div className="phys-table-wrap" tabIndex={0} role="region" aria-label="Where physics and machine learning share a formalism">
        <table>
          <caption>Physics first, machine learning second, and what is actually shared.</caption>
          <thead><tr><th scope="col">In physics</th><th scope="col">In machine learning</th><th scope="col">What is shared</th></tr></thead>
          <tbody>{bridges.map(b => <tr key={b.physics}><th scope="row">{b.physics}</th><td>{b.ml}</td><td>{b.detail}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="phys-next-grid">
        <Link href="/math#probability"><span className="phys-eyebrow">THE MATHEMATICS</span><h3>Probability &amp; entropy →</h3><p>Where cross-entropy and KL divergence are built from the ground up.</p></Link>
        <Link href="/simulations#integrators"><span className="phys-eyebrow">RUNNING IT</span><h3>Simulation lab →</h3><p>Orbits, springs and chaos, integrated live in your browser.</p></Link>
      </div>
    </section>

    <section id="open" className="phys-chapter">
      <Heading number="09" title="The parts nobody has finished.">
        <p>Physics is often taught as a completed edifice. It is not, and the gaps are large enough to be worth naming — roughly 95% of the universe&apos;s energy content is currently labelled rather than explained.</p>
      </Heading>
      <div className="phys-open-grid">
        {openQuestions.map((item, i) => <article key={item.q}>
          <span className="phys-eyebrow">OPEN {String(i + 1).padStart(2, "0")}</span>
          <h3>{item.q}</h3><p>{item.detail}</p>
          <p className="phys-level"><strong>Level:</strong> {item.level}</p>
        </article>)}
      </div>
    </section>

    <section id="start" className="phys-chapter">
      <Heading number="10" title="A workable order, and how to know you are ready.">
        <p>The common mistake is starting with whatever sounds most exciting — usually quantum or relativity — and bouncing off, because both assume mechanics you have not built yet.</p>
      </Heading>
      <ol className="phys-steps">
        {startHere.map((item, i) => <li key={item.step}>
          <span className="phys-eyebrow">STEP {String(i + 1).padStart(2, "0")}</span>
          <strong>{item.step}</strong><p>{item.detail}</p>
          <p className="phys-signal"><strong>Ready when:</strong> {item.signal}</p>
        </li>)}
      </ol>
      <h3>Where to learn it</h3>
      <div className="phys-resource-grid">
        {resources.map(r => <article key={r.name}>
          <span className="phys-eyebrow">{r.kind}</span>
          <h4><a href={r.href}>{r.name}<span aria-hidden="true"> ↗</span></a></h4><p>{r.note}</p>
        </article>)}
      </div>
      <aside className="phys-callout">
        <strong>The habit that matters most</strong>
        <p>Estimate before you calculate. Decide roughly what the answer should be — order of magnitude, sign, which way it should move when you change something — and only then do the algebra. It catches errors, and more importantly it is the thing that turns a set of equations into an understanding of how the world behaves.</p>
      </aside>
    </section>

    <div className="phys-next-grid"><Link href="/biology"><span className="phys-eyebrow">NEXT FOUNDATION</span><h3>Continue to Biology →</h3><p>Explore how living systems use energy, information and feedback.</p></Link></div>

    <footer className="phys-footer">
      <p>Measure carefully. Find what cannot change. Be honest about the error bars.</p>
      <a href="#atlas">Back to the atlas ↑</a>
    </footer>
  </main>;
}
