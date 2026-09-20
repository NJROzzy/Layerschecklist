import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./about.css";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <><ThemeToggle variant="floating" />{children}</>;
}
