import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mlRoadmap } from "../../sections/weekly_contents_of_ml/roadmap";
import { getMLLesson } from "../../sections/weekly_contents_of_ml/lessons";
import MLLesson from "../../sections/weekly_contents_of_ml/MLLesson";
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
  const { week } = await params;
  const lesson = getWeek(week);
  const content = getMLLesson(week);
  if (!content) notFound();
  return {
    title: `Week ${lesson.week}: ${lesson.title} — Layerchecklist`,
    description: content.summary,
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { week } = await params;
  const lesson = getWeek(week);
  const content = getMLLesson(week);
  if (!content) notFound();
  const index = mlRoadmap.indexOf(lesson);
  const previous = mlRoadmap[index - 1];
  const next = mlRoadmap[index + 1];

  return (
    <main className="ml-page ml-week-page">
      <Link href={`/ml#week-${lesson.week}`} className="back-link">&larr; Back to the learning map</Link>

      <MLLesson lesson={content} title={lesson.title} />

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
