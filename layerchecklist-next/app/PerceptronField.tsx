"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./simulations/useSim";
import { clamp, curve, CYCLE_SECONDS, INPUTS, learn, makeRun, MID_Y, NEURON_X, NODE_X, NODE_Y, OUT_X, pointOnConnection, predict, round, seeded } from "./perceptron-model";
import "./perceptron-field.css";

const TRAIL = 5;
const dustRandom = seeded(41);
const dust = Array.from({ length: 42 }, () => ({ x: round(105 + dustRandom() * 680), y: round(110 + dustRandom() * 470), r: round(.6 + dustRandom()), phase: dustRandom() * Math.PI * 2 }));
function initialAnimation() {
  const run = makeRun(7);
  return { run, prediction: predict(run), weights: [...run.w], phase: 0, time: 0, applied: false, holding: 0, seed: 7 };
}
const set = (element: Element | null | undefined, attributes: Record<string, number | string>) => {
  if (!element) return;
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, typeof value === "number" ? String(round(value)) : value);
};

/** Inputs, predictions and error correction share one clock and one actual training step. */
export default function PerceptronField() {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const glowId = useId();
  const root = useRef<HTMLDivElement>(null);
  const edges = useRef<(SVGPathElement | null)[]>([]);
  const signals = useRef<(SVGCircleElement | null)[]>([]);
  const feedback = useRef<(SVGCircleElement | null)[]>([]);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const inputRings = useRef<(SVGCircleElement | null)[]>([]);
  const rings = useRef<(SVGCircleElement | null)[]>([]);
  const stars = useRef<(SVGCircleElement | null)[]>([]);
  const neuron = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const orbit = useRef<SVGGElement>(null);
  const axon = useRef<SVGPathElement>(null);
  const output = useRef<SVGCircleElement>(null);
  const outputPulse = useRef<SVGCircleElement>(null);
  const outputLabel = useRef<SVGTextElement>(null);
  const phaseLabel = useRef<HTMLSpanElement>(null);
  const model = useRef(initialAnimation());

  const paint = useCallback((still = false) => {
    const state = model.current, p = state.phase, prediction = state.prediction;
    const arrival = Math.sin(clamp((p - .40) / .27) * Math.PI);
    const feedbackPhase = clamp((p - .79) / .21);
    const correction = prediction.error && state.applied ? Math.sin(feedbackPhase * Math.PI) : 0;
    const reveal = p >= .78 || still || state.holding > 0;
    root.current?.setAttribute("data-phase", state.holding ? "settled" : p < .5 ? "input" : p < .79 ? "predict" : prediction.error ? "adjust" : "correct");
    for (let i = 0; i < INPUTS; i++) {
      const w = state.weights[i], strength = clamp(Math.abs(w) / 1.3);
      const signal = clamp(Math.abs(prediction.sample.x[i] * w)), polarity = w >= 0 ? "pos" : "neg";
      set(edges.current[i], { "stroke-width": 1.1 + strength * 3, "stroke-opacity": .23 + strength * .4, "data-sign": polarity });
      set(dots.current[i], { r: 6 + Math.abs(prediction.sample.x[i]) * 5, "fill-opacity": .45 + signal * .5, "data-sign": polarity });
      const charging = still ? .15 : Math.sin(clamp((p - i * .022) / .3) * Math.PI);
      set(inputRings.current[i], { r: 14 + charging * 9, opacity: .12 + charging * .35, "data-sign": polarity });
      for (let tail = 0; tail < TRAIL; tail++) {
        const t = (p - .09 - i * .023) / .43 - tail * .025, position = pointOnConnection(i, t);
        const visible = !still && !state.holding && t > 0 && t < 1;
        set(signals.current[i * TRAIL + tail], { cx: position.x, cy: position.y, r: (2.4 + signal * 2.8) * (1 - tail * .14), opacity: visible ? Math.sin(Math.PI * t) ** .5 * (1 - tail / TRAIL) * .9 : 0, "data-sign": polarity });
      }
      const position = pointOnConnection(i, 1 - feedbackPhase);
      set(feedback.current[i], { cx: position.x, cy: position.y, r: 2.4 + signal * 1.4, opacity: still || state.holding ? 0 : correction * .75 });
    }
    const activation = clamp(Math.abs(prediction.activation) / 1.4);
    set(neuron.current, { r: 23 + arrival * 4, "stroke-width": 1.5 + arrival * 1.6 });
    set(halo.current, { r: 40 + arrival * 20 + correction * 9, opacity: .12 + arrival * .15 + activation * .05 });
    set(orbit.current, { transform: `rotate(${round(state.time * 9)} ${NEURON_X} ${MID_Y})` });
    for (let i = 0; i < 3; i++) {
      const ripple = (p - .49 - i * .045) / .38;
      set(rings.current[i], { r: 28 + clamp(ripple) * 57, opacity: still || ripple <= 0 || ripple >= 1 || state.holding ? 0 : (1 - ripple) * .48 });
    }
    const outbound = (p - .62) / .16;
    set(axon.current, { "stroke-opacity": reveal ? .58 : .2 });
    set(outputPulse.current, { cx: NEURON_X + clamp(outbound) * (OUT_X - NEURON_X), opacity: !still && !state.holding && outbound > 0 && outbound < 1 ? Math.sin(outbound * Math.PI) : 0 });
    // Both 0 and 1 are predictions. The warm return pulse separately shows an error.
    set(output.current, { r: 11 + (reveal ? 3 : 0), "fill-opacity": reveal ? .3 + prediction.output * .5 : .12 });
    if (outputLabel.current) outputLabel.current.textContent = reveal ? String(prediction.output) : "·";
    for (let i = 0; i < dust.length; i++) set(stars.current[i], { opacity: .08 + (1 + Math.sin(state.time * .5 + dust[i].phase)) * .09 });
    const label = still ? "Four inputs. One learning neuron." : state.holding ? "A pattern learned. A new beginning." : p < .5 ? "Take in the inputs" : p < .79 ? "Make a prediction" : prediction.error ? "Adjust the weights" : "Keep what works";
    if (phaseLabel.current && phaseLabel.current.textContent !== label) phaseLabel.current.textContent = label;
  }, []);

  useEffect(() => {
    paint(reduced);
    if (reduced || paused) return;
    const element = root.current;
    if (!element) return;
    let frame = 0, last = 0, visible = false, disposed = false;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      const state = model.current;
      state.time += dt;
      if (state.holding > 0) {
        state.holding = Math.max(0, state.holding - dt);
        if (!state.holding) {
          state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
          state.run = makeRun(state.seed); state.prediction = predict(state.run);
          state.phase = 0; state.applied = false;
        }
      } else {
        state.phase += dt / CYCLE_SECONDS;
        if (state.phase >= .79 && !state.applied) { learn(state.run, state.prediction); state.applied = true; }
        if (state.phase >= 1) {
          state.phase = 0; state.applied = false;
          if (state.run.clean >= state.run.data.length) state.holding = 4;
          else state.prediction = predict(state.run);
        }
      }
      for (let i = 0; i < INPUTS; i++) state.weights[i] += (state.run.w[i] - state.weights[i]) * (1 - Math.exp(-dt * 7));
      paint();
      frame = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(frame);
      if (!disposed && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncPlayback(); }, { threshold: 0 });
    observer.observe(element);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", syncPlayback); };
  }, [paint, paused, reduced]);

  return <>
    <div className="pf" ref={root} aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid meet" focusable="false">
        <defs><radialGradient id={glowId}><stop stopColor="currentColor" stopOpacity=".36" /><stop offset=".4" stopColor="currentColor" stopOpacity=".09" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient></defs>
        <ellipse className="pf-nebula" cx="455" cy={MID_Y} rx="380" ry="270" fill={`url(#${glowId})`} />
        <g className="pf-dust">{dust.map((star, i) => <circle key={i} ref={el => { stars.current[i] = el; }} cx={star.x} cy={star.y} r={star.r} opacity=".15" />)}</g>
        <g className="pf-guides"><path d="M145 128 V111 H162 M772 572 H789 V555" /><path d="M180 350 H785" strokeDasharray="2 10" /></g>
        <g className="pf-edges">
          {NODE_Y.map((_, i) => <path key={i} ref={el => { edges.current[i] = el; }} d={curve(i)} data-sign="pos" strokeWidth="2" strokeOpacity=".3" />)}
          <path ref={axon} className="pf-axon" d={`M ${NEURON_X} ${MID_Y} H ${OUT_X}`} />
        </g>
        <g className="pf-inputs">{NODE_Y.map((y, i) => <g key={i}>
          <circle ref={el => { inputRings.current[i] = el; }} className="pf-input-ring" cx={NODE_X} cy={y} r="16" />
          <circle ref={el => { dots.current[i] = el; }} cx={NODE_X} cy={y} r="8" className="pf-input-dot" />
          <text x={NODE_X - 31} y={y + 4} textAnchor="end">x<tspan baselineShift="sub" fontSize="8">{i + 1}</tspan></text>
        </g>)}</g>
        <g className="pf-neuron-system">
          <circle ref={halo} className="pf-halo" cx={NEURON_X} cy={MID_Y} r="40" opacity=".1" />
          {[0, 1, 2].map(i => <circle key={i} ref={el => { rings.current[i] = el; }} className="pf-ripple" cx={NEURON_X} cy={MID_Y} r="30" opacity="0" />)}
          <g ref={orbit} className="pf-orbit"><circle cx={NEURON_X} cy={MID_Y} r="46" strokeDasharray="30 12 3 12" /><circle cx={NEURON_X + 46} cy={MID_Y} r="2.3" className="pf-orbit-dot" /></g>
          <circle ref={neuron} className="pf-neuron" cx={NEURON_X} cy={MID_Y} r="23" />
          <text className="pf-sum" x={NEURON_X} y={MID_Y + 6} textAnchor="middle">Σ</text>
        </g>
        <g className="pf-output-system"><circle ref={output} className="pf-output" cx={OUT_X} cy={MID_Y} r="12" /><circle className="pf-output-ring" cx={OUT_X} cy={MID_Y} r="22" /><text ref={outputLabel} x={OUT_X} y={MID_Y + 4} textAnchor="middle">·</text><text className="pf-output-caption" x={OUT_X} y={MID_Y + 42} textAnchor="middle">prediction</text></g>
        <g className="pf-pulses">
          {Array.from({ length: INPUTS * TRAIL }, (_, i) => <circle key={i} ref={el => { signals.current[i] = el; }} cx={NODE_X} cy={NODE_Y[Math.floor(i / TRAIL)]} r="3" opacity="0" />)}
          <circle ref={outputPulse} className="pf-outbound" cx={NEURON_X} cy={MID_Y} r="4" opacity="0" />
        </g>
        <g className="pf-feedback">{NODE_Y.map((_, i) => <circle key={i} ref={el => { feedback.current[i] = el; }} cx={NEURON_X} cy={MID_Y} r="3" opacity="0" />)}</g>
      </svg>
    </div>
    <div className="pf-playback">
      <span className="pf-status-dot" aria-hidden="true" />
      <span ref={phaseLabel} className="pf-phase">Four inputs. One learning neuron.</span>
      {!reduced && <button type="button" aria-label={paused ? "Resume perceptron animation" : "Pause perceptron animation"} aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Resume" : "Pause"}</span></button>}
    </div>
  </>;
}
