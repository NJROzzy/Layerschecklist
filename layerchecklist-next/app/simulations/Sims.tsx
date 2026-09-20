"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  BOID_FIELD, CART_DEFAULTS, CART_DT, type Boid, type Body, type Cart, type Gains,
  type IntegratorKey, cartAlive, cartPolicy, cartStep, f2, flockOrder, flockStep, integrators,
  makeFlock, orbitEnergy, orbitStart, runEpisode, seeded, springStep,
} from "./sim-core";
import { usePlayback, useSimLoop } from "./useSim";

/* ------------------------------------------------------------------ */

export function SimPanel({ id, eyebrow, title, intro, children, question, answer }: {
  id: string; eyebrow: string; title: string; intro: ReactNode; children: ReactNode; question: string; answer: ReactNode;
}) {
  return <section className="sim-panel" id={id} aria-labelledby={`${id}-title`}>
    <span className="sim-eyebrow">{eyebrow}</span>
    <h3 id={`${id}-title`}>{title}</h3>
    {intro}
    {children}
    <details className="sim-check"><summary>Think it through: {question}</summary><div>{answer}</div></details>
  </section>;
}

export function Slider({ id, label, value, min, max, step, onChange, display }: {
  id: string; label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display?: string;
}) {
  return <label className="sim-slider" htmlFor={id}>
    <span>{label}<output htmlFor={id}>{display ?? value}</output></span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
  </label>;
}

export function Transport({ running, onToggle, onReset, extra }: { running: boolean; onToggle: () => void; onReset: () => void; extra?: ReactNode }) {
  return <div className="sim-transport">
    <button type="button" className="sim-primary" onClick={onToggle} aria-pressed={running}>{running ? "❚❚ Pause" : "▶ Run"}</button>
    <button type="button" onClick={onReset}>↺ Reset</button>
    {extra}
  </div>;
}

/* ==================================================================
   01 · Integrators — the same orbit, three ways of stepping time
================================================================== */

const KEYS: IntegratorKey[] = ["explicit", "symplectic", "rk4"];
const ORBIT_VIEW = 150, ORBIT_SCALE = 44;
const TRAIL = 520;

