export type MLLesson = {
  week: number;
  summary: string;
  prerequisites: string;
  objectives: string[];
  workflow: string[];
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    formula?: string;
    table?: { caption: string; headers: string[]; rows: string[][] };
    reference?: { title: string; href: string };
  }[];
  example: {
    title: string;
    description: string;
    install: string;
    code: string;
    observations: string[];
  };
  pitfalls: string[];
  exercises: { task: string; success: string }[];
  review: { question: string; answer: string }[];
};
