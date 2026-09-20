import Link from "next/link";
import "./Section.css";
import "./AI.css";

export default function AI() {
  return <section id="ai" className="learning-section fade-section" aria-labelledby="ai-foundations-title">
    <p className="ai-home-eyebrow">BEFORE THE LIBRARIES. BEFORE THE MODELS.</p>
    <h2 id="ai-foundations-title">AI Foundations</h2>
    <p>What is artificial intelligence, how does it work, and where does machine learning fit? Begin with the history, explore the ideas, and get to know the tools before building your first model.</p>
    <ol className="ai-home-path">
      <li><Link href="/ai#history"><span>01</span><strong>The history</strong><small>From Turing to today</small></Link></li>
      <li><Link href="/ai#ai-to-ml"><span>02</span><strong>AI → ML → DL</strong><small>Connect the ideas</small></Link></li>
      <li><Link href="/ai#how-ai-works"><span>03</span><strong>How it works</strong><small>Rules, learning, generation</small></Link></li>
      <li><Link href="/ai#tools"><span>04</span><strong>Today’s tools</strong><small>Explore by purpose</small></Link></li>
    </ol>
    <Link href="/ai" className="ai-home-start">Start AI Foundations <span aria-hidden="true">→</span></Link>
    <p className="ai-home-note">10 guided chapters · 6 interactive labs · Sources and a September 2026 market overview</p>
  </section>;
}

