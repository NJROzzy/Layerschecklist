"use client";

import { useState } from "react";
import { Choices, Lab, Metrics, Readout, Slider, at, percent, show } from "./Lab";
import { combinations, numberSystems } from "./content";

/* ==================================================================
   01 · The number systems, and the one the machine actually has
================================================================== */

/** Truncate a float64 to bfloat16's 8 mantissa bits, the format used to halve
 *  the memory cost of training. Real hardware rounds; truncating shows the idea. */
function toBFloat16(value: number) {
  const view = new DataView(new ArrayBuffer(4));
  view.setFloat32(0, value);
  view.setUint16(2, 0);
  return view.getFloat32(0);
}

const floatSamples = [
  { label: "0.1", value: 0.1, note: "A tenth cannot be written exactly in binary, just as a third cannot be written exactly in decimal." },
  { label: "1 ÷ 3", value: 1 / 3, note: "Rational, and still not exactly storable." },
  { label: "π", value: Math.PI, note: "Irrational: no finite representation exists in any base." },
  { label: "0.1 + 0.2", value: 0.1 + 0.2, note: "The classic. The sum of two approximations is not the approximation of the sum." },
];

export function NumberLab() {
  const [rung, setRung] = useState(0);
  const [sample, setSample] = useState(0);
  const system = numberSystems[rung];
  const chosen = floatSamples[sample];
  const f32 = Math.fround(chosen.value);
  const bf16 = toBFloat16(chosen.value);

  return <Lab id="math-numbers" eyebrow="CLIMB THE LADDER" title="Every number system was invented because an equation had no answer."
    question="Why does it matter that ℝ has no gaps?"
    answer={<><p>Calculus is built on limits, and a limit is the value a sequence is heading towards. If the line had holes in it, a sequence could head straight at a hole and have nowhere to land — the limit would not exist. Completeness is the property that guarantees the destination is always there.</p><p>That is the whole reason the reals are the setting for derivatives, and therefore for training. The floating-point numbers below <em>are</em> full of holes, which is why the machine can only ever approximate the thing the mathematics describes.</p></>}>
    <p>Do not learn these as a list of definitions. Learn them as a sequence of failures: at each rung somebody asked a reasonable question, found the numbers they had could not answer it, and invented the ones that could.</p>
    <div className="math-ladder" role="group" aria-label="Number systems">
      {numberSystems.map((item, index) => <button key={item.symbol} type="button" aria-pressed={index === rung} onClick={() => setRung(index)}>
        <strong>{item.symbol}</strong><span>{item.name}</span>
      </button>)}
    </div>
    <Readout>
      <p className="math-eyebrow">RUNG {String(rung + 1).padStart(2, "0")} · {system.name.toUpperCase()}</p>
      <div className="math-equation-line"><span>Solve</span><strong>{system.equation}</strong><span>gives</span><strong>{system.solution}</strong></div>
      <dl className="math-definition-grid">
        <div><dt>What is in it</dt><dd>{system.contents}</dd></div>
        <div><dt>Why it was needed</dt><dd>{system.born}</dd></div>
        <div><dt>Where it runs out</dt><dd>{system.breaks}</dd></div>
        <div><dt>Where you meet it in AI</dt><dd>{system.inAI}</dd></div>
      </dl>
    </Readout>
    <h4>And then there is what your computer has instead</h4>
    <p>A weight is a real number in the mathematics and a <strong>floating-point approximation</strong> in the machine — a fixed budget of bits, so only finitely many values exist and everything else is rounded to the nearest one.</p>
    <Choices label="Value to inspect" value={sample} onChange={setSample} options={floatSamples.map((item, index) => ({ value: index, label: item.label }))} />
    <div className="math-float-table">
      <div><span>float64 · 52 mantissa bits</span><strong>{chosen.value.toPrecision(17)}</strong><small>What JavaScript and NumPy default to.</small></div>
      <div><span>float32 · 23 mantissa bits</span><strong>{f32.toPrecision(17)}</strong><small>The long-standing default for training.</small></div>
      <div><span>bfloat16 · 7 mantissa bits</span><strong>{bf16.toPrecision(17)}</strong><small>Half the memory, same exponent range. Widely used in large-model training.</small></div>
    </div>
    <p className="math-note">{chosen.note} Relative error at bfloat16: {chosen.value === 0 ? "0" : (Math.abs(bf16 - chosen.value) / Math.abs(chosen.value) * 100).toFixed(3) + "%"}.</p>
    <Metrics items={[["0.1 + 0.2", (0.1 + 0.2).toPrecision(17)], ["Is that 0.3?", 0.1 + 0.2 === 0.3 ? "yes" : "no", true]]} />
    <p className="math-note">This is not a bug in JavaScript; every language using IEEE 754 agrees. It is why loss curves are compared with tolerances rather than equality, why the order of a summation can change its result, and why mixed-precision training needs care about which numbers stay wide.</p>
  </Lab>;
}

/* ==================================================================
   02 · Variables, parameters, constants
================================================================== */

export function VariableLab() {
  const [w, setW] = useState(1.4);
  const [b, setB] = useState(-0.5);
  const [x, setX] = useState(2);
  const y = w * x + b;
  const point = (value: number) => at(40 + (value + 4) * 33.75);  // −4..4 across 310px
  const height = (value: number) => at(150 - value * 16);

  return <Lab id="math-variables" eyebrow="THE FIRST ABSTRACTION" title="A letter is a name for a number you have not fixed yet."
    question="If w and b are variables too, why call them parameters?"
    answer={<p>Because of <em>when</em> they change. Within one prediction, x varies from example to example while w and b sit still — so the line is fixed and the input moves along it. During training it reverses: the data is held fixed and w and b are the things being adjusted. Same symbols, two different roles depending on which loop you are inside. Getting that straight removes most of the confusion in reading an ML paper.</p>}>
    <p>Three letters, three different jobs. Move each slider and watch which part of the picture responds.</p>
    <div className="math-lab-grid">
      <div>
        <Slider id="math-var-w" label="w · a parameter (the model owns this)" value={w} min={-3} max={3} step={0.1} display={w.toFixed(1)} onChange={setW} />
        <Slider id="math-var-b" label="b · a parameter (the model owns this)" value={b} min={-3} max={3} step={0.1} display={b.toFixed(1)} onChange={setB} />
        <Slider id="math-var-x" label="x · a variable (the data owns this)" value={x} min={-4} max={4} step={0.1} display={x.toFixed(1)} onChange={setX} />
        <div className="math-equation-line"><strong>y = wx + b</strong></div>
        <div className="math-equation-line"><span>=</span><strong>{w.toFixed(1)}</strong><span>×</span><strong>{x.toFixed(1)}</strong><span>+</span><strong>{b.toFixed(1)}</strong><span>=</span><strong>{y.toFixed(2)}</strong></div>
      </div>
      <figure>
        <svg viewBox="0 0 350 310" role="img" aria-label={`The line y equals ${w.toFixed(1)}x plus ${b.toFixed(1)}, with the point at x equals ${x.toFixed(1)} giving y equals ${y.toFixed(2)}.`}>
          <line className="math-axis" x1="40" y1={height(0)} x2="350" y2={height(0)} />
          <line className="math-axis" x1={point(0)} y1="10" x2={point(0)} y2="290" />
          <line className="math-curve" x1={point(-4)} y1={height(w * -4 + b)} x2={point(4)} y2={height(w * 4 + b)} />
          <line className="math-guide" x1={point(x)} y1={height(0)} x2={point(x)} y2={height(y)} />
          <circle className="math-point" cx={point(x)} cy={height(y)} r="6" />
          <text className="math-axis-label" x={point(x)} y={height(0) + 18} textAnchor="middle">x = {x.toFixed(1)}</text>
          <text className="math-axis-label" x={point(x) + 10} y={height(y) - 10}>y = {y.toFixed(2)}</text>
        </svg>
        <figcaption>w tilts the line. b slides it up and down. x only moves the dot along a line that is already fixed.</figcaption>
      </figure>
    </div>
    <dl className="math-definition-grid">
      <div><dt>Constant</dt><dd>A value that never changes: 2, π, e. Write the number.</dd></div>
      <div><dt>Variable</dt><dd>A named quantity that takes different values — here x, one value per example.</dd></div>
      <div><dt>Parameter</dt><dd>Fixed while predicting, adjusted while training: w and b. Collectively written θ.</dd></div>
      <div><dt>Index</dt><dd>A counter pointing at one item: xᵢ is the i-th input, x⁽ⁱ⁾ the i-th example.</dd></div>
    </dl>
  </Lab>;
}

/* ==================================================================
   03 · Algebra as legal moves on a balance
================================================================== */

