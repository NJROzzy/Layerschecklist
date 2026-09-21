import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import PythonLibraries from "../sections/PythonLibraries";

export const metadata: Metadata = {
  title: "Python Libraries — Layerchecklist",
  description: "NumPy, pandas, Matplotlib and the rest of the toolkit for handling data and numerical computation.",
};

export default function Page() {
  return <SectionPage><PythonLibraries /></SectionPage>;
}
