import Link from "next/link";
import "../Section.css";

type Topic = {
  title: string;
  explanation: string;
  code: string;
  check: string;
};

type WeeklyLessonProps = {
  week: number;
  title: string;
  introduction: string;
  coreIdea: string;
  topics: Topic[];
  exercise: string;
  questions: string[];
  outcome: string;
  source: { title: string; href: string };
};

export default function WeeklyLesson({
  week, title, introduction, coreIdea, topics, exercise, questions, outcome, source,
}: WeeklyLessonProps) {
  return (
    <section id={`week-${week}`} className="week-block learning-section" aria-labelledby={`week-${week}-title`}>
      <h1 id={`week-${week}-title`}>Week {week} — {title}</h1>
      <p>{introduction}</p>

      <div className="interview-note">
        <strong>Core idea:</strong>
        <p>{coreIdea}</p>
      </div>

      <div className="topic-grid">
        {topics.map((topic) => (
          <div className="topic-row" key={topic.title}>
            <div className="topic-explain">
              <h3>{topic.title}</h3>
              <p>{topic.explanation}</p>
              <p className="interview-tip"><strong>Check your understanding:</strong>{topic.check}</p>
            </div>
            <div className="topic-code">
              <pre tabIndex={0} aria-label={`${topic.title} example`}><code>{topic.code}</code></pre>
            </div>
          </div>
        ))}
      </div>

      <h3>Try It Yourself</h3>
      <p>{exercise}</p>

      <h3>Week {week} Review Questions</h3>
      <div className="interview-questions">
        <ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
      </div>

      <h3>The Standard You Want</h3>
      <p>{outcome}</p>
      <p className="week-reading">Further reading: <a href={source.href}>{source.title}</a></p>
      <Link className="week-back-to-map" href={`/dl#week-${week}`}>Back to the learning map &uarr;</Link>
    </section>
  );
}