type Equation = { a: number; b: number; c: number };
const clean = (value: number) => Number(value.toFixed(6));
const sideText = (eq: Equation) => `${clean(eq.a)}x ${eq.b < 0 ? "−" : "+"} ${Math.abs(clean(eq.b))}`;

const moves: { label: string; apply: (eq: Equation) => Equation }[] = [
  { label: "− 4", apply: eq => ({ a: eq.a, b: eq.b - 4, c: eq.c - 4 }) },
  { label: "+ 4", apply: eq => ({ a: eq.a, b: eq.b + 4, c: eq.c + 4 }) },
  { label: "÷ 3", apply: eq => ({ a: eq.a / 3, b: eq.b / 3, c: eq.c / 3 }) },
  { label: "× 3", apply: eq => ({ a: eq.a * 3, b: eq.b * 3, c: eq.c * 3 }) },
  { label: "× 2", apply: eq => ({ a: eq.a * 2, b: eq.b * 2, c: eq.c * 2 }) },
];

const START: Equation = { a: 3, b: 4, c: 19 };

export function AlgebraLab() {
  const [equation, setEquation] = useState<Equation>(START);
  const [history, setHistory] = useState<string[]>([]);
  const solved = clean(equation.a) === 1 && clean(equation.b) === 0;
  const balanced = Math.abs((equation.a * 5 + equation.b) - equation.c) < 1e-9;

  return <Lab id="math-algebra" eyebrow="THE ONLY RULE THERE IS" title="Algebra is a balance you are not allowed to tip."
    question="Every move keeps it balanced. So why do most of them get you nowhere?"
    answer={<p>Legal and useful are different tests. Any operation applied to both sides preserves the truth of the equation, so × 2 is perfectly valid — it just leaves you no closer to x on its own. Solving is a <em>search</em> through legal moves toward one particular shape: x alone on one side. That distinction reappears everywhere in this field. A gradient step is always legal; whether it helps depends on the step size. A model is always allowed to fit the training set; whether that helps depends on what you were trying to do.</p>}>
    <p>Start from <strong>3x + 4 = 19</strong>. Do the same thing to both sides and the scales stay level, whatever that thing is. Your goal is to reach the one arrangement that reads <strong>x = something</strong>.</p>
    <div className="math-balance" aria-live="polite" aria-atomic="true">
      <div className="math-pan"><span>left</span><strong>{sideText(equation)}</strong></div>
      <div className="math-fulcrum" aria-hidden="true">=</div>
      <div className="math-pan"><span>right</span><strong>{clean(equation.c)}</strong></div>
    </div>
    <div className="math-choice-row" role="group" aria-label="Apply to both sides">
      {moves.map(move => <button key={move.label} type="button" onClick={() => { setEquation(move.apply(equation)); setHistory([...history, move.label]); }}>{move.label}</button>)}
      <button type="button" className="math-secondary" onClick={() => { setEquation(START); setHistory([]); }}>Reset</button>
    </div>
    <Metrics items={[
      ["Moves used", history.length || "—"],
      ["Still balanced", balanced ? "yes" : "no"],
      ["Solved", solved ? `x = ${clean(equation.c)}` : "not yet", !solved],
    ]} />
    {history.length > 0 && <p className="math-note">Applied so far: {history.join(" → ")}. {solved ? "That is a solution: x alone on the left, a number on the right." : "x = 5 solves the original equation, and it solves every equation you can reach from it by legal moves — that is exactly what “legal” means."}</p>}
  </Lab>;
}

/* ==================================================================
   05 · Vectors, dot products, and a layer as stacked dot products
================================================================== */

const A: [number, number] = [3, 1];

export function VectorLab() {
  const [angle, setAngle] = useState(35);
  const [length, setLength] = useState(2.5);
  const [inputs, setInputs] = useState<[number, number, number]>([1, 2, 0.5]);

  const radians = (angle * Math.PI) / 180;
  const B: [number, number] = [length * Math.cos(radians), length * Math.sin(radians)];
  const dotAB = A[0] * B[0] + A[1] * B[1];
  const normA = Math.hypot(...A);
  const normB = Math.hypot(...B);
  const cosine = dotAB / (normA * normB);
  const projection = dotAB / normA;

  // A two-neuron layer: each row of W is one neuron's weights.
  const W: [number, number, number][] = [[0.5, -1, 2], [1.5, 0.25, -0.5]];
  const bias: [number, number] = [0.1, -0.2];
  const outputs = W.map((row, i) => row.reduce((sum, weight, j) => sum + weight * inputs[j], 0) + bias[i]);

  const px = (value: number) => at(150 + value * 38);
  const py = (value: number) => at(150 - value * 38);

  return <Lab id="math-vectors" eyebrow="THE LANGUAGE OF THE FORWARD PASS" title="One number that answers “how much do these agree?”"
    question="Why is the dot product the operation that appears everywhere?"
    answer={<p>Because it is the cheapest honest answer to “how much of this is in that?”. It collapses two lists into a single number measuring alignment, it is linear in each argument, and on modern hardware thousands of them run at once. Attention scores are dot products. Cosine similarity is a dot product with the lengths divided out. A neuron is a dot product plus a bias. A matrix product is a grid of dot products. Learn this one operation properly and a surprising share of the notation in a paper stops being notation.</p>}>
    <p>A vector is an ordered list of numbers — and also an arrow. Both readings matter: the list is what the machine stores, the arrow is what lets you reason about it.</p>
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 300 300" role="img" aria-label={`Vector a is 3, 1. Vector b is ${B[0].toFixed(2)}, ${B[1].toFixed(2)}. The angle between them is ${(Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI).toFixed(0)} degrees.`}>
          <line className="math-axis" x1="10" y1={py(0)} x2="290" y2={py(0)} />
          <line className="math-axis" x1={px(0)} y1="10" x2={px(0)} y2="290" />
          <line className="math-vector-a" x1={px(0)} y1={py(0)} x2={px(A[0])} y2={py(A[1])} />
          <line className="math-vector-b" x1={px(0)} y1={py(0)} x2={px(B[0])} y2={py(B[1])} />
          <line className="math-guide" x1={px(B[0])} y1={py(B[1])} x2={px(projection * A[0] / normA)} y2={py(projection * A[1] / normA)} />
          <line className="math-projection" x1={px(0)} y1={py(0)} x2={px(projection * A[0] / normA)} y2={py(projection * A[1] / normA)} />
          <text className="math-axis-label" x={px(A[0]) + 6} y={py(A[1]) - 6}>a</text>
          <text className="math-axis-label" x={px(B[0]) + 6} y={py(B[1]) - 6}>b</text>
        </svg>
        <figcaption>The thick segment along <strong>a</strong> is b&apos;s shadow on a. Its length is the dot product divided by ‖a‖.</figcaption>
      </figure>
      <div>
        <Slider id="math-vec-angle" label="Direction of b" value={angle} min={-180} max={180} step={1} display={angle + "°"} onChange={setAngle} />
        <Slider id="math-vec-length" label="Length of b" value={length} min={0.2} max={4} step={0.1} display={length.toFixed(1)} onChange={setLength} />
        <Metrics items={[
          ["a · b", show(dotAB, 2)],
          ["‖a‖ ‖b‖", show(normA * normB, 2)],
          ["cos θ", show(cosine, 3)],
          ["b's shadow on a", show(projection, 2)],
        ]} />
        <p className="math-note">
          {cosine > 0.85 ? "Nearly aligned: the dot product is close to its largest possible value." :
           cosine < -0.85 ? "Nearly opposite: the dot product is close to its most negative value." :
           Math.abs(cosine) < 0.12 ? "Near right angles: the dot product passes through zero. Orthogonal vectors carry no component of one another." :
           "Partly aligned. The dot product measures the part of b lying along a, scaled by how long a is."}
        </p>
      </div>
    </div>
    <h4>Now stack them: that is a layer</h4>
    <p>Two neurons, three inputs. Each neuron has its own row of weights, and each output is one dot product plus a bias. Writing the rows as a matrix <strong>W</strong> turns both neurons into the single expression <strong>Wx + b</strong>.</p>
    <div className="math-input-row">{inputs.map((value, i) => <Slider key={i} id={`math-input-${i}`} label={`x${i + 1}`} value={value} min={-2} max={2} step={0.1} display={value.toFixed(1)}
      onChange={next => setInputs(inputs.map((old, j) => j === i ? next : old) as [number, number, number])} />)}</div>
    <div className="math-matrix-work">
      {W.map((row, i) => <div key={i}>
        <span className="math-eyebrow">NEURON {i + 1}</span>
        <code>{row.map((weight, j) => `${weight}×${inputs[j].toFixed(1)}`).join(" + ")} + {bias[i]}</code>
        <strong>= {outputs[i].toFixed(3)}</strong>
      </div>)}
    </div>
    <p className="math-note">Three multiplications and two additions per neuron. A real layer does the identical thing with matrices of millions of entries, which is the entire reason GPUs matter: not because the mathematics is hard, but because there is so much of it and all of it can run at once.</p>
  </Lab>;
}

