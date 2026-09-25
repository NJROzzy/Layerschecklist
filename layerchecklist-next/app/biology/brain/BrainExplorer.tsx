"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { challenges, regionById, regionIndex, regions, type RegionId } from "./content";
import { createBrainRenderer, type BrainView } from "./brain-geometry";

function Orientation({yaw,pitch}:{yaw:number;pitch:number}) {
 const axes=[{name:"R",p:[1,0,0],color:"#e29ba5"},{name:"Up",p:[0,1,0],color:"#8cd7b9"},{name:"Front",p:[0,0,1],color:"#9db5f3"}];
 return <svg className="brain-orientation" viewBox="0 0 120 110" role="img" aria-label="Orientation axes: R is the person's right; Up is superior; Front is anterior.">{axes.map(({name,p,color})=>{const x=Math.cos(yaw)*p[0]+Math.sin(yaw)*p[2],z=-Math.sin(yaw)*p[0]+Math.cos(yaw)*p[2],y=Math.cos(pitch)*p[1]-Math.sin(pitch)*z;const r2=(n:number)=>Number(n.toFixed(2));return <g key={name}><line x1="55" y1="56" x2={r2(55+x*30)} y2={r2(56-y*30)} stroke={color} strokeWidth="2"/><text x={r2(55+x*42)} y={r2(59-y*42)} fill={color} textAnchor="middle">{name}</text></g>;})}</svg>;
}
function FallbackBrain() {return <svg viewBox="0 0 500 360" className="brain-fallback" role="img" aria-label="Schematic side view of the brain. Use the region buttons to explore each structure."><path fill="#8cd7b9" d="M85 185C42 130 83 65 151 69C178 35 235 42 263 66L247 153L173 206Z"/><path fill="#9db5f3" d="M263 66C326 48 376 76 391 125L328 169L247 153Z"/><path fill="#cea2df" d="M391 125C438 150 428 211 381 226L328 169Z"/><path fill="#e8b282" d="M173 206L247 153L328 169L381 226C323 269 205 265 173 206Z"/><ellipse cx="330" cy="260" rx="67" ry="43" fill="#e2cc82"/><path d="M258 238Q250 274 268 322" stroke="#e29ba5" strokeWidth="27" fill="none"/>{Array.from({length:9},(_,i)=><path key={i} d={`M${100+i*30} 100q-20 20 0 40t0 40`} fill="none" stroke="#061c1b" strokeOpacity=".3" strokeWidth="4"/>)}</svg>;}