export function OrbitLab() {
  const { running, reduced, toggle } = usePlayback();
  const [h, setH] = useState(0.02);
  const stage = useRef<HTMLDivElement>(null);
  const hRef = useRef(h);
  useEffect(() => { hRef.current = h; }, [h]);

  const bodies = useRef<Record<string, Body>>({});
  const trails = useRef<Record<string, number[]>>({});
  const paths = useRef<Record<string, SVGPolylineElement | null>>({});
  const dots = useRef<Record<string, SVGCircleElement | null>>({});
  const readouts = useRef<Record<string, HTMLElement | null>>({});
  const orbitsRef = useRef<HTMLElement | null>(null);
  const clock = useRef(0);

  const paint = useCallback((force = false) => {
    for (const key of KEYS) {
      const b = bodies.current[key]; if (!b) continue;
      const trail = trails.current[key];
      trail.push(f2(ORBIT_VIEW + b.x * ORBIT_SCALE), f2(ORBIT_VIEW - b.y * ORBIT_SCALE));
      if (trail.length > TRAIL * 2) trail.splice(0, trail.length - TRAIL * 2);
      paths.current[key]?.setAttribute("points", trail.join(" "));
      dots.current[key]?.setAttribute("cx", String(f2(ORBIT_VIEW + b.x * ORBIT_SCALE)));
      dots.current[key]?.setAttribute("cy", String(f2(ORBIT_VIEW - b.y * ORBIT_SCALE)));
      if (force || Math.random() < 0.12) {
        const node = readouts.current[key];
        if (node) node.textContent = orbitEnergy(b).toFixed(4);
      }
    }
  }, []);

  const reset = useCallback(() => {
    for (const key of KEYS) { bodies.current[key] = orbitStart(); trails.current[key] = []; }
    clock.current = 0;
    if (orbitsRef.current) orbitsRef.current.textContent = "0.0";
    paint(true);
  }, [paint]);

  useEffect(() => { reset(); }, [reset]);

  useSimLoop(stage, running, () => {
    // Advance the same amount of simulated time each frame, so the step size
    // changes the accuracy rather than the apparent speed.
    const step = hRef.current;
    const count = Math.max(1, Math.min(60, Math.round(0.1 / step)));
    for (const key of KEYS) {
      let b = bodies.current[key]; if (!b) continue;
      for (let i = 0; i < count; i++) b = integrators[key].step(b, step);
      bodies.current[key] = b;
    }
    clock.current += count * step;
    if (orbitsRef.current) orbitsRef.current.textContent = (clock.current / (2 * Math.PI)).toFixed(1);
    paint();
  });

  return <SimPanel id="sim-orbit" eyebrow="01 · THE STEP THAT DECIDES EVERYTHING"
    title="Three integrators. One orbit. Watch which one survives."
    question="Why does the cheap method beat the accurate one in a game engine?"
    answer={<><p>RK4 is more accurate per step and costs four force evaluations to get there. Semi-implicit Euler costs one, and although each step carries more error, the errors are <em>structured</em> — it is symplectic, so energy oscillates around the true value instead of creeping away from it. Over a million steps that property matters far more than per-step accuracy.</p><p>This is why physics engines built for games and robotics reach for semi-implicit Euler or a velocity-Verlet variant, while an orbital-mechanics package that must stay accurate over decades reaches for something higher order. Different failure you are trying to avoid.</p></>}
    intro={<p>Each panel runs the identical starting condition: a body in a perfectly circular orbit. Any change in the radius is error the integrator invented. Nothing here is drawn from a recording — the positions come from the equations on every frame.</p>}>
    <div className="sim-stage-dark" ref={stage}>
      <div className="sim-orbit-grid">
        {KEYS.map(key => <figure key={key} className={"sim-orbit" + (key === "explicit" ? " is-bad" : "")}>
          <figcaption><strong>{integrators[key].label}</strong><span>{integrators[key].cost}</span></figcaption>
          <svg viewBox="0 0 300 300" role="img" aria-label={`${integrators[key].label} orbit, live`}>
            <circle cx={ORBIT_VIEW} cy={ORBIT_VIEW} r="86" className="sim-orbit-truth" />
            <circle cx={ORBIT_VIEW} cy={ORBIT_VIEW} r="7" className="sim-sun" />
            <polyline ref={el => { paths.current[key] = el; }} className="sim-trail" points="" />
            <circle ref={el => { dots.current[key] = el; }} r="5.5" className="sim-body" cx={ORBIT_VIEW + ORBIT_SCALE} cy={ORBIT_VIEW} />
          </svg>
          <p className="sim-readout">energy <b ref={el => { readouts.current[key] = el; }}>-0.5000</b> <span>exact −0.5</span></p>
        </figure>)}
      </div>
    </div>
    <div className="sim-controls">
      <Slider id="sim-orbit-h" label="Step size · h" value={h} min={0.005} max={0.08} step={0.005} display={h.toFixed(3)} onChange={setH} />
      <Transport running={running} onToggle={toggle} onReset={reset}
        extra={<span className="sim-counter">orbits completed <b ref={orbitsRef}>0.0</b></span>} />
    </div>
    <p className="sim-note">The faint ring is the true orbit. Explicit Euler adds energy at every step and spirals off it; semi-implicit Euler stays on it with the same amount of arithmetic. {reduced ? "Motion is paused because your system asks for reduced motion — press Run to start it." : "Raise the step size and the difference arrives faster."}</p>
  </SimPanel>;
}

/* ==================================================================
   02 · Timestep stability
================================================================== */

const TRACE = 260;

