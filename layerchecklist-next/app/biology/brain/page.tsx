import type { Metadata } from "next";
import Link from "next/link";
import BrainExplorer from "./BrainExplorer";
import { NeuronLab, PathwayLab } from "./NervousSystemLabs";
import BodyExplorer from "./BodyExplorer";
import { references } from "./content";
import "./brain.css";

export const metadata: Metadata = {
  title: "Brain & Nervous System Playground — Layerchecklist",
  description: "Explore a rotatable 3D brain, discover ten structures, trace sensory and reflex pathways, and experiment with a neuron's firing threshold and myelin.",
};

export default function BrainPage() {
  return <main className="brain-page">
    <Link className="brain-back" href="/biology">← Biology / the living world</Link>
    <header className="brain-hero">
      <div><p className="brain-kicker">THE BRAIN & NERVOUS SYSTEM / AN INTERACTIVE FIELD GUIDE</p>
        <h1>A world inside<br /><span>your head.</span></h1>
        <p className="brain-lead">A thought, a touch, a movement. Each involves cells communicating across a living network. Get to know its structures, follow its signals, and experiment with the rules that make it work.</p>
      </div>
      <div className="brain-hero-note"><span className="brain-kicker">LEARN BY EXPLORING</span><p>Rotate.<br />Trace.<br /><em>Experiment.</em></p><span>10 structures · 4 playgrounds<br />From the whole body to a single neuron</span></div>
    </header>
    <nav className="brain-page-nav" aria-label="Brain lesson sections"><a href="#brain-atlas">01 <span>The 3D brain</span></a><a href="#nervous-system">02 <span>The bigger system</span></a><a href="#signal-pathways">03 <span>Follow a signal</span></a><a href="#neuron-lab">04 <span>The neuron lab</span></a><a href="#connections">05 <span>Connect the ideas</span></a></nav>

    <section id="brain-atlas" className="brain-section brain-atlas-section" aria-label="Interactive brain anatomy"><BrainExplorer /></section>

    <section id="nervous-system" className="brain-section">
      <header className="brain-section-heading"><span className="brain-kicker">02 / THE BIGGER SYSTEM</span><h2>One network.<br />Central and peripheral.</h2><p>The brain belongs to a system that extends through the body. Distinguish where a structure is from the direction a signal travels.</p></header>
      <BodyExplorer />
      <div className="brain-system-grid">
        <article><span className="brain-card-index">CNS</span><h3>Brain + spinal cord</h3><p>The <strong>central nervous system</strong> integrates information and organizes responses. The spinal cord contains processing circuits of its own, including circuits involved in reflexes.</p><a href="#brain-atlas">Find both in the 3D model ↑</a></article>
        <article><span className="brain-card-index">PNS</span><h3>Connections through the body</h3><p>The <strong>peripheral nervous system</strong> includes nerves and ganglia outside the brain and spinal cord. Sensory pathways bring information inward; motor pathways carry output to effectors such as muscles and glands.</p><a href="#signal-pathways">See the connections below ↓</a></article>
      </div>
      <div className="brain-direction-strip"><div><span>SENSORY / AFFERENT</span><strong>Body → central nervous system</strong><p>Information about the outside world and the body’s internal state.</p></div><div><span>MOTOR / EFFERENT</span><strong>Central nervous system → body</strong><p>Output that influences muscles, glands, and other effectors.</p></div></div>
      <div className="brain-reading-grid"><article><h3>Somatic and autonomic</h3><p>Somatic motor pathways control skeletal muscle, including in reflexes. Autonomic pathways regulate functions such as heart activity, digestion, and gland secretion. Sympathetic and parasympathetic divisions coordinate organ-specific responses; they are not simply universal on/off switches.</p></article><article><h3>Gray matter and white matter</h3><p>Gray matter contains many cell bodies, dendrites, and synapses. White matter contains many myelinated axons that connect regions. Both contain glial cells. The corpus callosum is a large white-matter connection between the cerebral hemispheres.</p></article></div>
      <p className="brain-source-note">Study further: <a href={references[1].url}>NICHD’s guide to the nervous system</a> and <a href={references[2].url}>the Society for Neuroscience brain map</a>.</p>
    </section>

    <section id="signal-pathways" className="brain-section">
      <header className="brain-section-heading"><span className="brain-kicker">03 / THE SIGNAL PLAYGROUND</span><h2>Follow a signal.</h2><p>Choose a touch, a voluntary movement, or a withdrawal reflex. Step through the route and watch where the central and peripheral systems meet.</p></header>
      <PathwayLab />
      <aside className="brain-takeaway"><span>TRY THIS</span><p>Compare touch with the withdrawal reflex. Which route needs a cortical stage for conscious perception? Which can organize a motor response through spinal circuits before conscious recognition?</p></aside>
      <p className="brain-source-note">The reflex example draws on <a href={references[5].url}>Purves and colleagues’ explanation of spinal circuitry</a>.</p>
    </section>

    <section id="neuron-lab" className="brain-section">
      <header className="brain-section-heading"><span className="brain-kicker">04 / THE NEURON PLAYGROUND</span><h2>Small cells.<br />Electrical conversations.</h2><p>Neurons receive inputs, integrate them, and send signals. Select a cell part, then change the inputs below to see when this simplified neuron fires.</p></header>
      <NeuronLab />
      <aside className="brain-takeaway"><span>TRY THIS</span><p>Start with low excitation and no inhibition. Increase excitation until spikes appear, then add inhibition. What changes: spike count or spike height? Next, double the axon distance and compare the travel time.</p></aside>
      <p className="brain-source-note">For the biological basis of conduction, read <a href={references[4].url}>how myelination supports faster signal propagation</a>.</p>
    </section>

    <section id="connections" className="brain-section">
      <header className="brain-section-heading"><span className="brain-kicker">05 / CONNECT THE IDEAS</span><h2>More than the sum<br />of its regions.</h2><p>The colored areas make anatomy easier to learn. Real behavior emerges from cells, pathways, feedback, and experience working together.</p></header>
      <div className="brain-concept-grid">
        <article><span className="brain-card-index">01</span><h3>Cells support other cells</h3><p>Glia help maintain the neural environment. Astrocytes have metabolic and signaling roles; microglia participate in immune surveillance. Oligodendrocytes make myelin in the CNS, while Schwann cells make it in the PNS.</p></article>
        <article><span className="brain-card-index">02</span><h3>Synapses connect the conversation</h3><p>Most synapses communicate chemically through transmitter release and receptors. Electrical synapses use gap junctions to couple cells directly. A synapse’s effect depends on its properties and the state of the receiving cell.</p></article>
        <article><span className="brain-card-index">03</span><h3>Experience can change circuits</h3><p>Plasticity includes changes in synaptic strength, structure, and cellular excitability. Learning can involve several mechanisms over different timescales. A useful explanation asks what changed, in which circuit, and what evidence shows it.</p></article>
      </div>
      <div className="brain-checkpoints"><h3>Pause and explain it to yourself.</h3>
        <details className="brain-details"><summary>Does one colored region do one job?</summary><p>No. Regions contain different cell populations and participate in multiple networks. The lobe descriptions are starting points for exploring contributions, not a one-to-one map of functions.</p></details>
        <details className="brain-details"><summary>Is a reflex outside the central nervous system?</summary><p>A spinal reflex uses the spinal cord, which is part of the CNS. It can organize a response without waiting for a conscious decision, and descending pathways from the brain can modify it.</p></details>
        <details className="brain-details"><summary>Does a stronger input make an action potential taller?</summary><p>In the model above, every spike has the same drawing height. Stronger sustained input can increase the number of spikes per unit time. Biological action potentials are regenerative events; their amplitude is not a simple proportional measure of input strength.</p></details>
        <details className="brain-details"><summary>Are people either “left-brained” or “right-brained”?</summary><p>Some functions show lateralization, but the hemispheres communicate and cooperate. Dividing people into a logical left-brain type and a creative right-brain type does not describe how cognition works.</p></details>
      </div>
    </section>

    <section className="brain-section brain-references" aria-labelledby="brain-references-title"><span className="brain-kicker">KEEP EXPLORING / SOURCES</span><h2 id="brain-references-title">Go deeper into the science.</h2><p>The anatomy and explanations follow these educational references. The 3D geometry, pathway sequences, and numerical experiments are simplified teaching models.</p><ul>{references.map((r,i)=><li key={r.url}><span>{String(i+1).padStart(2,"0")}</span><div><a href={r.url}>{r.name} ↗</a><p>{r.detail}</p></div></li>)}</ul></section>
    <footer className="brain-footer"><Link href="/biology">← Back to all of Biology</Link><a href="#brain-atlas">Return to the brain ↑</a></footer>
  </main>;
}
