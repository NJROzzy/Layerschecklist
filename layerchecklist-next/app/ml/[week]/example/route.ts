import { getMLLesson, mlLessons } from "../../../sections/weekly_contents_of_ml/lessons";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return mlLessons.map((lesson) => ({ week: `week-${lesson.week}` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ week: string }> }) {
  const lesson = getMLLesson((await params).week);
  if (!lesson) return new Response("Lesson not found", { status: 404 });

  return new Response(lesson.example.code, {
    headers: {
      "Content-Type": "text/x-python; charset=utf-8",
      "Content-Disposition": `attachment; filename="ml-week-${lesson.week}.py"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
