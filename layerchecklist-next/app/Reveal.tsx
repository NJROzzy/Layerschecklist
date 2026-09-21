"use client";

import { useEffect } from "react";
import "./reveal.css";

/**
 * Reveals anything marked [data-reveal] as it scrolls into view, once.
 * Mounted once per page; the elements themselves stay server-rendered, and
 * they are visible without JavaScript because the hidden state is only
 * applied after this has run.
 */
export default function Reveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach(el => el.classList.add("is-revealed"));
      return;
    }

    document.documentElement.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
