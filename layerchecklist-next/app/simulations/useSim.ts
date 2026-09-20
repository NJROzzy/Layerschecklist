"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const motionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");

function subscribeMotion(onChange: () => void) {
  const query = motionQuery();
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Honour the reader's motion setting before anything starts moving. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => motionQuery().matches, () => false);
}

/**
 * A frame loop that only burns cycles when it should: paused when the reader
 * pauses it, and paused when the panel is scrolled off screen. The callback
 * writes straight to the DOM through refs, so React never re-renders per frame.
 */
export function useSimLoop(ref: RefObject<Element | null>, running: boolean, onFrame: (dt: number) => void) {
  const frame = useRef(onFrame);
  useEffect(() => { frame.current = onFrame; });

  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => setOnScreen(entries[0].isIntersecting), { rootMargin: "120px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!running || !onScreen) return;
    let id = 0, last = performance.now();
    const tick = (now: number) => {
      // Clamp the step: a backgrounded tab can hand back an enormous dt.
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      frame.current(dt);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running, onScreen]);
}

/**
 * Play/pause that starts from the reader's motion preference but can always be
 * overridden. `null` means "follow the system setting".
 */
export function usePlayback() {
  const reduced = usePrefersReducedMotion();
  const [override, setOverride] = useState<boolean | null>(null);
  const running = override ?? !reduced;
  return { running, reduced, toggle: () => setOverride(!running) };
}
