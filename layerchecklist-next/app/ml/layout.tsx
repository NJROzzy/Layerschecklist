import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./ml.css";

export default function MLLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeToggle variant="floating" />
      {children}
    </>
  );
}
