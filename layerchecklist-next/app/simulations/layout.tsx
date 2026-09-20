import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./simulations.css";

export default function SimulationsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeToggle variant="floating" />
      {children}
    </>
  );
}
