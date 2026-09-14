import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mlRoadmap } from "../../sections/weekly_contents_of_ml/roadmap";
import "./week.css";

type WeekPageProps = { params: Promise<{ week: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return mlRoadmap.map((lesson) => ({ week: `week-${lesson.week}` }));
}

function getWeek(slug: string) {
  const lesson = mlRoadmap.find((item) => `week-${item.week}` === slug);
  if (!lesson) notFound();
  return lesson;
}

export async function generateMetadata({ params }: WeekPageProps): Promise<Metadata> {
  const lesson = getWeek((await params).week);
  return {
    title: `Week ${lesson.week}: ${lesson.title} — Layerchecklist`,
    description: `${lesson.title}. Week ${lesson.week} of the Layerchecklist machine learning series. Lesson content coming soon.`,
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const lesson = getWeek((await params).week);
  const index = mlRoadmap.indexOf(lesson);
  const previous = mlRoadmap[index - 1];
  const next = mlRoadmap[index + 1];

  return (
    <main className="ml-page ml-week-page">
      <Link href={`/ml#week-${lesson.week}`} className="back-link">&larr; Back to the learning map</Link>

      <article className="ml-upcoming-lesson">
        <p className="ml-week-label">Machine Learning · Week {lesson.week}</p>
        <h1>{lesson.title}</h1>
        <div className="ml-upcoming-note">
          <span className="ml-upcoming-status">Coming soon</span>
          <h2>This lesson is on the way.</h2>
          <p>
            The content for this week hasn&apos;t been added yet. Use the map or
            the links below to explore the other weeks in the series.
          </p>
          <Link href="/ml">View all weeks &rarr;</Link>
        </div>
      </article>

      <nav className="ml-week-pagination" aria-label="Previous and next weeks">
        {previous && (
          <Link href={`/ml/week-${previous.week}`} className="ml-previous-week" rel="prev">
            <span>&larr; Previous · Week {previous.week}</span>
            <strong>{previous.title}</strong>
          </Link>
        )}
        {next && (
          <Link href={`/ml/week-${next.week}`} className="ml-next-week" rel="next">
            <span>Next · Week {next.week} &rarr;</span>
            <strong>{next.title}</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}
