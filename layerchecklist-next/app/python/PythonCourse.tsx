"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { lessons, type Lesson } from "./lessons";
import PythonPlayground from "./PythonPlayground";

const STORAGE_KEY="layerchecklist.python.beginner.v1";
function Checkpoint({lesson}:{lesson:Lesson}) {
 const [choice,setChoice]=useState<number|null>(null),[checked,setChecked]=useState(false);
 return <section className="py-checkpoint" aria-labelledby="py-checkpoint-title"><span className="py-eyebrow">A QUICK CHECK</span><h3 id="py-checkpoint-title">{lesson.check.question}</h3><fieldset><legend className="py-sr-only">Choose one answer</legend>{lesson.check.choices.map((text,i)=><label key={text} className={choice===i?"is-selected":""}><input type="radio" name={`check-${lesson.id}`} checked={choice===i} onChange={()=>{setChoice(i);setChecked(false);}}/><span>{text}</span></label>)}</fieldset><button type="button" disabled={choice===null} onClick={()=>setChecked(true)}>Check my answer</button><div aria-live="polite">{checked&&<p className={choice===lesson.check.answer?"py-feedback-correct":"py-feedback-retry"}>{choice===lesson.check.answer?"You’ve got it. ":"Let’s work through it. "}{lesson.check.why}</p>}</div></section>;
}
export default function PythonCourse() {
 const [active,setActive]=useState(0),[completed,setCompleted]=useState<string[]>([]),[loaded,setLoaded]=useState(false),[persistent,setPersistent]=useState(true);
 const heading=useRef<HTMLHeadingElement>(null);
 const lesson=lessons[active];
 useEffect(()=>{
  let last=0;
  try {
   const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
   if(saved&&Array.isArray(saved.completed))setCompleted([...new Set<string>(saved.completed.filter((id:unknown)=>typeof id==="string"&&lessons.some(l=>l.id===id)))]);
   const savedIndex=lessons.findIndex(l=>l.id===saved?.last);if(savedIndex>=0)last=savedIndex;
  }catch{setPersistent(false);}
  const hashIndex=lessons.findIndex(l=>`#${l.id}`===window.location.hash);setActive(hashIndex>=0?hashIndex:last);setLoaded(true);
  const onHash=()=>{const index=lessons.findIndex(l=>`#${l.id}`===window.location.hash);if(index>=0)setActive(index);};
  window.addEventListener("hashchange",onHash);window.addEventListener("popstate",onHash);
  return()=>{window.removeEventListener("hashchange",onHash);window.removeEventListener("popstate",onHash);};
 },[]);
 useEffect(()=>{
  if(!loaded)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({completed,last:lessons[active].id}));}catch{setPersistent(false);}
 },[completed,active,loaded]);
 function navigate(index:number){
  setActive(index);window.history.pushState(null,"",`#${lessons[index].id}`);
  requestAnimationFrame(()=>{heading.current?.focus({preventScroll:true});document.getElementById("python-course")?.scrollIntoView({behavior:"instant",block:"start"});});
 }
 function mark(){setCompleted(ids=>ids.includes(lesson.id)?ids.filter(id=>id!==lesson.id):[...ids,lesson.id]);}
 return <section id="python-course" className="py-course" aria-label="Python beginner course">
  <aside className="py-course-nav"><div className="py-course-progress"><span className="py-eyebrow">YOUR LEARNING PATH</span><strong>{completed.length}<span> / {lessons.length} practiced</span></strong><progress value={completed.length} max={lessons.length} aria-label="Lessons marked as practiced"/><p>{persistent?"Your place and checklist are saved in this browser. Code edits last for this visit.":"Progress is available for this visit; browser storage is unavailable."}</p></div><nav aria-label="Python lessons"><ol>{lessons.map((item,i)=><li key={item.id}><a href={`#${item.id}`} aria-current={active===i?"step":undefined} onClick={e=>{e.preventDefault();navigate(i);}}><span className="py-lesson-number">{completed.includes(item.id)?"✓":String(i+1).padStart(2,"0")}</span><span><strong>{item.title}</strong><small>{item.short}</small></span>{completed.includes(item.id)&&<span className="py-sr-only">Practiced</span>}</a></li>)}</ol></nav><Link className="py-reference-link" href="/python/reference">Already comfortable? Open the advanced reference ↗</Link></aside>
  <div className="py-course-content"><div className="py-mobile-select"><label htmlFor="python-lesson-select">Choose a lesson</label><select id="python-lesson-select" value={active} onChange={e=>navigate(Number(e.target.value))}>{lessons.map((item,i)=><option key={item.id} value={i}>{String(i+1).padStart(2,"0")} · {item.title}</option>)}</select></div>
   <article id={lesson.id} className="py-lesson"><header className="py-lesson-heading"><span className="py-eyebrow">LESSON {String(active+1).padStart(2,"0")} / {lessons.length}</span><h2 ref={heading} tabIndex={-1}>{lesson.title}</h2><p className="py-goal"><span>By the end</span>{lesson.goal}</p></header><p className="py-intro-text">{lesson.intro}</p><dl className="py-concepts">{lesson.concepts.map(c=><div key={c.term}><dt>{c.term}</dt><dd>{c.meaning}</dd></div>)}</dl>
    <PythonPlayground lesson={lesson}/>
    <section className="py-walkthrough" aria-labelledby="py-walkthrough-title"><span className="py-eyebrow">READ IT SLOWLY</span><h3 id="py-walkthrough-title">What each step is doing</h3><ol>{lesson.lines.map(line=><li key={line.line}><span>LINE {line.line}</span><div><code>{lesson.code.split("\n")[line.line-1].trim()}</code><p>{line.explanation}</p></div></li>)}</ol><p className="py-caption">Line numbers refer to the original example. Use Reset example if you want to follow it again.</p></section>
    <section className="py-practice" aria-labelledby="py-practice-title"><span className="py-eyebrow">YOUR TURN</span><h3 id="py-practice-title">Make one change. See what happens.</h3><p>{lesson.tryIt}</p><details key={`${lesson.id}-hint`}><summary>I could use a hint</summary><p>{lesson.hint}</p></details><details key={`${lesson.id}-solution`}><summary>Show one solution</summary><pre><code>{lesson.solution}</code></pre>{lesson.id==="input"&&<p>Use these input answers: Sam on the first line, 30 on the second.</p>}<span className="py-eyebrow">SOLUTION OUTPUT</span><pre>{lesson.solutionOutput}</pre></details></section>
    <aside className="py-pitfall"><span>COMMON STUMBLE</span><p>{lesson.pitfall}</p></aside>
    <Checkpoint key={lesson.id} lesson={lesson}/>
    <div className="py-completion"><label><input type="checkbox" checked={completed.includes(lesson.id)} onChange={mark}/><span>I practiced this and can explain the example.</span></label><p>This is your checklist, not an automatic grade. Revisit any lesson whenever you like.</p></div>
    <nav className="py-lesson-pagination" aria-label="Move between lessons"><button type="button" disabled={active===0} onClick={()=>navigate(active-1)}>← Previous lesson</button>{active<lessons.length-1?<button type="button" className="py-next-button" onClick={()=>navigate(active+1)}>Next: {lessons[active+1].title} →</button>:<Link href="/libraries" className="py-next-button">Explore Python Libraries →</Link>}</nav>
    {completed.length===lessons.length&&<div className="py-finished"><strong>Your first Python path is complete.</strong><p>You have practiced all {lessons.length} lessons. Try rebuilding the spending tracker from a blank editor, then return to any step you need.</p></div>}
   </article>
  </div>
 </section>;
}