/* ==================================================================
   06 · The derivative
================================================================== */

const curves = {
  square: { label: "x²", f: (x: number) => x * x, d: (x: number) => 2 * x, exact: "f′(x) = 2x", algebra: (a: number, h: number) => `((${a.toFixed(1)}+h)² − ${a.toFixed(1)}²) / h  =  2·${a.toFixed(1)} + h  =  ${(2 * a + h).toFixed(6)}` },
  cube: { label: "x³", f: (x: number) => x ** 3, d: (x: number) => 3 * x * x, exact: "f′(x) = 3x²", algebra: (a: number, h: number) => `3·${a.toFixed(1)}² + 3·${a.toFixed(1)}·h + h²  =  ${(3 * a * a + 3 * a * h + h * h).toFixed(6)}` },
  sine: { label: "sin x", f: Math.sin, d: Math.cos, exact: "f′(x) = cos x", algebra: (a: number) => `cos(${a.toFixed(1)}) = ${Math.cos(a).toFixed(6)}` },
  exp: { label: "eˣ", f: Math.exp, d: Math.exp, exact: "f′(x) = eˣ", algebra: (a: number) => `e^${a.toFixed(1)} = ${Math.exp(a).toFixed(6)}` },
};
type CurveKey = keyof typeof curves;

export function DerivativeLab() {
  const [curve, setCurve] = useState<CurveKey>("square");
  const [a, setA] = useState(1.5);
  const [exponent, setExponent] = useState(0);
  const h = Math.pow(10, -exponent);
  const { f, d, exact, label } = curves[curve];

  const secant = (f(a + h) - f(a)) / h;
  const truth = d(a);
  const error = Math.abs(secant - truth);

  // Plot window: x from −2.6 to 2.6, y auto-scaled to the visible curve.
  const xs = Array.from({ length: 161 }, (_, i) => -2.6 + i * 0.0325);
  const ys = xs.map(f);
  const lo = Math.min(...ys, 0), hi = Math.max(...ys, 0);
  const pad = (hi - lo) * 0.12 || 1;
  const px = (x: number) => at(40 + ((x + 2.6) / 5.2) * 300);
  const py = (y: number) => at(240 - ((y - lo + pad) / (hi - lo + 2 * pad)) * 220);
  const path = xs.map((x, i) => (i ? "L" : "M") + px(x).toFixed(2) + "," + py(ys[i]).toFixed(2)).join(" ");
  const line = (slope: number) => `M ${px(-2.6).toFixed(2)},${py(f(a) + slope * (-2.6 - a)).toFixed(2)} L ${px(2.6).toFixed(2)},${py(f(a) + slope * (2.6 - a)).toFixed(2)}`;

  return <Lab id="math-derivative" eyebrow="THE IDEA THE WHOLE FIELD RESTS ON" title="You cannot divide by zero. So creep up on it instead."
    question="If the limit is exact, why does shrinking h too far make the answer worse?"
    answer={<><p>Because two different things are happening at once. Mathematically, smaller h means a better estimate, all the way down. Numerically, f(x+h) and f(x) are two nearly identical floating-point numbers, and subtracting them throws away almost every significant digit you had — then you divide that wreckage by a tiny number, which magnifies it.</p><p>Watch the error fall to roughly 1e-8 and then climb again. The best h is a compromise between the two effects, near the square root of machine precision. This is why real frameworks do not estimate gradients this way: backpropagation computes them <em>exactly</em> with the chain rule, and finite differences are kept for checking that the exact code is right.</p></>}>
    <p>Average speed is easy: distance ÷ time. Speed <em>at an instant</em> looks impossible, because in an instant nothing happens — you get 0 ÷ 0, which is not a number. The move that rescues it is to refuse the impossible division and watch where the possible ones are heading.</p>
    <Choices label="Function" value={curve} onChange={setCurve} options={(Object.keys(curves) as CurveKey[]).map(key => ({ value: key, label: curves[key].label }))} />
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 360 270" role="img" aria-label={`The curve ${label} with a secant line through x equals ${a.toFixed(1)} and x plus h. Its slope is ${secant.toFixed(4)}; the true slope is ${truth.toFixed(4)}.`}>
          <defs><clipPath id="math-plot-clip"><rect x="40" y="10" width="300" height="230" /></clipPath></defs>
          <line className="math-axis" x1="40" y1={py(0)} x2="340" y2={py(0)} />
          <path className="math-curve-path" d={path} clipPath="url(#math-plot-clip)" />
          <path className="math-tangent" d={line(truth)} clipPath="url(#math-plot-clip)" />
          <path className="math-secant" d={line(secant)} clipPath="url(#math-plot-clip)" />
          <line className="math-guide" x1={px(a)} y1={py(f(a))} x2={px(a + h)} y2={py(f(a))} />
          <line className="math-guide" x1={px(a + h)} y1={py(f(a))} x2={px(a + h)} y2={py(f(a + h))} />
          <circle className="math-point" cx={px(a)} cy={py(f(a))} r="5" />
          <circle className="math-point-ghost" cx={px(a + h)} cy={py(f(a + h))} r="5" />
        </svg>
        <figcaption>Dashed: the secant through two points a distance h apart. Solid: the tangent, the line the secant is heading towards.</figcaption>
      </figure>
      <div>
        <Slider id="math-deriv-a" label="Where on the curve · x" value={a} min={-2.2} max={2.2} step={0.1} display={a.toFixed(1)} onChange={setA} />
        <Slider id="math-deriv-h" label="Gap between the two points · h" value={exponent} min={0} max={12} step={1} display={h.toExponential(0)} onChange={setExponent} />
        <Metrics items={[
          ["Secant slope (measured)", show(secant, 6)],
          ["True slope (the limit)", show(truth, 6)],
          ["Error", error.toExponential(2), exponent >= 9],
        ]} />
        <div className="math-formula-block">
          <div>(f(x + h) − f(x)) / h</div>
          <div>= ({f(a + h).toFixed(6)} − {f(a).toFixed(6)}) / {h.toExponential(0)}</div>
          <div>= {secant.toFixed(6)}</div>
        </div>
        <p className="math-note">{exponent >= 9
          ? "The error is rising again, and that is the floating point from the first chapter biting: subtracting two nearly equal numbers destroys precision faster than the smaller h recovers it."
          : exponent === 0
            ? "A wide gap measures the average slope across a whole stretch of curve, which is not yet the slope at a point. Shrink h."
            : "The measured slope is closing in on the true one. Keep shrinking h and watch how many digits agree."}</p>
      </div>
    </div>
    <div className="math-formula-block is-wide">
      <div className="math-eyebrow">DO THE ALGEBRA AND THE MYSTERY DISAPPEARS</div>
      <div>{curves[curve].algebra(a, h)}</div>
      <div>{exact}, so at x = {a.toFixed(1)} the exact answer is {truth.toFixed(6)}</div>
    </div>
    <p>For x² the quotient simplifies to exactly <strong>2x + h</strong> — no limit language needed to see where it is going. As h shrinks, the h on the end shrinks with it and 2x is what remains. That is the derivative, and every rule you will memorise later is this same calculation done once, in general, so you never have to repeat it.</p>
    <h4>The reading that matters for AI</h4>
    <p><strong>f′(x) is a sensitivity.</strong> It says: nudge the input a little near x, and the output moves about f′(x) times as much. At x = 3 on the curve x², the output moves six times as fast as the input. Training asks exactly this question about a loss and a weight — <em>if I nudge this number, how much does the error move, and in which direction?</em> — a few hundred billion times per step.</p>
  </Lab>;
}

/* ==================================================================
   06b · The chain rule, which is backpropagation
================================================================== */

