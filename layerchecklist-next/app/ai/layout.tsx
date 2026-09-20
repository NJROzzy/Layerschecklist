import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./ai.css";

export default function AILayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeToggle variant="floating" />
      {children}
    </>
  );
}
