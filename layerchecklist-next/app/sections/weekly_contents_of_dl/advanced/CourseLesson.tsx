import { readFileSync } from "node:fs";
import Link from "next/link";
import path from "node:path";
import type { CourseLessonData } from "./types";
import CourseLab from "./CourseLabs";
import "./course.css";

export default function CourseLesson({ lesson }: { lesson: CourseLessonData }) {
  const example = readFileSync(path.join(process.cwd(), "public", "examples", `dl-week-${lesson.week}.py`), "utf8");
  return <article className="dl-course">
    <header className="dc-hero">
      <p className="dc-eyebrow">DEEP LEARNING / WEEK {String(lesson.week).padStart(2, "0")}</p>
      <h1>{lesson.title}</h1><p className="dc-lead">{lesson.lead}</p>
      <div className="dc-facts"><span>{lesson.sections.length} lessons</span><span>Interactive lab</span><span>Python experiment</span><span>Practice + answers</span></div>
      <p className="dc-prerequisites"><strong>Bring with you:</strong> {lesson.prerequisites}</p>
    </header>
    <div className="dc-objectives"><p className="dc-eyebrow">BY THE END OF THIS WEEK</p><ul>{lesson.outcomes.map(item => <li key={item}>{item}</li>)}</ul></div>
    <nav className="dc-contents" aria-label="This week's lessons"><p className="dc-eyebrow">FOLLOW THE IDEAS</p><ol>{lesson.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}<li><a href="#experiment">Run the experiment</a></li><li><a href="#practice">Practice & review</a></li></ol></nav>
    {lesson.sections.map((s, index) => <section className="dc-section" id={s.id} key={s.id} aria-labelledby={`${s.id}-title`}>
      <p className="dc-eyebrow">LESSON {lesson.week}.{index + 1}</p><h2 id={`${s.id}-title`}>{s.title}</h2>
      {s.paragraphs.map(p => <p key={p}>{p}</p>)}
      {s.formula && <pre className="dc-formula" tabIndex={0} aria-label={`${s.title} equations`}>{s.formula}</pre>}
      {s.table && <div className="dc-table-scroll" tabIndex={0} role="region" aria-label={`${s.title} comparison`}><table><thead><tr>{s.table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{s.table.rows.map((row, i) => <tr key={i}>{row.map((v,j) => j === 0 ? <th scope="row" key={j}>{v}</th> : <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}
      {s.worked && <aside className="dc-worked"><p className="dc-eyebrow">WORK IT THROUGH</p><h3>{s.worked.title}</h3><ol>{s.worked.steps.map(step => <li key={step}>{step}</li>)}</ol></aside>}
      {s.code && <pre className="dc-code" tabIndex={0} aria-label={`${s.title} code fragment`}><code>{s.code}</code></pre>}
      {s.lab && <CourseLab kind={s.lab} />}
      {s.takeaway && <p className="dc-takeaway"><strong>Keep this idea.</strong> {s.takeaway}</p>}
    </section>)}
    <section className="dc-section" id="debugging"><p className="dc-eyebrow">WHEN THE MODEL SURPRISES YOU</p><h2>Mistakes worth catching early</h2><div className="dc-cards">{lesson.pitfalls.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="dc-section" id="experiment"><p className="dc-eyebrow">FROM EQUATIONS TO A RUNNING MODEL</p><h2>{lesson.experiment.title}</h2><p>{lesson.experiment.description}</p>
      <p>Download the script, create a Python environment, and run the commands below in the folder containing the download. The example uses PyTorch on CPU and generates its own small dataset. No dataset or model download is required.</p>
      <pre className="dc-code" tabIndex={0} aria-label="Install and run commands"><code>{`python -m venv .venv\n# macOS / Linux: source .venv/bin/activate\n# Windows PowerShell: .venv\\Scripts\\Activate.ps1\npython -m pip install torch\npython dl-week-${lesson.week}.py\n# Fast execution check (not a convergence result):\npython dl-week-${lesson.week}.py --smoke`}</code></pre>
      <a className="dc-download" href={`/examples/dl-week-${lesson.week}.py`} download>Download Week {lesson.week} Python ↓</a>
      <details className="dc-details"><summary>Read the complete, runnable experiment</summary><pre className="dc-code" tabIndex={0}><code>{example}</code></pre></details>
      <h3>Read the output, then challenge it</h3><ul>{lesson.experiment.checks.map(c => <li key={c}>{c}</li>)}</ul>
      <p className="dc-caption">These are small mechanism studies, not benchmark claims. Seeds make runs easier to compare; versions and hardware can still change exact results. Decide your validation protocol before tuning and reserve final test results for reporting.</p>
    </section>
    <section className="dc-section" id="practice"><p className="dc-eyebrow">PREDICT → CALCULATE → EXPLAIN</p><h2>Practice with worked answers</h2>{lesson.practice.map(([q,a],i) => <div className="dc-practice" key={q}><h3>{i+1}. {q}</h3><details className="dc-details"><summary>Check your reasoning</summary><p>{a}</p></details></div>)}</section>
    <section className="dc-section" id="review"><p className="dc-eyebrow">EXPLAIN IT WITHOUT THE CODE</p><h2>Week {lesson.week} review questions</h2>{lesson.review.map(([q,a],i) => <details className="dc-details" key={q}><summary><span>{String(i+1).padStart(2,"0")}</span>{q}</summary><p>{a}</p></details>)}</section>
    <section className="dc-section" id="references"><p className="dc-eyebrow">RESEARCH CONNECTIONS</p><h2>Follow the original ideas</h2><div className="dc-cards">{lesson.references.map(r => <article key={r.url}><h3><a href={r.url}>{r.title} ↗</a></h3><p>{r.note}</p></article>)}</div><p className="dc-caption">Course alignment: AI Algorithms 2, lecture Week {lesson.week + 1}. This site counts from Week 0. Explanations, browser labs, and runnable experiments are authored study companions to the supplied lecture material.</p></section>
    <footer className="dc-bridge"><p className="dc-eyebrow">CONNECT THE LAYERS</p><p>{lesson.bridge}</p><Link href="/dl">See the complete learning map →</Link></footer>
  </article>;
}