export function ChainRuleLab() {
  const [x, setX] = useState(1);
  const [exponent, setExponent] = useState(2);
  const delta = Math.pow(10, -exponent);

  const g = (t: number) => 2 * t + 1;   // dg/dx = 2
  const hFn = (t: number) => t * t;     // dh/du = 2u
  const fFn = (t: number) => 3 * t;     // df/dv = 3

  const u = g(x), v = hFn(u), y = fFn(v);
  const u2 = g(x + delta), v2 = hFn(u2), y2 = fFn(v2);

  const rate1 = (u2 - u) / delta;
  const rate2 = (v2 - v) / (u2 - u);
  const rate3 = (y2 - y) / (v2 - v);
  const product = rate1 * rate2 * rate3;
  const overall = (y2 - y) / delta;
  const exactRate = 12 * u;  // dy/dx = 3 · 2u · 2

  const stages = [
    { name: "u = 2x + 1", from: x, to: u, rate: rate1, exact: 2, label: "du/dx" },
    { name: "v = u²", from: u, to: v, rate: rate2, exact: 2 * u, label: "dv/du" },
    { name: "y = 3v", from: v, to: y, rate: rate3, exact: 3, label: "dy/dv" },
  ];

  return <Lab id="math-chain" eyebrow="BACKPROPAGATION, WITHOUT THE NAME" title="A nudge travels through a chain, and each stage multiplies it."
    question="Why compute the chain from the output backwards?"
    answer={<p>A network has one loss and millions of weights. Going forwards, you would trace a separate chain from every weight to the loss — millions of passes. Going backwards, you compute how the loss responds to the last layer, then reuse that to get the layer before it, and so on: every weight&apos;s gradient falls out of a single sweep. That reuse is the whole algorithm. Backpropagation is not a different rule from the chain rule; it is the chain rule evaluated in the order that shares the most work.</p>}>
    <p>Three stages in a row. Push a nudge of size δ into the front and measure what arrives at each stage. Nothing here is more advanced than multiplication — the point is <em>what</em> gets multiplied.</p>
    <div className="math-lab-grid">
      <div>
        <Slider id="math-chain-x" label="Input · x" value={x} min={-2} max={2} step={0.1} display={x.toFixed(1)} onChange={setX} />
        <Slider id="math-chain-d" label="Nudge · δ" value={exponent} min={0} max={6} step={1} display={delta.toExponential(0)} onChange={setExponent} />
        <Metrics items={[
          ["Product of the three rates", show(product, 4)],
          ["Measured overall rate", show(overall, 4)],
          ["Exact dy/dx = 12(2x+1)", show(exactRate, 4)],
        ]} />
      </div>
      <ol className="math-chain-stages">
        {stages.map((stage, i) => <li key={stage.name}>
          <span className="math-eyebrow">STAGE {i + 1}</span>
          <strong>{stage.name}</strong>
          <div className="math-chain-flow"><span>{stage.from.toFixed(4)}</span><em>→</em><span>{stage.to.toFixed(4)}</span></div>
          <p>{stage.label} ≈ <strong>{show(stage.rate, 4)}</strong> · exactly {show(stage.exact, 4)}</p>
        </li>)}
      </ol>
    </div>
    <div className="math-formula-block is-wide">
      <div>dy/dx = (dy/dv) × (dv/du) × (du/dx)</div>
      <div>= {show(rate3, 4)} × {show(rate2, 4)} × {show(rate1, 4)} = {show(product, 4)}</div>
    </div>
    <p>The overall sensitivity is the <strong>product</strong> of the local sensitivities. That is the entire chain rule, and it is why deep networks have the failure modes they do: multiply many numbers below one and the gradient vanishes before it reaches the early layers; multiply many above one and it explodes. Careful initialisation, normalisation layers and residual connections are all, at bottom, attempts to keep this product near one.</p>
  </Lab>;
}

/* ==================================================================
   08 · Gradient descent
================================================================== */

export function DescentLab() {
  const [rate, setRate] = useState(0.2);
  const [steps, setSteps] = useState(6);
  const [start, setStart] = useState(-1);

  const loss = (w: number) => (w - 3) ** 2 + 1;
  const slope = (w: number) => 2 * (w - 3);

  const path: number[] = [start];
  for (let i = 0; i < steps; i++) {
    const w = path[path.length - 1];
    path.push(Number.isFinite(w) ? w - rate * slope(w) : w);
  }
  const multiplier = Math.abs(1 - 2 * rate);
  const final = path[path.length - 1];

  const px = (w: number) => at(40 + ((w + 4) / 14) * 300);
  const py = (value: number) => at(230 - (Math.min(value, 60) / 60) * 200);
  const curve = Array.from({ length: 121 }, (_, i) => {
    const w = -4 + (i / 120) * 14;
    return (i ? "L" : "M") + px(w).toFixed(2) + "," + py(loss(w)).toFixed(2);
  }).join(" ");

  const verdict = multiplier === 0 ? "One step lands exactly on the minimum: with α = 0.5 the update cancels the error completely."
    : multiplier < 1 && rate < 0.5 ? "Converging, approaching from one side."
    : multiplier < 1 ? "Converging, but overshooting and alternating sides each step."
    : multiplier === 1 ? "Stuck in a cycle: it jumps between two points forever and never improves."
    : "Diverging. Each step overshoots by more than the last and the loss grows without bound.";

  return <Lab id="math-descent" eyebrow="WHERE ALL OF IT MEETS" title="Read the slope, step against it, repeat."
    question="Why not just solve for the minimum directly?"
    answer={<p>For this parabola you can: set the derivative to zero, get w = 3, done. That works because the function is simple and convex. A neural network&apos;s loss has hundreds of billions of parameters, no closed-form solution, and a landscape that is not bowl-shaped, so there is no equation to solve — only a direction to follow. Descent asks the cheap local question, <em>which way is down from here?</em>, and accepts that it will never prove it found the best point. That it works as well as it does is genuinely not fully explained, which is why it appears in the open-questions chapter below.</p>}>
    <p>The loss is <strong>L(w) = (w − 3)² + 1</strong>, its slope is <strong>L′(w) = 2(w − 3)</strong>, and the rule is <strong>w ← w − α·L′(w)</strong>. Everything in this chapter and the last two now runs at once: a function, its derivative, and a step size.</p>
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 360 250" role="img" aria-label={`A parabola with ${steps} descent steps at learning rate ${rate}. The last position is ${Number.isFinite(final) ? final.toFixed(3) : "off the chart"}.`}>
          <line className="math-axis" x1="40" y1={py(0)} x2="340" y2={py(0)} />
          <path className="math-curve-path" d={curve} />
          {path.slice(0, -1).map((w, i) => {
            const next = path[i + 1];
            if (!Number.isFinite(w) || !Number.isFinite(next) || Math.abs(w) > 30 || Math.abs(next) > 30) return null;
            return <line key={i} className="math-step-line" x1={px(w)} y1={py(loss(w))} x2={px(next)} y2={py(loss(next))} />;
          })}
          {path.map((w, i) => Number.isFinite(w) && Math.abs(w) <= 30
            ? <circle key={i} className={i === path.length - 1 ? "math-point" : "math-point-ghost"} cx={px(w)} cy={py(loss(w))} r={i === path.length - 1 ? 6 : 4} />
            : null)}
          <line className="math-guide" x1={px(3)} y1={py(0)} x2={px(3)} y2={py(1)} />
          <text className="math-axis-label" x={px(3)} y={py(0) + 18} textAnchor="middle">minimum at w = 3</text>
        </svg>
        <figcaption>Each dot is one step. The largest dot is where you end up.</figcaption>
      </figure>
      <div>
        <Slider id="math-desc-rate" label="Learning rate · α" value={rate} min={0.05} max={1.2} step={0.05} display={rate.toFixed(2)} onChange={setRate} />
        <Slider id="math-desc-steps" label="Steps taken" value={steps} min={0} max={20} step={1} onChange={setSteps} />
        <Slider id="math-desc-start" label="Starting w" value={start} min={-4} max={9} step={0.5} display={start.toFixed(1)} onChange={setStart} />
        <Metrics items={[
          ["Position after the steps", Number.isFinite(final) ? show(final, 4) : "diverged"],
          ["Loss there", Number.isFinite(final) ? show(loss(final), 4) : "∞", !Number.isFinite(final) || loss(final) > 2],
          ["Error multiplier |1 − 2α|", show(multiplier, 2), multiplier >= 1],
        ]} />
        <p className="math-note">{verdict}</p>
      </div>
    </div>
    <p>For this loss the arithmetic is transparent: each step multiplies the distance from the minimum by exactly <strong>1 − 2α</strong>. Below 0.5 you approach steadily; at 0.5 you arrive in one step; between 0.5 and 1 you overshoot but still shrink; at 1 you bounce forever; above 1 you leave. A learning rate is not a vague dial for how fast you learn — it is a concrete multiplier on your remaining error, and in a real network it is one of these per direction of curvature at once.</p>
  </Lab>;
}

/* ==================================================================
   07 · Probability: softmax and cross-entropy
================================================================== */

