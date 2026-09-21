"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./simulations/useSim";
import "./perceptron-field.css";

/**
 * A real perceptron, learning, behind the hero.
 *
 * The note beside it says you do not need to begin with the right weights —
 * so this starts with random ones and runs the actual perceptron rule
 * (w += α(y − ŷ)x) against a separable set until it classifies every example,
 * pauses, then starts over from a fresh random init. Nothing is keyframed:
 * edge thickness is |w| and the glow is the activation.
 */

const INPUTS = 4;
const TRUE_W = [0.9, -0.7, 0.5, -1.1];
const TRUE_B = 0.15;
const RATE = 0.12;
const STEP_MS = 130;

const VIEW = { w: 1200, h: 700 };
// The neuron sits inside the equation's sum, which is the point. The axon has to
// stop short of the note column on the right, so the output is pulled well in.
const NODE_X = 214, NEURON_X = 600, OUT_X = 664;
const NODE_Y = [166, 288, 412, 534];
const MID_Y = 350;

const f2 = (v: number) => Number(v.toFixed(2));
const stepFn = (v: number) => (v >= 0 ? 1 : 0);

function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Sample = { x: number[]; y: number };
function makeRun(seed: number) {
  const rnd = seeded(seed);
  const data: Sample[] = [];
  while (data.length < 14) {
    const x = Array.from({ length: INPUTS }, () => rnd() * 2 - 1);
    const margin = x.reduce((s, xi, i) => s + xi * TRUE_W[i], TRUE_B);
    if (Math.abs(margin) >= 0.18) data.push({ x, y: stepFn(margin) });
  }
  return {
    data,
    w: Array.from({ length: INPUTS }, () => rnd() * 1.6 - 0.8),
    b: rnd() * 0.6 - 0.3,
    cursor: 0, clean: 0, settled: 0, sample: data[0],
  };
}

