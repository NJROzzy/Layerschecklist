"use client";

import { useEffect, useState } from "react";
import { chapters } from "./content";

export default function ChapterNav() {
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const sections = chapters.map(([id]) => document.getElementById(id));
    const update = () => {
      let current = -1;
      sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= 140) current = i; });
      setActive(current);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <>
    {active >= 0 && <div className="bio-bar">
      <div className="bio-bar-body">
        <span className="bio-eyebrow">CH {String(active + 1).padStart(2, "0")} / {chapters.length}</span>
        <strong>{chapters[active][1]}</strong><a href="#bio-contents">Chapters ↑</a>
      </div>
      <div className="bio-bar-track" role="progressbar" aria-label="Reading progress" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: (progress * 100).toFixed(2) + "%" }} />
      </div>
    </div>}
    <nav id="bio-contents" className="bio-contents" aria-label="Chapters">
      {chapters.map(([id, label], i) => <a key={id} href={"#" + id} aria-current={i === active ? "true" : undefined}>
        <span>{String(i + 1).padStart(2, "0")}</span>{label}</a>)}
    </nav>
  </>;
}
