"use client";

import { useEffect } from "react";
import Link from "next/link";
import Overview from "./sections/Overview";
import ThemeToggle from "./ThemeToggle";
import PerceptronField from "./PerceptronField";
import Reveal from "./Reveal";

declare global {
  interface Window {
    katex: { render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void };
  }
}

export default function Home() {
  useEffect(() => {
    // Render hero equation once KaTeX has loaded (polling since it's an async CDN script)
    const renderEquation = () => {
      const el = document.getElementById("hero-equation");
      if (window.katex && el) {
        try {
          window.katex.render(
            "y = f\\left(\\sum_{i=1}^{n} w_i x_i + b\\right)",
            el,
            { throwOnError: false, displayMode: true }
          );
        } catch (e) {
          console.error("KaTeX render failed:", e);
        }
        return true;
      }
      return false;
    };

    if (!renderEquation()) {
      const interval = setInterval(() => {
        if (renderEquation()) clearInterval(interval);
      }, 100);
      setTimeout(() => clearInterval(interval), 5000);
    }

    // Navbar shrink/blur on scroll
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav id="navbar">
        <Link href="/about" className="nav-title" aria-label="About Layerchecklist and the person writing it">Layerchecklist</Link>
        <ul>
          <li><Link href="/math">Math</Link></li>
          <li><Link href="/physics">Physics</Link></li>
          <li><Link href="/biology">Biology</Link></li>
          <li><Link href="/python">Python</Link></li>
          <li><Link href="/ai">AI</Link></li>
          <li><Link href="/libraries">Libraries</Link></li>
          <li><Link href="/ml">ML</Link></li>
          <li><Link href="/dl">DL</Link></li>
          <li><Link href="/sql">SQL</Link></li>
          <li><Link href="/ros">ROS</Link></li>
          <li><Link href="/cuda">CUDA</Link></li>
          <li><Link href="/simulations">Simulations</Link></li>
        </ul>
        <ThemeToggle />
      </nav>

      <header className="hero">
        <PerceptronField />

        <div className="hero-content">
          <div id="hero-equation"></div>

          <div className="hero-note">
            <p>The Perceptron</p>

            <p className="hero-note-detail">
              Life is a continuous learning process.
              <br /><br />
              Take in every experience. Give weight to what helps you grow.
              Learn from what causes loss. Adjust, try again, and move forward.
              <br /><br />
              <strong>
                You don&apos;t need to begin with the right weights.
                You just need to keep learning.
              </strong>
            </p>
          </div>
        </div>

        <p className="hero-subtitle">
          Math. Physics. Biology. Then the tools to explore them.
        </p>
      </header>

      <main>
        <Reveal />
        <Overview />
      </main>
    </>
  );
}
