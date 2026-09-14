import Link from "next/link";
import { mlRoadmap } from "./weekly_contents_of_ml/roadmap";
import "./Section.css";
import "./ML.css";

export default function ML() {
    return (
      <section id="ml" className="learning-section fade-section">
        <h2>ML Fundamentals</h2>
        <p>
          A week-by-week series — starting from the unglamorous but essential
          work of cleaning data, then building up through classical models,
          feature engineering, and optimization.
        </p>
  
        <div className="roadmap">
          {mlRoadmap.map((item) => (
            <div key={item.week} className={`roadmap-item ${item.ready ? "ready" : "pending"}`}>
              <span className="roadmap-week">Week {item.week}</span>
              <Link href={`/ml/week-${item.week}`} className="roadmap-title roadmap-lesson-link">
                {item.title}
              </Link>
              <span className="roadmap-status">
                {item.ready ? "Available" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
  
        <Link href="/ml" className="read-more-link">Explore the ML learning map &rarr;</Link>
      </section>
    );
  }
