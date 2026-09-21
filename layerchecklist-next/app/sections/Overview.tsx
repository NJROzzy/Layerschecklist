import Link from "next/link";
import type { CSSProperties } from "react";
import ScienceFlow from "../ScienceFlow";
import TopicMotif, { type MotifKind } from "./TopicMotif";
import { concepts as mathConcepts } from "../math/universe";
import { ideas as physicsIdeas } from "../physics/universe";
import { ideas as biologyIdeas } from "../biology/universe";
import "./Overview.css";

const groups = [
  {
    id: "foundations",
    eyebrow: "PART ONE",
    title: "The foundations",
    blurb: "Three subjects, in the order they depend on each other. Each one opens with an interactive atlas — every idea in the field as a single circle, arranged by branch and by how much has to be understood first.",
    items: [
      { href: "/math", motif: "math" as MotifKind, name: "Math", note: "From what a number is to the open problems, by way of linear algebra, calculus and probability.", stat: `${mathConcepts.length} ideas mapped` },
      { href: "/physics", motif: "physics" as MotifKind, name: "Physics", note: "The rules underneath, and the places they share equations with machine learning rather than metaphors.", stat: `${physicsIdeas.length} ideas mapped` },
      { href: "/biology", motif: "biology" as MotifKind, name: "Biology", note: "Living systems: cells, heredity, evolution and ecology, with interactive models.", stat: `${biologyIdeas.length} ideas mapped` },
      { href: "/notation", motif: "notation" as MotifKind, name: "Reading the notation", note: "Translate θ, ∇, Σ and argmin into plain sentences. Start here if equations are the obstacle.", stat: "Symbol by symbol" },
    ],
  },
  {
    id: "tools",
    eyebrow: "PART TWO",
    title: "The tools",
    blurb: "Nothing here is theory. This is the layer where an idea becomes something that runs, and where most of the day actually goes.",
    items: [
      { href: "/python", motif: "python" as MotifKind, name: "Python Fundamentals", note: "Types, control flow, functions and the patterns that recur in every ML codebase.", stat: "The language itself" },
      { href: "/libraries", motif: "libraries" as MotifKind, name: "Python Libraries", note: "NumPy, pandas, Matplotlib and the rest of the toolkit for data and numerical work.", stat: "The working toolkit" },
      { href: "/sql", motif: "sql" as MotifKind, name: "SQL", note: "Organise, query and join the data behind an experiment before it reaches a model.", stat: "Where the data lives" },
      { href: "/cuda", motif: "cuda" as MotifKind, name: "CUDA", note: "Parallel computation on the GPU, and the hardware model underneath every training run.", stat: "Why it is fast" },
      { href: "/ros", motif: "ros" as MotifKind, name: "ROS", note: "Nodes, topics and services — wiring sensing, communication and control together.", stat: "Robots, plumbed" },
    ],
  },
  {
    id: "learning",
    eyebrow: "PART THREE",
    title: "Machine learning",
    blurb: "The field itself, taken in order: what it is, then how to do it, then what breaks. Every chapter ends where the subject is genuinely unresolved rather than where the explanation ran out.",
    items: [
      { href: "/ai", motif: "ai" as MotifKind, name: "AI Foundations", note: "What the field is, how a system works, and how to judge a result — before any notation.", stat: "10 chapters" },
      { href: "/ml", motif: "ml" as MotifKind, name: "Machine Learning", note: "Week by week, from cleaning data through models, features and optimisation.", stat: "5 weeks" },
      { href: "/dl", motif: "dl" as MotifKind, name: "Deep Learning", note: "The longer path through architectures, training dynamics and the things that go wrong.", stat: "14 weeks" },
    ],
  },
  {
    id: "doing",
    eyebrow: "PART FOUR",
    title: "Simulation & robotics",
    blurb: "Where the mathematics stops being notation. Everything in the lab is integrating real equations in your browser, frame by frame — none of it is a recording.",
    items: [
      { href: "/simulations", motif: "lab" as MotifKind, name: "The simulation lab", note: "Integrators racing an orbit, timestep stability, flocking, CartPole, arm kinematics, PID, lidar and the reality gap.", stat: "8 live simulations" },
      { href: "/simulators", motif: "simulators" as MotifKind, name: "Simulation environments", note: "MuJoCo, Isaac Sim, Gazebo and the rest — what each models and how well it transfers.", stat: "Tool reference" },
    ],
  },
];

/** The whole site, described in one place, directly beneath the hero. */
export default function Overview() {
  return <div className="overview">
    <section className="ov-intro" aria-labelledby="ov-intro-title" data-reveal>
      <p className="ov-eyebrow">WHAT THIS IS</p>
      <h2 id="ov-intro-title">Math. Physics. Biology. Then the tools to explore them.</h2>
      <p className="ov-lead">
        Most explanations of this material pick one of two failure modes: they stay so high
        that nothing is learnable, or they open with notation and lose everyone who has not
        already seen it. Layerchecklist is an attempt at the third option — start from what
        you already know, add one layer at a time, and never hide behind a symbol that has
        not been earned.
      </p>
      <p>
        It is organised in four parts. The <strong>foundations</strong> come first because
        everything else quietly assumes them. The <strong>tools</strong> turn an idea into
        something that runs. <strong>Machine learning</strong> is the field itself. And the{" "}
        <strong>simulation lab</strong> is where it all has to survive contact with real
        equations. You can read straight through, or drop into any part.
      </p>
      <div className="ov-figures" data-reveal style={{ "--reveal-step": 1 } as CSSProperties}>
        <div><strong>{mathConcepts.length}</strong><span>mathematical ideas mapped</span></div>
        <div><strong>{physicsIdeas.length}</strong><span>physics ideas mapped</span></div>
        <div><strong>{biologyIdeas.length}</strong><span>biology ideas mapped</span></div>
        <div><strong>8 + 3</strong><span>simulation labs + biology models</span></div>
      </div>
    </section>

    {groups.map(group => <section key={group.id} className="ov-group" aria-labelledby={`ov-${group.id}`}>
      <header data-reveal>
        <p className="ov-eyebrow">{group.eyebrow}</p>
        <h2 id={`ov-${group.id}`}>{group.title}</h2>
        <p>{group.blurb}</p>
      </header>
      {group.id === "foundations" && <div data-reveal><ScienceFlow /></div>}
      <ul className="ov-cards">
        {group.items.map((item, i) => <li key={item.href} data-reveal style={{ "--reveal-step": i } as CSSProperties}>
          <Link href={item.href}>
            <TopicMotif kind={item.motif} />
            <strong>{item.name}</strong>
            <span>{item.note}</span>
            <em>{item.stat}</em>
          </Link>
        </li>)}
      </ul>
    </section>)}

  </div>;
}
