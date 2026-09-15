import week0 from "./week0/lesson";
import week1 from "./week1/lesson";
import week2 from "./week2/lesson";
import week3 from "./week3/lesson";
import week4 from "./week4/lesson";

export const mlLessons = [week0, week1, week2, week3, week4];

export function getMLLesson(slug: string) {
  return mlLessons.find((lesson) => `week-${lesson.week}` === slug);
}
