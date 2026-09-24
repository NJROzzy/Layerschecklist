import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { dlRoadmap } from "../sections/weekly_contents_of_dl/roadmap";
import "./map.css";

export const metadata: Metadata = {
  title: "Deep Learning Map — Layerchecklist",
  description: "Explore 14 connected weeks of deep learning, from statistical learning and neural networks to transformers, generative models, and deep reinforcement learning.",
};

export default function DLPage() {
  return (
    <main className="dl-page dl-map-page">
      <Link href="/#ov-learning" className="back-link">&larr; Back to Layerchecklist</Link>

      <header className="dl-map-header">
        <p className="dl-eyebrow">ONE IDEA BUILDS ON THE NEXT</p>
        <h1>Your deep learning map.</h1>
        <p className="dl-intro">
          From your first neuron to learning through experience. Follow the path
          in order, or open any week to explore what comes next.
        </p>
        <div className="dl-map-summary">
          <span>{dlRoadmap.length} connected weeks</span>
          <span>{dlRoadmap.filter((lesson) => lesson.ready).length} lessons ready</span>
        </div>
      </header>

      <nav id="dl-weeks" className="dl-learning-map" aria-label="Deep learning weeks in learning order">
        <ol className="dl-map-path" role="list">
          {dlRoadmap.map((lesson, index) => {
            const row = Math.floor(index / 3);
            const movesLeft = row % 2 === 1;
            const column = movesLeft ? 3 - (index % 3) : (index % 3) + 1;
            const direction = index === dlRoadmap.length - 1
              ? "end"
              : index % 3 === 2 ? "down" : movesLeft ? "left" : "right";

            return (
              <li
                id={`week-${lesson.week}`}
                className={`dl-map-node dl-map-${direction} ${lesson.ready ? "is-ready" : "is-upcoming"}`}
                key={lesson.week}
                style={{ "--map-column": column, "--map-row": row + 1 } as CSSProperties}
              >
                <Link href={`/dl/week-${lesson.week}`} className="dl-map-card">
                  <div className="dl-map-card-top">
                    <span className="dl-map-number" aria-hidden="true">{String(lesson.week).padStart(2, "0")}</span>
                    <span className="dl-map-status">{lesson.ready ? "Lesson ready" : "Coming soon"}</span>
                  </div>
                  <p className="dl-map-week">Week {lesson.week}</p>
                  <h2>{lesson.title}</h2>
                  <span className="dl-map-action">{lesson.ready ? "Read lesson" : "View week"}<span aria-hidden="true">&rarr;</span></span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <footer className="dl-map-footer">
        <p>Every week is another layer of understanding.</p>
        <Link href="/dl/week-0">Start with Week 0 &rarr;</Link>
      </footer>
    </main>
  );
}
