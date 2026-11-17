import type { Metadata } from "next";
import Link from "next/link";
import SectionPage from "../../sections/SectionPage";
import PythonFundamentals from "../../sections/PythonFundamentals";
export const metadata:Metadata={title:"Python Reference & Interview Practice — Layerchecklist",description:"After the beginner course: Python patterns, classes, comprehensions, generators, and interview practice."};
export default function Page(){return <SectionPage><p><Link href="/python">← New to programming? Start with Python from Zero</Link></p><PythonFundamentals/></SectionPage>;}
