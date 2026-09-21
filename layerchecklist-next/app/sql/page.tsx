import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import SQL from "../sections/SQL";

export const metadata: Metadata = {
  title: "SQL — Layerchecklist",
  description: "Organise, query and join the data behind an experiment or an application.",
};

export default function Page() {
  return <SectionPage><SQL /></SectionPage>;
}