export function TimestepLab() {
  const { running, toggle } = usePlayback();
  const [dt, setDt] = useState(0.35);
  const stage = useRef<HTMLDivElement>(null);
  const dtRef = useRef(dt);
  useEffect(() => { dtRef.current = dt; }, [dt]);

  const springs = useRef({ explicit: { x: 1, v: 0 }, symplectic: { x: 1, v: 0 } });
  const traces = useRef<Record<string, number[]>>({ explicit: [], symplectic: [] });
  const lines = useRef<Record<string, SVGPolylineElement | null>>({});
  const bobs = useRef<Record<string, SVGCircleElement | null>>({});
  const amps = useRef<Record<string, HTMLElement | null>>({});

  const reset = useCallback(() => {
    springs.current = { explicit: { x: 1, v: 0 }, symplectic: { x: 1, v: 0 } };
    traces.current = { explicit: [], symplectic: [] };
    for (const key of ["explicit", "symplectic"]) { lines.current[key]?.setAttribute("points", ""); }
  }, []);
  useEffect(() => { reset(); }, [reset]);

  useSimLoop(stage, running, () => {
    for (const key of ["explicit", "symplectic"] as const) {
      const explicit = key === "explicit";
      let s = springs.current[key];
      if (Number.isFinite(s.x)) s = springStep(s, dtRef.current, 1, explicit);
      springs.current[key] = s;

      const clamped = Math.max(-1.9, Math.min(1.9, Number.isFinite(s.x) ? s.x : 2));
      const trace = traces.current[key];
      trace.push(clamped);
      if (trace.length > TRACE) trace.shift();
      lines.current[key]?.setAttribute("points", trace.map((v, i) => `${f2(i * (560 / TRACE))},${f2(70 - v * 34)}`).join(" "));
      bobs.current[key]?.setAttribute("cx", String(f2(280 + clamped * 120)));
      const node = amps.current[key];
      if (node && Math.random() < 0.15) {
        const size = Math.hypot(s.x, s.v);
        node.textContent = !Number.isFinite(size) || size > 1e6 ? "exploded" : size.toFixed(3);
      }
    }
  });

  const verdict = dt >= 2 ? "Past the limit: even the symplectic method diverges now."
    : dt > 1.2 ? "Coarse but stable on the right. The left has long since left the building."
    : dt > 0.5 ? "The explicit method is visibly gaining energy; the symplectic one is holding."
    : "Both look calm here — but only one of them stays that way as you raise the step.";

  return <SimPanel id="sim-timestep" eyebrow="02 · WHY YOUR SIM EXPLODED"
    title="The same spring, stepped at the same rate, with two different orders of operations."
    question="What is the actual stability limit?"
    answer={<><p>For an undamped oscillator of frequency ω, semi-implicit Euler is stable while the step stays below <strong>2/ω</strong>. Here ω = 1, so it holds together until dt reaches 2 and comes apart above it — which is exactly what the slider shows. Explicit Euler has no stable region at all for this system: it gains energy at every step, and a small dt only slows the inevitable.</p><p>That formula is why stiff systems are painful. A stiff contact adds a very high ω, and the whole simulation is then forced down to a step size that suits the fastest mode — even though nothing else in the scene needs it. Substepping, implicit solvers and constraint-based contact all exist to escape that tax.</p></>}
    intro={<p>A mass on a spring, released from the same place. Left uses explicit Euler, right uses semi-implicit. The only difference is whether the position update reads the old velocity or the new one.</p>}>
    <div className="sim-stage-dark" ref={stage}>
      <div className="sim-spring-grid">
        {(["explicit", "symplectic"] as const).map(key => <figure key={key} className={"sim-spring" + (key === "explicit" ? " is-bad" : "")}>
          <figcaption><strong>{key === "explicit" ? "Explicit Euler" : "Semi-implicit Euler"}</strong>
            <span><code>{key === "explicit" ? "x += v·dt ; v += a·dt" : "v += a·dt ; x += v·dt"}</code></span></figcaption>
          <svg viewBox="0 0 560 140" role="img" aria-label={`${key} spring, live`}>
            <line x1="20" y1="112" x2="540" y2="112" className="sim-rail" />
            <line x1="280" y1="100" x2="280" y2="124" className="sim-rail" />
            <polyline ref={el => { lines.current[key] = el; }} className="sim-trace" points="" />
            <circle ref={el => { bobs.current[key] = el; }} cx="400" cy="112" r="11" className="sim-bob" />
          </svg>
          <p className="sim-readout">amplitude <b ref={el => { amps.current[key] = el; }}>1.000</b> <span>should stay 1</span></p>
        </figure>)}
      </div>
    </div>
    <div className="sim-controls">
      <Slider id="sim-dt" label="Timestep · dt" value={dt} min={0.05} max={2.4} step={0.05} display={dt.toFixed(2)} onChange={setDt} />
      <Transport running={running} onToggle={toggle} onReset={reset} extra={<span className="sim-counter">stability limit <b>dt &lt; 2.00</b></span>} />
    </div>
    <p className="sim-note">{verdict}</p>
  </SimPanel>;
}

