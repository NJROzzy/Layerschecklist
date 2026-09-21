import type { CSSProperties } from "react";
import type { MotifKind } from "./TopicMotif";

type Scene = "geometry" | "wave" | "orbit" | "field" | "dna" | "cell" | "code" | "matrix" | "scatter" | "pipeline" | "network" | "descent" | "layers" | "attention" | "robot" | "pendulum" | "radar" | "world";
const studies: Record<MotifKind, { name: string; hue: number; scenes: [Scene, Scene]; captions: [string, string] }> = {
  math: { name: "Math", hue: 229, scenes: ["geometry", "wave"], captions: ["Patterns in rotation", "A language for change"] },
  physics: { name: "Physics", hue: 28, scenes: ["orbit", "field"], captions: ["Motion across scales", "Fields carry the story"] },
  biology: { name: "Biology", hue: 157, scenes: ["dna", "cell"], captions: ["Information becomes form", "A world inside a boundary"] },
  notation: { name: "Notation", hue: 260, scenes: ["geometry", "code"], captions: ["Give a pattern a symbol", "Read one idea at a time"] },
  python: { name: "Python", hue: 210, scenes: ["code", "pipeline"], captions: ["An idea becomes a program", "Input. Transform. Return."] },
  libraries: { name: "Libraries", hue: 178, scenes: ["matrix", "scatter"], captions: ["Give your data a shape", "Make the pattern visible"] },
  sql: { name: "SQL", hue: 192, scenes: ["matrix", "pipeline"], captions: ["Rows become relationships", "Select what matters"] },
  cuda: { name: "CUDA", hue: 100, scenes: ["matrix", "pipeline"], captions: ["Many threads, working together", "Move data. Do the work."] },
  ros: { name: "ROS", hue: 200, scenes: ["robot", "network"], captions: ["From sensing to movement", "A conversation between nodes"] },
  ai: { name: "AI", hue: 265, scenes: ["network", "pipeline"], captions: ["Connect an input to a decision", "Observe. Reason. Act."] },
  ml: { name: "Machine Learning", hue: 219, scenes: ["descent", "scatter"], captions: ["Follow the learning signal", "Find structure in observations"] },
  dl: { name: "Deep Learning", hue: 306, scenes: ["layers", "attention"], captions: ["Representations, layer by layer", "Learn what to attend to"] },
  lab: { name: "Simulation", hue: 33, scenes: ["pendulum", "radar"], captions: ["Let an equation move", "Sense a world in motion"] },
  simulators: { name: "Environments", hue: 174, scenes: ["world", "robot"], captions: ["Build a world to experiment in", "Connect a model to movement"] },
};

const delay = (i: number) => ({ "--scene-delay": `${-i * .37}s` } as CSSProperties);
const f = (value: number) => Number(value.toFixed(2));
const wave = (shift = 0) => Array.from({ length: 85 }, (_, i) => `${i ? "L" : "M"}${f(18 + i * 2.4)} ${f(150 + Math.sin(i / 10 + shift) * 38)}`).join(" ");
const nodes = [[30, 92], [30, 152], [30, 212], [104, 62], [104, 122], [104, 182], [104, 242], [200, 112], [200, 192]];

/** Decorative SVG studies; motion is scoped to the homepage and needs no animation loop. */
export default function TopicScene({ topic, side }: { topic: MotifKind; side: "left" | "right" }) {
  const study = studies[topic], index = side === "left" ? 0 : 1;
  return <div className={`topic-scene scene-${study.scenes[index]}`} style={{ "--scene-hue": study.hue } as CSSProperties} aria-hidden="true" data-scene-topic={topic}>
    <div className="scene-halo" />
    <div className="scene-label"><span className="scene-indicator" />{study.name}<span>{side === "left" ? "01" : "02"}</span></div>
    <svg viewBox="0 0 240 300" fill="none" focusable="false">
      <g className="scene-registration"><path d="M10 24 V10 H24 M216 10 H230 V24 M10 276 V290 H24 M216 290 H230 V276" /><path d="M116 15 H124 M120 11 V19 M116 285 H124 M120 281 V289" /></g>
      <SceneDrawing scene={study.scenes[index]} topic={topic} />
    </svg>
    <p className="scene-caption">{study.captions[index]}</p>
  </div>;
}

