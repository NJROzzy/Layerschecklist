import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import SimulationsEnv from "../sections/SimulationsEnv";

export const metadata: Metadata = {
  title: "Simulation Environments — Layerchecklist",
  description: "Compare Isaac Sim, Isaac Lab, and MuJoCo, connect physics engines to neural learning, and explore hybrid models, DDPG, and A3C with examples.",
};

export default function Page() {
  return <SectionPage><SimulationsEnv /></SectionPage>;
}
