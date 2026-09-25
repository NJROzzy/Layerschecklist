"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { createBodyRenderer, tracks, trackById, type BodyView } from "./body-geometry";

const GROUPS:{id:string;label:string;ids:number[]}[]=[
 {id:"cns",    label:"Central nervous system", ids:[0,1,2,3]},
 {id:"cranial",label:"Cranial nerves",         ids:[4,5]},
 {id:"trunk",  label:"Trunk & autonomic",      ids:[6,7]},
 {id:"plexus", label:"Plexuses",               ids:[8,12]},
 {id:"arm",    label:"Nerves of the arm",      ids:[9,10,11]},
 {id:"leg",    label:"Nerves of the leg",      ids:[13,14,15,16]},
];
const PRESETS:[string,number,number][]=[["Front",0,.02],["Right side",Math.PI/2,.02],["Back",Math.PI,.02],["Three-quarter",.52,.10]];

function FallbackBody() {
 return <svg viewBox="0 0 220 460" className="body-fallback" role="img" aria-label="Schematic front view of the nervous system: brain, spinal cord, and the main nerves of the arms and legs. Use the nerve buttons to read about each one.">
  <ellipse cx="110" cy="40" rx="27" ry="32" fill="#2a4a44" stroke="#8cd7b9" strokeWidth="1.5"/>
  <path d="M96 30q14-12 28 0" stroke="#8cd7b9" strokeWidth="2" fill="none"/>
  <path d="M110 72V250" stroke="#8cd7b9" strokeWidth="7" strokeLinecap="round"/>
  {Array.from({length:14},(_,i)=><path key={i} d={`M110 ${96+i*11}l-30 9m30-9l30 9`} stroke="#6fbfe0" strokeWidth="1.6"/>)}
  <path d="M110 250l-10 22-6 60-4 74M110 250l10 22 6 60 4 74" stroke="#f0a0a8" strokeWidth="4" fill="none" strokeLinecap="round"/>
  <path d="M96 108l-26 26-14 66-4 52M124 108l26 26 14 66 4 52" stroke="#8ab8f0" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  <text x="110" y="446" fill="#9ec6ba" fontSize="11" textAnchor="middle">brain · cord · spinal nerves · limb nerves</text>
 </svg>;
}