function SceneDrawing({ scene, topic }: { scene: Scene; topic: MotifKind }) {
  switch (scene) {
    case "geometry": return <>
      <path className="scene-faint" d="M20 150 H220 M120 50 V250" />
      {[48, 76, 98].map(r => <circle key={r} className="scene-faint" cx="120" cy="150" r={r} />)}
      <g className="scene-turn">
        <rect className="scene-stroke" x="66" y="96" width="108" height="108" />
        <rect className="scene-stroke scene-secondary" x="66" y="96" width="108" height="108" transform="rotate(45 120 150)" />
        <path className="scene-stroke" d="M120 74 L186 188 H54 Z" />
        <circle className="scene-fill" cx="120" cy="74" r="4" />
      </g>
      <circle className="scene-fill" cx="120" cy="150" r="4" />
      <text className="scene-equation" x="120" y="272" textAnchor="middle">{topic === "notation" ? "Σ · ∇ · θ · ∫" : "sin² θ + cos² θ = 1"}</text>
    </>;
    case "wave": return <>
      {Array.from({ length: 7 }, (_, i) => <path key={i} className="scene-faint" d={`M20 ${60 + i * 30} H220`} />)}
      <path className="scene-stroke scene-secondary" d={wave(Math.PI)} />
      <path className="scene-stroke scene-draw" pathLength="100" d={wave()} />
      <path className="scene-stroke scene-wave-drift" d={wave(.7)} />
      <circle className="scene-fill scene-wave-point" cx="120" cy="150" r="5" />
      <text className="scene-equation" x="120" y="272" textAnchor="middle">y = sin(x + t)</text>
    </>;
    case "orbit": return <>
      {[52, 80, 103].map(r => <circle key={r} className="scene-faint" cx="120" cy="150" r={r} />)}
      <ellipse className="scene-stroke scene-secondary" cx="120" cy="150" rx="103" ry="36" transform="rotate(-28 120 150)" />
      {[52, 80, 103].map((r, i) => <g key={r} className={`scene-orbiter scene-orbiter-${i}`}><circle className="scene-fill" cx={120 + r} cy="150" r={i === 1 ? 6 : 3.5} /><path className="scene-stroke" opacity=".55" d={`M${120 + r} 150 A${r} ${r} 0 0 0 ${120 + r * .866} ${150 - r * .5}`} /></g>)}
      <circle className="scene-fill scene-sun" cx="120" cy="150" r="11" />
      <circle className="scene-faint" cx="120" cy="150" r="19" />
      <text className="scene-equation" x="120" y="282" textAnchor="middle">F = Gm₁m₂ / r²</text>
    </>;
    case "field": return <>
      {[-3, -2, -1, 0, 1, 2, 3].map((i, n) => <path key={i} className="scene-stroke scene-field-line" style={delay(n)} d={`M45 150 C80 ${150 + i * 59} 160 ${150 + i * 59} 195 150`} />)}
      <circle className="scene-fill" cx="45" cy="150" r="13" /><circle className="scene-fill scene-secondary" cx="195" cy="150" r="13" />
      <text className="scene-charge" x="45" y="155" textAnchor="middle">+</text><text className="scene-charge" x="195" y="155" textAnchor="middle">−</text>
      <text className="scene-equation" x="120" y="270" textAnchor="middle">a field at every point</text>
    </>;
    case "dna": return <>
      {Array.from({ length: 17 }, (_, i) => {
        const x = Math.sin(i * .53) * 60, y = 44 + i * 13;
        return <g key={i} className="scene-dna-rung" style={delay(i)}><line className="scene-stroke" x1={f(120 - x)} y1={y} x2={f(120 + x)} y2={y} /><circle className="scene-fill" cx={f(120 - x)} cy={y} r="4" /><circle className="scene-fill scene-secondary" cx={f(120 + x)} cy={y} r="4" /></g>;
      })}
      <text className="scene-equation" x="120" y="282" textAnchor="middle">A · T · C · G</text>
    </>;
    case "cell": return <>
      <path className="scene-stroke scene-cell-wall" d="M209 148 C218 210 177 253 115 245 C42 257 19 195 31 142 C17 79 65 49 123 55 C183 44 216 84 209 148Z" />
      <path className="scene-faint" d="M201 148 C210 207 174 244 116 237 C50 247 28 194 39 143 C24 87 68 57 122 63 C178 51 208 88 201 148Z" />
      <circle className="scene-fill scene-nucleus" cx="118" cy="146" r="32" /><circle className="scene-stroke" cx="118" cy="146" r="39" />
      {[[68, 105], [173, 167], [80, 207]].map(([x, y], i) => <g key={i} className="scene-drift" style={delay(i * 4)}><ellipse className="scene-stroke" cx={x} cy={y} rx="17" ry="9" transform={`rotate(-25 ${x} ${y})`} /><path className="scene-faint" d={`M${x - 9} ${y} l5 -4 l5 8 l5 -4`} /></g>)}
      {[[63, 153], [159, 101], [153, 211], [95, 83], [185, 129]].map(([x, y], i) => <circle key={i} className="scene-fill scene-drift" style={delay(i)} cx={x} cy={y} r="2.5" />)}
    </>;
    case "code": return <>
      <rect className="scene-faint" x="22" y="52" width="196" height="186" rx="10" />
      {[0, 1, 2].map(i => <circle key={i} className="scene-fill scene-secondary" cx={37 + i * 12} cy="69" r="2" />)}
      <path className="scene-faint" d="M22 83 H218" />
      {(topic === "notation" ? ["θ : parameters", "∇ : gradient", "Σ : add terms", "∂ : a change", "argmin : where?"] : ["def explore(x):", "  observe(x)", "  y = model(x)", "  compare(y)", "  return y"]).map((line, i) => <g key={line} className="scene-code-line" style={delay(i)}><text className="scene-code-number" x="33" y={111 + i * 24}>{i + 1}</text><text className="scene-code-text" x="52" y={111 + i * 24}>{line}</text></g>)}
      <path className="scene-stroke scene-caret" d="M52 229 H64" />
    </>;
    case "matrix": return <>
      <path className="scene-stroke" d="M35 57 H22 V239 H35 M205 57 H218 V239 H205" />
      {Array.from({ length: 36 }, (_, i) => <rect key={i} className={`scene-matrix-cell${topic === "cuda" ? " is-parallel" : ""}`} style={delay(Math.floor(i / 6) + i % 6)} x={38 + i % 6 * 28} y={68 + Math.floor(i / 6) * 28} width="23" height="22" rx="3" />)}
      <text className="scene-equation" x="120" y="270" textAnchor="middle">{topic === "cuda" ? "threads → blocks → grid" : topic === "sql" ? "SELECT · JOIN · GROUP BY" : "shape = (6, 6)"}</text>
    </>;
    case "pipeline": return <>
      {[72, 150, 228].map((y, i) => <g key={y}><rect className="scene-stroke scene-pipeline-box" style={delay(i * 2)} x="53" y={y - 21} width="134" height="42" rx="8" /><text className="scene-equation" x="120" y={y + 5} textAnchor="middle">{(topic === "sql" ? ["TABLES", "QUERY", "RESULT"] : topic === "ai" ? ["OBSERVE", "REASON", "ACT"] : topic === "cuda" ? ["LOAD", "COMPUTE", "STORE"] : ["INPUT", "TRANSFORM", "RETURN"])[i]}</text></g>)}
      <path className="scene-faint" d="M120 93 V129 M120 171 V207" />
      <circle className="scene-fill scene-pipeline-dot" cx="120" cy="95" r="4" />
      <circle className="scene-fill scene-pipeline-dot" cx="120" cy="173" r="4" />
    </>;
    case "network": return <>
      {nodes.slice(0, 3).flatMap(([x, y], i) => nodes.slice(3, 7).map(([a, b], j) => <line className="scene-faint" key={`${i}-${j}`} x1={x} y1={y} x2={a} y2={b} />))}
      {nodes.slice(3, 7).flatMap(([x, y], i) => nodes.slice(7).map(([a, b], j) => <line className="scene-stroke scene-signal" style={delay(i + j)} key={`${i}-${j}`} x1={x} y1={y} x2={a} y2={b} />))}
      {nodes.map(([x, y], i) => <g key={i}><circle className="scene-fill scene-node" style={delay(i)} cx={x} cy={y} r="6" /><circle className="scene-faint" cx={x} cy={y} r="12" /></g>)}
    </>;
    case "descent": return <>
      {[0, 1, 2, 3, 4].map(i => <ellipse className="scene-faint" key={i} cx="139" cy="173" rx={24 + i * 19} ry={17 + i * 21} transform="rotate(-28 139 173)" />)}
      <path className="scene-stroke scene-descent-path" d="M36 75 L81 98 L68 130 L113 145 L109 169 L139 173" />
      {[[36, 75], [81, 98], [68, 130], [113, 145], [109, 169], [139, 173]].map(([x, y], i) => <circle className="scene-fill scene-node" style={delay(i)} key={i} cx={x} cy={y} r="3" />)}
      <circle className="scene-fill scene-learner" r="5" />
      <text className="scene-equation" x="120" y="277" textAnchor="middle">θ ← θ − η ∇L</text>
    </>;
    case "scatter": return <>
      <path className="scene-faint" d="M28 53 V247 H218 M28 185 H218 M28 120 H218" />
      {Array.from({ length: 23 }, (_, i) => <circle className="scene-fill scene-observation" style={delay(i)} key={i} cx={38 + i * 7.4} cy={f(218 - i * 5.7 + Math.sin(i * 2.6) * 24)} r="3.5" />)}
      <path className="scene-stroke scene-draw" pathLength="100" d="M30 229 L219 77" />
      <text className="scene-equation" x="120" y="277" textAnchor="middle">observations → a model</text>
    </>;
    case "layers": return <>
      {[0, 1, 2, 3, 4].map(i => <g key={i} className="scene-depth-layer" style={delay(i * 2)}><path className="scene-layer-plane" d={`M26 ${82 + i * 35} L119 ${48 + i * 35} L214 ${82 + i * 35} L120 ${116 + i * 35} Z`} /><path className="scene-faint" d={`M57 ${82 + i * 35} L150 ${48 + i * 35} M89 ${94 + i * 35} L181 ${60 + i * 35}`} /></g>)}
    </>;
    case "attention": return <>
      {Array.from({ length: 49 }, (_, i) => <rect key={i} className="scene-attention-cell" style={{ ...delay(i % 7), "--cell-opacity": f(.15 + ((i * 13) % 17) / 20) } as CSSProperties} x={28 + i % 7 * 27} y={57 + Math.floor(i / 7) * 27} width="23" height="23" rx="3" />)}
      <text className="scene-equation" x="120" y="276" textAnchor="middle">query · key · value</text>
    </>;
    case "robot": return <>
      <path className="scene-faint" d="M19 247 H222 M29 259 H211" />
      <rect className="scene-stroke" x="92" y="229" width="55" height="18" rx="4" />
      <g className="scene-arm"><path className="scene-robot-link" d="M120 229 L76 148" /><circle className="scene-fill" cx="120" cy="229" r="8" /><g className="scene-forearm"><path className="scene-robot-link" d="M76 148 L155 99" /><circle className="scene-fill" cx="76" cy="148" r="7" /><path className="scene-stroke" d="M153 101 L169 95 L178 101 M153 101 L161 84 L172 81" /></g></g>
      <rect className="scene-faint" x="179" y="215" width="27" height="30" rx="3" />
    </>;
    case "pendulum": return <>
      <path className="scene-faint" d="M35 69 H205 M120 69 V263 M27 210 Q120 285 213 210" />
      <g className="scene-pendulum"><path className="scene-stroke" d="M120 69 V232" /><circle className="scene-fill" cx="120" cy="232" r="15" /><circle className="scene-faint" cx="120" cy="232" r="23" /></g>
      <circle className="scene-fill" cx="120" cy="69" r="5" />
    </>;
    case "radar": return <>
      {[28, 56, 84, 108].map(r => <circle key={r} className="scene-faint" cx="120" cy="150" r={r} />)}
      <path className="scene-faint" d="M12 150 H228 M120 42 V258" />
      <g className="scene-turn"><path className="scene-radar-fan" d="M120 150 L120 42 A108 108 0 0 1 196 74 Z" /><path className="scene-stroke" d="M120 150 V42" /></g>
      {[[85, 104], [178, 168], [80, 207], [155, 75]].map(([x, y], i) => <circle key={i} className="scene-fill scene-node" style={delay(i * 3)} cx={x} cy={y} r="4" />)}
      <circle className="scene-fill" cx="120" cy="150" r="4" />
    </>;
    case "world": return <>
      {Array.from({ length: 7 }, (_, i) => <g key={i} className="scene-faint"><path d={`M${24 + i * 29} ${100 + i * 12} L${24 + i * 29} ${209 + i * 8}`} /><path d={`M24 ${100 + i * 18} L198 ${172 + i * 12}`} /></g>)}
      <g className="scene-world-cube"><path className="scene-layer-plane" d="M76 103 L120 78 L164 103 L120 129 Z" /><path className="scene-stroke" d="M76 103 V154 L120 180 L164 154 V103 M120 129 V180" /></g>
      <ellipse className="scene-faint" cx="120" cy="215" rx="45" ry="17" />
    </>;
  }
}
