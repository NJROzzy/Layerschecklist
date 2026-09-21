import type { Metadata } from "next";
import SectionPage from "../sections/SectionPage";
import ROS from "../sections/ROS";

export const metadata: Metadata = {
  title: "ROS — Layerchecklist",
  description: "The Robot Operating System: nodes, topics and services for connecting sensing, communication and control.",
};

export default function Page() {
  return <SectionPage><ROS /></SectionPage>;
}
