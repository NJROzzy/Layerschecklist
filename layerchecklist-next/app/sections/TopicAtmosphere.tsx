"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import TopicScene from "./TopicScene";
import type { MotifKind } from "./TopicMotif";
import "./TopicAtmosphere.css";

export default function TopicAtmosphere({ children, topics, id }: { children: ReactNode; topics: MotifKind[]; id: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MotifKind | null>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    // CSS handles the motion. The observer only pauses illustrations outside the viewport.
    const observer = new IntersectionObserver(entries => {
      element.dataset.inView = String(entries.some(entry => entry.isIntersecting));
    }, { rootMargin: "80px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function follow(target: EventTarget | null) {
    if (!(target instanceof Element)) return;
    const topic = target.closest<HTMLElement>("[data-topic]")?.dataset.topic;
    if (topic && topics.includes(topic as MotifKind)) setSelected(topic as MotifKind);
  }

  return <div className="topic-atmosphere" ref={root} data-in-view="false" data-topic-group={id}
    onPointerOver={event => follow(event.target)} onFocusCapture={event => follow(event.target)}>
    <div className="topic-rail topic-rail-left"><TopicScene key={selected ?? topics[0]} topic={selected ?? topics[0]} side="left" /></div>
    <div className="topic-center">{children}</div>
    <div className="topic-rail topic-rail-right"><TopicScene key={selected ?? topics[Math.min(2, topics.length - 1)]} topic={selected ?? topics[Math.min(2, topics.length - 1)]} side="right" /></div>
  </div>;
}
