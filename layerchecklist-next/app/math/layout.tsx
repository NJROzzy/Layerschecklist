import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./math.css";

export default function MathLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeToggle variant="floating" />
      {children}
    </>
  );
}