export default function BrainExplorer() {
 const [selected,setSelected]=useState<RegionId>("frontal"),[inside,setInside]=useState(false),[camera,setCamera]=useState<[number,number]>([1.05,.16]),[zoom,setZoom]=useState(1),[status,setStatus]=useState("loading");
 const [quiz,setQuiz]=useState(false),[question,setQuestion]=useState(0),[feedback,setFeedback]=useState<"correct"|"retry"|null>(null);
 const canvas=useRef<HTMLCanvasElement>(null),renderer=useRef<ReturnType<typeof createBrainRenderer>>(null),view=useRef<BrainView>({yaw:1.05,pitch:.16,zoom:1,inside:false,selected:0});
 const drag=useRef<{x:number;y:number;startX:number;startY:number;moved:boolean}|null>(null);
 const region=regionById[selected];
 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  let disposed=false;
  const frame=requestAnimationFrame(()=>{
   if(disposed)return;
   try {renderer.current=createBrainRenderer(node);setStatus(renderer.current?"ready":"fallback");renderer.current?.draw(view.current);} catch {setStatus("fallback");}
  });
  const resize=new ResizeObserver(()=>renderer.current?.draw(view.current));resize.observe(node);
  const lost=(e:Event)=>{e.preventDefault();setStatus("fallback");};
  const restored=()=>{renderer.current?.dispose();try{renderer.current=createBrainRenderer(node);setStatus(renderer.current?"ready":"fallback");renderer.current?.draw(view.current);}catch{setStatus("fallback");}};
  node.addEventListener("webglcontextlost",lost);node.addEventListener("webglcontextrestored",restored);
  return()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();node.removeEventListener("webglcontextlost",lost);node.removeEventListener("webglcontextrestored",restored);renderer.current?.dispose();renderer.current=null;};
 },[]);
 useEffect(()=>{view.current={yaw:camera[0],pitch:camera[1],zoom,inside,selected:regionIndex(selected)};renderer.current?.draw(view.current);},[camera,zoom,inside,selected]);
 function choose(id:RegionId) {
  setSelected(id);setFeedback(null);
  if(regionById[id].inside){setInside(true);setCamera([1.35,.08]);}
 }
 function pointerDown(e:PointerEvent<HTMLCanvasElement>) {if(e.button!==0)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};}
 function pointerMove(e:PointerEvent<HTMLCanvasElement>) {const d=drag.current;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;d.moved=d.moved||Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>4;d.x=e.clientX;d.y=e.clientY;if(d.moved)setCamera(([yaw,pitch])=>[yaw+dx*.008,Math.max(-1.5,Math.min(1.5,pitch+dy*.008))]);}
 function pointerUp(e:PointerEvent<HTMLCanvasElement>) {const d=drag.current;drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(d&&!d.moved){const picked=renderer.current?.pick(e.clientX,e.clientY)??-1;if(regions[picked])choose(regions[picked].id);}}
 const presets:[string,number,number][]=[["Left side",Math.PI/2,.05],["Right side",-Math.PI/2,.05],["Front",0,.05],["From above",0,1.5]];
 return <div className="brain-explorer">
  <div className="brain-explorer-toolbar"><div><span className="brain-kicker">01 / ANATOMY EXPLORER</span><h2>A living landscape.</h2></div><div className="brain-segment" role="group" aria-label="Anatomical view"><button type="button" aria-pressed={!inside} onClick={()=>{setInside(false);if(region.inside)setSelected("frontal");}}>Outer surface</button><button type="button" aria-pressed={inside} onClick={()=>{setInside(true);setCamera([1.35,.08]);}}>Look inside</button></div></div>
  <div className="brain-explorer-grid">
   <div className="brain-model-column">
    <div className="brain-stage">
     <div className="brain-stage-head"><span><i/> {inside?"LEFT HEMISPHERE REMOVED":"CEREBRUM · CEREBELLUM · BRAINSTEM"}</span><span>3D STUDY MODEL</span></div>
     {status==="fallback"&&<FallbackBrain/>}
     <canvas ref={canvas} className={status==="fallback"?"brain-canvas is-unavailable":"brain-canvas"} tabIndex={0} role="img" aria-label="Rotatable 3D brain. Drag to rotate, click a surface to select a region. Arrow keys rotate; plus and minus zoom. The region buttons provide the same selection without the canvas." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}} onKeyDown={e=>{
      const changes:Record<string,[number,number]>={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.15],ArrowDown:[0,.15]};
      if(changes[e.key]){e.preventDefault();const [dy,dp]=changes[e.key];setCamera(([y,p])=>[y+dy,Math.max(-1.5,Math.min(1.5,p+dp))]);}
      if(e.key==="+"||e.key==="="||e.key==="-"){e.preventDefault();setZoom(z=>Math.max(.75,Math.min(1.35,z+(e.key==="-"?-.05:.05))));}
     }}/>
     <Orientation yaw={camera[0]} pitch={camera[1]}/>
     <p className="brain-stage-caption">{status==="fallback"?"3D is unavailable here. Explore the side-view schematic with the region buttons.":status==="loading"?"Preparing the brain model…":"Drag to orbit · Select a region · Use arrows when focused"}</p>
    </div>
    <div className="brain-view-controls"><div className="brain-presets" role="group" aria-label="Camera presets">{presets.map(([name,yaw,pitch])=><button key={name} type="button" onClick={()=>setCamera([yaw,pitch])}>{name}</button>)}</div><label>Zoom<input type="range" min=".75" max="1.35" step=".05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><button type="button" onClick={()=>{setCamera([1.05,.16]);setZoom(1);}}>Reset view</button></div>
    <p className="brain-small">Original, stylized geometry. Folds, borders, deep-structure positions, and relative sizes are approximate; this is not a scan-derived anatomical atlas. The cutaway hides the left cerebral hemisphere to reveal internal structures.</p>
   </div>
   <aside className="brain-inspector" style={{"--region-color":region.color} as CSSProperties} aria-labelledby="brain-region-title"><span className="brain-kicker">SELECTED STRUCTURE / {region.inside?"DEEP":"OUTER"}</span><h3 id="brain-region-title">{region.name}</h3><p className="brain-region-subtitle">{region.subtitle}</p><dl><dt>Where is it?</dt><dd>{region.position}</dd><dt>What does it contribute?</dt><dd>{region.role}</dd><dt>Meet it in everyday life</dt><dd>{region.example}</dd><dt>Follow the connection</dt><dd>{region.connection}</dd></dl><p className="brain-inspector-note">{region.remember}</p></aside>
  </div>
  <div className="brain-region-grid" role="group" aria-label="Select a brain or spinal structure">{regions.map(r=><button type="button" key={r.id} aria-pressed={selected===r.id} onClick={()=>choose(r.id)} style={{"--region-color":r.color} as CSSProperties}><i/><span>{r.name}{r.inside&&<small>inside view</small>}</span></button>)}</div>
  <div className="brain-challenge"><div><span className="brain-kicker">MAKE IT STICK</span><h3>Can you find it?</h3><p>Use the model and region buttons to answer five short anatomy challenges.</p></div><button type="button" onClick={()=>{setQuiz(!quiz);setQuestion(0);setFeedback(null);}}>{quiz?"Close challenge":"Start anatomy challenge →"}</button>
   {quiz&&<div className="brain-challenge-body">{question<challenges.length?<><span className="brain-kicker">QUESTION {question+1} / {challenges.length}</span><p>{challenges[question].question}</p><div className="brain-challenge-actions"><span>Your selection: <strong>{region.name}</strong></span><button type="button" onClick={()=>setFeedback(selected===challenges[question].answer?"correct":"retry")}>Check selection</button></div><div aria-live="polite">{feedback==="correct"&&<p className="brain-feedback">Correct. {challenges[question].why} <button type="button" onClick={()=>{setQuestion(q=>q+1);setFeedback(null);}}>{question===challenges.length-1?"Finish":"Next question →"}</button></p>}{feedback==="retry"&&<p className="brain-feedback">Try another structure. Compare its position and role with the clue.</p>}</div></>:<><h3>Five structures found.</h3><p>Next, follow how these connected structures communicate with the body.</p><a href="#signal-pathways">Trace a signal ↓</a></>}</div>}
  </div>
 </div>;
}
