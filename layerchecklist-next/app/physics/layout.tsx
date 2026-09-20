import type { ReactNode } from "react";
import ThemeToggle from "../ThemeToggle";
import "./physics.css";

export default function PhysicsLayout({ children }: { children: ReactNode }) {
  return <><ThemeToggle variant="floating" />{children}</>;
}
