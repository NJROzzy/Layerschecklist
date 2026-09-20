import Link from "next/link";
import "./Section.css";
import "./Physics.css";
import { branches, ideas } from "../physics/universe";

/** The subject underneath all the others, added at the end of the path. */
export default function Physics() {
  const computeLinks = ideas.filter(idea => idea.compute).length;

  return <section id="physics" className="learning-section fade-section" aria-labelledby="physics-title">
    <p className="phy-eyebrow">THE SUBJECT UNDERNEATH</p>
    <h2 id="physics-title">Physics</h2>
    <p>
      Everything on this site runs on something physical, and a surprising amount of
      it was <em>invented</em> by physicists. Entropy, the Boltzmann distribution,
      diffusion processes, spin glasses, symmetry arguments — machine learning did
      not borrow the vocabulary, it inherited the equations. This is an atlas of
      where those ideas came from, and of the rest of the subject they came from.
    </p>

    <div className="phy-atlas-card">
      <div>
        <span className="phy-eyebrow">THE PHYSICS ATLAS</span>
        <strong>{ideas.length} ideas. {branches.length} branches. One circle.</strong>
        <p>
          Plotted by branch and by how much has to be understood first — the middle
          is what you can feel with your hands, the rim is what nobody has settled.
          {" "}{computeLinks} of them carry a real link to computation.
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
      <li><Link href="/physics#bridge"><span>06</span><strong>Physics &amp; machine learning</strong><small>Shared equations, and one analogy that is only an analogy</small></Link></li>
      <li><Link href="/physics#open"><span>07</span><strong>Still open</strong><small>Around 95% of the universe is labelled, not explained</small></Link></li>
      <li><Link href="/physics#start"><span>08</span><strong>Where to start</strong><small>An order that works, with a test for each stage</small></Link></li>
    </ol>

    <Link href="/physics" className="phy-start">Explore physics <span aria-hidden="true">→</span></Link>
    <p className="phy-note">9 chapters · {ideas.length}-idea interactive atlas · 5 guided routes · 7 open questions</p>
  </section>;
}