export function ProbabilityLab() {
  const [logits, setLogits] = useState<[number, number, number]>([2, 0.5, -1]);
  const [truth, setTruth] = useState(0);
  const names = ["cat", "dog", "bird"];

  const maxLogit = Math.max(...logits);
  const weights = logits.map(z => Math.exp(z - maxLogit));  // shift for numerical stability
  const total = weights.reduce((sum, value) => sum + value, 0);
  const probabilities = weights.map(value => value / total);
  const pTrue = probabilities[truth];
  const loss = -Math.log(pTrue);

  const cx = (p: number) => at(40 + p * 280);
  const cy = (value: number) => at(150 - Math.min(value, 6) * 22);
  const lossCurve = Array.from({ length: 120 }, (_, i) => {
    const p = 0.008 + (i / 119) * 0.992;
    return (i ? "L" : "M") + cx(p).toFixed(2) + "," + cy(-Math.log(p)).toFixed(2);
  }).join(" ");

  return <Lab id="math-probability" eyebrow="TURNING SCORES INTO A CLAIM" title="Why the loss is a logarithm, and not something friendlier."
    question="Why not just use “1 − p” as the loss? It is simpler."
    answer={<><p>Three reasons, and they all matter. First, a model that assigns probability 0.001 to the truth is far worse than one assigning 0.3, but 1 − p barely distinguishes them (0.999 against 0.7); −log p rates them 6.9 against 1.2. Confident and wrong is the failure worth punishing hardest, and only the log punishes it without limit.</p><p>Second, independent probabilities multiply, and logs turn multiplication into addition — so the loss over a whole dataset becomes a sum, which is what makes it differentiable and cheap to work with. Third, minimising −log p is exactly maximising likelihood, so the training objective inherits a century of statistics rather than being invented for the occasion.</p></>}>
    <p>A network&apos;s last layer emits raw scores, which can be any real numbers. Two steps turn them into a claim you can grade: <strong>softmax</strong> makes them a probability distribution, then <strong>cross-entropy</strong> measures how surprised that distribution is by the truth.</p>
    <div className="math-input-row">{logits.map((value, i) => <Slider key={i} id={`math-logit-${i}`} label={`score for “${names[i]}”`} value={value} min={-4} max={4} step={0.1} display={value.toFixed(1)}
      onChange={next => setLogits(logits.map((old, j) => j === i ? next : old) as [number, number, number])} />)}</div>
    <div className="math-prob-bars" aria-live="polite" aria-atomic="true">
      {probabilities.map((p, i) => <div key={names[i]} className={i === truth ? "is-truth" : undefined}>
        <strong>{names[i]}</strong>
        <div><span style={{ width: percent(p * 100) }} /></div>
        <output>{(p * 100).toFixed(1)}%</output>
      </div>)}
    </div>
    <div className="math-formula-block is-wide"><div>softmax(z)ᵢ = exp(zᵢ) / Σⱼ exp(zⱼ)</div><div>they sum to {probabilities.reduce((s, p) => s + p, 0).toFixed(6)} — a distribution, by construction</div></div>
    <p>Now say which answer was actually correct. The loss looks only at the probability given to <em>that</em> one.</p>
    <Choices label="The correct answer" value={truth} onChange={setTruth} options={names.map((name, i) => ({ value: i, label: name }))} />
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 340 180" role="img" aria-label={`The curve of minus log p. At p equals ${pTrue.toFixed(3)} the loss is ${loss.toFixed(3)}.`}>
          <line className="math-axis" x1="40" y1={cy(0)} x2="330" y2={cy(0)} />
          <line className="math-axis" x1={cx(0)} y1="15" x2={cx(0)} y2={cy(0)} />
          <path className="math-curve-path" d={lossCurve} />
          <line className="math-guide" x1={cx(pTrue)} y1={cy(0)} x2={cx(pTrue)} y2={cy(Math.min(loss, 6))} />
          <circle className="math-point" cx={cx(pTrue)} cy={cy(Math.min(loss, 6))} r="6" />
          <text className="math-axis-label" x={cx(1)} y={cy(0) + 18} textAnchor="end">p = 1</text>
          <text className="math-axis-label" x={cx(0) + 4} y={cy(0) + 18}>p = 0</text>
        </svg>
        <figcaption>−log p. Certain and right costs nothing; certain and wrong costs without bound.</figcaption>
      </figure>
      <div>
        <Metrics items={[
          [`Probability given to “${names[truth]}”`, (pTrue * 100).toFixed(2) + "%"],
          ["Loss · −log p", show(loss, 4), loss > 1.5],
          ["In bits · −log₂ p", show(loss / Math.LN2, 4)],
        ]} />
        <p className="math-note">{pTrue > 0.8 ? "Confident and correct: the loss is near zero and there is little gradient left to learn from."
          : pTrue > 0.4 ? "Roughly right but unconvinced. There is a real gradient here, which is where learning happens."
          : "Confident and wrong — the expensive corner. The loss is large and so is the gradient, so this example will move the weights hard."}</p>
        <p className="math-note">Read the loss in bits and it has a plain meaning: the number of yes/no questions&apos; worth of surprise the model felt on seeing the right answer. Zero bits means it already knew.</p>
      </div>
    </div>
  </Lab>;
}

/* ==================================================================
   09 · What combines into what
================================================================== */

const allConcepts = [...new Set(combinations.flatMap(item => item.concepts))].sort();

export function CombinationLab() {
  const [mode, setMode] = useState<"part" | "concept">("part");
  const [part, setPart] = useState(combinations[0].part);
  const [concept, setConcept] = useState("Linear algebra");

  const selectedPart = combinations.find(item => item.part === part) ?? combinations[0];
  const usingConcept = combinations.filter(item => item.concepts.includes(concept));

  return <Lab id="math-combinations" eyebrow="NOTHING HERE IS USED ALONE" title="No single branch of mathematics builds an AI system."
    question="Which one should you learn first, then?"
    answer={<p>Linear algebra, without much doubt. It appears in more rows of this map than anything else, it is what the shapes in your code actually mean, and it is the language the forward pass is written in — you meet it on the first day and never stop. Calculus is second because it explains training rather than architecture, and probability third because it explains the loss and what a prediction claims. Optimisation is last because it is where the other three combine, and it is hard to appreciate before you have them.</p>}>
    <p>Look up a part of a system to see what it is made of, or look up a concept to see everywhere it turns up. The second direction is the more useful one once you start learning: it tells you what a week of study actually buys.</p>
    <Choices label="Direction" value={mode} onChange={setMode} options={[{ value: "part" as const, label: "By system part" }, { value: "concept" as const, label: "By math concept" }]} />
    {mode === "part" ? <>
      <div className="math-choice-row math-choice-wrap" role="group" aria-label="Part of an AI system">
        {combinations.map(item => <button key={item.part} type="button" aria-pressed={item.part === part} onClick={() => setPart(item.part)}>{item.part}</button>)}
      </div>
      <Readout>
        <h4>{selectedPart.part}</h4>
        <p className="math-note">{selectedPart.what}</p>
        <div className="math-concept-chips">{selectedPart.concepts.map(name => <span key={name}>{name}</span>)}</div>
        <p>{selectedPart.detail}</p>
      </Readout>
    </> : <>
      <div className="math-choice-row math-choice-wrap" role="group" aria-label="Mathematical concept">
        {allConcepts.map(name => <button key={name} type="button" aria-pressed={name === concept} onClick={() => setConcept(name)}>{name}</button>)}
      </div>
      <Readout>
        <h4>{concept}</h4>
        <p className="math-note">Used by {usingConcept.length} of the {combinations.length} parts on this map.</p>
        <ul className="math-uses-list">{usingConcept.map(item => <li key={item.part}><strong>{item.part}</strong><span>{item.what}</span></li>)}</ul>
      </Readout>
    </>}
  </Lab>;
}

/* ==================================================================
   05b · SVD and low-rank approximation
================================================================== */

const GLYPH = [
  "................", "......####......", "......####......", ".....##..##.....",
  ".....##..##.....", "....##....##....", "....##....##....", "...##########...",
  "...##########...", "..####....####..", "..####....####..", ".###........###.",
  ".###........###.", "###..........###", "................", "................",
];
const MATRIX = GLYPH.map(row => [...row].map(ch => (ch === "#" ? 1 : 0)));

