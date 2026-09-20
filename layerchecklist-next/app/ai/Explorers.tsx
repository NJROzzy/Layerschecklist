"use client";

import { useState } from "react";
import type { AITool, ToolCategory } from "./content";

/**
 * A CSS width for a bar. Browsers re-serialise style values at their own precision
 * (and Node and the browser disagree in the last digit of a float anyway), so a
 * raw 16-digit number renders one way on the server and another after hydration.
 * Two decimals is exact in every engine and well under one pixel.
 */
const percent = (value: number) => value.toFixed(2) + "%";

const layers = [
  { label: "AI", name: "Artificial intelligence", description: "The broad field of building systems that perceive, reason, plan, learn, or act toward objectives.", example: "Example: a route planner searches possible paths using a map and a cost function. Its search can work without a learned model." },
  { label: "ML", name: "Machine learning", description: "An approach to AI that fits behavior from data or experience, using an objective and a learning procedure.", example: "Example: a classifier learns patterns from labeled support tickets instead of receiving an exhaustive list of hand-written rules." },
  { label: "DL", name: "Deep learning", description: "A family of ML methods that uses multilayer neural networks to learn transformations and representations.", example: "Example: a vision network learns features useful for recognizing objects in images. Deep learning can classify, predict, or generate." },
  { label: "GenAI", name: "Generative AI", description: "AI designed to produce content such as text, images, audio, or code. This describes a capability, rather than every method in the field.", example: "Example: a language model generates a draft response. Many modern generative models use deep learning; an image generator need not be a language model." },
];

export function AIMap() {
  const [selected, setSelected] = useState(0);
  return <div className="ai-lab" aria-labelledby="ai-map-title">
    <span className="ai-eyebrow">EXPLORE THE RELATIONSHIP</span><h3 id="ai-map-title">One field. Several ways to build.</h3>
    <div className="ai-choice-row" role="group" aria-label="AI concepts">{layers.map((layer, index) => <button type="button" key={layer.label} aria-pressed={index === selected} onClick={() => setSelected(index)}>{layer.label}</button>)}</div>
    <div className="ai-map-layout"><div className="ai-nested-map" aria-label="Machine learning is within AI, and deep learning is within machine learning.">
      <div className={selected === 0 ? "ai-map-box selected" : "ai-map-box"}><strong>Artificial intelligence</strong><span>Search · logic · planning · learning</span>
        <div className={selected === 1 ? "ai-map-box selected" : "ai-map-box"}><strong>Machine learning</strong><span>Learn from examples or experience</span>
          <div className={selected === 2 || selected === 3 ? "ai-map-box selected" : "ai-map-box"}><strong>Deep learning</strong><span>Multilayer neural networks</span></div>
        </div>
      </div><p className="ai-small">Generative AI overlaps this map as a capability. Modern generators commonly use deep learning.</p>
    </div><div className="ai-map-description" aria-live="polite" aria-atomic="true"><span className="ai-eyebrow">{layers[selected].label}</span><h4>{layers[selected].name}</h4><p>{layers[selected].description}</p><p>{layers[selected].example}</p></div></div>
  </div>;
}

