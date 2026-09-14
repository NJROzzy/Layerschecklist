"use client";

import { useEffect } from "react";
import Math from "./sections/Math";
import PythonFundamentals from "./sections/PythonFundamentals";
import PythonLibraries from "./sections/PythonLibraries";
import ML from "./sections/ML";
import DL from "./sections/DL";
import SQL from "./sections/SQL";
import ROS from "./sections/ROS";
import CUDA from "./sections/CUDA";
import SimulationsEnv from "./sections/SimulationsEnv";

declare global {
  interface Window {
    katex: any;
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

    // Dark/light mode toggle
    const toggleBtn = document.getElementById("theme-toggle");
    const root = document.documentElement;

    function applyTheme(theme: string) {
      root.setAttribute("data-theme", theme);
      if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    applyTheme(savedTheme);

    const handleToggleClick = () => {
      const newTheme =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    };
    toggleBtn?.addEventListener("click", handleToggleClick);

    // Navbar shrink/blur on scroll
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Fade-in sections on scroll into view
    const sections = document.querySelectorAll(".fade-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Once visible, stop watching it
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      toggleBtn?.removeEventListener("click", handleToggleClick);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <nav id="navbar">
        <span className="nav-title">Layerchecklist</span>
        <ul>
          <li><a href="#math">Math</a></li>
          <li><a href="#python-fundamentals">Python</a></li>
          <li><a href="#python-libraries">Libraries</a></li>
          <li><a href="#ml">ML</a></li>
          <li><a href="#dl">DL</a></li>
          <li><a href="#sql">SQL</a></li>
          <li><a href="#ros">ROS</a></li>
          <li><a href="#cuda">CUDA</a></li>
          <li><a href="#simulations">Simulations</a></li>
        </ul>
        <button id="theme-toggle" aria-label="Toggle dark mode">🌙</button>
      </nav>

      <header className="hero">
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
          Learning machines. Learning mathematics. Learning how to learn.
        </p>
      </header>

      <main>
        <Math />
        <PythonFundamentals />
        <PythonLibraries />
        <ML />
        <DL />
        <SQL />
        <ROS />
        <CUDA />
        <SimulationsEnv />
      </main>
    </>
  );
}