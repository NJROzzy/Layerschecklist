"use client";

import { useEffect, useRef } from "react";

type Katex = { render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void };

/**
 * Renders TeX with the KaTeX bundle the root layout already loads from a CDN.
 * `plain` is what the server sends and what the first client render produces, so
 * hydration matches; KaTeX then replaces it in place. If the CDN never arrives,
 * the plain text is a real fallback rather than an empty box.
 */
export default function Formula({ tex, plain, display = false }: { tex: string; plain: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const attempt = () => {
      const katex = (window as unknown as { katex?: Katex }).katex;
      if (!katex) return false;
      try {
        katex.render(tex, element, { throwOnError: false, displayMode: display });
      } catch {
        // Leave the plain-text fallback in place.
      }
      return true;
    };

    if (attempt()) return;
    const poll = setInterval(() => { if (attempt()) clearInterval(poll); }, 120);
    const giveUp = setTimeout(() => clearInterval(poll), 6000);
    return () => { clearInterval(poll); clearTimeout(giveUp); };
  }, [tex, display]);

  return <span className={display ? "math-tex-display" : "math-tex"} ref={ref}>{plain}</span>;
}
