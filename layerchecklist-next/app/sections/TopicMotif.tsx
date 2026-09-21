import "./TopicMotif.css";

export type MotifKind =
  | "math" | "physics" | "biology" | "notation"
  | "python" | "libraries" | "sql" | "cuda" | "ros"
  | "ai" | "ml" | "dl" | "lab" | "simulators";

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * A small animated emblem per topic. Pure CSS keyframes — no timers, no state,
 * nothing to hydrate — so fourteen of them on one page cost almost nothing and
 * the server render matches the client exactly.
 */
export default function TopicMotif({ kind }: { kind: MotifKind }) {
  return <span className={`motif motif-${kind}`} aria-hidden="true">
    <svg viewBox="0 0 64 48">{render(kind)}</svg>
  </span>;
}

function render(kind: MotifKind) {
  switch (kind) {
    // Counting: three odometer reels running at different speeds.
    case "math":
      return <>
        <defs><clipPath id="m-reel"><rect x="0" y="14" width="64" height="20" /></clipPath></defs>
        <g clipPath="url(#m-reel)">
          {[10, 27, 44].map((x, r) => <g key={x} className={`m-reel m-reel-${r}`}>
            {digits.concat(0).map((d, i) => <text key={i} x={x} y={29 + i * 20} textAnchor="middle">{d}</text>)}
          </g>)}
        </g>
      </>;

    // A nucleus, an orbiting charge, and a sky behind it.
    case "physics":
      return <>
        {[[8, 10], [54, 14], [46, 40], [14, 38]].map(([x, y], i) => <circle key={i} className={`m-star m-star-${i}`} cx={x} cy={y} r="1.4" />)}
        <ellipse className="m-orbit" cx="32" cy="24" rx="20" ry="9" />
        <ellipse className="m-orbit m-orbit-b" cx="32" cy="24" rx="20" ry="9" transform="rotate(60 32 24)" />
        <circle className="m-core" cx="32" cy="24" r="4.5" />
        <g className="m-electron"><circle cx="52" cy="24" r="2.6" /></g>
      </>;

    // A neuron: dendrites in, a soma, a signal down the axon, a synapse flash.
    case "biology":
      return <>
        {[[6, 12], [5, 24], [7, 35]].map(([x, y], i) => <line key={i} className="m-dendrite" x1={x} y1={y} x2="20" y2="24" />)}
        <line className="m-axon" x1="26" y1="24" x2="56" y2="24" />
        <circle className="m-soma" cx="22" cy="24" r="6" />
        <circle className="m-spike" cx="26" cy="24" r="2.6" />
        <circle className="m-synapse" cx="57" cy="24" r="3.4" />
      </>;

    // Symbols taking turns.
    case "notation":
      return <g className="m-symbols">
        {["Σ", "∇", "θ"].map((s, i) => <text key={s} className={`m-sym m-sym-${i}`} x="32" y="32" textAnchor="middle">{s}</text>)}
      </g>;

    // Lines of code typing themselves in, with a caret.
    case "python":
      return <>
        {[[10, 14, 30], [16, 23, 22], [16, 32, 34]].map(([x, y, w], i) => <rect key={i} className={`m-code m-code-${i}`} x={x} y={y} width={w} height="4" rx="2" />)}
        <rect className="m-caret" x="10" y="38" width="3" height="5" />
      </>;

    // A column sweeping across a table of cells.
    case "libraries":
      return <g className="m-grid">
        {[0, 1, 2, 3].map(c => [0, 1, 2].map(r =>
          <rect key={`${c}-${r}`} className={`m-cell m-col-${c}`} x={8 + c * 13} y={12 + r * 9} width={10} height={6} rx="1.5" />))}
      </g>;

    // Rows being filtered: two of four survive, on a cycle.
    case "sql":
      return <g className="m-rows">
        {[0, 1, 2, 3].map(r => <rect key={r} className={`m-row m-row-${r}`} x="10" y={10 + r * 8} width="44" height="5" rx="2" />)}
      </g>;

    // Every cell at once — the point of the thing.
    case "cuda":
      return <g className="m-cores">
        {[0, 1, 2, 3].map(c => [0, 1, 2, 3].map(r =>
          <rect key={`${c}-${r}`} className="m-core-cell" x={10 + c * 11} y={8 + r * 9} width={8} height={7} rx="1.5" />))}
      </g>;

    // A message hopping between nodes.
    case "ros":
      return <>
        <line className="m-wire" x1="12" y1="30" x2="32" y2="14" />
        <line className="m-wire" x1="32" y1="14" x2="52" y2="30" />
        {[[12, 30], [32, 14], [52, 30]].map(([x, y], i) => <circle key={i} className="m-node" cx={x} cy={y} r="4" />)}
        <circle className="m-packet" cx="12" cy="30" r="2.4" />
      </>;

    // A small network, layer by layer.
    case "ai":
      return <>
        {[[10, 16], [10, 32]].map(([x1, y1], a) => [[32, 12], [32, 24], [32, 36]].map(([x2, y2], b) =>
          <line key={`${a}-${b}`} className="m-synapse-line" x1={x1} y1={y1} x2={x2} y2={y2} />))}
        {[[32, 12], [32, 24], [32, 36]].map(([x1, y1], a) =>
          <line key={a} className="m-synapse-line" x1={x1} y1={y1} x2="54" y2="24" />)}
        {[[10, 16], [10, 32]].map(([x, y], i) => <circle key={i} className="m-unit m-layer-0" cx={x} cy={y} r="3.2" />)}
        {[[32, 12], [32, 24], [32, 36]].map(([x, y], i) => <circle key={i} className="m-unit m-layer-1" cx={x} cy={y} r="3.2" />)}
        <circle className="m-unit m-layer-2" cx="54" cy="24" r="3.2" />
      </>;

    // A loss curve, and a point walking down it.
    case "ml":
      return <>
        <path className="m-curve" d="M 8 12 C 20 12, 22 36, 34 37 C 46 38, 48 34, 56 33" />
        <circle className="m-walker" r="3" />
        <line className="m-floor" x1="8" y1="41" x2="56" y2="41" />
      </>;

    // Activation passing down through the stack.
    case "dl":
      return <g className="m-stack">
        {[0, 1, 2, 3].map(i => <rect key={i} className={`m-layer m-layer-s${i}`} x="12" y={8 + i * 9} width="40" height="6" rx="3" />)}
      </g>;

    // A pendulum, because the lab opens with one.
    case "lab":
      return <>
        <line className="m-pivot-bar" x1="18" y1="9" x2="46" y2="9" />
        <g className="m-swing">
          <line x1="32" y1="9" x2="32" y2="34" />
          <circle cx="32" cy="36" r="5" />
        </g>
      </>;

    // A body dropping onto the floor and bouncing.
    case "simulators":
      return <>
        <line className="m-ground" x1="10" y1="40" x2="54" y2="40" />
        <rect className="m-bouncer" x="26" y="10" width="12" height="12" rx="2.5" />
      </>;
  }
}
