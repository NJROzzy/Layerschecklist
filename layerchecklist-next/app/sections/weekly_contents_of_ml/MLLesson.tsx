import type { MLLesson as LessonData } from "./types";
import "./MLLesson.css";

export default function MLLesson({ lesson, title }: { lesson: LessonData; title: string }) {
  return (
    <article className="ml-lesson" aria-labelledby="lesson-title">
      <header className="ml-lesson-header">
        <p className="ml-week-label">Machine Learning · Week {lesson.week}</p>
        <h1 id="lesson-title">{title}</h1>
        <p className="ml-lesson-summary">{lesson.summary}</p>
        <p className="ml-prerequisites"><strong>Before you start:</strong> {lesson.prerequisites}</p>
      </header>

      <aside className="ml-lesson-goals" aria-labelledby="lesson-goals">
        <h2 id="lesson-goals">What you will learn</h2>
        <ul>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
      </aside>

      <ol className="ml-lesson-workflow" aria-label="This week's workflow">
        {lesson.workflow.map((step) => <li key={step}>{step}</li>)}
      </ol>

      <nav className="ml-lesson-contents" aria-label="In this lesson">
        {lesson.sections.map((section, index) => <a href={`#${section.id}`} key={section.id}>{index + 1}. {section.title}</a>)}
        <a href="#worked-example">Complete example</a>
        <a href="#practice">Practice</a>
        <a href="#review">Review answers</a>
      </nav>

      {lesson.sections.map((section, index) => (
        <section id={section.id} className="ml-lesson-section" key={section.id} aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}>{index + 1}. {section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.formula && <pre className="ml-lesson-formula" tabIndex={0} aria-label={`${section.title} formula`}><code>{section.formula}</code></pre>}
          {section.table && (
            <div className="ml-lesson-table" tabIndex={0} role="region" aria-label={section.table.caption}>
              <table>
                <caption>{section.table.caption}</caption>
                <thead><tr>{section.table.headers.map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
                <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th scope="row" key={cellIndex}>{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
          {section.reference && <p className="ml-lesson-reference">Documentation: <a href={section.reference.href}>{section.reference.title}</a></p>}
        </section>
      ))}

      <section id="worked-example" className="ml-lesson-section" aria-labelledby="example-title">
        <h2 id="example-title">Complete example: {lesson.example.title}</h2>
        <p>{lesson.example.description}</p>
        <p>Install the packages in your Python environment, then download and run the script. The example creates its data locally.</p>
        <pre className="ml-lesson-setup" tabIndex={0} aria-label="Install and run commands"><code>{`${lesson.example.install}\npython ml-week-${lesson.week}.py`}</code></pre>
        <a className="ml-download-example" href={`/ml/week-${lesson.week}/example`} download={`ml-week-${lesson.week}.py`}>Download Python example &darr;</a>
        <pre className="ml-lesson-example" tabIndex={0} aria-label="Complete Python example"><code>{lesson.example.code}</code></pre>
        <h3>What to look for</h3>
        <ul>{lesson.example.observations.map((observation) => <li key={observation}>{observation}</li>)}</ul>
      </section>

      <aside className="ml-lesson-pitfalls" aria-labelledby="pitfalls-title">
        <h2 id="pitfalls-title">Mistakes to avoid</h2>
        <ul>{lesson.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul>
      </aside>

      <section id="practice" className="ml-lesson-section" aria-labelledby="practice-title">
        <h2 id="practice-title">Practice and completion checks</h2>
        <ol className="ml-exercises">{lesson.exercises.map((exercise) => <li key={exercise.task}><p>{exercise.task}</p><p><strong>You are done when:</strong> {exercise.success}</p></li>)}</ol>
      </section>

      <section id="review" className="ml-lesson-section" aria-labelledby="review-title">
        <h2 id="review-title">Check your understanding</h2>
        <p>Answer each question first, then expand it to compare your reasoning.</p>
        <div className="ml-review-questions">{lesson.review.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </article>
  );
}
