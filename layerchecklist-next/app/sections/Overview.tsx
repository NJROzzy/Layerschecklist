"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import ScienceFlow from "../ScienceFlow";
import TopicMotif, { type MotifKind } from "./TopicMotif";
import TopicAtmosphere from "./TopicAtmosphere";
import { concepts as mathConcepts } from "../math/universe";
import { ideas as physicsIdeas } from "../physics/universe";
import { ideas as biologyIdeas } from "../biology/universe";
import "./Overview.css";

const groups = [
  {
    id: "foundations",
    eyebrow: "PART ONE",
    title: "The foundations",
    blurb: "Begin with Math, continue into Physics, then explore Biology. Each subject opens with an interactive atlas of selected ideas, arranged by branch and study level. Follow a connection and see where it takes you.",
    items: [
      { href: "/math", motif: "math" as MotifKind, name: "Math", note: "From what a number is to the open problems, by way of linear algebra, calculus and probability.", stat: `${mathConcepts.length} ideas mapped` },
      { href: "/physics", motif: "physics" as MotifKind, name: "Physics", note: "Matter, motion, fields and chance, with connections to living systems and computing.", stat: `${physicsIdeas.length} ideas mapped` },
      { href: "/biology", motif: "biology" as MotifKind, name: "Biology", note: "Living systems: cells, heredity, evolution and ecology, with interactive models.", stat: `${biologyIdeas.length} ideas mapped` },
      { href: "/notation", motif: "notation" as MotifKind, name: "Reading the notation", note: "Translate θ, ∇, Σ and argmin into plain sentences. Start here if equations are the obstacle.", stat: "Symbol by symbol" },
    ],
  },
  {
    id: "tools",
    eyebrow: "PART TWO",
    title: "The tools",
    blurb: "Turn an idea into something you can run. Write a program, work with arrays and data, explore parallel computation, and connect the parts of a robot.",
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
    blurb: "Start with what AI is and how to judge a result. Then learn how models use data, how neural networks build representations, and how to investigate their mistakes.",
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
    blurb: "Make a prediction, change a parameter, and watch what happens. Explore motion, control and sensing in interactive labs, then learn about the environments used to model more complex worlds.",
    items: [
      { href: "/simulations", motif: "lab" as MotifKind, name: "The simulation lab", note: "Live physics and robotics, Isaac and MuJoCo examples, hybrid models, DDPG and A3C.", stat: "8 live simulations + 4 learning panels" },
      { href: "/simulators", motif: "simulators" as MotifKind, name: "Simulation environments", note: "Isaac Sim, Isaac Lab and MuJoCo: choose a physics engine, task framework and learning algorithm.", stat: "Tool reference" },
    ],
  },
];

/** The whole site, described in one place, directly beneath the hero. */
export default function Overview() {
  const [paused, setPaused] = useState(false);
  return <div className="overview" data-motion={paused ? "paused" : "running"}>
    <section className="ov-intro" aria-labelledby="ov-intro-title" data-reveal>
      <p className="ov-eyebrow">A CONNECTED PLACE TO LEARN</p>
      <h2 id="ov-intro-title">One idea leads<br />to another.</h2>
      <p className="ov-lead">
        Explore the language of mathematics, the laws of physics and the systems of biology.
        Then use code, learning algorithms and simulations to ask your own questions.
        Layerchecklist brings the maps, lessons and experiments together, one layer at a time.
      </p>
      <p>
        It is organised in four parts. The <strong>foundations</strong> come first because
        they give you a language for what follows. The <strong>tools</strong> turn an idea into
        something that runs. <strong>Machine learning</strong> explores how systems learn from data.
        The <strong>simulation lab</strong> lets you experiment with models of the world.
        Follow the path, or start with a question that interests you.
      </p>
      <div className="ov-intro-actions"><Link href="/math">Start with Math <span aria-hidden="true">↗</span></Link><a href="#ov-foundations">Explore the whole site ↓</a></div>
      <div className="ov-figures" data-reveal style={{ "--reveal-step": 1 } as CSSProperties}>
        <div><strong>{mathConcepts.length}</strong><span>mathematical ideas mapped</span></div>
        <div><strong>{physicsIdeas.length}</strong><span>physics ideas mapped</span></div>
        <div><strong>{biologyIdeas.length}</strong><span>biology ideas mapped</span></div>
        <div><strong>8 + 3</strong><span>simulation labs + biology models</span></div>
      </div>
      <div className="ov-motion-control"><span>Explore a topic to change the illustrations.</span><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Resume motion" : "Pause motion"}</button></div>
    </section>

    {groups.map(group => <TopicAtmosphere key={group.id} id={group.id} topics={group.items.map(item => item.motif)}><section className="ov-group" aria-labelledby={`ov-${group.id}`}>
      <header data-reveal>
        <p className="ov-eyebrow">{group.eyebrow}</p>
        <h2 id={`ov-${group.id}`}>{group.title}</h2>
        <p>{group.blurb}</p>
      </header>
      {group.id === "foundations" && <div data-reveal><ScienceFlow /></div>}
      <ul className="ov-cards">
        {group.items.map((item, i) => <li key={item.href} data-reveal style={{ "--reveal-step": i } as CSSProperties}>
          <Link href={item.href} data-topic={item.motif}>
            <TopicMotif kind={item.motif} />
            <strong>{item.name}</strong>
            <span>{item.note}</span>
            <em>{item.stat}</em>
          </Link>
        </li>)}
      </ul>
    </section></TopicAtmosphere>)}

    <footer className="ov-footer" data-reveal><span className="ov-eyebrow">KEEP FOLLOWING THE CONNECTIONS</span><p>A question in one subject can become your starting point in another.</p><Link href="/about">Meet the person behind Layerchecklist ↗</Link></footer>

  </div>;
}