/* ==================================================================
   03 · Emergence
================================================================== */

export function BoidsLab() {
  const { running, toggle } = usePlayback();
  const [separation, setSeparation] = useState(1);
  const [alignment, setAlignment] = useState(1);
  const [cohesion, setCohesion] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const order = useRef<HTMLElement | null>(null);
  const flock = useRef<Boid[]>(makeFlock(150));
  const rules = useRef({ separation, alignment, cohesion, speed: 2.4 });
  useEffect(() => { rules.current = { separation, alignment, cohesion, speed: 2.4 }; }, [separation, alignment, cohesion]);

  const draw = useCallback(() => {
    const el = canvas.current; if (!el) return;
    const ctx = el.getContext("2d"); if (!ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (el.width !== BOID_FIELD.w * ratio) { el.width = BOID_FIELD.w * ratio; el.height = BOID_FIELD.h * ratio; }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, BOID_FIELD.w, BOID_FIELD.h);
    for (const b of flock.current) {
      const angle = Math.atan2(b.vy, b.vx);
      const speed = Math.hypot(b.vx, b.vy);
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);
      ctx.fillStyle = `hsl(${188 + speed * 14} 85% ${58 + speed * 4}%)`;
      ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(-6, 4.2); ctx.lineTo(-3.4, 0); ctx.lineTo(-6, -4.2); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }, []);

  useEffect(() => { draw(); }, [draw]);

  useSimLoop(stage, running, dt => {
    flockStep(flock.current, rules.current, dt);
    draw();
    if (order.current && Math.random() < 0.1) order.current.textContent = flockOrder(flock.current).toFixed(3);
  });

  const reset = useCallback(() => { flock.current = makeFlock(150); draw(); }, [draw]);

  return <SimPanel id="sim-boids" eyebrow="03 · NOBODY IS IN CHARGE"
    title="A flock, from three rules and no leader."
    question="What has a flock got to do with training a model?"
    answer={<><p>Two things. First, it is the cleanest demonstration that complex global behaviour does not require a global controller — every bird here reads only its immediate neighbours, and the flock is nowhere in the code. That is the premise of multi-agent RL, swarm robotics and traffic simulation.</p><p>Second, it is a warning about evaluation. Turn cohesion up and you get a beautiful tight flock that looks like success; it is also a flock that will fly straight into a wall together. A simulation that produces impressive-looking behaviour has told you nothing until you have defined what you were actually measuring.</p></>}
    intro={<p>Every agent follows the same three rules, applied only to neighbours it can see: steer away from anyone too close, match the heading of those nearby, and drift toward the middle of the group. That is the whole program. Pull a rule to zero and watch what the flock loses.</p>}>
    <div className="sim-stage-dark is-flush" ref={stage}>
      <canvas ref={canvas} className="sim-canvas" style={{ aspectRatio: `${BOID_FIELD.w} / ${BOID_FIELD.h}` }} role="img" aria-label="A live flocking simulation of 150 agents." />
    </div>
    <div className="sim-controls sim-controls-three">
      <Slider id="sim-sep" label="Separation" value={separation} min={0} max={2} step={0.05} display={separation.toFixed(2)} onChange={setSeparation} />
      <Slider id="sim-ali" label="Alignment" value={alignment} min={0} max={2} step={0.05} display={alignment.toFixed(2)} onChange={setAlignment} />
      <Slider id="sim-coh" label="Cohesion" value={cohesion} min={0} max={2} step={0.05} display={cohesion.toFixed(2)} onChange={setCohesion} />
    </div>
    <Transport running={running} onToggle={toggle} onReset={reset}
      extra={<span className="sim-counter">alignment of the flock <b ref={order}>0.000</b> <span>1 = one stream</span></span>} />
    <p className="sim-note">Separation to zero and they collapse into a single point. Alignment to zero and the flock loses its shared heading but keeps its clump. Cohesion to zero and the group dissolves into drifting pairs. None of those behaviours is written down anywhere.</p>
  </SimPanel>;
}

