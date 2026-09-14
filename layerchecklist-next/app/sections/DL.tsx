import Link from "next/link";
import { dlRoadmap } from "./weekly_contents_of_dl/roadmap";
import "./Section.css";
import "./DL.css";

export default function DL() {
    return (
      <section id="dl" className="learning-section fade-section">
        <h2>Deep Learning</h2>
        <p>
          A 14-week series — starting from the bridge between classical ML and
          neural networks, then building up through architectures, training
          techniques, generative models, and reinforcement learning.
        </p>
  
        <div className="roadmap">
          {dlRoadmap.map((item) => (
            <div key={item.week} className={`roadmap-item ${item.ready ? "ready" : "pending"}`}>
              <span className="roadmap-week">Week {item.week}</span>
              <Link href={`/dl/week-${item.week}`} className="roadmap-title roadmap-lesson-link">
                {item.title}
              </Link>
              <span className="roadmap-status">
                {item.ready ? "Available" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
  
        <Link href="/dl" className="read-more-link">Explore the DL learning map &rarr;</Link>
      </section>
    );
  }
