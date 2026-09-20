import type { ReactNode } from "react";

/** A bar width or similar CSS number: browsers re-serialise these at their own
 *  precision, so anything longer than a couple of decimals breaks hydration. */
export const percent = (value: number) => value.toFixed(2) + "%";

/**
 * An SVG coordinate. Math.cos, Math.sin, Math.exp and friends are not required to
 * be correctly rounded, so Node and the browser disagree in the last bit — which
 * React reports as a hydration mismatch. Two decimals is sub-pixel and identical
 * in both. Every computed coordinate goes through here.
 */
export const at = (value: number) => Number(value.toFixed(2));

/** Fixed-width display for a number that changes under a slider. */
export const show = (value: number, places = 3) =>
  Number.isFinite(value) ? value.toFixed(places) : value > 0 ? "∞" : "−∞";

export function Lab({ id, eyebrow, title, children, question, answer }: {
  id: string; eyebrow: string; title: string; children: ReactNode; question: string; answer: ReactNode;
}) {
  return <section className="math-lab" id={id} aria-labelledby={`${id}-title`}>
    <span className="math-eyebrow">{eyebrow}</span>
    <h3 id={`${id}-title`}>{title}</h3>
    {children}
    <details className="math-lab-check"><summary>Think it through: {question}</summary><div>{answer}</div></details>
  </section>;
}

export function Slider({ id, label, value, min, max, step = 1, onChange, display }: {
  id: string; label: string; value: number; min: number; max: number; step?: number;
  onChange: (value: number) => void; display?: string;
}) {
  return <label className="math-slider" htmlFor={id}>
    <span>{label}<output htmlFor={id}>{display ?? value}</output></span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} />
  </label>;
}

export function Choices<T extends string | number>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void;
}) {
  return <div className="math-choice-row" role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

export function Metrics({ items }: { items: [string, ReactNode, boolean?][] }) {
  return <div className="math-metrics" aria-live="polite" aria-atomic="true">
    {items.map(([label, value, warn]) => <div key={label} className={warn ? "is-warning" : undefined}><span>{label}</span><strong>{value}</strong></div>)}
  </div>;
}

export function Readout({ children }: { children: ReactNode }) {
  return <div className="math-readout" aria-live="polite" aria-atomic="true">{children}</div>;
}
