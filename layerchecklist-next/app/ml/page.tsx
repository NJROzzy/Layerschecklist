import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { mlRoadmap } from "../sections/weekly_contents_of_ml/roadmap";
import "./map.css";

export const metadata: Metadata = {
  title: "Machine Learning Map — Layerchecklist",
  description: "Explore five connected weeks of machine learning, from data cleaning and classical models to feature engineering, optimization, and neural networks with TensorFlow.",
};

export default function MLPage() {
  const readyCount = mlRoadmap.filter((lesson) => lesson.ready).length;

  return (
    <main className="ml-page ml-map-page">
      <Link href="/#ml" className="back-link">&larr; Back to Layerchecklist</Link>

      <header className="ml-map-header">
        <p className="ml-eyebrow">ONE IDEA BUILDS ON THE NEXT</p>
        <h1>Your machine learning map.</h1>
        <p className="ml-intro">
          From preparing your data to building your first models. Follow the
          path in order, or open any week to explore what comes next.
        </p>
        <div className="ml-map-summary">
          <span>{mlRoadmap.length} connected weeks</span>
          <span>{readyCount > 0 ? `${readyCount} ${readyCount === 1 ? "lesson" : "lessons"} ready` : "Lessons coming soon"}</span>
        </div>
      </header>

      <nav id="ml-weeks" className="ml-learning-map" aria-label="Machine learning weeks in learning order">
        <ol className="ml-map-path" role="list">
          {mlRoadmap.map((lesson, index) => {
            const row = Math.floor(index / 3);
            const movesLeft = row % 2 === 1;
            const column = movesLeft ? 3 - (index % 3) : (index % 3) + 1;
            const direction = index === mlRoadmap.length - 1
              ? "end"
              : index % 3 === 2 ? "down" : movesLeft ? "left" : "right";

            return (
              <li
                id={`week-${lesson.week}`}
                className={`ml-map-node ml-map-${direction} ${lesson.ready ? "is-ready" : "is-upcoming"}`}
                key={lesson.week}
                style={{ "--map-column": column, "--map-row": row + 1 } as CSSProperties}
              >
                <Link href={`/ml/week-${lesson.week}`} className="ml-map-card">
                  <div className="ml-map-card-top">
                    <span className="ml-map-number" aria-hidden="true">{String(lesson.week).padStart(2, "0")}</span>
                    <span className="ml-map-status">{lesson.ready ? "Lesson ready" : "Coming soon"}</span>
                  </div>
                  <p className="ml-map-week">Week {lesson.week}</p>
                  <h2>{lesson.title}</h2>
                  <span className="ml-map-action">{lesson.ready ? "Read lesson" : "View week"}<span aria-hidden="true">&rarr;</span></span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <footer className="ml-map-footer">
        <p>Build your understanding, one week at a time.</p>
        <Link href="/ml/week-0">Explore Week 0 &rarr;</Link>
      </footer>
    </main>
  );
}
