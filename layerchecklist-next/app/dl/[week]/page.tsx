import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dlRoadmap } from "../../sections/weekly_contents_of_dl/roadmap";
import Week0 from "../../sections/weekly_contents_of_dl/week0/Week0";
import Week1 from "../../sections/weekly_contents_of_dl/week1/Week1";
import Week2 from "../../sections/weekly_contents_of_dl/week2/Week2";
import Week3 from "../../sections/weekly_contents_of_dl/week3/Week3";
import CourseLesson from "../../sections/weekly_contents_of_dl/advanced/CourseLesson";
import { week4 } from "../../sections/weekly_contents_of_dl/advanced/week4";
import { week5 } from "../../sections/weekly_contents_of_dl/advanced/week5";
import { week6 } from "../../sections/weekly_contents_of_dl/advanced/week6";
import { week7 } from "../../sections/weekly_contents_of_dl/advanced/week7";
import { week8 } from "../../sections/weekly_contents_of_dl/advanced/week8";
import { week9 } from "../../sections/weekly_contents_of_dl/advanced/week9";
import { week10 } from "../../sections/weekly_contents_of_dl/advanced/week10";
import { week11 } from "../../sections/weekly_contents_of_dl/advanced/week11";
import { week12 } from "../../sections/weekly_contents_of_dl/advanced/week12";
import { week13 } from "../../sections/weekly_contents_of_dl/advanced/week13";
import "./week.css";

type WeekPageProps = { params: Promise<{ week: string }> };

const lessons: Partial<Record<number, ComponentType>> = {
  0: Week0,
  1: Week1,
  2: Week2,
  3: Week3,
  // Later weeks share a renderer while retaining topic-specific lessons and labs.
  4: () => <CourseLesson lesson={week4} />,
  5: () => <CourseLesson lesson={week5} />,
  6: () => <CourseLesson lesson={week6} />,
  7: () => <CourseLesson lesson={week7} />,
  8: () => <CourseLesson lesson={week8} />,
  9: () => <CourseLesson lesson={week9} />,
  10: () => <CourseLesson lesson={week10} />,
  11: () => <CourseLesson lesson={week11} />,
  12: () => <CourseLesson lesson={week12} />,
  13: () => <CourseLesson lesson={week13} />,
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
    description: `${lesson.title}. Week ${lesson.week} of the Layerchecklist deep learning series, with explanations, worked mathematics, interactive examples, and practice.`,
  };
}

export default async function WeekPage({ params }: WeekPageProps) {
  const lesson = getWeek((await params).week);
  const index = dlRoadmap.indexOf(lesson);
  const previous = dlRoadmap[index - 1];
  const next = dlRoadmap[index + 1];
  const Lesson = lessons[lesson.week];
  if (!Lesson) notFound();

  return (
    <main className="dl-page dl-week-page">
      <Link href={`/dl#week-${lesson.week}`} className="back-link">&larr; Back to the learning map</Link>

      <Lesson />

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
