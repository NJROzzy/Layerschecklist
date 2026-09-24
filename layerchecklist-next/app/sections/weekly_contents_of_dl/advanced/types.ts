export type LabKind = "convolution" | "residual" | "memory" | "attention" | "contrastive" | "vae" | "gan" | "diffusion" | "calibration" | "bellman";

export type LessonSection = {
  id: string;
  title: string;
  paragraphs: string[];
  formula?: string;
  worked?: { title: string; steps: string[] };
  table?: { headers: string[]; rows: string[][] };
  code?: string;
  lab?: LabKind;
  takeaway?: string;
};

export type CourseLessonData = {
  week: number;
  title: string;
  lead: string;
  prerequisites: string;
  outcomes: string[];
  sections: LessonSection[];
  pitfalls: [string, string][];
  practice: [string, string][];
  review: [string, string][];
  experiment: { title: string; description: string; checks: string[] };
  bridge: string;
  references: { title: string; url: string; note: string }[];
};