/** One-sided Jacobi SVD: rotate pairs of columns until they are orthogonal. */
function computeSVD(A: number[][]) {
  const m = A.length, n = A[0].length;
  const U = A.map(row => row.slice());
  const V: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let i = 0; i < n - 1; i++) for (let j = i + 1; j < n; j++) {
      let alpha = 0, beta = 0, gamma = 0;
      for (let k = 0; k < m; k++) { alpha += U[k][i] * U[k][i]; beta += U[k][j] * U[k][j]; gamma += U[k][i] * U[k][j]; }
      off += gamma * gamma;
      if (Math.abs(gamma) < 1e-15) continue;
      const zeta = (beta - alpha) / (2 * gamma);
      const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
      const c = 1 / Math.sqrt(1 + t * t), s = c * t;
      for (let k = 0; k < m; k++) { const a = U[k][i], b = U[k][j]; U[k][i] = c * a - s * b; U[k][j] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][i], b = V[k][j]; V[k][i] = c * a - s * b; V[k][j] = s * a + c * b; }
    }
    if (off < 1e-24) break;
  }
  const order = Array.from({ length: n }, (_, i) => {
    let nrm = 0; for (let k = 0; k < m; k++) nrm += U[k][i] * U[k][i];
    return { value: Math.sqrt(nrm), index: i };
  }).sort((a, b) => b.value - a.value);
  return {
    S: order.map(o => o.value),
    U: order.map(o => U.map(row => (o.value > 1e-12 ? row[o.index] / o.value : 0))),
    V: order.map(o => V.map(row => row[o.index])),
  };
}

const DECOMP = computeSVD(MATRIX);
const ENERGY = DECOMP.S.reduce((sum, value) => sum + value * value, 0);

export function SVDLab() {
  const [k, setK] = useState(4);
  const size = MATRIX.length;

  const approx = Array.from({ length: size }, () => new Array(size).fill(0));
  for (let r = 0; r < k; r++) for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) {
    approx[i][j] += DECOMP.S[r] * DECOMP.U[r][i] * DECOMP.V[r][j];
  }
  let squared = 0;
  for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) squared += (approx[i][j] - MATRIX[i][j]) ** 2;

  const kept = DECOMP.S.slice(0, k).reduce((sum, value) => sum + value * value, 0) / ENERGY;
  const stored = k * (size + size + 1);
  const trueRank = DECOMP.S.filter(value => value > 1e-9).length;

  const grid = (cells: number[][], label: string) => <figure>
    <svg viewBox={`0 0 ${size * 12} ${size * 12}`} role="img" aria-label={label}>
      {cells.map((row, i) => row.map((value, j) => <rect key={`${i}-${j}`} x={j * 12} y={i * 12} width={12} height={12}
        fill={`color-mix(in srgb, var(--m-accent) ${at(Math.max(0, Math.min(1, value)) * 100)}%, var(--color-bg))`} />))}
    </svg>
    <figcaption>{label}</figcaption>
  </figure>;

  return <Lab id="math-svd" eyebrow="THE DECOMPOSITION THAT EARNS ITS KEEP" title="Every matrix is a rotation, a stretch, and another rotation."
    question="Why does this make fine-tuning cheap?"
    answer={<p>LoRA starts from an observation: the <em>change</em> a fine-tune makes to a big weight matrix is close to low-rank. So instead of learning all d×d numbers, you learn two thin matrices whose product has rank r, and add it on. With d = 4096 and r = 8 that is 65 thousand numbers instead of 17 million — the same trade you are making with the slider, applied to a weight update rather than a picture. It only works because real matrices, like the letter above, carry most of their content in their first few singular directions.</p>}>
    <p>The singular value decomposition writes any matrix as a sum of simple rank-one pieces, ordered by how much they matter. Keep the first few and you keep most of the content. This is PCA, image compression, and LoRA, all at once.</p>
    <Slider id="math-svd-k" label="Rank kept · k" value={k} min={1} max={size} step={1} onChange={setK} />
    <div className="math-svd-grids">
      {grid(MATRIX, `Original · ${size}×${size}`)}
      {grid(approx, `Rebuilt from ${k} singular ${k === 1 ? "direction" : "directions"}`)}
    </div>
    <div className="math-spectrum" aria-label="Singular values, largest first">
      {DECOMP.S.map((value, i) => <span key={i} className={i < k ? "is-kept" : undefined} style={{ height: percent(value / DECOMP.S[0] * 100) }} title={`σ${i + 1} = ${value.toFixed(3)}`} />)}
    </div>
    <Metrics items={[
      ["Numbers stored", `${stored} of ${size * size}`, stored > size * size],
      ["Content kept", (kept * 100).toFixed(1) + "%"],
      ["Typical pixel error", show(Math.sqrt(squared / (size * size)), 4)],
      ["True rank of this matrix", trueRank],
    ]} />
    <p className="math-note">The first singular value alone carries {(DECOMP.S[0] ** 2 / ENERGY * 100).toFixed(0)}% of the content. Note what happens past rank {Math.ceil(size * size / (2 * size + 1))}: you are storing more numbers than the original had, so compression stops being a saving. Low rank only pays when k stays small next to the dimensions — which, for real weight matrices, it does.</p>
  </Lab>;
}

/* ==================================================================
   07b · The Gaussian, and why it is everywhere
================================================================== */

/** Seeded generator so the server and the browser draw the same samples. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BINS = 26;

export function GaussianLab() {
  const [n, setN] = useState(1);
  const draws = 4000;

  const counts = new Array(BINS).fill(0);
  const random = mulberry32(20260919);
  let sum = 0, sumSquares = 0;
  for (let s = 0; s < draws; s++) {
    let total = 0;
    for (let i = 0; i < n; i++) total += random();
    const mean = total / n;
    sum += mean; sumSquares += mean * mean;
    counts[Math.min(BINS - 1, Math.floor(mean * BINS))]++;
  }
  const measuredMean = sum / draws;
  const measuredSd = Math.sqrt(sumSquares / draws - measuredMean * measuredMean);
  const predictedSd = Math.sqrt(1 / (12 * n));

  const peak = Math.max(...counts);
  const px = (value: number) => at(40 + value * 300);
  const py = (value: number) => at(190 - value * 160);
  const density = (x: number) => Math.exp(-((x - 0.5) ** 2) / (2 * predictedSd ** 2)) / (predictedSd * Math.sqrt(2 * Math.PI));
  const densityPeak = density(0.5);
  const bell = Array.from({ length: 121 }, (_, i) => {
    const x = i / 120;
    return (i ? "L" : "M") + px(x).toFixed(2) + "," + py(density(x) / densityPeak).toFixed(2);
  }).join(" ");

  return <Lab id="math-gaussian" eyebrow="WHY THE BELL CURVE IS UNAVOIDABLE" title="Average enough of anything and you get the same shape."
    question="Why does initialisation scale weights by 1 over the square root of the fan-in?"
    answer={<p>A neuron sums n terms, each roughly independent. Variances of independent things add, so the sum&apos;s variance is about n times one term&apos;s — meaning the signal grows by √n at every layer, and after thirty layers it has exploded or vanished. Dividing the initial weights by √n cancels that factor exactly, so variance is preserved through depth. Xavier and He initialisation are this argument with the activation function accounted for. It is one of the highest-value things on this page: a two-line variance calculation that decides whether a deep network trains at all.</p>}>
    <p>Draw <strong>n</strong> numbers uniformly between 0 and 1 and average them. At n = 1 the histogram is flat, because that is what uniform means. Watch what happens as n grows — nothing about the underlying distribution has changed.</p>
    <Slider id="math-clt-n" label="Numbers averaged together · n" value={n} min={1} max={12} step={1} onChange={setN} />
    <figure>
      <svg viewBox="0 0 360 215" role="img" aria-label={`Histogram of ${draws} averages of ${n} uniform draws, with the predicted bell curve overlaid. Measured spread ${measuredSd.toFixed(4)}.`}>
        <line className="math-axis" x1="40" y1={py(0)} x2="340" y2={py(0)} />
        {counts.map((count, i) => <rect key={i} className="math-hist-bar" x={px(i / BINS) + 1} y={py(count / peak)} width={at(300 / BINS - 2)} height={at(py(0) - py(count / peak))} />)}
        <path className="math-secant" d={bell} />
        <text className="math-axis-label" x={px(0)} y={py(0) + 17}>0</text>
        <text className="math-axis-label" x={px(0.5)} y={py(0) + 17} textAnchor="middle">0.5</text>
        <text className="math-axis-label" x={px(1)} y={py(0) + 17} textAnchor="end">1</text>
      </svg>
      <figcaption>Bars: {draws.toLocaleString("en-GB")} measured averages. Dashed: the Gaussian the central limit theorem predicts, with no fitting.</figcaption>
    </figure>
    <Metrics items={[
      ["Measured mean", show(measuredMean, 4)],
      ["Measured spread", show(measuredSd, 4)],
      ["Predicted √(1/12n)", show(predictedSd, 4)],
      ["Shape", n === 1 ? "flat" : n === 2 ? "a triangle" : n < 5 ? "rounding over" : "a bell"],
    ]} />
    <div className="math-formula-block is-wide">
      <div>Var(X₁ + … + Xₙ) = n·Var(X)  for independent terms</div>
      <div>so Var(mean) = Var(X)/n, and the spread shrinks as 1/√n</div>
    </div>
    <p>Two things are happening, and they are worth separating. The spread narrows like 1/√n — that is the law of large numbers, and it is why a bigger mini-batch gives a steadier gradient. The <em>shape</em> becomes Gaussian regardless of what you started from — that is the central limit theorem, and it is why the bell curve describes measurement error, heights, and the sum of many small effects in almost any system you look at. Nobody chose the Gaussian for its convenience. It is what averaging does.</p>
  </Lab>;
}

/* ==================================================================
   07c · KL divergence
================================================================== */

