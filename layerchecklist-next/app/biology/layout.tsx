import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./biology.css";

export default function BiologyLayout({ children }: { children: ReactNode }) {
  return <><ThemeToggle variant="floating" />{children}</>;
}
