export type Equation = {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  symbols: [string, string][];
  steps: string[];
  note?: string;
};

export type MathChapter = {
  id: string;
  title: string;
  intro: string;
  weeks: number[];
  equations: Equation[];
};