export function RuleLearningLab() {
  const [hours, setHours] = useState(5);
  const [changed, setChanged] = useState(false);
  const training = [1, 2, 3, 4, 6, 8].map(value => ({ hours: value, priority: value >= (changed ? 6 : 4) }));
  const candidates = [0, 1.5, 2.5, 3.5, 5, 7, 10];
  const errors = (threshold: number) => training.filter(row => (row.hours >= threshold) !== row.priority).length;
  const learned = candidates.reduce((best, candidate) => errors(candidate) < errors(best) ? candidate : best, candidates[0]);
  return <div className="ai-lab" aria-labelledby="ai-rule-title"><span className="ai-eyebrow">YOUR FIRST LEARNING MACHINE</span><h3 id="ai-rule-title">Write a rule, or learn one from examples.</h3>
    <p>A toy support desk assigns priority using only waiting time. The hand-written rule uses 8 hours. The learned classifier tries seven candidate thresholds and keeps the one with the fewest training errors.</p>
    <button type="button" className="ai-secondary" aria-pressed={changed} onClick={() => setChanged(value => !value)}>{changed ? "Restore the 4-hour label" : "Change the 4-hour label to normal"}</button>
    <div className="ai-training-examples" aria-label="Six labeled training examples">{training.map(row => <div key={row.hours}><strong>{row.hours} h</strong><span>{row.priority ? "Priority" : "Normal"}</span></div>)}</div>
    <label className="ai-slider" htmlFor="ai-waiting"><span>New ticket’s waiting time<output htmlFor="ai-waiting">{hours} hours</output></span><input id="ai-waiting" type="range" min="0" max="10" step=".5" value={hours} onChange={event => setHours(Number(event.target.value))} /></label>
    <div className="ai-comparison" aria-live="polite" aria-atomic="true"><article><span className="ai-eyebrow">HUMAN-AUTHORED RULE</span><h4>Waiting time ≥ 8 h</h4><strong className="ai-result">{hours >= 8 ? "Priority" : "Normal"}</strong><p>{errors(8)} / 6 training examples disagree with this rule.</p></article><article><span className="ai-eyebrow">FITTED FROM EXAMPLES</span><h4>Waiting time ≥ {learned} h</h4><strong className="ai-result">{hours >= learned ? "Priority" : "Normal"}</strong><p>{errors(learned)} / 6 training errors. Changing a label refits the threshold; moving the new input only runs inference.</p></article></div>
    <p className="ai-small">This is a real, tiny threshold search in your browser. The examples are invented. Zero training errors say nothing yet about unseen tickets; real priority may depend on information this toy model omits.</p>
  </div>;
}

export function TokenLab() {
  const [temperature, setTemperature] = useState(1);
  const logits = [3, 2, 0];
  const weights = logits.map(value => Math.exp((value - 3) / temperature));
  const total = weights.reduce((sum, value) => sum + value, 0);
  return <div className="ai-lab" aria-labelledby="ai-token-title"><span className="ai-eyebrow">INSPECT ONE GENERATION STEP</span><h3 id="ai-token-title">A distribution of possible continuations.</h3>
    <p>Context: <strong>“The sky is …”</strong> Imagine three candidate tokens with fixed scores. Change temperature to see how their relative probabilities change.</p>
    <label className="ai-slider" htmlFor="ai-temperature"><span>Sampling temperature<output htmlFor="ai-temperature">{temperature.toFixed(1)}</output></span><input id="ai-temperature" type="range" min=".2" max="2" step=".1" value={temperature} onChange={event => setTemperature(Number(event.target.value))} /></label>
    <div className="ai-token-bars" aria-live="polite" aria-atomic="true">{["blue", "clear", "green"].map((token, i) => <div className="ai-token-row" key={token}><strong>{token}</strong><div><span style={{ width: percent(weights[i] / total * 100) }} /></div><output>{(weights[i] / total * 100).toFixed(1)}%</output></div>)}</div>
    <div className="ai-formula">P(token i) = exp(scoreᵢ / T) / Σⱼ exp(scoreⱼ / T)</div>
    <p className="ai-small">These scores and single-word candidates are illustrative, not output from a trained LLM. Lower temperature concentrates the distribution; it does not verify facts. Real vocabularies include subwords, and sampling settings depend on the model.</p>
  </div>;
}

