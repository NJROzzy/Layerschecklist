"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";
import "./SectionPage.css";

/**
 * Wrapper for the sections that used to live inline on the home page.
 * They carry .fade-section, which is opacity 0 until an observer marks it
 * visible — on the home page that observer lives in page.tsx, so every
 * standalone route needs its own or the content never appears.
 */
export default function SectionPage({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-section");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      }),
      { threshold: 0.01, rootMargin: "0px 0px -80px 0px" },
    );
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <>
    <ThemeToggle variant="floating" />
    <main className="section-page">
      <Link href="/" className="section-page-back">← Back to Layerchecklist</Link>
      {children}
    </main>
  </>;
}