/* ==================================================================
   04 · An actual RL environment
================================================================== */

const PRESETS: { label: string; gains: Gains }[] = [
  { label: "Angle only", gains: [0, 0, 1, 0] },
  { label: "Add damping", gains: [0.1, 0.5, 1, 0.5] },
  { label: "Tuned", gains: [0.45, 1.3, 7, 2.4] },
];

export function CartPoleLab() {
  const { running, toggle } = usePlayback();
  const [gains, setGains] = useState<Gains>([0.1, 0.5, 1, 0.5]);
  const stage = useRef<HTMLDivElement>(null);
  const gainsRef = useRef(gains);
  useEffect(() => { gainsRef.current = gains; }, [gains]);

  const cart = useRef<Cart>({ x: 0, dx: 0, th: 0.05, dth: 0 });
  const steps = useRef(0), episodes = useRef(0), best = useRef(0), accumulator = useRef(0);
  const random = useRef(seeded(99));
  const cartEl = useRef<SVGGElement>(null), poleEl = useRef<SVGLineElement>(null), pushEl = useRef<SVGPolygonElement>(null);
  const stepsEl = useRef<HTMLElement>(null), epEl = useRef<HTMLElement>(null), bestEl = useRef<HTMLElement>(null);

  const place = useCallback(() => {
    const s = cart.current;
    const px = 300 + s.x * 92;
    cartEl.current?.setAttribute("transform", `translate(${f2(px)} 0)`);
    poleEl.current?.setAttribute("x2", String(f2(Math.sin(s.th) * 96)));
    poleEl.current?.setAttribute("y2", String(f2(126 - Math.cos(s.th) * 96)));
  }, []);
  const restart = () => {
    if (steps.current > best.current) { best.current = steps.current; if (bestEl.current) bestEl.current.textContent = String(best.current); }
    episodes.current++; if (epEl.current) epEl.current.textContent = String(episodes.current);
    cart.current = { x: 0, dx: 0, th: (random.current() - 0.5) * 0.1, dth: 0 };
    steps.current = 0;
  };
  const reset = useCallback(() => { episodes.current = 0; best.current = 0; steps.current = 0; random.current = seeded(99);
    cart.current = { x: 0, dx: 0, th: 0.05, dth: 0 };
    if (epEl.current) epEl.current.textContent = "0"; if (bestEl.current) bestEl.current.textContent = "0";
    place(); }, [place]);

  useEffect(() => { place(); }, [place]);

  useSimLoop(stage, running, dt => {
    accumulator.current += Math.min(dt, 0.05);
    let guard = 0;
    while (accumulator.current >= CART_DT && guard++ < 8) {
      accumulator.current -= CART_DT;
      const push = cartPolicy(cart.current, gainsRef.current);
      cart.current = cartStep(cart.current, push);
      steps.current++;
      pushEl.current?.setAttribute("transform", `translate(${push ? 34 : -34} 0) scale(${push ? 1 : -1} 1)`);
      if (!cartAlive(cart.current) || steps.current > 4000) restart();
    }
    place();
    if (stepsEl.current) stepsEl.current.textContent = String(steps.current);
  });

  const names = ["cart position x", "cart velocity ẋ", "pole angle θ", "pole rate θ̇"];
  return <SimPanel id="sim-cartpole" eyebrow="04 · THE ENVIRONMENT, RUNNING"
    title="CartPole, the real dynamics, with the policy in your hands."
    question="Why does the obvious policy fail?"
    answer={<><p>Set the gains to <strong>Angle only</strong>. Pushing right whenever the pole leans right is the intuitive rule, and it collapses in about forty steps — because by the time you react to the angle, the pole already has angular velocity, and you arrive late every single time. Adding the θ̇ term lets the controller respond to where the pole is <em>going</em>, which is the difference between damping an oscillation and amplifying it.</p><p>That is also the whole reason the state includes velocities. Give an agent only positions and the problem stops being Markov: the same picture can mean falling left or falling right, and no policy can tell them apart. When people say a state must capture everything needed to act, this is the concrete version of it.</p></>}
    intro={<p>This is the standard benchmark, with the standard constants, integrated at 50 Hz. The four sliders are a linear policy: multiply each state variable by its weight, add them up, push right if the total is positive. An episode ends if the cart leaves the track or the pole passes twelve degrees.</p>}>
    <div className="sim-stage-dark" ref={stage}>
      <svg viewBox="0 0 600 190" role="img" aria-label="A live CartPole simulation.">
        <line x1="30" y1="150" x2="570" y2="150" className="sim-rail" />
        {[-2.4, 0, 2.4].map(t => <line key={t} x1={f2(300 + t * 92)} y1="140" x2={f2(300 + t * 92)} y2="160" className={t === 0 ? "sim-rail" : "sim-rail is-limit"} />)}
        <g ref={cartEl} transform="translate(300 0)">
          <line ref={poleEl} x1="0" y1="126" x2="4.8" y2="30" className="sim-pole" />
          <circle cx="0" cy="126" r="4" className="sim-pivot" />
          <rect x="-34" y="126" width="68" height="24" rx="6" className="sim-cart" />
          <polygon ref={pushEl} points="0,138 13,138 13,133 22,141 13,149 13,144 0,144" className="sim-push" transform="translate(34 0)" />
        </g>
      </svg>
    </div>
    <div className="sim-controls sim-controls-four">
      {gains.map((g, i) => <Slider key={i} id={`sim-gain-${i}`} label={names[i]} value={g} min={-8} max={8} step={0.05} display={g.toFixed(2)}
        onChange={v => setGains(gains.map((old, j) => j === i ? v : old) as Gains)} />)}
    </div>
    <div className="sim-presets" role="group" aria-label="Policy presets">
      {PRESETS.map(p => <button key={p.label} type="button" aria-pressed={p.gains.every((v, i) => v === gains[i])} onClick={() => setGains([...p.gains] as Gains)}>{p.label}</button>)}
    </div>
    <Transport running={running} onToggle={toggle} onReset={reset}
      extra={<><span className="sim-counter">steps alive <b ref={stepsEl}>0</b></span><span className="sim-counter">best <b ref={bestEl}>0</b></span><span className="sim-counter">episodes <b ref={epEl}>0</b></span></>} />
    <p className="sim-note">Nothing here is learned — you are the optimiser. Reinforcement learning replaces your hand on the sliders with a search over these same four numbers, guided only by how long the pole stayed up.</p>
  </SimPanel>;
}

