import type { Metadata } from "next";
import Link from "next/link";
import { areas, principles, profile } from "./content";
import { ideas as physicsIdeas } from "../physics/universe";
import { concepts as mathConcepts } from "../math/universe";

export const metadata: Metadata = {
  title: `About ${profile.name} — Layerchecklist`,
  description: `${profile.name} on why Layerchecklist exists, what is on it, and how it is built.`,
};

export default function AboutPage() {
  const links = profile.links.filter(link => link.url);
  const meta = [profile.role, profile.location].filter(Boolean);

  return <main className="about-page">
    <Link className="about-back" href="/">← Back to Layerchecklist</Link>

    <header className="about-hero">
      <p className="about-eyebrow">ABOUT</p>
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
        Most explanations of machine learning pick one of two failure modes. They stay
        so high that nothing is actually learnable, or they open with notation and lose
        everyone who has not already seen it. Layerchecklist is an attempt at the third
        option: start from what someone already knows, build one layer at a time, and
        never hide behind a symbol that has not been earned.
      </p>
      <blockquote className="about-quote">
        <p>
          Take in every experience. Give weight to what helps you grow. Learn from what
          causes loss. Adjust, try again, and move forward.
        </p>
        <p><strong>You don&apos;t need to begin with the right weights. You just need to keep learning.</strong></p>
        <footer>— the perceptron, read as advice, from the front page</footer>
      </blockquote>
      <p>
        That is the whole editorial position. A model starts with arbitrary parameters and
        gets better by being wrong in a measurable way. So does anybody learning this
        material, and a site about it should be honest that the starting point is supposed
        to be bad.
      </p>
    </section>

    <section className="about-section">
      <h2>What is here</h2>
      <p>
        Six areas, each built to be read in order and each ending where the subject is
        genuinely unresolved rather than where the explanation ran out.
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
        <div><strong>22</strong><span>interactive panels and labs</span></div>
        <div><strong>8</strong><span>live simulations</span></div>
      </div>
    </section>

    <section className="about-section">
      <h2>How it is built</h2>
      <p>
        Next.js and React, no chart library and no physics engine — the diagrams are
        hand-written SVG and the simulations are integrated from the equations. Four
        rules have survived the whole thing.
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
      <Link href="/">Back to the checklist →</Link>
    </footer>
  </main>;
}
