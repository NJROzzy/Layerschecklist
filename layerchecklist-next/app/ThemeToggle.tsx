"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "./theme";

const root = () => document.documentElement;

// The theme lives on <html data-theme>, written by the inline script in the root
// layout before first paint. This component reads that attribute rather than
// keeping a second copy of the truth in React state.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (root().getAttribute("data-theme") === "dark" ? "dark" : "light");
const getServerSnapshot = (): Theme => "light";

/**
 * "nav" sits inside the home page navbar; "floating" pins itself to the corner of
 * a standalone page (/ai, /ml, /dl) that has no navbar of its own.
 */
export default function ThemeToggle({ variant = "nav" }: { variant?: "nav" | "floating" }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    root().setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage: the choice still applies to this page.
    }
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      {...(variant === "nav" ? { id: "theme-toggle" } : { className: "theme-toggle-floating" })}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
    </button>
  );
}
