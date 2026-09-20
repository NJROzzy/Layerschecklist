"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { f2, seeded } from "./sim-core";
import {
  L1, L2, REACH, ROOM, WALLS, WAYPOINTS, type Base, type Joint, type Pose,
  baseStart, castRay, driveCommand, driveStep, forward, inverse, jointStep, manipulability, velocityEllipse,
} from "./robot-core";
import { usePlayback, useSimLoop } from "./useSim";
import { SimPanel, Slider, Transport } from "./Sims";

/* ==================================================================
   06 · Kinematics — where the hand is, and how to put it somewhere
================================================================== */

const ARM_SCALE = 118, ARM_X = 300, ARM_Y = 300;
const toView = (x: number, y: number) => [f2(ARM_X + x * ARM_SCALE), f2(ARM_Y - y * ARM_SCALE)] as const;

export function ArmLab() {
  const [target, setTarget] = useState<[number, number]>([1.3, 0.9]);
  const [elbowUp, setElbowUp] = useState(true);
  const [showEllipse, setShowEllipse] = useState(true);
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const { q1, q2, reachable } = inverse(target[0], target[1], elbowUp);
  const pose: Pose = { q1, q2 };
  const { elbow, tip } = forward(pose);
  const measure = manipulability(pose);
  const ellipse = velocityEllipse(pose);
  const singular = measure < 0.12;

  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width * 600 - ARM_X) / ARM_SCALE;
    const y = (ARM_Y - (event.clientY - box.top) / box.height * 460) / ARM_SCALE;
    setTarget([Math.max(-2.4, Math.min(2.4, x)), Math.max(-1.2, Math.min(2.4, y))]);
  };

  const [tx, ty] = toView(target[0], target[1]);
  const [ex, ey] = toView(elbow[0], elbow[1]);
  const [hx, hy] = toView(tip[0], tip[1]);

  return <SimPanel id="sim-arm" eyebrow="06 · KINEMATICS"
    title="Forward is arithmetic. Inverse is where robotics starts."
    question="Why does the arm slow down near the edge of its reach?"
    answer={<><p>At full extension the two links are in line, and both joints can only move the hand along the same arc — there is no combination of joint speeds that moves it straight outward. That is a <strong>singularity</strong>, and the determinant of the Jacobian is exactly zero there. Because the controller inverts the Jacobian to turn a desired hand velocity into joint velocities, approaching that point asks it to divide by something approaching zero, and the commanded joint speeds run away.</p><p>Watch the ellipse collapse into a line as you push the target outward. Every real manipulator has these, they are a property of the mechanism rather than the software, and planning around them is a permanent part of the job.</p></>}
    intro={<p>Drag anywhere in the panel to move the target. <strong>Forward kinematics</strong> — joint angles to hand position — is one line of trigonometry with one answer. <strong>Inverse kinematics</strong> is the reverse, and it has two answers, sometimes none, and occasionally infinitely many.</p>}>
    <div className="sim-stage-dark">
      <svg ref={svg} viewBox="0 0 600 460" role="img" aria-label={`A two-link arm reaching for a target. Joint one ${(q1 * 180 / Math.PI).toFixed(0)} degrees, joint two ${(q2 * 180 / Math.PI).toFixed(0)} degrees.`}
        style={{ cursor: "crosshair", touchAction: "none" }}
        onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e); }}
        onPointerMove={e => { if (dragging.current) move(e); }}
        onPointerUp={e => { dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
        onPointerCancel={() => { dragging.current = false; }}>
        <circle cx={ARM_X} cy={ARM_Y} r={f2(REACH * ARM_SCALE)} className="sim-reach" />
        <circle cx={ARM_X} cy={ARM_Y} r={f2(Math.abs(L1 - L2) * ARM_SCALE)} className="sim-reach" />
        {showEllipse && !singular && <ellipse cx={hx} cy={hy} rx={f2(ellipse.major * 52)} ry={f2(ellipse.minor * 52)}
          transform={`rotate(${f2(-ellipse.angle * 180 / Math.PI)} ${hx} ${hy})`} className="sim-ellipse" />}
        <line x1={ARM_X} y1={ARM_Y} x2={ex} y2={ey} className={"sim-link" + (singular ? " is-singular" : "")} />
        <line x1={ex} y1={ey} x2={hx} y2={hy} className={"sim-link" + (singular ? " is-singular" : "")} />
        <circle cx={ARM_X} cy={ARM_Y} r="9" className="sim-joint" />
        <circle cx={ex} cy={ey} r="8" className="sim-joint" />
        <circle cx={hx} cy={hy} r="7" className="sim-hand" />
        <g className={"sim-target" + (reachable ? "" : " is-out")}>
          <circle cx={tx} cy={ty} r="13" />
          <line x1={f2(tx - 19)} y1={ty} x2={f2(tx + 19)} y2={ty} />
          <line x1={tx} y1={f2(ty - 19)} x2={tx} y2={f2(ty + 19)} />
        </g>
        {!reachable && <line x1={hx} y1={hy} x2={tx} y2={ty} className="sim-miss" />}
      </svg>
    </div>
    <div className="sim-controls sim-controls-three">
      <Slider id="sim-arm-x" label="Target x" value={target[0]} min={-2.4} max={2.4} step={0.05} display={target[0].toFixed(2)} onChange={v => setTarget([v, target[1]])} />
      <Slider id="sim-arm-y" label="Target y" value={target[1]} min={-1.2} max={2.4} step={0.05} display={target[1].toFixed(2)} onChange={v => setTarget([target[0], v])} />
      <div className="sim-toggles">
        <button type="button" aria-pressed={elbowUp} onClick={() => setElbowUp(!elbowUp)}>{elbowUp ? "Elbow up" : "Elbow down"}</button>
        <button type="button" aria-pressed={showEllipse} onClick={() => setShowEllipse(!showEllipse)}>Velocity ellipse</button>
      </div>
    </div>
    <div className="sim-metrics">
      <div><span>joint 1 · θ₁</span><strong>{(q1 * 180 / Math.PI).toFixed(1)}°</strong></div>
      <div><span>joint 2 · θ₂</span><strong>{(q2 * 180 / Math.PI).toFixed(1)}°</strong></div>
      <div className={reachable ? "" : "is-warn"}><span>target</span><strong>{reachable ? "reachable" : "out of reach"}</strong></div>
      <div className={singular ? "is-warn" : ""}><span>manipulability · |det J|</span><strong>{measure.toFixed(3)}</strong></div>
    </div>
    <p className="sim-note">{!reachable
      ? "Beyond the reach the arm can only point at the target and stop. A real controller has to decide what to do here, and “stretch as far as possible” is a choice somebody made."
      : singular
        ? "Almost straight, and the ellipse has collapsed to a line: the hand can still swing sideways but can barely move along the arm. Inverting the Jacobian here produces enormous joint commands."
        : "The ellipse shows which directions the hand can move quickly for a given joint speed. A round ellipse is a well-conditioned pose; a thin one is a pose to avoid."}</p>
  </SimPanel>;
}

/* ==================================================================
   07 · Control — closing the loop on one joint
================================================================== */

const PID_PRESETS: { label: string; gains: [number, number, number] }[] = [
  { label: "P only", gains: [8, 0, 0] },
  { label: "PD", gains: [8, 0, 3] },
  { label: "PID", gains: [8, 4, 3] },
  { label: "Too much P", gains: [40, 0, 0] },
];
const PID_TRACE = 300;

export function PIDLab() {
  const { running, toggle } = usePlayback();
  const [gains, setGains] = useState<[number, number, number]>([8, 0, 0]);
  const stage = useRef<HTMLDivElement>(null);
  const gainsRef = useRef(gains);
  useEffect(() => { gainsRef.current = gains; }, [gains]);

  const joint = useRef<Joint>({ angle: 0, rate: 0, integral: 0, lastError: 1 });
  const trace = useRef<number[]>([]);
  const line = useRef<SVGPolylineElement>(null);
  const arm = useRef<SVGLineElement>(null);
  const errEl = useRef<HTMLElement>(null);
  const overEl = useRef<HTMLElement>(null);
  const peak = useRef(0);
  const TARGET = 1;

  const reset = useCallback(() => {
    joint.current = { angle: 0, rate: 0, integral: 0, lastError: TARGET };
    trace.current = []; peak.current = 0;
    line.current?.setAttribute("points", "");
  }, []);
  useEffect(() => { reset(); }, [reset, gains]);

  useSimLoop(stage, running, () => {
    for (let i = 0; i < 2; i++) {
      joint.current = jointStep(joint.current, TARGET, ...gainsRef.current);
      peak.current = Math.max(peak.current, joint.current.angle);
      trace.current.push(joint.current.angle);
      if (trace.current.length > PID_TRACE) trace.current.shift();
    }
    const j = joint.current;
    line.current?.setAttribute("points", trace.current.map((v, i) =>
      `${f2(i * (520 / PID_TRACE))},${f2(150 - Math.max(-0.4, Math.min(2, v)) * 62)}`).join(" "));
    arm.current?.setAttribute("x2", String(f2(120 + Math.cos(j.angle - 0.6) * 96)));
    arm.current?.setAttribute("y2", String(f2(112 - Math.sin(j.angle - 0.6) * 96)));
    if (errEl.current && Math.random() < 0.15) errEl.current.textContent = (TARGET - j.angle).toFixed(4);
    if (overEl.current && Math.random() < 0.15) overEl.current.textContent = Math.max(0, (peak.current - TARGET) / TARGET * 100).toFixed(1) + "%";
  });

  const labels = ["proportional · Kp", "integral · Ki", "derivative · Kd"];
  return <SimPanel id="sim-pid" eyebrow="07 · CONTROL"
    title="Tell a joint where to go, and it will not simply go there."
    question="Why does proportional control alone stop short?"
    answer={<><p>A constant load — gravity on the link — is pulling the joint down the whole time. Proportional torque is produced only by error, so the joint settles exactly where the proportional term balances the load, and that is not the target. The gap is a <strong>steady-state error</strong>, and no amount of extra Kp removes it; it only shrinks it while making the approach more violent, as the fourth preset shows.</p><p>Integral action fixes it properly: error that persists keeps accumulating, so the torque keeps rising until the error is actually zero. Derivative action responds to how fast the error is closing, which damps the overshoot the other two create. That is the whole of PID, and it still runs an enormous share of the machines in the world.</p></>}
    intro={<p>One joint with a mass on the end and gravity pulling it down, commanded to hold a position it is not currently at. The three gains are the entire controller.</p>}>
    <div className="sim-stage-dark" ref={stage}>
      <div className="sim-pid-grid">
        <svg viewBox="0 0 240 190" role="img" aria-label="A joint swinging toward its commanded angle.">
          <line x1="120" y1="112" x2={f2(120 + Math.cos(TARGET - 0.6) * 96)} y2={f2(112 - Math.sin(TARGET - 0.6) * 96)} className="sim-setpoint" />
          <line ref={arm} x1="120" y1="112" x2="200" y2="112" className="sim-link" />
          <circle cx="120" cy="112" r="9" className="sim-joint" />
        </svg>
        <svg viewBox="0 0 540 190" role="img" aria-label="The joint angle over time against its target.">
          <line x1="0" y1={f2(150 - 62)} x2="530" y2={f2(150 - 62)} className="sim-setpoint" />
          <line x1="0" y1="150" x2="530" y2="150" className="sim-rail" />
          <polyline ref={line} className="sim-trace" points="" />
          <text x="534" y={f2(150 - 62)} className="sim-axis-tag" textAnchor="end">target</text>
        </svg>
      </div>
    </div>
    <div className="sim-presets" role="group" aria-label="Controller presets">
      {PID_PRESETS.map(p => <button key={p.label} type="button" aria-pressed={p.gains.every((v, i) => v === gains[i])} onClick={() => setGains([...p.gains] as [number, number, number])}>{p.label}</button>)}
    </div>
    <div className="sim-controls sim-controls-three">
      {gains.map((g, i) => <Slider key={i} id={`sim-pid-${i}`} label={labels[i]} value={g} min={0} max={i === 0 ? 40 : 12} step={0.5} display={g.toFixed(1)}
        onChange={v => setGains(gains.map((old, j) => j === i ? v : old) as [number, number, number])} />)}
    </div>
    <Transport running={running} onToggle={toggle} onReset={reset}
      extra={<><span className="sim-counter">steady-state error <b ref={errEl}>1.0000</b></span><span className="sim-counter">peak overshoot <b ref={overEl}>0.0%</b></span></>} />
    <p className="sim-note">Start on <strong>P only</strong> and watch it settle short of the dashed line — that gap is gravity winning. Add integral and the gap closes; add derivative and it stops ringing on the way.</p>
  </SimPanel>;
}

/* ==================================================================
   08 · Sensing and state estimation
================================================================== */

const RAYS = 90, RANGE = 320;

export function LidarLab() {
  const { running, toggle } = usePlayback();
  const [drift, setDrift] = useState(3);
  const stage = useRef<HTMLDivElement>(null);
  const driftRef = useRef(drift);
  useEffect(() => { driftRef.current = drift; }, [drift]);

  const truth = useRef<Base>(baseStart());
  const guess = useRef<Base>(baseStart());
  const noise = useRef(seeded(7));
  const scan = useRef<SVGPolygonElement>(null);
  const beams = useRef<SVGPathElement>(null);
  const robot = useRef<SVGGElement>(null);
  const ghost = useRef<SVGGElement>(null);
  const breadcrumbs = useRef<number[]>([]);
  const crumbEl = useRef<SVGPolylineElement>(null);
  const gapEl = useRef<HTMLElement>(null);

  const paint = useCallback(() => {
    const t = truth.current, g = guess.current;
    const hull: string[] = [], rays: string[] = [];
    for (let i = 0; i < RAYS; i++) {
      const a = t.th + (i / RAYS) * Math.PI * 2;
      const dx = Math.cos(a), dy = Math.sin(a);
      const d = castRay(t.x, t.y, dx, dy, RANGE);
      const px = f2(t.x + dx * d), py = f2(t.y + dy * d);
      hull.push(`${px},${py}`);
      if (i % 3 === 0) rays.push(`M${f2(t.x)},${f2(t.y)}L${px},${py}`);
    }
    scan.current?.setAttribute("points", hull.join(" "));
    beams.current?.setAttribute("d", rays.join(""));
    robot.current?.setAttribute("transform", `translate(${f2(t.x)} ${f2(t.y)}) rotate(${f2(t.th * 180 / Math.PI)})`);
    ghost.current?.setAttribute("transform", `translate(${f2(g.x)} ${f2(g.y)}) rotate(${f2(g.th * 180 / Math.PI)})`);
    crumbEl.current?.setAttribute("points", breadcrumbs.current.join(" "));
    if (gapEl.current) gapEl.current.textContent = Math.hypot(t.x - g.x, t.y - g.y).toFixed(1);
  }, []);

  const reset = useCallback(() => {
    truth.current = baseStart(); guess.current = baseStart();
    noise.current = seeded(7); breadcrumbs.current = [];
    paint();
  }, [paint]);
  useEffect(() => { reset(); }, [reset]);

  useSimLoop(stage, running, dt => {
    const step = Math.min(dt, 1 / 30);
    const { speed, omega, arrived } = driveCommand(truth.current);
    truth.current = driveStep(truth.current, speed, omega, step, arrived);

    // Odometry integrates what it *commanded*, through wheels that are not quite
    // the size it believes, with a little noise. Nothing corrects it.
    const bias = 1 + driftRef.current / 100;
    const wobble = (noise.current() - 0.5) * driftRef.current * 0.01;
    guess.current = driveStep(guess.current, speed * bias, omega * (2 - bias) + wobble, step, arrived);
    guess.current.target = truth.current.target;

    const crumbs = breadcrumbs.current;
    if (crumbs.length < 2 || Math.hypot(crumbs[crumbs.length - 2] - truth.current.x, crumbs[crumbs.length - 1] - truth.current.y) > 9) {
      crumbs.push(f2(truth.current.x), f2(truth.current.y));
      if (crumbs.length > 900) crumbs.splice(0, crumbs.length - 900);
    }
    paint();
  });

  return <SimPanel id="sim-lidar" eyebrow="08 · SENSING, AND KNOWING WHERE YOU ARE"
    title="The robot can see the room. It still does not know where it is standing."
    question="If odometry always drifts, why is it in every robot?"
    answer={<><p>Because it is fast, always available, and locally excellent. Over a second it is close to perfect; the problem is only that the error <em>accumulates</em> and nothing ever removes it. A wheel a few percent off its nominal radius is a bias, not noise, so it integrates rather than averaging out.</p><p>The fix is not a better wheel encoder — it is a second source of information that does not drift. The lidar sees the walls, and walls do not move, so matching this scan against a map pins the pose absolutely. That combination is what SLAM is: dead reckoning for the short term, landmarks for the long term, and a filter deciding how much to trust each. This panel is the argument for it, drawn.</p></>}
    intro={<p>A differential-drive base follows four waypoints around a room, casting {RAYS} lidar rays every frame against the real walls. The solid robot is the truth. The outline is where the robot <em>believes</em> it is, integrating its own wheel commands.</p>}>
    <div className="sim-stage-dark is-flush" ref={stage}>
      <svg viewBox={`0 0 ${ROOM.w} ${ROOM.h}`} role="img" aria-label="A robot driving a room while casting lidar rays, with its drifting odometry estimate shown alongside.">
        <polygon ref={scan} className="sim-scan" points="" />
        <path ref={beams} className="sim-beam" d="" />
        {WALLS.map((w, i) => <line key={i} x1={w[0]} y1={w[1]} x2={w[2]} y2={w[3]} className="sim-wall" />)}
        {WAYPOINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" className="sim-waypoint" />)}
        <polyline ref={crumbEl} className="sim-crumbs" points="" />
        <g ref={ghost} className="sim-ghost"><circle r="11" /><line x1="0" y1="0" x2="17" y2="0" /></g>
        <g ref={robot} className="sim-robot"><circle r="11" /><line x1="0" y1="0" x2="17" y2="0" /></g>
      </svg>
    </div>
    <div className="sim-controls">
      <Slider id="sim-drift" label="Wheel calibration error" value={drift} min={0} max={10} step={0.5} display={drift.toFixed(1) + "%"} onChange={setDrift} />
    </div>
    <Transport running={running} onToggle={toggle} onReset={reset}
      extra={<span className="sim-counter">truth vs belief <b ref={gapEl}>0.0</b> <span>px apart</span></span>} />
    <p className="sim-note">Set the error to zero and the outline stays locked to the robot forever — perfect wheels, perfect knowledge. Nudge it to 2% and watch the two separate, slowly at first, then without limit. The lidar has been seeing the walls correctly the entire time; nothing is using that information.</p>
  </SimPanel>;
}
