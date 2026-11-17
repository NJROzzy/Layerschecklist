"use client";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "./lessons";

type Result = {output:string;error?:string;note?:string};
const errorHints:Record<string,string> = {
 SyntaxError:"Check the marked line for missing quotes, parentheses, or a colon.",
 IndentationError:"Check the spaces at the start of each line. Use four spaces for each level inside a block.",
 NameError:"Check the spelling and capitalization of the name, and whether you assigned it a value earlier.",
 TypeError:"Check whether your values are text or numbers. int() can convert suitable numeric text before arithmetic.",
 ValueError:"The value could not be used in this operation. For int(), try a whole number such as 20, not twenty or 2.5.",
 IndexError:"That list position does not exist. A three-item list has indexes 0, 1, and 2.",
 KeyError:"That key is missing from the dictionary. Check its spelling or use .get() with a default.",
 EOFError:"Your program requested another input line. Add one answer per input() call in the Input box.",
 ZeroDivisionError:"The divisor is zero. Choose a nonzero divisor or handle that case before dividing.",
 FileNotFoundError:"Check the filename and create the file before reading it. Files here live in temporary browser memory.",
 ModuleNotFoundError:"This editor supports Python's standard library. Extra packages are not installed automatically.",
};
export default function PythonPlayground({lesson,workspaceLabel="YOUR FIRST WORKSPACE"}:{lesson:Lesson;workspaceLabel?:string}) {
 const [drafts,setDrafts]=useState<Record<string,string>>({}),[inputs,setInputs]=useState<Record<string,string>>({});
 const [results,setResults]=useState<Record<string,Result>>({}),[state,setState]=useState<"idle"|"loading"|"running">("idle"),[ready,setReady]=useState(false);
 const [copyStatus,setCopyStatus]=useState("");
 const worker=useRef<Worker|null>(null),timeout=useRef<ReturnType<typeof setTimeout>|null>(null),run=useRef<{id:number;lesson:string}|null>(null),serial=useRef(0);
 const code=drafts[lesson.id]??lesson.code,input=inputs[lesson.id]??lesson.input??"",result=results[lesson.id];
 const busy=state!=="idle";
 function clearTimer(){if(timeout.current)clearTimeout(timeout.current);timeout.current=null;}
 function destroy(){clearTimer();worker.current?.terminate();worker.current=null;}
 useEffect(()=>()=>{if(timeout.current)clearTimeout(timeout.current);worker.current?.terminate();},[]);
 function stop(note="Stopped. Your code is still in the editor; change it and run again.") {
  destroy();if(run.current){const key=run.current.lesson;setResults(all=>({...all,[key]:{output:"",note}}));}
  run.current=null;setState("idle");setReady(false);
 }
 function runCode() {
  if(busy)return;
  const id=++serial.current;run.current={id,lesson:lesson.id};setResults(all=>({...all,[lesson.id]:{output:""}}));setState(ready?"running":"loading");
  if(!worker.current){
   try{worker.current=new Worker("/python/runner.mjs",{type:"module"});}catch{stop("This browser could not start Python. Copy or download the code and try it in Thonny using the setup guide below.");return;}
   worker.current.onmessage=({data})=>{
    const current=run.current;
    if(!current||data.id!==current.id)return;
    const key=current.lesson;
    if(data.type==="ready"){
     setReady(true);setState("running");clearTimer();timeout.current=setTimeout(()=>stop("Stopped after 10 seconds. Check whether a loop keeps repeating. Your code is preserved."),10000);return;
    }
    clearTimer();setState("idle");run.current=null;
    if(data.type==="load-error"){
     destroy();setReady(false);setResults(all=>({...all,[key]:{output:"",note:"Python could not download. Check your connection and press Run to retry, or use the local setup guide below. The lessons and expected outputs still work."}}));
    }else setResults(all=>({...all,[key]:{output:data.output,error:data.error}}));
   };
   worker.current.onerror=()=>stop("Python could not start or stopped unexpectedly. Press Run to retry, or copy the code into Thonny.");
  }
  clearTimer();timeout.current=setTimeout(()=>stop(ready?"Stopped after 10 seconds. Check for a loop that never ends.":"The Python download took too long. Check your connection and press Run to retry."),ready?10000:120000);
  worker.current.postMessage({id,code,input});
 }
 function download(){const url=URL.createObjectURL(new Blob([code+"\n"],{type:"text/x-python"}));const link=document.createElement("a");link.href=url;link.download=`${lesson.id}.py`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function copy(){try{await navigator.clipboard.writeText(code);setCopyStatus("Copied");}catch{setCopyStatus("Select the code to copy it");}}
 const errorType=result?.error?.match(/(?:^|\n)(\w*Error):/)?.[1];
 return <div className="py-playground">
  <div className="py-editor-heading"><div><span className="py-eyebrow">{workspaceLabel}</span><strong>{lesson.id}.py</strong></div><div className="py-editor-tools"><button type="button" onClick={copy}>{copyStatus||"Copy"}</button><button type="button" onClick={download}>Download .py</button><button type="button" disabled={busy} onClick={()=>{setDrafts(d=>({...d,[lesson.id]:lesson.code}));setInputs(d=>({...d,[lesson.id]:lesson.input??""}));setResults(r=>{const next={...r};delete next[lesson.id];return next;});setCopyStatus("");}}>Reset example</button></div></div>
  <div className="py-workspace"><div className="py-code-pane"><label className="py-pane-label" htmlFor="python-editor"><span>01 / CODE</span><span>Edit these instructions</span></label><textarea id="python-editor" wrap="off" aria-label="Python code editor" spellCheck={false} autoCapitalize="off" autoCorrect="off" value={code} onChange={e=>{setDrafts(d=>({...d,[lesson.id]:e.target.value}));setCopyStatus("");}} onKeyDown={e=>{
   if(e.key==="Tab"&&!e.shiftKey){e.preventDefault();const el=e.currentTarget,start=el.selectionStart,end=el.selectionEnd;setDrafts(d=>({...d,[lesson.id]:code.slice(0,start)+"    "+code.slice(end)}));requestAnimationFrame(()=>{el.selectionStart=el.selectionEnd=start+4;});}
   if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();runCode();}
  }} style={{minHeight:Math.min(400,Math.max(170,(code.split("\n").length+1)*25))}}/><div className="py-run-bar"><button type="button" className="py-run-button" onClick={runCode} disabled={busy}>{state==="loading"?"Loading Python…":state==="running"?"Running…":"▶ Run Python"}</button>{busy&&<button type="button" onClick={()=>stop()}>Stop</button>}<span>{ready?"Python is ready":"First run downloads Python"}</span></div></div>
   <div className="py-output-pane"><div className="py-pane-label"><span>02 / OUTPUT</span><span>What the program displays</span></div><div className="py-output" aria-live="polite" aria-atomic="true">{result?.output&&<pre>{result.output}</pre>}{result?.error&&<><p className="py-error-title">{errorType||"Python found a problem"}</p>{errorType&&errorHints[errorType]&&<p>{errorHints[errorType]}</p>}<pre className="py-error">{result.error}</pre></>}{result?.note&&<p>{result.note}</p>}{!result&&<p>Your result will appear here.<br/>Read the code, make a prediction, then press Run.</p>}{result&&!result.output&&!result.error&&!result.note&&<p>{busy?"Working on your program…":"Finished with no printed output. Use print() when you want to display a result."}</p>}</div><details className="py-expected"><summary>Reveal expected output for the original example</summary><pre>{lesson.output}</pre><p>Compare this with your result. Changing the code or inputs can change the output.</p></details></div>
  </div>
  <details className="py-input" open={lesson.input!==undefined}><summary>Input answers {lesson.input!==undefined?"· used in this lesson":"· for programs with input()"}</summary><label htmlFor="python-input">One answer per line, in the order input() asks for them.</label><textarea id="python-input" rows={3} spellCheck={false} value={input} onChange={e=>setInputs(d=>({...d,[lesson.id]:e.target.value}))}/></details>
  <p className="py-runtime-note">Real Python runs in your browser using <a href="https://pyodide.org/">Pyodide</a>. The first run needs an internet connection and may take a moment. Each run starts with fresh variable names; files remain in temporary memory until Python restarts. Tab inserts four spaces; Shift+Tab leaves the editor.</p>
 </div>;
}