export default function BodyExplorer() {
 const [selected,setSelected]=useState(1),[bones,setBones]=useState(true),[pulses,setPulses]=useState(true);
 const [camera,setCamera]=useState<[number,number]>([.52,.10]),[zoom,setZoom]=useState(1),[status,setStatus]=useState("loading");
 const canvas=useRef<HTMLCanvasElement>(null);
 const renderer=useRef<ReturnType<typeof createBodyRenderer>>(null);
 const view=useRef<BodyView>({yaw:.52,pitch:.10,zoom:1,selected:1,bones:true,time:0,pulses:true});
 const drag=useRef<{x:number;y:number;sx:number;sy:number;moved:boolean}|null>(null);
 const visible=useRef(false);
 const track=trackById[selected];

 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  let disposed=false,raf=0,started=0;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const loop=(now:number)=>{
   if(disposed)return;
   if(!started)started=now;
   view.current.time=(now-started)/1000;
   if(visible.current&&view.current.pulses) renderer.current?.draw(view.current);
   raf=requestAnimationFrame(loop);
  };
  const boot=requestAnimationFrame(()=>{
   if(disposed)return;
   try {
    renderer.current=createBodyRenderer(node);
    if(!renderer.current){setStatus("fallback");return;}
    setStatus("ready");
    view.current.pulses=!reduced.matches;
    renderer.current.draw(view.current);
    raf=requestAnimationFrame(loop);
   } catch {setStatus("fallback");}
  });
  if(reduced.matches) setPulses(false);
  const io=new IntersectionObserver(es=>{visible.current=es[0].isIntersecting;},{threshold:.05});
  io.observe(node);
  const resize=new ResizeObserver(()=>renderer.current?.draw(view.current));resize.observe(node);
  const lost=(e:Event)=>{e.preventDefault();setStatus("fallback");};
  node.addEventListener("webglcontextlost",lost);
  return()=>{disposed=true;cancelAnimationFrame(boot);cancelAnimationFrame(raf);io.disconnect();resize.disconnect();
   node.removeEventListener("webglcontextlost",lost);renderer.current?.dispose();renderer.current=null;};
 },[]);

 useEffect(()=>{
  view.current={...view.current,yaw:camera[0],pitch:camera[1],zoom,selected,bones,pulses};
  renderer.current?.draw(view.current);
 },[camera,zoom,selected,bones,pulses]);

 const pointerDown=useCallback((e:PointerEvent<HTMLCanvasElement>)=>{
  if(e.button!==0)return;
  e.currentTarget.setPointerCapture(e.pointerId);
  drag.current={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false};
 },[]);
 const pointerMove=useCallback((e:PointerEvent<HTMLCanvasElement>)=>{
  const d=drag.current;if(!d)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  d.moved=d.moved||Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>4;
  d.x=e.clientX;d.y=e.clientY;
  if(d.moved)setCamera(([y,p])=>[y+dx*.008,Math.max(-1.2,Math.min(1.2,p+dy*.008))]);
 },[]);
 const pointerUp=useCallback((e:PointerEvent<HTMLCanvasElement>)=>{
  const d=drag.current;drag.current=null;
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  if(d&&!d.moved){const hit=renderer.current?.pick(e.clientX,e.clientY)??-1;if(trackById[hit])setSelected(hit);}
 },[]);

 return <div className="body-explorer">
  <div className="body-toolbar">
   <div><span className="brain-kicker">THE WHOLE ARCHITECTURE</span><h3>One brain. Two metres of wiring.</h3></div>
   <div className="body-switches">
    <label className="brain-check"><input type="checkbox" checked={bones} onChange={e=>setBones(e.target.checked)}/>Show skeleton</label>
    <label className="brain-check"><input type="checkbox" checked={pulses} onChange={e=>setPulses(e.target.checked)}/>Animate signals</label>
   </div>
  </div>
  <div className="body-grid">
   <div className="body-stage">
    <div className="brain-stage-head"><span><i/> {bones?"SKELETON + NERVOUS SYSTEM":"NERVOUS SYSTEM ONLY"}</span><span>3D STUDY MODEL</span></div>
    {status==="fallback"&&<FallbackBody/>}
    <canvas ref={canvas} className={status==="fallback"?"body-canvas is-unavailable":"body-canvas"} tabIndex={0} role="img"
     aria-label="Rotatable 3D figure showing the skeleton with the brain, spinal cord and peripheral nerves inside it. Drag to rotate, click a nerve to select it. Arrow keys rotate; plus and minus zoom. The nerve buttons provide the same selection without the canvas."
     onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
     onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}
     onKeyDown={e=>{
      const step:Record<string,[number,number]>={ArrowLeft:[-.16,0],ArrowRight:[.16,0],ArrowUp:[0,-.12],ArrowDown:[0,.12]};
      if(step[e.key]){e.preventDefault();const [dy,dp]=step[e.key];setCamera(([y,p])=>[y+dy,Math.max(-1.2,Math.min(1.2,p+dp))]);}
      if(e.key==="+"||e.key==="="||e.key==="-"){e.preventDefault();setZoom(z=>Math.max(.7,Math.min(2.6,z+(e.key==="-"?-.1:.1))));}
     }}/>
    <p className="brain-stage-caption">{status==="fallback"?"3D is unavailable here. Use the schematic and the nerve buttons.":status==="loading"?"Building the body model…":"Drag to orbit · Click a nerve · Arrows rotate when focused"}</p>
   </div>
   <aside className="body-inspector" aria-labelledby="body-track-title">
    <span className="brain-kicker">SELECTED / {track.group==="cns"?"CENTRAL":"PERIPHERAL"}</span>
    <h3 id="body-track-title">{track.name}</h3>
    <p>{track.blurb}</p>
    <div className="body-legend">
     {GROUPS.map(g=><span key={g.id} className={`body-dot body-dot-${g.id}`}>{g.label}</span>)}
    </div>
    <p className="brain-small">Nerve routes are drawn as single smooth paths. A real nerve is a bundle of many axons that branches repeatedly along its course.</p>
   </aside>
  </div>
  <div className="body-controls">
   <div className="brain-presets" role="group" aria-label="Camera presets">{PRESETS.map(([n,y,p])=><button key={n} type="button" onClick={()=>setCamera([y,p])}>{n}</button>)}</div>
   <label>Zoom<input type="range" min=".7" max="2.6" step=".1" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label>
   <button type="button" onClick={()=>{setCamera([.52,.10]);setZoom(1);}}>Reset view</button>
  </div>
  <div className="body-tracks">
   {GROUPS.map(g=><div key={g.id} className="body-track-group">
    <span className="brain-kicker">{g.label}</span>
    <div role="group" aria-label={g.label}>
     {g.ids.map(id=><button key={id} type="button" className={`body-track body-track-${g.id}`} aria-pressed={selected===id} onClick={()=>setSelected(id)}><i/>{trackById[id].name}</button>)}
    </div>
   </div>)}
  </div>
  <p className="brain-small">Original, stylized geometry built from anatomical proportions. Bone shapes, nerve routes and branch points are schematic teaching approximations, not scan-derived anatomy. Nerves are drawn thicker than scale so they stay visible inside the skeleton.</p>
 </div>;
}
