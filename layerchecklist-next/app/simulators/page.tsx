import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import SimulationsEnv from "../sections/SimulationsEnv";

export const metadata: Metadata = {
  title: "Simulation Environments — Layerchecklist",
  description: "MuJoCo, Isaac Sim, Gazebo and the rest — what each models, and how well it transfers to hardware.",
};

export default function Page() {
  return <SectionPage><SimulationsEnv /></SectionPage>;
}
