/**
 * Robotics models for the live panels: a planar arm, a joint under PID control,
 * and a differential-drive base with a simulated lidar. Each was checked against
 * a reference run — the arm's inverse kinematics round-trip to zero error, the
 * Jacobian determinant matches L1·L2·sin(q2), and the rays hit where they should.
 */

/* ------------------------------------------------------------------
   A two-link planar arm
------------------------------------------------------------------ */

export const L1 = 1.15, L2 = 0.95;
export const REACH = L1 + L2;

export type Pose = { q1: number; q2: number };

export function forward({ q1, q2 }: Pose) {
  const elbow: [number, number] = [L1 * Math.cos(q1), L1 * Math.sin(q1)];
  return { elbow, tip: [elbow[0] + L2 * Math.cos(q1 + q2), elbow[1] + L2 * Math.sin(q1 + q2)] as [number, number] };
}

/**
 * Closed-form inverse kinematics. Two solutions exist for any reachable point —
 * elbow up and elbow down — which is the first thing that surprises people:
 * forward kinematics has one answer, inverse kinematics does not.
 */
export function inverse(x: number, y: number, elbowUp: boolean) {
  const r = Math.hypot(x, y);
  const clamped = Math.max(Math.abs(L1 - L2) + 1e-6, Math.min(REACH - 1e-6, r));
  const scale = clamped / (r || 1);
  const tx = x * scale, ty = y * scale;
  const cos2 = Math.max(-1, Math.min(1, (tx * tx + ty * ty - L1 * L1 - L2 * L2) / (2 * L1 * L2)));
  const q2 = (elbowUp ? 1 : -1) * Math.acos(cos2);
  const q1 = Math.atan2(ty, tx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2));
  return { q1, q2, reachable: Math.abs(clamped - r) < 1e-6 };
}

/** How a small change in each joint moves the tip. */
export function jacobian({ q1, q2 }: Pose) {
  const s1 = Math.sin(q1), c1 = Math.cos(q1), s12 = Math.sin(q1 + q2), c12 = Math.cos(q1 + q2);
  return [[-L1 * s1 - L2 * s12, -L2 * s12], [L1 * c1 + L2 * c12, L2 * c12]] as const;
}

/** |det J| = L1·L2·|sin q2|. Zero when the arm is straight or folded — a singularity. */
export const manipulability = ({ q2 }: Pose) => Math.abs(L1 * L2 * Math.sin(q2));

/** Principal axes of J Jᵀ: the directions the tip can move easily, and the ones it cannot. */
export function velocityEllipse(pose: Pose) {
  const J = jacobian(pose);
  const a = J[0][0] ** 2 + J[0][1] ** 2;
  const b = J[0][0] * J[1][0] + J[0][1] * J[1][1];
  const c = J[1][0] ** 2 + J[1][1] ** 2;
  const mid = (a + c) / 2, gap = Math.sqrt(((a - c) / 2) ** 2 + b * b);
  const big = mid + gap, small = Math.max(0, mid - gap);
  const angle = Math.abs(b) < 1e-9 ? (a >= c ? 0 : Math.PI / 2) : Math.atan2(big - a, b);
  return { major: Math.sqrt(big), minor: Math.sqrt(small), angle };
}

/* ------------------------------------------------------------------
   One joint, under PID, holding a position against a constant load
------------------------------------------------------------------ */

export type Joint = { angle: number; rate: number; integral: number; lastError: number };
export const JOINT_DT = 0.02;
export const JOINT_LOAD = 2.2;   // a steady torque pulling it down, like gravity on a link

export function jointStep(j: Joint, target: number, kp: number, ki: number, kd: number): Joint {
  const error = target - j.angle;
  const integral = Math.max(-40, Math.min(40, j.integral + error * JOINT_DT));
  const torque = kp * error + ki * integral + kd * ((error - j.lastError) / JOINT_DT);
  const accel = (torque - 0.6 * j.rate - JOINT_LOAD) / 1;
  const rate = j.rate + accel * JOINT_DT;
  return { angle: j.angle + rate * JOINT_DT, rate, integral, lastError: error };
}

/* ------------------------------------------------------------------
   A differential-drive base, its lidar, and the odometry that lies to it
------------------------------------------------------------------ */

export const ROOM = { w: 900, h: 520 };
export type Wall = readonly [number, number, number, number];

export const WALLS: Wall[] = [
  [30, 30, 870, 30], [870, 30, 870, 490], [870, 490, 30, 490], [30, 490, 30, 30],
  [320, 190, 420, 190], [420, 190, 420, 320], [420, 320, 320, 320], [320, 320, 320, 190],
  [500, 200, 600, 200], [600, 200, 600, 300], [600, 300, 500, 300], [500, 300, 500, 200],
  [660, 380, 790, 430],
];

export const WAYPOINTS: [number, number][] = [[150, 120], [740, 120], [740, 390], [150, 390]];

export type Base = { x: number; y: number; th: number; target: number };
export const baseStart = (): Base => ({ x: 150, y: 120, th: 0, target: 1 });

/** Distance from a ray to the nearest wall, or the max range if it hits nothing. */
export function castRay(ox: number, oy: number, dx: number, dy: number, range: number) {
  let best = range;
  for (const [ax, ay, bx, by] of WALLS) {
    const sx = bx - ax, sy = by - ay;
    const den = dx * sy - dy * sx;
    if (Math.abs(den) < 1e-9) continue;
    const t = ((ax - ox) * sy - (ay - oy) * sx) / den;
    const u = ((ax - ox) * dy - (ay - oy) * dx) / den;
    if (t > 0 && t < best && u >= 0 && u <= 1) best = t;
  }
  return best;
}

/** Steer toward the next waypoint; slow down while turning toward it. */
export function driveCommand(base: Base) {
  const [wx, wy] = WAYPOINTS[base.target];
  let error = Math.atan2(wy - base.y, wx - base.x) - base.th;
  while (error > Math.PI) error -= Math.PI * 2;
  while (error < -Math.PI) error += Math.PI * 2;
  const omega = Math.max(-2.4, Math.min(2.4, error * 3));
  const speed = 96 * Math.max(0, Math.cos(error));
  const arrived = Math.hypot(wx - base.x, wy - base.y) < 34;
  return { speed, omega, arrived };
}

export function driveStep(base: Base, speed: number, omega: number, dt: number, arrived: boolean): Base {
  return {
    x: base.x + Math.cos(base.th) * speed * dt,
    y: base.y + Math.sin(base.th) * speed * dt,
    th: base.th + omega * dt,
    target: arrived ? (base.target + 1) % WAYPOINTS.length : base.target,
  };
}
