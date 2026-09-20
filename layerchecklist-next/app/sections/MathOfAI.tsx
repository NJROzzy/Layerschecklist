import Link from "next/link";
import "./Section.css";
import "./MathOfAI.css";

/** The second layer under Math: the subject itself, rather than how to read it. */
export default function MathOfAI() {
  return <section id="math-of-ai" className="learning-section fade-section" aria-labelledby="math-of-ai-title">
    <p className="moa-eyebrow">LAYER TWO · ONE STEP DEEPER</p>
    <h2 id="math-of-ai-title">Now Build the Math Itself</h2>
    <p>
      Reading the symbols gets you through a paper. Building the subject underneath
      them is what lets you tell a real result from a convincing one. This layer starts
      from what a number is and ends at the questions nobody has answered yet — in the
      order the ideas actually depend on each other, not the order a syllabus lists them.
    </p>

    <ol className="moa-path">
      <li><Link href="/math#numbers"><span>01</span><strong>Numbers &amp; variables</strong><small>Why each number system had to be invented</small></Link></li>
      <li><Link href="/math#algebra"><span>02</span><strong>Algebra &amp; functions</strong><small>Five legal moves, and composition</small></Link></li>
      <li><Link href="/math#linear-algebra"><span>03</span><strong>Linear algebra</strong><small>Learn this before calculus</small></Link></li>
      <li><Link href="/math#calculus"><span>04</span><strong>Calculus</strong><small>One idea, approached properly</small></Link></li>
      <li><Link href="/math#probability"><span>05</span><strong>Probability</strong><small>What a prediction actually claims</small></Link></li>
      <li><Link href="/math#optimization"><span>06</span><strong>Optimization</strong><small>Where all of it meets</small></Link></li>
    </ol>

    <div className="moa-extras">
      <Link href="/math#combinations"><strong>What combines into AI →</strong><small>Which mixture of concepts builds a layer, a loss, attention, diffusion</small></Link>
      <Link href="/math#world"><strong>The same math, elsewhere →</strong><small>Why none of this was invented for AI</small></Link>
      <Link href="/math#frontier"><strong>Where the work is now →</strong><small>Eight open questions, and the level each one asks of you</small></Link>
    </div>

    <Link href="/math" className="moa-start">Build the math of AI <span aria-hidden="true">→</span></Link>
    <p className="moa-note">15 chapters · 17 interactive labs · 16 mathematical constellations · Starts from zero · Ends at the open problems</p>
  </section>;
}