const KL_NAMES = ["cat", "dog", "bird", "fish"];
const TRUTH = [0.5, 0.25, 0.15, 0.1];

export function KLLab() {
  const [logits, setLogits] = useState<[number, number, number, number]>([1.2, 0.6, 0.2, 0]);
  const [direction, setDirection] = useState<"pq" | "qp">("pq");

  const shifted = logits.map(z => Math.exp(z - Math.max(...logits)));
  const total = shifted.reduce((sum, value) => sum + value, 0);
  const Q = shifted.map(value => value / total);

  const entropy = -TRUTH.reduce((sum, p) => sum + (p > 0 ? p * Math.log(p) : 0), 0);
  const crossEntropy = -TRUTH.reduce((sum, p, i) => sum + (p > 0 ? p * Math.log(Q[i]) : 0), 0);
  const klPQ = TRUTH.reduce((sum, p, i) => sum + (p > 0 ? p * Math.log(p / Q[i]) : 0), 0);
  const klQP = Q.reduce((sum, q, i) => sum + (q > 1e-12 ? q * Math.log(q / TRUTH[i]) : 0), 0);
  const shown = direction === "pq" ? klPQ : klQP;

  return <Lab id="math-kl" eyebrow="THE MISSING HALF OF CROSS-ENTROPY" title="How far one distribution is from another."
    question="If KL is a distance, why is it not symmetric?"
    answer={<><p>Because it asks a one-sided question: how much extra surprise do you suffer by <em>using</em> Q when reality is P. Swapping the roles asks a different question, so it gets a different number — try the swap button and watch them diverge. It is not a metric, and calling it a distance is a convenient lie.</p><p>The asymmetry has teeth. Minimising KL(P‖Q) over the data punishes Q for assigning near-zero probability to anything that really happens, so Q spreads out to cover everything — that is maximum likelihood, and it is why generative models produce blurry averages. Minimising KL(Q‖P) instead punishes Q for putting mass where P has none, so Q collapses onto one mode and ignores the rest. Same two distributions, opposite failure modes, chosen by which way round you write it.</p></>}>
    <p>Reality is fixed at <strong>P</strong>. Move the model&apos;s scores to change <strong>Q</strong> and watch three quantities that are usually taught as separate things turn out to be one equation.</p>
    <div className="math-input-row math-input-four">{logits.map((value, i) => <Slider key={i} id={`math-kl-${i}`} label={`score for “${KL_NAMES[i]}”`} value={value} min={-3} max={3} step={0.1} display={value.toFixed(1)}
      onChange={next => setLogits(logits.map((old, j) => j === i ? next : old) as [number, number, number, number])} />)}</div>
    <div className="math-dual-bars" aria-live="polite" aria-atomic="true">
      {KL_NAMES.map((name, i) => <div key={name}>
        <strong>{name}</strong>
        <div><span className="is-truth" style={{ width: percent(TRUTH[i] * 100) }} /></div>
        <output>{(TRUTH[i] * 100).toFixed(0)}%</output>
        <div><span style={{ width: percent(Q[i] * 100) }} /></div>
        <output>{(Q[i] * 100).toFixed(1)}%</output>
      </div>)}
      <p className="math-note math-dual-key"><span className="math-key-truth" aria-hidden="true" /> P · what actually happens &nbsp;&nbsp; <span className="math-key-model" aria-hidden="true" /> Q · what the model predicts</p>
    </div>
    <div className="math-formula-block is-wide">
      <div className="math-eyebrow">ONE EQUATION, THREE FAMILIAR QUANTITIES</div>
      <div>H(P, Q)  =  H(P)  +  KL(P ‖ Q)</div>
      <div>{crossEntropy.toFixed(4)}  =  {entropy.toFixed(4)}  +  {klPQ.toFixed(4)}</div>
    </div>
    <Metrics items={[
      ["H(P) · irreducible", show(entropy, 4)],
      ["H(P,Q) · your loss", show(crossEntropy, 4)],
      [direction === "pq" ? "KL(P ‖ Q)" : "KL(Q ‖ P)", show(shown, 4), shown > 0.2],
      ["The other direction", show(direction === "pq" ? klQP : klPQ, 4)],
    ]} />
    <Choices label="Direction" value={direction} onChange={setDirection} options={[{ value: "pq" as const, label: "KL(P ‖ Q)" }, { value: "qp" as const, label: "KL(Q ‖ P) · swap" }]} />
    <p>This is the payoff of the previous lab. Cross-entropy — the loss you actually minimise — splits cleanly into the entropy of the data, which no model can do anything about, and the KL divergence, which is entirely the model&apos;s fault. Training can only ever drive the second term down. When a loss curve flattens above zero, that floor is H(P): the data was ambiguous and no parameters will fix it.</p>
  </Lab>;
}

/* ==================================================================
   06c · Taylor series
================================================================== */

const series = {
  sin: { label: "sin x", f: Math.sin, coefficient: (n: number) => (n % 2 === 0 ? 0 : (n % 4 === 1 ? 1 : -1) / factorial(n)), from: -7, to: 7, note: "Converges everywhere, but you need more terms the further out you look." },
  exp: { label: "eˣ", f: Math.exp, coefficient: (n: number) => 1 / factorial(n), from: -3, to: 3, note: "Converges everywhere. This is how a calculator actually evaluates it." },
  log: { label: "ln(1 + x)", f: (x: number) => Math.log(1 + x), coefficient: (n: number) => (n === 0 ? 0 : (n % 2 === 1 ? 1 : -1) / n), from: -0.9, to: 2.4, note: "Diverges past x = 1 no matter how many terms you add — every series has a radius beyond which it is useless." },
};
type SeriesKey = keyof typeof series;
function factorial(n: number) { let out = 1; for (let i = 2; i <= n; i++) out *= i; return out; }

export function TaylorLab() {
  const [which, setWhich] = useState<SeriesKey>("sin");
  const [order, setOrder] = useState(3);
  const { f, from, to, label, coefficient, note } = series[which];

  const approximate = (x: number) => {
    let sum = 0;
    for (let n = 0; n <= order; n++) sum += coefficient(n) * Math.pow(x, n);
    return sum;
  };

  const samples = Array.from({ length: 241 }, (_, i) => from + (i / 240) * (to - from));
  const lo = Math.min(...samples.map(f)), hi = Math.max(...samples.map(f));
  const pad = (hi - lo) * 0.45 || 1;
  const px = (x: number) => at(40 + ((x - from) / (to - from)) * 300);
  const py = (y: number) => at(200 - ((y - lo + pad) / (hi - lo + 2 * pad)) * 180);
  const trace = (g: (x: number) => number) => samples
    .map((x, i) => (i ? "L" : "M") + px(x).toFixed(2) + "," + py(Math.max(lo - pad, Math.min(hi + pad, g(x)))).toFixed(2)).join(" ");

  const probe = (to - from) * 0.33 + from;
  const error = Math.abs(approximate(probe) - f(probe));

  return <Lab id="math-taylor" eyebrow="EVERY HARD FUNCTION, LOCALLY EASY" title="Near a point, anything smooth is a polynomial."
    question="What has this got to do with training?"
    answer={<p>Everything, and it is usually left unsaid. Gradient descent replaces the loss near your current weights with its <strong>first-order</strong> Taylor approximation — a flat plane — and steps along it; the learning rate exists because that plane is only trustworthy nearby. Newton&apos;s method keeps the <strong>second-order</strong> term as well, so it models the curve as a bowl and can jump straight to its bottom, which is why it needs far fewer steps and why each one costs a Hessian. Every optimiser you will meet is a choice about how many Taylor terms you can afford.</p>}>
    <p>Pick a function and add terms one at a time. The polynomial grips the curve at zero first, then bends to match its slope, then its curvature, then creeps outward.</p>
    <Choices label="Function" value={which} onChange={setWhich} options={(Object.keys(series) as SeriesKey[]).map(key => ({ value: key, label: series[key].label }))} />
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 360 225" role="img" aria-label={`${label} with its Taylor polynomial of order ${order} around zero.`}>
          <defs><clipPath id="math-taylor-clip"><rect x="40" y="8" width="300" height="200" /></clipPath></defs>
          <line className="math-axis" x1="40" y1={py(0)} x2="340" y2={py(0)} />
          <line className="math-axis" x1={px(0)} y1="8" x2={px(0)} y2="208" />
          <path className="math-curve-path" d={trace(f)} clipPath="url(#math-taylor-clip)" />
          <path className="math-secant" d={trace(approximate)} clipPath="url(#math-taylor-clip)" />
          <circle className="math-point" cx={px(0)} cy={py(f(0))} r="5" />
        </svg>
        <figcaption>Solid: the real function. Dashed: the polynomial. The dot is where they are forced to agree.</figcaption>
      </figure>
      <div>
        <Slider id="math-taylor-order" label="Highest power kept" value={order} min={0} max={11} step={1} onChange={setOrder} />
        <Metrics items={[
          ["Terms used", order + 1],
          ["Error part-way out", show(error, 5), error > 0.5],
          ["Order 1 is", "a gradient step"],
          ["Order 2 is", "Newton's method"],
        ]} />
        <div className="math-formula-block">
          <div>f(x) ≈ f(0) + f′(0)x + f″(0)x²/2! + …</div>
          <div>{Array.from({ length: order + 1 }, (_, n) => coefficient(n)).map((c, n) => c === 0 ? null : `${c > 0 && n > 0 ? "+ " : c < 0 ? "− " : ""}${Math.abs(c).toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}${n ? `x${n > 1 ? "^" + n : ""}` : ""}`).filter(Boolean).join(" ") || "0"}</div>
        </div>
        <p className="math-note">{note}</p>
      </div>
    </div>
  </Lab>;
}

