import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import CUDA from "../sections/CUDA";

export const metadata: Metadata = {
  title: "CUDA — Layerchecklist",
  description: "Parallel computation on the GPU, and the hardware model underneath every training run.",
};

export default function Page() {
  return <SectionPage><CUDA /></SectionPage>;
}
