import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "./ChapterNav";
import { BoidsLab, CartPoleLab, OrbitLab, SimToRealLab, TimestepLab } from "./Sims";
import { ArmLab, LidarLab, PIDLab } from "./Robotics";
import { buildSteps, closing, contactModels, gapCauses, reasons, reviewedOn, reviewedOnISO, stack, toolCategories, tools } from "./content";

export const metadata: Metadata = {
  title: "Simulation: How Virtual Worlds Train Real Systems — Layerchecklist",
  description: "Live, running simulations: integrators and energy drift, timestep stability, emergent flocking, a real CartPole environment, robot arm kinematics and singularities, PID control, lidar and odometry drift, and the sim-to-real gap.",
};

function Heading({ number, title, children }: { number: string; title: string; children?: React.ReactNode }) {
  return <header className="sim-chapter-heading"><span className="sim-eyebrow">CHAPTER {number}</span><h2>{title}</h2>{children}</header>;
}

export default function SimulationsPage() {
  return <main className="sim-page">
    <Link className="sim-back" href="/#simulations">← Back to the learning path</Link>

    <header className="sim-hero">
      <div>
        <p className="sim-eyebrow">SIMULATION / EVERYTHING HERE IS RUNNING</p>
        <h1>Build a world.<br /><span>Then find out where it lies to you.</span></h1>
        <p className="sim-lead">Almost every robot policy and control system is born in a simulator, because reality is slow, expensive and unforgiving. This page runs the physics live in your browser — the orbits, springs, flocks and carts below are all being integrated as you read, not played back.</p>
        <div className="sim-hero-actions"><a className="sim-button" href="#integrators">Start with the integrator ↓</a><a href="#sim2real">Jump to the reality gap ↗</a></div>
      </div>
      <div className="sim-hero-stats" aria-label="What is on this page.">
        {[["8", "live simulations", "real physics, every frame"], ["3", "integrators raced", "and one of them loses"], ["90", "lidar rays", "cast against real walls"], ["240", "episodes per drag", "in the reality-gap panel"]].map(([n, label, detail]) =>
          <div key={label}><strong>{n}</strong><span>{label}</span><small>{detail}</small></div>)}
      </div>
    </header>

    <div className="sim-overview-meta">
      <span>Runs in your browser</span><span>12 chapters</span><span>Nothing pre-recorded</span>
      <span>Tools checked <time dateTime={reviewedOnISO}>{reviewedOn}</time></span>
    </div>

    <ChapterNav />

    <section id="why" className="sim-chapter">
      <Heading number="01" title="A simulator is a bet about what matters.">
        <p>Every simulator is a deliberate simplification: this force counts, that one does not, and the difference is small enough to ignore. Those bets are usually reasonable and occasionally catastrophic, and the whole discipline is knowing which is which.</p>
      </Heading>
      <div className="sim-reason-grid">
        {reasons.map(reason => <article key={reason.title}>
          <h3>{reason.title}</h3>
          <p>{reason.text}</p>
          <p className="sim-cost"><strong>The catch:</strong> {reason.cost}</p>
        </article>)}
      </div>
      <aside className="sim-callout">
        <strong>The question to keep asking</strong>
        <p>Not &ldquo;is this simulator realistic?&rdquo; — nothing is — but &ldquo;is it realistic in the dimensions this task depends on?&rdquo; A navigation policy can tolerate a crude contact model. A manipulation policy cannot, because contact <em>is</em> the task.</p>
      </aside>
    </section>

    <section id="integrators" className="sim-chapter">
      <Heading number="02" title="A simulator is a loop that guesses the next moment.">
        <p>Physics gives you accelerations. What you need is positions, one small step of time later, over and over. How you take that step is the single most consequential choice in the engine, and it is usually three lines of code.</p>
      </Heading>
      <OrbitLab />
    </section>

    <section id="timestep" className="sim-chapter">
      <Heading number="03" title="Every simulator has a speed limit.">
        <p>Step too far and the numbers stop describing anything. Not gradually — a simulation that is slightly too coarse does not look slightly wrong, it looks fine until it detonates.</p>
      </Heading>
      <TimestepLab />
    </section>

    <section id="contact" className="sim-chapter">
      <Heading number="04" title="Contact is where simulators earn their reputation.">
        <p>Bodies flying through space is solved arithmetic. Bodies <em>touching</em> is a discontinuity: a force that is zero one instant and enormous the next, applied over an area nobody measured, between materials nobody characterised. Nearly every difficulty in robotics simulation is downstream of this.</p>
      </Heading>
      <div className="sim-table-wrap" tabIndex={0} role="region" aria-label="Approaches to simulating contact">
        <table>
          <caption>Four ways to answer &ldquo;these two things are touching, now what?&rdquo;</caption>
          <thead><tr><th scope="col">Approach</th><th scope="col">How it works</th><th scope="col">Why you would</th><th scope="col">What it costs</th></tr></thead>
          <tbody>{contactModels.map(model => <tr key={model.name}><th scope="row">{model.name}</th><td>{model.how}</td><td>{model.good}</td><td>{model.bad}</td></tr>)}</tbody>
        </table>
      </div>
      <p>Notice the thread running through all four: each is a different compromise between <strong>stiffness</strong> and <strong>step size</strong>, which is the stability limit from the previous chapter reappearing in physical clothing. A rigid surface is a very stiff spring, a very stiff spring has a high frequency, and a high frequency demands a small step. Engines that feel solid without crawling have found somewhere clever to hide that tension.</p>
      <aside className="sim-callout">
        <strong>Why friction is worse than it looks</strong>
        <p>Coulomb friction is a constraint, not a force you can just add: it says the tangential force stays inside a cone whose size depends on the normal force you are solving for at the same time. That circular dependency is why friction is solved iteratively, why the solver has an iteration budget, and why a stack of boxes in any engine will eventually shiver.</p>
      </aside>
    </section>

    <section id="emergence" className="sim-chapter">
      <Heading number="05" title="The behaviour you wanted is rarely the behaviour you wrote.">
        <p>Simulation is at its most useful when it produces something you did not put in. It is at its most dangerous for exactly the same reason.</p>
      </Heading>
      <BoidsLab />
    </section>

    <section id="environments" className="sim-chapter">
      <Heading number="06" title="An environment is a contract, not a picture.">
        <p>Strip away the rendering and a reinforcement-learning environment is four things: a way to reset to a known state, a way to apply an action, an observation handed back, and a number saying how that went. Everything else is presentation.</p>
      </Heading>
      <div className="sim-contract">
        {[["reset()", "Return to a known starting state and hand back the first observation."],
          ["step(action)", "Advance the physics, and return the next observation and a reward."],
          ["observation", "What the agent is allowed to know. The most consequential design choice you will make."],
          ["reward", "One number per step. The agent will optimise it exactly, including the parts you did not intend."]].map(([name, detail]) =>
          <div key={name}><code>{name}</code><p>{detail}</p></div>)}
      </div>
      <CartPoleLab />
    </section>

    <section id="kinematics" className="sim-chapter">
      <Heading number="07" title="Now put a body on it.">
        <p>Everything so far has been a point or a cart. A robot is a chain of rigid links with motors at the joints, and that changes the question: you no longer command a position, you command angles and hope the hand ends up where you meant.</p>
      </Heading>
      <div className="sim-table-wrap" tabIndex={0} role="region" aria-label="The layers of a robotics stack">
        <table>
          <caption>What a robotics stack is made of, and which parts these panels touch.</caption>
          <thead><tr><th scope="col">Layer</th><th scope="col">Its job</th><th scope="col">On this page</th></tr></thead>
          <tbody>{stack.map(row => <tr key={row.layer}><th scope="row">{row.layer}</th><td>{row.what}</td><td>{row.here}</td></tr>)}</tbody>
        </table>
      </div>
      <ArmLab />
      <aside className="sim-callout">
        <strong>Degrees of freedom, and why arms have seven</strong>
        <p>Two joints in a plane give you exactly enough to reach a point, which is why the panel above has a discrete pair of solutions rather than a continuum. Add a third and there are infinitely many ways to reach the same spot — the arm can writhe while the hand stays still. That redundancy looks wasteful and is the opposite: it is what lets a robot reach the same cup while avoiding a shelf, a person, and its own singularities. A six-jointed arm can place a hand at any position <em>and</em> orientation; a seventh joint exists purely to give it choices about how.</p>
      </aside>
    </section>

    <section id="control" className="sim-chapter">
      <Heading number="08" title="Commanding a joint is not the same as moving it.">
        <p>Kinematics told you which angles you want. Nothing about that makes a motor produce them. Between the two sits a control loop, and its failures — overshoot, oscillation, quietly settling somewhere near but not at the target — are the failures you will actually spend your time on.</p>
      </Heading>
      <PIDLab />
      <p>There is a thread worth noticing here. The gain that is too large produces overshoot and ringing; the gain that is too small crawls. That is the same trade-off as the learning rate in the descent panel on the <Link href="/math#optimization">mathematics page</Link>, and the same one as the timestep in chapter three. A control loop, a training loop and an integrator are all the same shape of problem: how far do you dare move on the strength of local information.</p>
    </section>

    <section id="sensing" className="sim-chapter">
      <Heading number="09" title="A robot that cannot tell you where it is cannot do anything else.">
        <p>Every layer above depends on the pose being known. Kinematics puts the hand somewhere relative to the base; that is useless if the base is somewhere other than you think.</p>
      </Heading>
      <LidarLab />
    </section>

    <section id="sim2real" className="sim-chapter">
      <Heading number="10" title="The simulator was never the point.">
        <p>A policy that works in simulation and fails on hardware is the default outcome, not an unlucky one. The gap has specific, nameable causes, and most of them are things somebody decided not to model.</p>
      </Heading>
      <SimToRealLab />
      <h3>Where the gap actually comes from</h3>
      <div className="sim-cause-grid">
        {gapCauses.map(item => <article key={item.cause}><h4>{item.cause}</h4><p>{item.detail}</p></article>)}
      </div>
      <h3>And how people close it</h3>
      <div className="sim-table-wrap" tabIndex={0} role="region" aria-label="Techniques for closing the reality gap">
        <table>
          <thead><tr><th scope="col">Technique</th><th scope="col">What it does</th><th scope="col">What it costs</th></tr></thead>
          <tbody>{closing.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.what}</td><td>{item.note}</td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section id="tools" className="sim-chapter">
      <Heading number="11" title="Pick the kind of tool before the brand.">
        <p>A physics engine, a robotics platform, an environment API and a domain simulator solve different parts of the problem, and people routinely compare across the categories as though they were competing. Checked against official documentation on {reviewedOn}.</p>
      </Heading>
      {toolCategories.map(category => <div key={category} className="sim-tool-group">
        <h3>{category}</h3>
        <div className="sim-tool-grid">
          {tools.filter(tool => tool.category === category).map(tool => <article key={tool.name}>
            <h4><a href={tool.href}>{tool.name}<span aria-hidden="true"> ↗</span></a></h4>
            <p>{tool.what}</p>
            <p className="sim-check-note"><strong>Check:</strong> {tool.check}</p>
          </article>)}
        </div>
      </div>)}
    </section>

    <section id="build" className="sim-chapter">
      <Heading number="12" title="Build a small one, properly.">
        <p>The instinct is to reach for a photorealistic platform. Resist it. A correct environment of twenty lines will teach you more than a beautiful one you cannot reason about, and these steps are in this order for a reason.</p>
      </Heading>
      <ol className="sim-steps">
        {buildSteps.map((item, i) => <li key={item.step}>
          <span className="sim-eyebrow">STEP {String(i + 1).padStart(2, "0")}</span>
          <strong>{item.step}</strong>
          <p>{item.detail}</p>
          <p className="sim-signal"><strong>Done when:</strong> {item.signal}</p>
        </li>)}
      </ol>
      <aside className="sim-callout">
        <strong>The habit worth forming</strong>
        <p>Every time a simulated result surprises you, work out whether the world did something interesting or the integrator did. It is the integrator far more often than anyone admits, and the people who check are the ones whose results survive contact with hardware.</p>
      </aside>
      <div className="sim-next-grid">
        <Link href="/math#optimization"><span className="sim-eyebrow">THE MATHEMATICS</span><h3>Stepping &amp; optimisation →</h3><p>The stability limit on this page is the learning-rate argument in different clothing.</p></Link>
        <Link href="/ai#how-ai-works"><span className="sim-eyebrow">THE CONTEXT</span><h3>AI Foundations →</h3><p>Where training, evaluation and deployment sit around all of this.</p></Link>
      </div>
    </section>

    <footer className="sim-footer">
      <p>Model what matters. Measure what you modelled. Expect the world to disagree.</p>
      <a href="#why">Back to the beginning ↑</a>
    </footer>
  </main>;
}