/* ==================================================================
   08b · Regularisation, and where sparsity comes from
================================================================== */

const OPTIMUM: [number, number] = [2.2, 0.9];
const CURVE: [[number, number], [number, number]] = [[1, 0.35], [0.35, 0.55]];
const quadratic = (w: [number, number]) => {
  const d: [number, number] = [w[0] - OPTIMUM[0], w[1] - OPTIMUM[1]];
  return d[0] * (CURVE[0][0] * d[0] + CURVE[0][1] * d[1]) + d[1] * (CURVE[1][0] * d[0] + CURVE[1][1] * d[1]);
};

export function RegularizationLab() {
  const [penalty, setPenalty] = useState<"l1" | "l2">("l1");
  const [budget, setBudget] = useState(1.2);

  // The optimum sits on the boundary whenever the unpenalised one is out of reach.
  let solution: [number, number] = OPTIMUM;
  let bestLoss = 0;
  if ((penalty === "l1" ? Math.abs(OPTIMUM[0]) + Math.abs(OPTIMUM[1]) : Math.hypot(...OPTIMUM)) > budget) {
    bestLoss = Infinity;
    const corners: [number, number][] = [[budget, 0], [0, budget], [-budget, 0], [0, -budget]];
    for (let i = 0; i < 1600; i++) {
      let w: [number, number];
      if (penalty === "l2") {
        const theta = (i / 1600) * Math.PI * 2;
        w = [budget * Math.cos(theta), budget * Math.sin(theta)];
      } else {
        const u = (i / 1600) * 4, side = Math.floor(u), fraction = u - side;
        const a = corners[side], b = corners[(side + 1) % 4];
        w = [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction];
      }
      const value = quadratic(w);
      if (value < bestLoss) { bestLoss = value; solution = w; }
    }
  }
  const zeroed = Math.abs(solution[1]) < 0.02 || Math.abs(solution[0]) < 0.02;

  const px = (v: number) => at(175 + v * 58);
  const py = (v: number) => at(175 - v * 58);
  const contour = (level: number) => Array.from({ length: 97 }, (_, i) => {
    const theta = (i / 96) * Math.PI * 2;
    const d: [number, number] = [Math.cos(theta), Math.sin(theta)];
    const form = d[0] * (CURVE[0][0] * d[0] + CURVE[0][1] * d[1]) + d[1] * (CURVE[1][0] * d[0] + CURVE[1][1] * d[1]);
    const r = Math.sqrt(level / form);
    return (i ? "L" : "M") + px(OPTIMUM[0] + d[0] * r).toFixed(2) + "," + py(OPTIMUM[1] + d[1] * r).toFixed(2);
  }).join(" ") + " Z";

  const region = penalty === "l2"
    ? <circle className="math-region" cx={px(0)} cy={py(0)} r={at(budget * 58)} />
    : <polygon className="math-region" points={[[budget, 0], [0, budget], [-budget, 0], [0, -budget]].map(([a, b]) => `${px(a)},${py(b)}`).join(" ")} />;

  return <Lab id="math-regularization" eyebrow="WHY L1 GIVES YOU ZEROS AND L2 DOES NOT" title="A budget on the weights, and the shape of that budget."
    question="So is weight decay the same as L2 regularisation?"
    answer={<p>For plain SGD, yes — adding λ‖w‖² to the loss and shrinking every weight by a constant factor each step are the same update written two ways. For Adam they come apart, because Adam divides by the recent gradient magnitude and that division also rescales the penalty term, so the effective decay differs per parameter. AdamW exists precisely to fix this: it applies the shrinkage separately, outside the adaptive scaling. That is the entire content of a paper people cite constantly, and it is a consequence of the algebra rather than a new idea.</p>}>
    <p>Two weights. The ellipses are the loss, lowest at the dot in the middle. The shaded shape is your budget: the weights must stay inside it. The answer is wherever the smallest reachable ellipse touches the shape — and <em>the shape of the budget decides where that touch happens</em>.</p>
    <Choices label="Penalty" value={penalty} onChange={setPenalty} options={[{ value: "l1" as const, label: "L1 · |w₁| + |w₂|" }, { value: "l2" as const, label: "L2 · w₁² + w₂²" }]} />
    <div className="math-lab-grid">
      <figure>
        <svg viewBox="0 0 350 300" role="img" aria-label={`Loss contours with an ${penalty === "l1" ? "L1 diamond" : "L2 circle"} constraint of size ${budget}. The solution is at ${solution[0].toFixed(2)}, ${solution[1].toFixed(2)}.`}>
          <line className="math-axis" x1="15" y1={py(0)} x2="335" y2={py(0)} />
          <line className="math-axis" x1={px(0)} y1="15" x2={px(0)} y2="285" />
          {region}
          {[0.25, 1, 2.25, 4].map(level => <path key={level} className="math-contour" d={contour(level)} />)}
          <circle className="math-point-ghost" cx={px(OPTIMUM[0])} cy={py(OPTIMUM[1])} r="5" />
          <circle className="math-point" cx={px(solution[0])} cy={py(solution[1])} r="7" />
          <text className="math-axis-label" x={px(OPTIMUM[0]) + 9} y={py(OPTIMUM[1]) - 8}>unpenalised best</text>
          <text className="math-axis-label" x="330" y={py(0) - 8} textAnchor="end">w₁</text>
          <text className="math-axis-label" x={px(0) + 7} y="26">w₂</text>
        </svg>
        <figcaption>The solution is where the smallest reachable contour touches the budget.</figcaption>
      </figure>
      <div>
        <Slider id="math-reg-budget" label="Budget on the weights" value={budget} min={0.2} max={2.6} step={0.1} display={budget.toFixed(1)} onChange={setBudget} />
        <Metrics items={[
          ["w₁", show(solution[0], 3)],
          ["w₂", show(solution[1], 3), zeroed],
          ["Loss at the solution", show(quadratic(solution), 3)],
          ["A weight at exactly zero", zeroed ? "yes" : "no", zeroed],
        ]} />
        <p className="math-note">{penalty === "l1"
          ? (zeroed ? "The diamond has corners on the axes, and a corner is where a shrinking ellipse touches first. w₂ is not small — it is zero, and that feature has been removed from the model entirely."
                    : "With a generous budget the touch point slips off the corner onto a flat edge and nothing is zeroed. Tighten it and the corner wins again.")
          : "The circle has no corners. There is nothing to catch the contour on an axis, so both weights shrink towards zero together and neither ever arrives."}</p>
      </div>
    </div>
    <p>This one picture is the whole difference. <strong>L1 selects</strong>: it produces models with genuinely fewer features, because a corner is the first thing a shrinking ellipse meets. <strong>L2 shrinks</strong>: it keeps every feature and makes them all smaller, which is smoother and usually better conditioned. Both fight overfitting by refusing to let the fit chase noise; they just disagree about whether the answer should be sparse.</p>
  </Lab>;
}
