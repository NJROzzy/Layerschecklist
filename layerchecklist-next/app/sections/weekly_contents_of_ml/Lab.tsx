import type { ReactNode } from "react";
import "./Lab.css";

export function Lab({ id, title, children, question, answer }: { id: string; title: string; children: ReactNode; question: string; answer: string }) {
  return <section className="ml-lab" id={id} aria-labelledby={`${id}-title`}>
    <span className="ml-eyebrow">EXPLORE THE IDEA</span>
    <h3 id={`${id}-title`}>{title}</h3>
    {children}
    <details className="ml-lab-check"><summary>Think it through: {question}</summary><p>{answer}</p></details>
  </section>;
}

export function Slider({ id, label, value, min, max, step = 1, onChange, display }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void; display?: string }) {
  return <label className="ml-slider" htmlFor={id}><span>{label}<output htmlFor={id}>{display ?? value}</output></span><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}

export function Metrics({ items }: { items: [string, ReactNode][] }) {
  return <div className="ml-lab-metrics" aria-live="polite" aria-atomic="true">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

export function Choices<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <div className="ml-lab-choices" role="group" aria-label={label}>{options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>;
}

export function ScrollTable({ label, children }: { label: string; children: ReactNode }) {
  return <div className="ml-lab-table" tabIndex={0} role="region" aria-label={label}>{children}</div>;
}
