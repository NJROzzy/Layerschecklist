import Link from "next/link";
import "./science-flow.css";

const subjects = [
  { id: "math", label: "Math", description: "The language of patterns" },
  { id: "physics", label: "Physics", description: "The rules of the physical world" },
  { id: "biology", label: "Biology", description: "Living systems and their history" },
] as const;

export default function ScienceFlow({ current }: { current?: "math" | "physics" | "biology" }) {
  return <nav className="science-flow" aria-label="Foundation learning sequence"><span className="science-flow-label">BUILD YOUR FOUNDATIONS</span><ol>{subjects.map((subject, i) => <li key={subject.id}><Link href={"/" + subject.id} aria-current={current === subject.id ? "page" : undefined}><span className="science-flow-number">0{i + 1}</span><div><strong>{subject.label}</strong><small>{subject.description}</small></div><span aria-hidden="true">{i < subjects.length - 1 ? "→" : "↗"}</span></Link></li>)}</ol></nav>;
}
