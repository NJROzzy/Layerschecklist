/**
 * The physics behind the live demos on this page. Everything here is the real
 * calculation — no recordings, no easing curves pretending to be dynamics.
 * Each model below was checked against a reference run before being wired up.
 */

export const f2 = (value: number) => Number(value.toFixed(2));

/** Deterministic RNG so the first frame is identical on the server and in the browser. */
export function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------
   Orbital motion — the standard test for whether an integrator conserves
   energy. A body in a circular orbit should stay in one.
------------------------------------------------------------------ */

export type Body = { x: number; y: number; vx: number; vy: number };
export const GM = 1;

export const orbitStart = (): Body => ({ x: 1, y: 0, vx: 0, vy: 1 });
export const orbitEnergy = (s: Body) => 0.5 * (s.vx ** 2 + s.vy ** 2) - GM / Math.hypot(s.x, s.y);

const pull = (x: number, y: number) => {
  const r = Math.hypot(x, y), k = -GM / (r * r * r);
  return [k * x, k * y] as const;
};

/** Update position from the OLD velocity. Energy grows; the orbit spirals outward. */
export function explicitEuler(s: Body, h: number): Body {
  const [ax, ay] = pull(s.x, s.y);
  return { x: s.x + s.vx * h, y: s.y + s.vy * h, vx: s.vx + ax * h, vy: s.vy + ay * h };
}

/** Update velocity first, then move with the NEW velocity. One line different, and it conserves energy. */
export function semiImplicitEuler(s: Body, h: number): Body {
  const [ax, ay] = pull(s.x, s.y);
  const vx = s.vx + ax * h, vy = s.vy + ay * h;
  return { x: s.x + vx * h, y: s.y + vy * h, vx, vy };
}

/** Four sampled slopes averaged. Accurate, and four times the cost per step. */
export function rk4(s: Body, h: number): Body {
  const f = (st: Body) => { const [ax, ay] = pull(st.x, st.y); return { x: st.vx, y: st.vy, vx: ax, vy: ay }; };
  const add = (a: Body, b: Body, m: number): Body => ({ x: a.x + b.x * m, y: a.y + b.y * m, vx: a.vx + b.vx * m, vy: a.vy + b.vy * m });
  const k1 = f(s), k2 = f(add(s, k1, h / 2)), k3 = f(add(s, k2, h / 2)), k4 = f(add(s, k3, h));
  return {
    x: s.x + h / 6 * (k1.x + 2 * k2.x + 2 * k3.x + k4.x), y: s.y + h / 6 * (k1.y + 2 * k2.y + 2 * k3.y + k4.y),
    vx: s.vx + h / 6 * (k1.vx + 2 * k2.vx + 2 * k3.vx + k4.vx), vy: s.vy + h / 6 * (k1.vy + 2 * k2.vy + 2 * k3.vy + k4.vy),
  };
}

export const integrators = {
  explicit: { label: "Explicit Euler", cost: "1 force evaluation", step: explicitEuler },
  symplectic: { label: "Semi-implicit Euler", cost: "1 force evaluation", step: semiImplicitEuler },
  rk4: { label: "Runge–Kutta 4", cost: "4 force evaluations", step: rk4 },
};
export type IntegratorKey = keyof typeof integrators;

/* ------------------------------------------------------------------
   A spring, for the timestep-stability demo. Semi-implicit Euler is stable
   while the step stays under 2/omega; explicit Euler never really is.
------------------------------------------------------------------ */

export type Spring = { x: number; v: number };
export const springStep = (s: Spring, h: number, omega: number, explicit: boolean): Spring => {
  const a = -omega * omega * s.x;
  if (explicit) return { x: s.x + s.v * h, v: s.v + a * h };
  const v = s.v + a * h;
  return { x: s.x + v * h, v };
};

/* ------------------------------------------------------------------
   CartPole. The classic control benchmark, with the usual constants.
------------------------------------------------------------------ */

export type Cart = { x: number; dx: number; th: number; dth: number };
export type CartParams = { gravity: number; cartMass: number; poleMass: number; halfLength: number; force: number };
export const CART_DEFAULTS: CartParams = { gravity: 9.8, cartMass: 1, poleMass: 0.1, halfLength: 0.5, force: 10 };
export const CART_DT = 0.02;
export const cartAlive = (s: Cart) => Math.abs(s.x) < 2.4 && Math.abs(s.th) < 12 * Math.PI / 180;

