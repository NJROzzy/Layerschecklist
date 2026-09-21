import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import Math from "../sections/Math";

export const metadata: Metadata = {
  title: "Reading Mathematical Notation — Layerchecklist",
  description: "Translate the symbols in a machine-learning equation into plain sentences before worrying about the formal mathematics.",
};

export default function Page() {
  return <SectionPage><Math /></SectionPage>;
}
