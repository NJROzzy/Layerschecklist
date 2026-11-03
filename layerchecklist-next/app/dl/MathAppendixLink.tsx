import Link from "next/link";
import { equationCount } from "./mathematics/content";

export default function MathAppendixLink({ final = false }: { final?: boolean }) {
  return <aside id="mathematics" className="dl-math-appendix" aria-label="Deep learning mathematics reference"><div><span>{final ? "AFTER WEEK 13 / THE FINAL REFERENCE" : "MATHEMATICS & NOTATION / COURSE REFERENCE"}</span><h2>The equations behind the whole course.</h2><p>{equationCount} explained equation entries, symbol definitions, dimensions, worked examples, and a complete interactive gradient trace.</p></div><Link href="/dl/mathematics">Open the mathematics reference →</Link></aside>;
}