export function cartStep(s: Cart, push: boolean, p: CartParams = CART_DEFAULTS): Cart {
  const f = push ? p.force : -p.force;
  const ct = Math.cos(s.th), st = Math.sin(s.th), total = p.cartMass + p.poleMass;
  const temp = (f + p.poleMass * p.halfLength * s.dth * s.dth * st) / total;
  const ddth = (p.gravity * st - ct * temp) / (p.halfLength * (4 / 3 - p.poleMass * ct * ct / total));
  const ddx = temp - p.poleMass * p.halfLength * ddth * ct / total;
  return { x: s.x + CART_DT * s.dx, dx: s.dx + CART_DT * ddx, th: s.th + CART_DT * s.dth, dth: s.dth + CART_DT * ddth };
}

/** A four-weight linear policy: push right when the weighted state reads positive. */
export type Gains = [number, number, number, number];
export const cartPolicy = (s: Cart, g: Gains) => g[0] * s.x + g[1] * s.dx + g[2] * s.th + g[3] * s.dth > 0;

/**
 * Run a whole episode headlessly. Beyond the physical parameters, this models the
 * two things that most often break a controller on real hardware: the decision
 * arriving a few steps late, and the measurement being slightly wrong.
 */
export function runEpisode(g: Gains, p: CartParams, startAngle: number,
  opts: { latency?: number; noise?: number; random?: () => number } = {}, cap = 600) {
  const { latency = 0, noise = 0, random = Math.random } = opts;
  let s: Cart = { x: 0, dx: 0, th: startAngle, dth: 0 };
  const queued: boolean[] = [];
  let t = 0;
  while (t < cap && cartAlive(s)) {
    const seen: Cart = noise
      ? { ...s, th: s.th + (random() - 0.5) * noise, dth: s.dth + (random() - 0.5) * noise * 4 }
      : s;
    queued.push(cartPolicy(seen, g));
    const action = queued.length > latency ? queued.shift()! : queued[0];
    s = cartStep(s, action, p);
    t++;
  }
  return t;
}

/* ------------------------------------------------------------------
   Boids. Three local rules; the flock is not programmed anywhere.
------------------------------------------------------------------ */

export type Boid = { x: number; y: number; vx: number; vy: number };
export type BoidRules = { separation: number; alignment: number; cohesion: number; speed: number };
export const BOID_FIELD = { w: 900, h: 520 };

export function makeFlock(count: number): Boid[] {
  const random = seeded(4242);
  return Array.from({ length: count }, () => {
    const angle = random() * Math.PI * 2;
    return { x: random() * BOID_FIELD.w, y: random() * BOID_FIELD.h, vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2 };
  });
}

const NEAR = 62, CLOSE = 24;

export function flockStep(flock: Boid[], rules: BoidRules, dt: number) {
  const scale = Math.min(dt, 1 / 30) * 60;
  for (const b of flock) {
    let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, near = 0;
    for (const other of flock) {
      if (other === b) continue;
      const dx = other.x - b.x, dy = other.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > NEAR * NEAR || d2 === 0) continue;
      near++; ax += other.vx; ay += other.vy; cx += other.x; cy += other.y;
      if (d2 < CLOSE * CLOSE) { const d = Math.sqrt(d2); sx -= dx / d; sy -= dy / d; }
    }
    if (near) {
      b.vx += (ax / near - b.vx) * rules.alignment * 0.05 * scale;
      b.vy += (ay / near - b.vy) * rules.alignment * 0.05 * scale;
      b.vx += (cx / near - b.x) * rules.cohesion * 0.0012 * scale;
      b.vy += (cy / near - b.y) * rules.cohesion * 0.0012 * scale;
    }
    b.vx += sx * rules.separation * 0.12 * scale;
    b.vy += sy * rules.separation * 0.12 * scale;

    const speed = Math.hypot(b.vx, b.vy) || 1;
    b.vx = b.vx / speed * rules.speed;
    b.vy = b.vy / speed * rules.speed;
    b.x = (b.x + b.vx * scale + BOID_FIELD.w) % BOID_FIELD.w;
    b.y = (b.y + b.vy * scale + BOID_FIELD.h) % BOID_FIELD.h;
  }
}

/** How tightly the flock agrees on a direction: 1 is a single stream, 0 is a milling crowd. */
export function flockOrder(flock: Boid[]) {
  let sx = 0, sy = 0;
  for (const b of flock) { const s = Math.hypot(b.vx, b.vy) || 1; sx += b.vx / s; sy += b.vy / s; }
  return Math.hypot(sx, sy) / flock.length;
}
