"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { LabKind } from "./types";
import { MemoryLab, AttentionLab, ContrastiveLab, VAELab, GANLab, DiffusionLab, CalibrationLab, BellmanLab } from "./AdvancedLabs";

const round = (v: number) => Number(v.toFixed(2));

/* ------------------------------------------------------------------
   Week 4 · convolution
   The arithmetic here is the real thing: every output cell is computed
   from the input, the kernel, the stride and the padding on each render.
------------------------------------------------------------------ */

const INPUTS: Record<string, number[][]> = {
  "Vertical edge": [
    [0, 0, 0, 9, 9, 9, 9], [0, 0, 0, 9, 9, 9, 9], [0, 0, 0, 9, 9, 9, 9],
    [0, 0, 0, 9, 9, 9, 9], [0, 0, 0, 9, 9, 9, 9], [0, 0, 0, 9, 9, 9, 9], [0, 0, 0, 9, 9, 9, 9],
  ],
  "Horizontal edge": [
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9, 9, 9, 9],
  ],
  "Corner": [
    [9, 9, 9, 9, 0, 0, 0], [9, 9, 9, 9, 0, 0, 0], [9, 9, 9, 9, 0, 0, 0], [9, 9, 9, 9, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
  ],
};

const KERNELS: Record<string, number[][]> = {
  "Vertical contrast": [[1, 0, -1], [1, 0, -1], [1, 0, -1]],
  "Horizontal contrast": [[1, 1, 1], [0, 0, 0], [-1, -1, -1]],
  "Blur (mean)": [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  "Identity": [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
};

function ConvolutionLab() {
  const [inputName, setInputName] = useState("Vertical edge");
  const [kernelName, setKernelName] = useState("Vertical contrast");
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState(1);
  const [relu, setRelu] = useState(false);
  const [picked, setPicked] = useState<[number, number] | null>(null);

  const input = INPUTS[inputName];
  const kernel = KERNELS[kernelName];
  const k = 3, n = input.length;
  const scale = kernelName === "Blur (mean)" ? 1 / 9 : 1;

  const out = Math.floor((n + 2 * padding - k) / stride) + 1;
  const at = (r: number, c: number) => (r < 0 || c < 0 || r >= n || c >= n ? 0 : input[r][c]);

  const window = (oy: number, ox: number) => {
    const terms: { v: number; w: number; r: number; c: number }[] = [];
    for (let u = 0; u < k; u++) for (let v = 0; v < k; v++) {
      const r = oy * stride + u - padding, c = ox * stride + v - padding;
      terms.push({ v: at(r, c), w: kernel[u][v], r, c });
    }
    return terms;
  };
  const value = (oy: number, ox: number) => {
    const raw = window(oy, ox).reduce((s, t) => s + t.v * t.w, 0) * scale;
    return relu ? Math.max(0, raw) : raw;
  };

  const feature = out > 0 ? Array.from({ length: out }, (_, r) => Array.from({ length: out }, (_, c) => value(r, c))) : [];
  const peak = Math.max(1, ...feature.flat().map(Math.abs));
  const lit = picked ? new Set(window(picked[0], picked[1]).map(t => `${t.r},${t.c}`)) : new Set<string>();

  const cell = (v: number, key: string, on: boolean, tone: number) => <span key={key}
    style={{ background: `color-mix(in srgb, var(--dc-teal) ${Math.round(tone * 60)}%, transparent)`,
             outline: on ? "2px solid var(--dc-accent)" : undefined }}>{v}</span>;

  return <div className="dc-lab">
    <p className="dc-eyebrow">INTERACTIVE · SLIDE THE KERNEL</p>
    <h3>Compute a feature map, one window at a time</h3>
    <p>Every number below is calculated from the input, the kernel, the stride and the padding — change any of them and the whole map is recomputed. Select an output cell to see the nine products that produced it.</p>

    <div className="dc-controls">
      <label className="dc-control"><span>Input pattern</span>
        <select value={inputName} onChange={e => { setInputName(e.target.value); setPicked(null); }}>
          {Object.keys(INPUTS).map(name => <option key={name}>{name}</option>)}
        </select></label>
      <label className="dc-control"><span>Kernel</span>
        <select value={kernelName} onChange={e => { setKernelName(e.target.value); setPicked(null); }}>
          {Object.keys(KERNELS).map(name => <option key={name}>{name}</option>)}
        </select></label>
      <label className="dc-control"><span>Stride<output>{stride}</output></span>
        <input type="range" min={1} max={3} step={1} value={stride} onChange={e => { setStride(+e.target.value); setPicked(null); }} /></label>
      <label className="dc-control"><span>Padding<output>{padding}</output></span>
        <input type="range" min={0} max={2} step={1} value={padding} onChange={e => { setPadding(+e.target.value); setPicked(null); }} /></label>
    </div>
    <label className="dc-check"><input type="checkbox" checked={relu} onChange={e => setRelu(e.target.checked)} />Apply ReLU to the output</label>

    <div className="dc-matrices">
      <div>
        <p className="dc-eyebrow">INPUT {n}×{n}</p>
        <div className="dc-matrix" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, maxWidth: 320 } as CSSProperties}>
          {input.map((row, r) => row.map((v, c) => cell(v, `${r}-${c}`, lit.has(`${r},${c}`), v / 9)))}
        </div>
      </div>
      <div>
        <p className="dc-eyebrow">KERNEL 3×3{scale !== 1 && " · DIVIDE BY 9"}</p>
        <div className="dc-matrix" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", maxWidth: 170 } as CSSProperties}>
          {kernel.map((row, r) => row.map((v, c) => <span key={`${r}-${c}`}>{v}</span>))}
        </div>
      </div>
      <div>
        <p className="dc-eyebrow">OUTPUT {out}×{out}</p>
        {out > 0 ? <div className="dc-matrix" style={{ gridTemplateColumns: `repeat(${out}, minmax(0, 1fr))`, maxWidth: 320 } as CSSProperties}>
          {feature.map((row, r) => row.map((v, c) => <span key={`${r}-${c}`} role="button" tabIndex={0}
            aria-label={`Output row ${r}, column ${c}: ${round(v)}`}
            aria-pressed={picked?.[0] === r && picked?.[1] === c}
            onClick={() => setPicked([r, c])}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked([r, c]); } }}
            style={{ cursor: "pointer",
                     background: `color-mix(in srgb, var(--dc-teal) ${Math.round(Math.abs(v) / peak * 60)}%, transparent)`,
                     outline: picked && picked[0] === r && picked[1] === c ? "2px solid var(--dc-accent)" : undefined }}>
            {round(v)}</span>))}
        </div> : <p>No window fits. Reduce the stride or add padding.</p>}
      </div>
    </div>

    <dl className="dc-readouts">
      <div><dt>Output size</dt><dd>{out > 0 ? `${out}×${out}` : "—"}</dd></div>
      <div><dt>floor((n + 2p − k) / s) + 1</dt><dd>floor(({n} + {2 * padding} − {k}) / {stride}) + 1</dd></div>
      <div><dt>Weights (1 channel)</dt><dd>{k * k} + 1 bias</dd></div>
      <div><dt>Multiply–accumulates</dt><dd>{(Math.max(0, out) ** 2 * k * k).toLocaleString("en-GB")}</dd></div>
    </dl>

    {picked && out > 0 && <aside className="dc-worked">
      <p className="dc-eyebrow">OUTPUT CELL ({picked[0]}, {picked[1]})</p>
      <h3>{scale !== 1 && "("}{window(picked[0], picked[1]).filter(t => t.w !== 0).map(t => `${t.v}×${t.w}`).join("  +  ") || "0"}{scale !== 1 && ") ÷ 9"}</h3>
      <p>= {round(window(picked[0], picked[1]).reduce((s, t) => s + t.v * t.w, 0) * scale)}
        {relu && <> → ReLU → {round(value(picked[0], picked[1]))}</>}. Cells outside the input contribute the padded value of 0;
        they are an assumption about the boundary, not measured data.</p>
    </aside>}
  </div>;
}