export function ToolExplorer({ tools, categories }: { tools: AITool[]; categories: ToolCategory[] }) {
  const [category, setCategory] = useState<ToolCategory | "All">("All");
  const [query, setQuery] = useState("");
  const visible = tools.filter(tool => (category === "All" || tool.category === category) && [tool.name, tool.category, tool.kind, tool.use].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="ai-tool-explorer">
    <div className="ai-choice-row" role="group" aria-label="Filter AI tools by purpose">{(["All", ...categories] as const).map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
    <label className="ai-search" htmlFor="ai-tool-search">Find a tool or capability<input id="ai-tool-search" type="search" placeholder="Try coding, local, image, or Python" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p className="ai-small" role="status">{visible.length} of {tools.length} tools shown</p>
    <div className="ai-tool-grid">{visible.map(tool => <article className="ai-tool-card" key={tool.name}><span className="ai-eyebrow">{tool.category}</span><h3><a href={tool.href}>{tool.name}<span aria-hidden="true"> ↗</span></a></h3><p className="ai-tool-kind">{tool.kind}</p><p>{tool.use}</p><p className="ai-tool-check"><strong>When comparing:</strong> {tool.check}</p><a className="ai-source" href={tool.href}>Official product / documentation ↗</a></article>)}</div>
    {visible.length === 0 && <div className="ai-empty"><p>No tools match these filters.</p><button type="button" onClick={() => { setCategory("All"); setQuery(""); }}>Show all tools</button></div>}
  </div>;
}


/* ------------------------------------------------------------------
   Chapter 04 — separating development data from evaluation data.
------------------------------------------------------------------ */

type SplitStrategy = "random" | "time" | "group";

// 24 support tickets in arrival order. Several customers appear more than once,
// which is what makes the split strategy matter.
const splitRows = [1, 3, 7, 2, 4, 1, 5, 8, 3, 6, 2, 7, 4, 1, 8, 5, 6, 3, 2, 7, 4, 8, 6, 5]
  .map((customer, index) => ({ arrival: index + 1, customer }));

// A fixed permutation stands in for one draw of a random shuffle, so the demo is
// reproducible and every reader sees the same split.
const shuffled = [17, 4, 22, 9, 1, 14, 6, 20, 11, 2, 18, 7, 23, 12, 0, 15, 3, 19, 10, 21, 5, 13, 8, 16];

function splitTestRows(strategy: SplitStrategy, size: number): Set<number> {
  if (strategy === "time") {
    // The most recent arrivals are held out.
    return new Set(splitRows.slice(splitRows.length - size).map(row => row.arrival));
  }
  if (strategy === "group") {
    // Whole customers move to the test side until it is large enough.
    const order = [...new Set(splitRows.map(row => row.customer))];
    const chosen = new Set<number>();
    let held = 0;
    for (const customer of order) {
      if (held >= size) break;
      chosen.add(customer);
      held += splitRows.filter(row => row.customer === customer).length;
    }
    return new Set(splitRows.filter(row => chosen.has(row.customer)).map(row => row.arrival));
  }
  return new Set(shuffled.slice(0, size).map(index => splitRows[index].arrival));
}

const splitNotes: Record<SplitStrategy, string> = {
  random: "Every row is equally likely to be held out. This is the usual default, and it is the one that quietly breaks when rows share a customer or arrive in a meaningful order.",
  time: "Everything before a cut-off trains; everything after it is scored. This matches how the system will actually be used: predicting rows that did not exist at training time.",
  group: "A customer lands entirely on one side. The model is then scored on customers it has never seen, which is the right question when new customers keep arriving.",
};

export function SplitLab() {
  const [strategy, setStrategy] = useState<SplitStrategy>("random");
  const [size, setSize] = useState(6);

  const test = splitTestRows(strategy, size);
  const train = splitRows.filter(row => !test.has(row.arrival));
  const testRows = splitRows.filter(row => test.has(row.arrival));

  const testCustomers = new Set(testRows.map(row => row.customer));
  const sharedCustomers = [...new Set(train.filter(row => testCustomers.has(row.customer)).map(row => row.customer))].sort((a, b) => a - b);
  const earliestTest = Math.min(...testRows.map(row => row.arrival));
  const futureTrainRows = train.filter(row => row.arrival > earliestTest).length;

  return <div className="ai-lab" aria-labelledby="ai-split-title">
    <span className="ai-eyebrow">STEP 03, IN PRACTICE</span><h3 id="ai-split-title">Who gets held out decides what you learn.</h3>
    <p>Twenty-four support tickets arrive in order. Eight customers appear across them, several more than once. Choose how to reserve evaluation rows and watch two specific problems appear and disappear.</p>
    <div className="ai-choice-row" role="group" aria-label="Split strategy">{([["random", "Random rows"], ["time", "By arrival time"], ["group", "By customer"]] as [SplitStrategy, string][]).map(([value, label]) => <button type="button" key={value} aria-pressed={strategy === value} onClick={() => setStrategy(value)}>{label}</button>)}</div>
    <label className="ai-slider" htmlFor="ai-split-size"><span>Rows held out for evaluation<output htmlFor="ai-split-size">{testRows.length} of {splitRows.length}</output></span><input id="ai-split-size" type="range" min="4" max="10" step="1" value={size} onChange={event => setSize(Number(event.target.value))} /></label>
    <ol className="ai-split-strip" aria-label={`Arrival order, with ${testRows.length} rows held out for evaluation`}>{splitRows.map(row => <li key={row.arrival} className={test.has(row.arrival) ? "is-test" : "is-train"}><strong>{row.arrival}</strong><span>C{row.customer}</span></li>)}</ol>
    <p className="ai-small"><span className="ai-swatch is-train" aria-hidden="true" /> Fits the model · <span className="ai-swatch is-test" aria-hidden="true" /> Held out · <strong>C#</strong> is the customer on that ticket.</p>
    <div className="ai-metric-row" aria-live="polite" aria-atomic="true">
      <div><span>Rows used to fit</span><strong>{train.length}</strong></div>
      <div className={sharedCustomers.length ? "is-warning" : ""}><span>Customers on both sides</span><strong>{sharedCustomers.length ? sharedCustomers.map(c => "C" + c).join(" ") : "None"}</strong></div>
      <div className={futureTrainRows ? "is-warning" : ""}><span>Training rows from after the first held-out ticket</span><strong>{futureTrainRows}</strong></div>
    </div>
    <p>{splitNotes[strategy]}</p>
    <p className="ai-small">Both counts above are leakage you can measure before you look at any score. A customer on both sides lets the model recognise a customer rather than the problem. Training on rows that arrived after the evaluation period lets it use information the real system would not have had. Either one inflates the result without changing a single line of the model.</p>
    <details className="ai-lab-check"><summary>Think it through: is a random split simply wrong?</summary><p>No. It is the right default when rows are independent and order carries no meaning — separate patients in a one-off study, say. It goes wrong exactly when a hidden connection survives the shuffle. Ask what a row shares with other rows, and what the system will know at the moment it has to predict. Answer those two questions and the split usually chooses itself.</p></details>
  </div>;
}

/* ------------------------------------------------------------------
   Chapter 05 — how text becomes the units a model actually reads.
------------------------------------------------------------------ */

// A hand-made vocabulary: some whole words, some common word parts, and every
// single character, so no input can ever fall outside it.
const tokenVocabulary = [
  "artificial", "intellig", "transform", "attention", "generat", "embedding", "network", "machine",
  "predict", "represent", "unfamiliar", "vocabulary", "language", "sentence", "example", "pattern",
  "token", "model", "learn", "train", "split", "score", "layer", "check", "list", "vector", "image",
  "word", "text", "data", "piece", "deep", "step", "open", "run", "play", "fast", "the", "and", "to",
  "of", "in", "it", "is", "sky", "blue", "into", "from", "hand", "byte", "char", "act", "er",
  "ize", "izer", "ization", "ation", "ing", "ed", "es", "s", "ly", "ness", "ful", "less", "able",
  "ive", "ence", "ial", "ism", "ist", "or", "al", "ic", "un", "re", "pre", "post", "hyper", "sub",
  ..."abcdefghijklmnopqrstuvwxyz0123456789".split(""),
].sort((a, b) => b.length - a.length);

type Piece = { text: string; continues: boolean; single: boolean };

/** Greedy longest-match from the left — how WordPiece assigns pieces at inference time. */
function tokenize(text: string): Piece[] {
  const pieces: Piece[] = [];
  for (const chunk of text.toLowerCase().match(/[a-z0-9]+|[^\sa-z0-9]/g) ?? []) {
    if (!/^[a-z0-9]+$/.test(chunk)) { pieces.push({ text: chunk, continues: false, single: false }); continue; }
    let rest = chunk;
    let first = true;
    while (rest) {
      const taken = tokenVocabulary.find(entry => rest.startsWith(entry)) ?? rest[0];
      pieces.push({ text: taken, continues: !first, single: taken.length === 1 });
      rest = rest.slice(taken.length);
      first = false;
    }
  }
  return pieces;
}

const tokenizerSamples = [
  "Tokenizers split unfamiliar words into pieces.",
  "Artificial intelligence and machine learning",
  "hyperparameter tuning",
];

export function TokenizerLab() {
  const [text, setText] = useState(tokenizerSamples[0]);
  const pieces = tokenize(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return <div className="ai-lab" aria-labelledby="ai-tokenizer-title">
    <span className="ai-eyebrow">BEFORE THE MODEL SEES ANYTHING</span><h3 id="ai-tokenizer-title">Your sentence is not what the model reads.</h3>
    <p>A tokenizer cuts text into the units a model has representations for. Type anything and watch where the cuts land. A <code>##</code> marks a piece that continues the word before it.</p>
    <label className="ai-search" htmlFor="ai-tokenizer-text">Text to tokenize<input id="ai-tokenizer-text" type="text" value={text} maxLength={120} onChange={event => setText(event.target.value)} placeholder="Type a sentence" /></label>
    <div className="ai-choice-row" role="group" aria-label="Example sentences">{tokenizerSamples.map(sample => <button type="button" key={sample} aria-pressed={text === sample} onClick={() => setText(sample)}>{sample.length > 26 ? sample.slice(0, 24) + "…" : sample}</button>)}</div>
    <div className="ai-token-chips" aria-live="polite" aria-atomic="true">{pieces.length ? pieces.map((piece, i) => <span key={i} className={"ai-chip" + (piece.continues ? " is-continuation" : "") + (piece.single ? " is-single" : "")}>{piece.continues && <em aria-label="continues the previous piece">##</em>}{piece.text}</span>) : <span className="ai-small">Type something to see its pieces.</span>}</div>
    <div className="ai-metric-row">
      <div><span>Characters</span><strong>{text.length}</strong></div>
      <div><span>Words</span><strong>{words}</strong></div>
      <div><span>Tokens</span><strong>{pieces.length}</strong></div>
      <div><span>Tokens per word</span><strong>{words ? (pieces.length / words).toFixed(2) : "—"}</strong></div>
    </div>
    <p className="ai-small">This vocabulary has {tokenVocabulary.length} hand-picked entries. A real one is <em>learned</em> from a corpus — BPE, WordPiece, or Unigram — and runs to tens of thousands of entries covering every byte, so nothing is ever unreadable. What carries over is the cost: a common word is one token, a rare or misspelt one shatters into several. Context limits, pricing, and the meaning of “a 1,000-token document” are all counted in these units, not in words.</p>
    <details className="ai-lab-check"><summary>Think it through: why does this make character-level questions hard?</summary><p>Ask a model how many letter R’s are in a word and it is not looking at letters — it is looking at a handful of pieces it has representations for. The spelling has to be reconstructed from those pieces rather than read off. It is a good reminder that a model’s inputs are not the same objects you see on screen, and that a failure can come from the representation rather than from reasoning.</p></details>
  </div>;
}

/* ------------------------------------------------------------------
   Chapter 05 — comparing meaning as geometry.
------------------------------------------------------------------ */

// Placed by hand on a plane so that the geometry is visible. Direction carries the
// topic; length varies deliberately so that the two measures below disagree.
const embeddingWords: { word: string; vector: [number, number] }[] = [
  { word: "cat", vector: [0.92, 0.30] },
  { word: "kitten", vector: [0.55, 0.20] },
  { word: "dog", vector: [0.86, 0.46] },
  { word: "puppy", vector: [0.48, 0.28] },
  { word: "king", vector: [0.12, 0.95] },
  { word: "queen", vector: [-0.02, 0.88] },
  { word: "throne", vector: [0.25, 0.70] },
  { word: "server", vector: [-0.90, 0.22] },
  { word: "laptop", vector: [-0.84, 0.05] },
  { word: "keyboard", vector: [-0.62, -0.12] },
  { word: "bread", vector: [-0.18, -0.90] },
  { word: "butter", vector: [-0.32, -0.84] },
  { word: "soup", vector: [0.10, -0.95] },
];

const dot = (a: [number, number], b: [number, number]) => a[0] * b[0] + a[1] * b[1];
const norm = (a: [number, number]) => Math.hypot(a[0], a[1]);
const cosine = (a: [number, number], b: [number, number]) => dot(a, b) / (norm(a) * norm(b));
const distance = (a: [number, number], b: [number, number]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function EmbeddingLab() {
  const [query, setQuery] = useState("cat");
  const [measure, setMeasure] = useState<"cosine" | "distance">("cosine");

  const anchor = embeddingWords.find(item => item.word === query) ?? embeddingWords[0];
  const scored = embeddingWords
    .filter(item => item.word !== anchor.word)
    .map(item => ({ ...item, cosine: cosine(anchor.vector, item.vector), distance: distance(anchor.vector, item.vector) }))
    .sort((a, b) => measure === "cosine" ? b.cosine - a.cosine : a.distance - b.distance);
  const nearest = scored.slice(0, 5);
  const furthest = scored[scored.length - 1];
  const maxDistance = Math.max(...scored.map(item => item.distance));

  // The plane spans -1.1 to 1.1 in both directions, drawn into a 340-pixel box.
  const px = (value: number) => 175 + value * 150;
  const py = (value: number) => 175 - value * 150;

  return <div className="ai-lab" aria-labelledby="ai-embedding-title">
    <span className="ai-eyebrow">WHY ANYTHING CAN BE RETRIEVED</span><h3 id="ai-embedding-title">Meaning as a direction you can measure.</h3>
    <p>Once a piece of text is a vector, “related” becomes arithmetic. Pick a word, then compare the two measures that answer “related” differently.</p>
    <div className="ai-lab-controls">
      <label className="ai-select" htmlFor="ai-embedding-word">Compare everything to<select id="ai-embedding-word" value={query} onChange={event => setQuery(event.target.value)}>{embeddingWords.map(item => <option key={item.word} value={item.word}>{item.word}</option>)}</select></label>
      <div className="ai-choice-row" role="group" aria-label="Similarity measure">{([["cosine", "Cosine similarity"], ["distance", "Euclidean distance"]] as const).map(([value, label]) => <button type="button" key={value} aria-pressed={measure === value} onClick={() => setMeasure(value)}>{label}</button>)}</div>
    </div>
    <div className="ai-map-layout">
      <figure className="ai-embedding-plot">
        <svg viewBox="0 0 350 350" role="img" aria-label={`Thirteen words plotted on a plane. Measured by ${measure === "cosine" ? "cosine similarity" : "Euclidean distance"}, the nearest word to ${anchor.word} is ${nearest[0].word}.`}>
          <line className="ai-plot-axis" x1="15" y1={py(0)} x2="335" y2={py(0)} />
          <line className="ai-plot-axis" x1={px(0)} y1="15" x2={px(0)} y2="335" />
          <line className="ai-plot-ray" x1={px(0)} y1={py(0)} x2={px(anchor.vector[0])} y2={py(anchor.vector[1])} />
          {embeddingWords.map(item => {
            const isAnchor = item.word === anchor.word;
            const isNear = nearest.slice(0, 3).some(near => near.word === item.word);
            return <g key={item.word} className={"ai-plot-point" + (isAnchor ? " is-anchor" : isNear ? " is-near" : "")}>
              <circle cx={px(item.vector[0])} cy={py(item.vector[1])} r={isAnchor ? 6 : 4} />
              <text x={px(item.vector[0]) + 8} y={py(item.vector[1]) + 4}>{item.word}</text>
            </g>;
          })}
        </svg>
        <figcaption>Filled ray: the chosen word’s vector from the origin. Cosine reads the angle between two rays; Euclidean distance reads the gap between two points.</figcaption>
      </figure>
      <div aria-live="polite" aria-atomic="true">
        <p className="ai-eyebrow">NEAREST TO “{anchor.word.toUpperCase()}”</p>
        <ol className="ai-rank-list">{nearest.map(item => <li key={item.word}><strong>{item.word}</strong><div><span style={{ width: percent(measure === "cosine" ? Math.max(0, item.cosine) * 100 : (1 - item.distance / maxDistance) * 100) }} /></div><output>{measure === "cosine" ? item.cosine.toFixed(3) : item.distance.toFixed(3)}</output></li>)}</ol>
        <p className="ai-small">Furthest away: <strong>{furthest.word}</strong> ({measure === "cosine" ? furthest.cosine.toFixed(3) : furthest.distance.toFixed(3)}).</p>
      </div>
    </div>
    <div className="ai-formula">cos(a, b) = (a · b) / (‖a‖ ‖b‖)  ·  d(a, b) = ‖a − b‖</div>
    <p>Switch measures with <strong>cat</strong> selected. Cosine puts <strong>kitten</strong> first, because it points in almost the same direction. Euclidean distance puts <strong>dog</strong> first, because <em>kitten</em>’s vector is shorter and that gap counts against it. Retrieval systems usually normalise vectors and use cosine for exactly this reason: they want the topic, not the magnitude.</p>
    <p className="ai-small">These thirteen coordinates were placed by hand so the geometry is visible; nothing here was learned. A real embedding has hundreds or thousands of dimensions, no individual axis means anything you could name, and the neighbourhoods come from training data — along with whatever associations that data happened to contain. The mechanism is the same one behind semantic search and the retrieval step in RAG: embed the question, then find the stored vectors nearest to it.</p>
    <details className="ai-lab-check"><summary>Think it through: does a near neighbour mean the answer is correct?</summary><p>It means the text is <em>similar</em> to the query in the embedding space, which is not the same as containing the answer. Retrieval can return a passage that reads like the question and says nothing useful, and it can miss the one passage that matters because the wording diverges. That is why the retrieval step gets evaluated separately from the generated answer: first ask whether the right passage came back, then ask whether the answer actually follows from it.</p></details>
  </div>;
}
