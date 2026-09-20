"use client";

import { useEffect, useState } from "react";
import { chapters } from "./content";

/**
 * The chapter list at the top of the guide, plus a floating pill that tracks which
 * chapter you are reading. Ten chapters is a long scroll; without this you lose
 * your place and the contents list is far behind you.
 */
export default function ChapterNav() {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = chapters.map(([id]) => document.getElementById(id));

    const update = () => {
      // The active chapter is the last one whose top edge has passed the reading line.
      let current = -1;
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= 140) current = index;
      });
      setActive(current);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {active >= 0 && (
        <div className="ai-chapter-bar">
          <div className="ai-chapter-bar-body">
            <span className="ai-eyebrow">CH {String(active + 1).padStart(2, "0")} / {chapters.length}</span>
            <strong>{chapters[active][1]}</strong>
            <a href="#ai-contents">Chapters ↑</a>
          </div>
          <div className="ai-chapter-bar-track" role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: (progress * 100).toFixed(2) + "%" }} />
          </div>
        </div>
      )}
      <nav id="ai-contents" className="ai-contents" aria-label="AI foundations chapters">
        {chapters.map(([id, label], i) => (
          <a key={id} href={"#" + id} aria-current={i === active ? "true" : undefined}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}
