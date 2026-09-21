import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import PythonFundamentals from "../sections/PythonFundamentals";

export const metadata: Metadata = {
  title: "Python Fundamentals — Layerchecklist",
  description: "The language itself: types, control flow, functions, data structures and the patterns that show up in every ML codebase.",
};

export default function Page() {
  return <SectionPage><PythonFundamentals /></SectionPage>;
}