/* ==================================================================
   05 · Sim-to-real
================================================================== */

const TRIALS = 240;

export function SimToRealLab() {
  const [spread, setSpread] = useState(0);
  const [which, setWhich] = useState(2);
  const gains = PRESETS[which].gains;

  // Score the same policy across a spread of physical parameters. Seeded, so the
  // only thing that changes between runs is the width of the randomisation.
  const random = seeded(2026);
  const lengths: number[] = [];
  let survived = 0;
  for (let i = 0; i < TRIALS; i++) {
    const jitter = () => 1 + (random() - 0.5) * 2 * spread;
    const params = {
      ...CART_DEFAULTS,
      poleMass: CART_DEFAULTS.poleMass * jitter(),
      halfLength: CART_DEFAULTS.halfLength * jitter(),
      cartMass: CART_DEFAULTS.cartMass * jitter(),
      force: CART_DEFAULTS.force * jitter(),
    };
    const life = runEpisode(gains, params, (random() - 0.5) * 0.1, {
      latency: Math.floor(random() * spread * 10),   // the decision arrives up to six steps late
      noise: spread * 0.05,                          // and the angle it acted on was a little wrong
      random,
    });
    lengths.push(life);
    if (life >= 600) survived++;
  }
  const rate = survived / TRIALS;
  const buckets = new Array(12).fill(0);
  for (const life of lengths) buckets[Math.min(11, Math.floor(life / 50))]++;
  const tallest = Math.max(...buckets);

  return <SimPanel id="sim-to-real" eyebrow="05 · THE GAP THAT ENDS PROJECTS"
    title="A policy that is perfect in the simulator, and the physics it never met."
    question="So how does domain randomisation actually help?"
    answer={<><p>The slider here only shows you the problem: a controller tuned on one set of numbers degrades as the world stops matching them. The fix is to move the randomisation from evaluation into <em>training</em> — sample new physics every episode, so the policy is optimised against the whole distribution rather than one point in it.</p><p>What you get is a policy that is slightly worse on nominal physics and dramatically better off it, because it was never allowed to depend on a number it could not trust. The real robot then looks like one more sample from the training distribution rather than an unpleasant surprise. The cost is real: a wide enough distribution can make the task unlearnable, and choosing what to randomise — masses and friction, yes; gravity, rarely — is judgement, not a recipe.</p></>}
    intro={<><p>Pick a policy, then widen the gap. Every trial re-rolls the pole mass, pole length, cart mass and motor strength by up to the percentage shown — and, because parameters are rarely what actually bites, also delays the controller&apos;s decision by up to six steps and adds noise to the angle it reads. That is {TRIALS} complete simulations, recomputed as you drag.</p></>}>
    <div className="sim-presets" role="group" aria-label="Policy">
      {PRESETS.map((p, i) => <button key={p.label} type="button" aria-pressed={which === i} onClick={() => setWhich(i)}>{p.label}</button>)}
    </div>
    <Slider id="sim-spread" label="How far the physics may differ from the simulator" value={spread} min={0} max={0.6} step={0.05} display={Math.round(spread * 100) + "%"} onChange={setSpread} />
    <div className="sim-result">
      <div className="sim-rate">
        <span className="sim-eyebrow">EPISODES SURVIVED</span>
        <strong className={rate < 0.5 ? "is-bad" : rate < 0.85 ? "is-warn" : ""}>{Math.round(rate * 100)}%</strong>
        <span>{survived} of {TRIALS} lasted the full 600 steps</span>
      </div>
      <figure className="sim-histogram">
        <div>{buckets.map((n, i) => <span key={i} style={{ height: (tallest ? n / tallest * 100 : 0).toFixed(2) + "%" }} title={`${n} episodes lasted ${i * 50}–${i * 50 + 50} steps`} className={i === 11 ? "is-good" : undefined} />)}</div>
        <figcaption>How long each episode lasted · left is an immediate fall, right is a full survival</figcaption>
      </figure>
    </div>
    <p className="sim-note">At 0% every trial runs on the simulator&apos;s exact numbers, with an instant, perfect reading of the pole — the result you would put in a slide. Widen it and the same controller, unchanged, starts dropping the pole. Compare the two working policies as you drag: <strong>Tuned</strong> degrades far more slowly than <strong>Add damping</strong>, which is what robustness actually looks like when you measure it rather than assert it.</p>
  </SimPanel>;
}
