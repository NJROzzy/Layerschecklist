import type { Metadata } from "next";
import Link from "next/link";
import ScienceFlow from "../ScienceFlow";
import { areas, principles, profile } from "./content";
import { ideas as biologyIdeas } from "../biology/universe";
import { ideas as physicsIdeas } from "../physics/universe";
import { concepts as mathConcepts } from "../math/universe";

export const metadata: Metadata = {
  title: `About ${profile.name} — Layerchecklist`,
  description: `${profile.name}'s Layerchecklist: a learning path from Math to Physics and Biology, followed by programming, AI and interactive simulations.`,
};

export default function AboutPage() {
  const links = profile.links.filter(link => link.url);
  const meta = [profile.role, profile.location].filter(Boolean);

  return <main className="about-page">
    <Link className="about-back" href="/">← Back to Layerchecklist</Link>

    <header className="about-hero">
      <p className="about-eyebrow">ABOUT ME / ABOUT LAYERCHECKLIST</p>
      <h1>{profile.name}</h1>
      {profile.tagline && <p className="about-tagline">{profile.tagline}</p>}
      {meta.length > 0 && <p className="about-meta">{meta.join(" · ")}</p>}
      {profile.intro.length > 0 && <div className="about-intro">{profile.intro.map((line, i) => <p key={i}>{line}</p>)}</div>}
      {links.length > 0 && <div className="about-links">
        {links.map(link => <a key={link.label} href={link.url}>{link.label}{link.handle && <span>{link.handle}</span>}</a>)}
      </div>}
    </header>

    <section className="about-section">
      <h2>Why this site exists</h2>
      <p>
        Layerchecklist is a growing learning notebook for understanding patterns,
        the physical world, living systems and the machines we build to study them.
        The aim is to make the connections visible: an equation should explain an
        observation, and an interactive model should give you something to test.
      </p>
      <p>Start with something familiar. Give it a precise explanation. Try an example,
        change an assumption, and use what you learn to build the next layer.</p>
      <blockquote className="about-quote">
        <p>
          Take in every experience. Give weight to what helps you grow. Learn from what
          causes loss. Adjust, try again, and move forward.
        </p>
        <p><strong>You don&apos;t need to begin with the right weights. You just need to keep learning.</strong></p>
        <footer>— the perceptron, read as advice, from the front page</footer>
      </blockquote>
      <p>
        That learning metaphor still fits the expanded site. You can return to a
        foundation, follow a connection into another subject, and improve your
        understanding through a concrete experiment.
      </p>
    </section>

    <section className="about-section" id="learning-path">
      <h2>Math → Physics → Biology</h2>
      <p>Math supplies the language of patterns and uncertainty. Physics uses it to
        describe matter, energy and motion. Biology follows those mechanisms into
        cells, organisms and ecosystems, adding heredity, evolution and history.</p>
      <ScienceFlow />
      <p>Then use Python and its libraries to explore data and models, move through AI,
        machine learning and deep learning, and try the ideas in simulations and
        robotics. The order is a suggested path; every subject stays open to explore.</p>
    </section>

    <section className="about-section">
      <h2>What is here</h2>
      <p>
        {areas.length} places to learn, from interactive subject atlases to courses,
        tool checklists and experiments.
      </p>
      <div className="about-areas">
        {areas.map(area => <Link key={area.href} href={area.href}>
          <strong>{area.title}</strong>
          <span>{area.detail}</span>
        </Link>)}
      </div>
      <div className="about-counts">
        <div><strong>{mathConcepts.length}</strong><span>mathematical ideas mapped</span></div>
        <div><strong>{physicsIdeas.length}</strong><span>physics ideas mapped</span></div>
        <div><strong>{biologyIdeas.length}</strong><span>biology ideas mapped</span></div>
        <div><strong>8 + 3</strong><span>simulation labs + biology models</span></div>
      </div>
    </section>

    <section className="about-section">
      <h2>Learn by changing something</h2>
      <p>A map helps you find a topic. An experiment helps you question it. Start with
        a prediction, move one control, and explain the result before moving another.</p>
      <div className="about-experiments">
        <Link href="/simulations#integrators"><span className="about-eyebrow">PHYSICS IN MOTION</span><strong>Keep an orbit on course →</strong><span>Compare numerical integration methods and watch their energy error.</span></Link>
        <Link href="/biology#bio-diffusion"><span className="about-eyebrow">PHYSICS INTO BIOLOGY</span><strong>Follow a concentration gradient →</strong><span>Change permeability and time in a two-compartment diffusion model.</span></Link>
        <Link href="/biology#bio-inheritance"><span className="about-eyebrow">MATH INTO BIOLOGY</span><strong>Explore inherited variation →</strong><span>Connect allele frequencies to expected genotype proportions.</span></Link>
      </div>
    </section>

    <section className="about-section">
      <h2>How it is built</h2>
      <p>
        The site is built with Next.js and React, with SVG and canvas for its visual
        explanations. The atlases connect related ideas; the labs let you explore
        simplified models. These four principles guide the work.
      </p>
      <ol className="about-principles">
        {principles.map((item, i) => <li key={item.title}>
          <span className="about-eyebrow">{String(i + 1).padStart(2, "0")}</span>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
        </li>)}
      </ol>
    </section>

    {profile.now.length > 0 && <section className="about-section">
      <h2>What I am working on now</h2>
      {profile.now.map((line, i) => <p key={i}>{line}</p>)}
    </section>}

    <footer className="about-footer">
      <p>Still learning. Still adjusting the weights.</p>
      <Link href="/math">Start with Math →</Link>
    </footer>
  </main>;
}