/* ------------------------------------------------------------------
   Week 5 · the residual gradient path
   Reproduces the scalar stack from the lesson: a plain stack of L blocks
   with derivative aᴸ against a residual stack with (1+a)ᴸ.
------------------------------------------------------------------ */

function ResidualLab() {
  const [a, setA] = useState(0.1);
  const [depth, setDepth] = useState(10);

  const plain = (l: number) => Math.pow(a, l);
  const residual = (l: number) => Math.pow(1 + a, l);
  const safeLog = (v: number) => Math.log10(Math.max(Math.abs(v), 1e-30));
  const logMax = Math.max(6, Math.ceil(safeLog(plain(30))), Math.ceil(safeLog(residual(30))));

  const W = 640, H = 260, PAD = 44;
  const x = (l: number) => round(PAD + (l / 30) * (W - PAD - 16));
  const y = (v: number) => round(H - 28 - ((safeLog(v) + 30) / (logMax + 30)) * (H - 56));
  const line = (f: (l: number) => number) =>
    Array.from({ length: 31 }, (_, l) => `${l ? "L" : "M"}${x(l)},${y(f(l))}`).join(" ");

  const fmt = (v: number) => (Math.abs(v) >= 1e-4 && Math.abs(v) < 1e6 ? v.toPrecision(4) : v.toExponential(2));
  const res = residual(depth), pln = plain(depth);
  const verdict = 1 + a === 0
    ? "The branch exactly cancels the shortcut: 1 + a = 0, so the residual path vanishes too. An identity route is not an unconditional guarantee."
    : Math.abs(res) > 1e3
      ? "The residual product is now exploding. Above a per-layer factor of one the shortcut amplifies with depth as readily as it rescues."
      : Math.abs(res) < 1e-6
        ? "The residual derivative also shrinks toward zero here. A shortcut gives an identity route, but the branch can attenuate or nearly cancel it."
      : Math.abs(pln) < 1e-6 && Math.abs(res) > 1e-2
        ? "This is the case the shortcut is for: the plain product has collapsed while the residual one is still a usable size."
        : "Compare the signed readouts with the magnitudes in the plot. Gradient growth or decay depends on the branch scale and depth together.";

  return <div className="dc-lab">
    <p className="dc-eyebrow">INTERACTIVE · GRADIENT THROUGH DEPTH</p>
    <h3>Why the shortcut changes the product</h3>
    <p>Stack <em>L</em> identical blocks whose branch is F(x) = a·x. A plain stack multiplies a at every layer; a residual stack multiplies (1 + a). Both curves below are evaluated directly, on a logarithmic axis.</p>

    <div className="dc-controls">
      <label className="dc-control"><span>Branch scale a<output>{a.toFixed(2)}</output></span>
        <input type="range" min={-1.5} max={1.5} step={0.05} value={a} onChange={e => setA(+e.target.value)} /></label>
      <label className="dc-control"><span>Depth L<output>{depth}</output></span>
        <input type="range" min={1} max={30} step={1} value={depth} onChange={e => setDepth(+e.target.value)} /></label>
    </div>

    <svg className="dc-plot" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`At a equals ${a.toFixed(2)} and depth ${depth}, the plain derivative is ${fmt(plain(depth))} and the residual derivative is ${fmt(residual(depth))}.`}>
      {[-30, -20, -10, 0, logMax].map(p => <g key={p}>
        <line x1={PAD} y1={y(Math.pow(10, p))} x2={W - 16} y2={y(Math.pow(10, p))}
          stroke="currentColor" strokeOpacity=".14" />
        <text x={4} y={y(Math.pow(10, p)) + 4}>1e{p}</text>
      </g>)}
      <path d={line(plain)} fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeDasharray="5 4" />
      <path d={line(residual)} fill="none" stroke="var(--dc-teal)" strokeWidth="2.4" />
      <line x1={x(depth)} y1={20} x2={x(depth)} y2={H - 28} stroke="var(--dc-accent)" strokeOpacity=".5" />
      <circle cx={x(depth)} cy={y(plain(depth))} r="4" fill="var(--color-muted)" />
      <circle cx={x(depth)} cy={y(residual(depth))} r="4.5" fill="var(--dc-teal)" />
      <text x={PAD} y={16}>solid: residual (1+a)ᴸ · dashed: plain aᴸ</text>
    </svg>
    <p className="dc-caption">The vertical axis shows absolute derivative magnitude; values below 10⁻³⁰ are drawn at the floor. Signed values remain visible below.</p>

    <dl className="dc-readouts">
      <div><dt>Plain stack aᴸ</dt><dd>{fmt(plain(depth))}</dd></div>
      <div><dt>Residual (1+a)ᴸ</dt><dd>{fmt(residual(depth))}</dd></div>
      <div><dt>Ratio</dt><dd>{plain(depth) === 0 ? "∞" : fmt(residual(depth) / plain(depth))}</dd></div>
      <div><dt>Per-layer factor</dt><dd>{round(1 + a)}</dd></div>
    </dl>
    <p className="dc-takeaway"><strong>Keep this idea.</strong> {verdict}</p>
  </div>;
}

export default function CourseLab({ kind }: { kind: LabKind }) {
  switch (kind) {
    case "convolution": return <ConvolutionLab />;
    case "residual": return <ResidualLab />;
    case "memory": return <MemoryLab />;
    case "attention": return <AttentionLab />;
    case "contrastive": return <ContrastiveLab />;
    case "vae": return <VAELab />;
    case "gan": return <GANLab />;
    case "diffusion": return <DiffusionLab />;
    case "calibration": return <CalibrationLab />;
    case "bellman": return <BellmanLab />;
  }
}
