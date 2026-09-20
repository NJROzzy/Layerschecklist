import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dlRoadmap } from "../../sections/weekly_contents_of_dl/roadmap";
import Week0 from "../../sections/weekly_contents_of_dl/week0/Week0";
import Week1 from "../../sections/weekly_contents_of_dl/week1/Week1";
import Week2 from "../../sections/weekly_contents_of_dl/week2/Week2";
import Week3 from "../../sections/weekly_contents_of_dl/week3/Week3";
import "./week.css";

type WeekPageProps = { params: Promise<{ week: string }> };

const lessons: Partial<Record<number, ComponentType>> = {
  0: Week0,
  1: Week1,
  2: Week2,
  3: Week3,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return dlRoadmap.map((lesson) => ({ week: `week-${lesson.week}` }));
}

function getWeek(slug: string) {
  const lesson = dlRoadmap.find((item) => `week-${item.week}` === slug);
  if (!lesson) notFound();
  return lesson;
}

export async function generateMetadata({ params }: WeekPageProps): Promise<Metadata> {
  const lesson = getWeek((await params).week);
  return {
    title: `Week ${lesson.week}: ${lesson.title} — Layerchecklist`,
    description: `${lesson.title}. Week ${lesson.week} of the Layerchecklist deep learning series.${lesson.ready ? "" : " Lesson content coming soon."}`,
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const lesson = getWeek((await params).week);
  const index = dlRoadmap.indexOf(lesson);
  const previous = dlRoadmap[index - 1];
  const next = dlRoadmap[index + 1];
  const Lesson = lessons[lesson.week];

  return (
    <main className="dl-page dl-week-page">
      <Link href={`/dl#week-${lesson.week}`} className="back-link">&larr; Back to the learning map</Link>

      {Lesson ? <Lesson /> : (
        <article className="dl-upcoming-lesson">
          <p className="dl-week-label">Deep Learning · Week {lesson.week}</p>
          <h1>{lesson.title}</h1>
          <div className="dl-upcoming-note">
            <span className="dl-upcoming-status">Coming soon</span>
            <h2>This lesson is on the way.</h2>
            <p>
              The content for this week hasn&apos;t been added yet. Explore the
              rest of the map, or start with an available lesson.
            </p>
            <Link href="/dl/week-0">Read Week 0 &rarr;</Link>
          </div>
        </article>
      )}

      <nav className="dl-week-pagination" aria-label="Previous and next weeks">
        {previous && (
          <Link href={`/dl/week-${previous.week}`} className="dl-previous-week" rel="prev">
            <span>&larr; Previous · Week {previous.week}</span>
            <strong>{previous.title}</strong>
          </Link>
        )}
        {next && (
          <Link href={`/dl/week-${next.week}`} className="dl-next-week" rel="next">
            <span>Next · Week {next.week} &rarr;</span>
            <strong>{next.title}</strong>
          </Link>
        )}
      </nav>
    </main>
  );
}
