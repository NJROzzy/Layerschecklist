import Link from "next/link";
import "./Section.css";
import "./Physics.css";
import { branches, ideas } from "../physics/universe";
import { routes } from "../physics/universe-layout";
import { chapters, openQuestions } from "../physics/content";

/** The subject underneath all the others, the second foundation in the learning path. */
export default function Physics() {
  const computeLinks = ideas.filter(idea => idea.compute).length;

  return <section id="physics" className="learning-section fade-section" aria-labelledby="physics-title">
    <p className="phy-eyebrow">FOUNDATION 02 / MATH → PHYSICS → BIOLOGY</p>
    <h2 id="physics-title">Physics</h2>
    <p>
      Put mathematics to work describing matter, energy, motion and chance.
      Follow diffusion, gradients and electrical signals into Biology, or explore
      the connections to simulations and machine learning. This atlas gives you
      a route through the physical ideas behind those systems.
    </p>

    <div className="phy-atlas-card">
      <div>
        <span className="phy-eyebrow">THE PHYSICS ATLAS</span>
        <strong>{ideas.length} ideas. {branches.length} branches. One circle.</strong>
        <p>
          Start with everyday observations, then move toward deeper theory and
          open research. {computeLinks} ideas connect to computation, and a new
          guided route connects physical mechanisms to living systems.
        </p>
      </div>
      <Link href="/physics#atlas" className="phy-atlas-link">Open the atlas <span aria-hidden="true">→</span></Link>
    </div>

    <ol className="phy-path">
      <li><Link href="/physics#method"><span>01</span><strong>How physics works</strong><small>Five habits that do most of the work</small></Link></li>
      <li><Link href="/physics#scales"><span>02</span><strong>Sixty orders of magnitude</strong><small>Same laws, different things you can ignore</small></Link></li>
      <li><Link href="/physics#conserved"><span>03</span><strong>What never changes</strong><small>Symmetry, and the quantities it protects</small></Link></li>
      <li><Link href="/physics#chance"><span>04</span><strong>Chance &amp; heat</strong><small>Where softmax and cross-entropy actually come from</small></Link></li>
      <li><Link href="/physics#quantum"><span>05</span><strong>The quantum turn</strong><small>Learnable maths, genuinely unsettled meaning</small></Link></li>
      <li><Link href="/physics#life"><span>06</span><strong>Physics into Biology</strong><small>Transport, cellular energy and electrical signals</small></Link></li>
      <li><Link href="/physics#bridge"><span>07</span><strong>Physics &amp; machine learning</strong><small>Shared mathematical tools and their limits</small></Link></li>
      <li><Link href="/physics#open"><span>08</span><strong>Still open</strong><small>Questions that established theories leave unanswered</small></Link></li>
      <li><Link href="/physics#start"><span>09</span><strong>Where to start</strong><small>An order that works, with a test for each stage</small></Link></li>
    </ol>

    <Link href="/physics" className="phy-start">Explore physics <span aria-hidden="true">→</span></Link>
    <p className="phy-note">{chapters.length} chapters · {ideas.length}-idea interactive atlas · {routes.length} guided routes · {openQuestions.length} open questions</p>
  </section>;
}