export default function PerceptronField() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const edges = useRef<(SVGPathElement | null)[]>([]);
  const pulses = useRef<(SVGCircleElement | null)[]>([]);
  const inputDots = useRef<(SVGCircleElement | null)[]>([]);
  const neuron = useRef<SVGCircleElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const axon = useRef<SVGPathElement>(null);
  const output = useRef<SVGCircleElement>(null);

  const run = useRef(makeRun(7));
  const phase = useRef<number[]>(Array.from({ length: INPUTS }, (_, i) => i * 0.23));
  const clock = useRef(0);
  const fire = useRef(0);

  const paint = useCallback(() => {
    const { w, b, sample } = run.current;
    const activation = sample.x.reduce((s, xi, i) => s + xi * w[i], b);

    for (let i = 0; i < INPUTS; i++) {
      const strength = Math.min(1, Math.abs(w[i]) / 1.3);
      const signal = Math.min(1, Math.abs(sample.x[i] * w[i]));
      const edge = edges.current[i];
      if (edge) {
        edge.setAttribute("stroke-width", String(f2(0.9 + strength * 3.4)));
        edge.setAttribute("stroke-opacity", String(f2(0.16 + strength * 0.5)));
        edge.setAttribute("data-sign", w[i] >= 0 ? "pos" : "neg");
      }
      const dot = inputDots.current[i];
      if (dot) {
        dot.setAttribute("r", String(f2(7 + Math.abs(sample.x[i]) * 7)));
        dot.setAttribute("fill-opacity", String(f2(0.25 + signal * 0.6)));
      }
      const pulse = pulses.current[i];
      if (pulse) {
        const t = phase.current[i] % 1;
        pulse.setAttribute("cx", String(f2(NODE_X + (NEURON_X - NODE_X) * t)));
        pulse.setAttribute("cy", String(f2(NODE_Y[i] + (MID_Y - NODE_Y[i]) * t)));
        pulse.setAttribute("r", String(f2(1.8 + signal * 3.4)));
        pulse.setAttribute("opacity", String(f2(Math.sin(t * Math.PI) * (0.25 + signal * 0.65))));
        pulse.setAttribute("data-sign", w[i] >= 0 ? "pos" : "neg");
      }
    }

    const firing = Math.min(1, Math.abs(activation) / 1.4);
    neuron.current?.setAttribute("r", String(f2(22 + firing * 5)));
    halo.current?.setAttribute("r", String(f2(34 + firing * 26 + fire.current * 16)));
    halo.current?.setAttribute("opacity", String(f2(0.06 + firing * 0.14 + fire.current * 0.22)));
    axon.current?.setAttribute("stroke-opacity", String(f2(0.12 + fire.current * 0.6)));
    output.current?.setAttribute("r", String(f2(10 + fire.current * 9)));
    output.current?.setAttribute("fill-opacity", String(f2(0.2 + fire.current * 0.7)));
  }, []);

  useEffect(() => {
    paint();
    if (reduced) return;

    let frame = 0, last = performance.now(), since = 0, seed = 7;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now; clock.current += dt; since += dt * 1000;
      fire.current = Math.max(0, fire.current - dt * 2.4);

      for (let i = 0; i < INPUTS; i++) {
        phase.current[i] += dt * (0.22 + Math.min(1, Math.abs(run.current.w[i])) * 0.5);
      }

      if (since >= STEP_MS) {
        since = 0;
        const r = run.current;
        if (r.settled > 0) {
          // Hold the converged network for a beat, then start again wrong.
          r.settled -= 1;
          if (r.settled === 0) run.current = makeRun((seed = (seed * 1103515245 + 12345) & 0x7fffffff));
        } else {
          const s = r.data[r.cursor % r.data.length];
          r.sample = s;
          const yhat = stepFn(s.x.reduce((acc, xi, k) => acc + xi * r.w[k], r.b));
          const err = s.y - yhat;
          if (err !== 0) {
            for (let k = 0; k < INPUTS; k++) r.w[k] += RATE * err * s.x[k];
            r.b += RATE * err;
            r.clean = 0;
            fire.current = 1;
          } else {
            r.clean += 1;
            if (r.clean >= r.data.length) r.settled = 26;   // ~3.4s of holding steady
          }
          r.cursor += 1;
        }
      }

      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paint, reduced]);

  const curve = (i: number) => {
    const y = NODE_Y[i];
    return `M ${NODE_X} ${y} C ${(NODE_X + NEURON_X) / 2} ${y}, ${(NODE_X + NEURON_X) / 2} ${MID_Y}, ${NEURON_X} ${MID_Y}`;
  };

  return <div className="pf" ref={root} aria-hidden="true">
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid slice">
      <g className="pf-edges">
        {NODE_Y.map((_, i) => <path key={i} ref={el => { edges.current[i] = el; }} d={curve(i)} data-sign="pos" strokeWidth="2" strokeOpacity=".3" fill="none" />)}
        <path ref={axon} className="pf-axon" d={`M ${NEURON_X} ${MID_Y} L ${OUT_X} ${MID_Y}`} strokeOpacity=".12" fill="none" />
      </g>
      <g className="pf-nodes">
        {NODE_Y.map((y, i) => <circle key={i} ref={el => { inputDots.current[i] = el; }} cx={NODE_X} cy={y} r="9" fillOpacity=".4" />)}
        <circle ref={halo} className="pf-halo" cx={NEURON_X} cy={MID_Y} r="40" opacity=".1" />
        <circle ref={neuron} className="pf-neuron" cx={NEURON_X} cy={MID_Y} r="23" />
        <circle ref={output} className="pf-output" cx={OUT_X} cy={MID_Y} r="12" fillOpacity=".4" />
      </g>
      <g className="pf-pulses">
        {NODE_Y.map((_, i) => <circle key={i} ref={el => { pulses.current[i] = el; }} cx={NODE_X} cy={NODE_Y[i]} r="3" opacity="0" data-sign="pos" />)}
      </g>
    </svg>
  </div>;
}
