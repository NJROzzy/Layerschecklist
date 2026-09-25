"use client";
import { useEffect, useMemo, useState } from "react";
import { conductionDelay, simulateNeuron } from "./neuron-model";

const pathways={
 touch:{name:"Feel a touch",intro:"A simplified route for conscious touch from a hand. This omits several relays and the crossing of many ascending fibers.",steps:[
  {name:"A receptor responds",where:"PERIPHERAL / SKIN",text:"A touch-sensitive ending converts a physical disturbance into a change in neural activity.",point:[77,223]},
  {name:"A sensory neuron carries it inward",where:"PERIPHERAL / AFFERENT",text:"Signals travel toward the central nervous system along a sensory axon.",point:[119,180]},
  {name:"The signal enters the spinal cord",where:"CENTRAL / SPINAL CORD",text:"Ascending pathways carry information onward; local circuits can also use it.",point:[170,178]},
  {name:"A thalamic relay participates",where:"CENTRAL / THALAMUS",text:"A somatosensory thalamic nucleus interacts with cortical circuits.",point:[173,75]},
  {name:"Cortical networks interpret it",where:"CENTRAL / SOMATOSENSORY CORTEX",text:"Parietal and wider networks help represent the location and qualities of the sensation.",point:[149,48]},
 ]},
 movement:{name:"Move a hand",intro:"A shortened voluntary motor route. Planning, basal ganglia, cerebellar feedback, and sensory correction operate in connected loops.",steps:[
  {name:"A movement is planned and initiated",where:"CENTRAL / CORTICAL NETWORKS",text:"Frontal motor networks participate in selecting and organizing the action.",point:[190,48]},
  {name:"Descending signals pass through the brainstem",where:"CENTRAL / DESCENDING PATHWAYS",text:"Motor pathways carry commands toward spinal circuits; many fibers cross along the route.",point:[170,108]},
  {name:"Spinal motor circuits are recruited",where:"CENTRAL / SPINAL CORD",text:"Local circuits and lower motor neurons combine descending and sensory inputs.",point:[170,181]},
  {name:"A motor axon carries the output",where:"PERIPHERAL / EFFERENT",text:"The lower motor neuron’s axon travels out toward skeletal muscle.",point:[118,199]},
  {name:"Muscle fibers receive a chemical signal",where:"PERIPHERAL / NEUROMUSCULAR JUNCTION",text:"Acetylcholine at the neuromuscular junction helps trigger muscle electrical activity and contraction.",point:[77,223]},
 ]},
 reflex:{name:"Trace a withdrawal reflex",intro:"A simplified polysynaptic withdrawal circuit. Ascending information also reaches the brain; the spinal response need not wait for conscious recognition.",steps:[
  {name:"A sensory ending detects a harmful stimulus",where:"PERIPHERAL / RECEPTOR",text:"Nociceptive endings respond to potentially damaging conditions and generate sensory signals.",point:[77,223]},
  {name:"An afferent signal enters the cord",where:"PERIPHERAL → CENTRAL",text:"A sensory neuron carries the signal into spinal circuitry.",point:[118,180]},
  {name:"Spinal interneurons distribute the response",where:"CENTRAL / LOCAL CIRCUIT",text:"Multiple interneurons can excite and inhibit motor pathways, coordinating withdrawal.",point:[170,178]},
  {name:"Motor neurons activate the response",where:"CENTRAL → PERIPHERAL",text:"Motor output recruits appropriate muscles. Opposing muscle groups can be inhibited through other circuit branches.",point:[169,204]},
  {name:"The limb withdraws",where:"PERIPHERAL / MUSCLE",text:"The local response and ascending information can proceed in parallel; the brain also modulates spinal processing.",point:[77,223]},
 ]},
};
type Pathway=keyof typeof pathways;
export function PathwayLab() {
 const [kind,setKind]=useState<Pathway>("touch"),[step,setStep]=useState(0),[playing,setPlaying]=useState(false);
 const path=pathways[kind],current=path.steps[step];
 useEffect(()=>{
  if(!playing)return;
  const timer=setTimeout(()=>{if(step>=path.steps.length-1)setPlaying(false);else setStep(s=>s+1);},1000);
  const stop=()=>{if(document.hidden)setPlaying(false);};document.addEventListener("visibilitychange",stop);
  return()=>{clearTimeout(timer);document.removeEventListener("visibilitychange",stop);};
 },[playing,step,path.steps.length]);
 return <div className="brain-lab">
  <div className="brain-segment" role="group" aria-label="Signal pathway">{Object.entries(pathways).map(([id,p])=><button key={id} type="button" aria-pressed={kind===id} onClick={()=>{setKind(id as Pathway);setStep(0);setPlaying(false);}}>{p.name}</button>)}</div>
  <p className="brain-lab-intro">{path.intro}</p>
  <div className="brain-pathway-grid">
   <div className="brain-body-stage"><svg viewBox="0 0 340 410" role="img" aria-label={`${path.name}. Step ${step+1}: ${current.name}. Central structures connect to sensory and motor nerves.`}>
    <defs><radialGradient id="body-brain-glow"><stop stopColor="#94dfc4" stopOpacity=".35"/><stop offset="1" stopColor="#94dfc4" stopOpacity="0"/></radialGradient></defs>
    <circle cx="170" cy="68" r="67" fill="url(#body-brain-glow)"/>
    <path d="M153 103C120 112 113 135 105 160L68 219Q64 229 77 235L126 181L130 257L108 370Q113 391 128 375L169 279L203 375Q219 390 225 371L205 256L211 181L260 235Q274 231 268 218L233 159C225 132 219 112 187 103" fill="#122c2a" stroke="#54746b" strokeWidth="1.5"/>
    <ellipse cx="170" cy="65" rx="34" ry="44" fill="#152e2c" stroke="#54746b" strokeWidth="1.5"/>
    <path d="M144 62C138 40 158 33 170 41C185 26 208 48 194 69L180 87L159 86Z" fill="#7daf98" stroke="#a0d9b7" strokeWidth="1"/>
    <path d="M170 88L170 260" stroke="#a0d9b7" strokeWidth="6" strokeLinecap="round"/>
    {[142,162,182,202,222,242].map(y=><path key={y} d={`M170 ${y}l-22 13m22-13l22 13`} stroke="#ab8e67" fill="none" strokeWidth="2"/>)}
    <path d="M155 139L116 174L77 223M185 139L226 174L260 226M165 252L123 374M176 252L213 374" stroke="#ab8e67" strokeWidth="2" fill="none"/>
    {path.steps.slice(1).map((s,i)=><path key={i} d={`M${path.steps[i].point.join(" ")}L${s.point.join(" ")}`} fill="none" stroke={i<step?"#94dfc4":"#375951"} strokeWidth={i<step?4:2} strokeDasharray={i<step?undefined:"4 6"}/>)}
    {kind==="reflex"&&<path d="M177 176Q218 111 192 68" stroke="#a9bbed" strokeWidth="2" strokeDasharray="4 5" fill="none"/>}
    {path.steps.map((s,i)=><g key={i}><circle cx={s.point[0]} cy={s.point[1]} r={i===step?10:5} fill={i<=step?"#94dfc4":"#375951"} stroke={i===step?"white":"none"} strokeWidth="2"/></g>)}
    <text x="18" y="31" fill="#94dfc4" fontSize="12">CNS / brain + cord</text><text x="18" y="396" fill="#d4b17d" fontSize="12">PNS / connecting nerves</text>
   </svg></div>
   <div className="brain-pathway-steps">{path.steps.map((s,i)=><button type="button" key={s.name} aria-pressed={i===step} onClick={()=>{setStep(i);setPlaying(false);}}><span>{String(i+1).padStart(2,"0")}</span><div><small>{s.where}</small><strong>{s.name}</strong>{i===step&&<p>{s.text}</p>}</div></button>)}</div>
  </div>
  <div className="brain-lab-footer"><div className="brain-lab-actions"><button type="button" onClick={()=>{if(step===4)setStep(0);setPlaying(!playing);}}>{playing?"Pause pathway":"Play pathway"}</button><button type="button" disabled={step===0} onClick={()=>{setPlaying(false);setStep(s=>s-1);}}>← Previous</button><button type="button" disabled={step===4} onClick={()=>{setPlaying(false);setStep(s=>s+1);}}>Next →</button></div><span>Step {step+1} of 5 · symbolic timing</span></div>
  <p className="brain-small">The order highlights a route through a network. Real activity overlaps in time, includes feedback, and follows more branches than this diagram shows.</p>
 </div>;
}

const neuronParts={
 dendrites:{name:"Dendrites",text:"Many neurons receive synaptic input on branched dendrites. Inputs change local membrane voltage; integration depends on location, timing, and cell properties."},
 soma:{name:"Cell body",text:"The soma contains the nucleus and much of the cell’s machinery. Signals integrate across the cell; in many neurons, spikes begin near the axon initial segment."},
 axon:{name:"Axon",text:"Action potentials propagate along an axon. Voltage-gated channels regenerate the signal; a stronger input does not simply make each spike taller."},
 myelin:{name:"Myelin",text:"Glial membranes insulate segments of an axon. Action potentials regenerate at nodes between segments, supporting faster conduction in appropriate fibers."},
 synapse:{name:"Chemical synapse",text:"At many terminals, an arriving action potential opens calcium channels. Vesicles release transmitter, which binds receptors on the receiving cell. Its effect depends on the receptor and circuit."},
};
type NeuronPart=keyof typeof neuronParts;
function Slider({label,value,set,min,max,step=.1,unit}:{label:string;value:number;set:(v:number)=>void;min:number;max:number;step?:number;unit:string}) {return <label className="brain-slider"><span>{label}<output>{value.toFixed(step<.1?2:1)} {unit}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>set(Number(e.target.value))}/></label>;}

export function NeuronLab() {
 const [excitation,setExcitation]=useState(2.8),[inhibition,setInhibition]=useState(.3),[myelin,setMyelin]=useState(true),[distance,setDistance]=useState(.5),[part,setPart]=useState<NeuronPart>("axon");
 const model=useMemo(()=>simulateNeuron(excitation,inhibition),[excitation,inhibition]);
 const chartMin=Math.min(-85,...model.samples.map(s=>s.voltage))-5;
 const y=(v:number)=>205-(v-chartMin)/(35-chartMin)*175;
 const trace=model.samples.map((p,i)=>`${i?"L":"M"}${(50+p.time/300*555).toFixed(2)},${y(p.voltage).toFixed(2)}`).join(" ");
 return <div className="brain-lab">
  <div className="brain-neuron-stage"><svg viewBox="0 0 720 230" role="img" aria-label="A schematic neuron with dendrites, a cell body, axon, myelin segments and synaptic terminals. Select these parts using the buttons below.">
   <g fill="none" stroke="#769b94" strokeWidth="3">{[-2,-1,0,1,2].map(i=><path key={i} d={`M170 115Q${110+Math.abs(i)*6} ${115+i*20} ${70+Math.abs(i)*7} ${115+i*35}m15 ${-i*8}l-25 ${i*11}m30 ${-i*15}l-14 ${-i*9}`}/>)}</g>
   <path d="M163 70Q205 69 219 107Q233 134 197 157Q173 174 148 145Q123 117 140 93Z" fill="#345c52" stroke="#98dcb9" strokeWidth="3"/>
   <circle cx="177" cy="117" r="18" fill="#83b39e"/><circle cx="181" cy="113" r="6" fill="#436f5e"/>
   <path d="M216 118L625 118M625 118Q651 109 665 83M625 118L670 125M625 118Q651 143 665 164" stroke="#9ddbc1" strokeWidth="5" fill="none"/>
   {myelin&&[260,345,430,515].map(x=><g key={x}><rect x={x} y="100" width="63" height="36" rx="16" fill="#93acce" fillOpacity=".6" stroke="#b5c8e5"/><path d={`M${x+12} 103v30m12-31v32m12-32v32m12-30v28`} stroke="#d0dbea" strokeOpacity=".3"/></g>)}
   {[83,125,164].map(y=><g key={y}><circle cx={669} cy={y} r="8" fill="#e6b184"/><circle cx={687} cy={y-4} r="2" fill="#e6b184"/><circle cx={692} cy={y+4} r="2" fill="#e6b184"/></g>)}
   <path d="M700 67v113" stroke="#b39dc7" strokeWidth="6" strokeLinecap="round"/>
   <text x="28" y="210" fill="#b6d5ca" fontSize="14">input</text><text x="160" y="210" fill="#b6d5ca" fontSize="14">integration</text><text x="365" y="210" fill="#b6d5ca" fontSize="14">propagation →</text><text x="617" y="210" fill="#e6b184" fontSize="14">transmission</text>
  </svg></div>
  <div className="brain-segment" role="group" aria-label="Explore neuron parts">{Object.entries(neuronParts).map(([id,p])=><button type="button" key={id} aria-pressed={part===id} onClick={()=>setPart(id as NeuronPart)}>{p.name}</button>)}</div><p className="brain-part-note"><strong>{neuronParts[part].name}.</strong> {neuronParts[part].text}</p>
  <div className="brain-neuron-experiment"><div><span className="brain-kicker">EXPERIMENT / WHEN DOES IT FIRE?</span><h3>Add input. Find the threshold.</h3><p>Change excitatory and inhibitory current during a 200 ms input window. This simplified neuron leaks toward rest, fires when it reaches threshold, resets, and briefly becomes refractory.</p><div className="brain-sliders"><Slider label="Excitatory drive" value={excitation} set={setExcitation} min={0} max={4} unit="nA"/><Slider label="Inhibitory drive" value={inhibition} set={setInhibition} min={0} max={3} unit="nA"/></div></div>
   <div className="brain-voltage"><svg viewBox="0 0 640 250" role="img" aria-label={`Membrane voltage across 300 milliseconds. ${model.spikes.length} spikes during the input window. Threshold minus 50 millivolts.`}><rect x={50+20/300*555} y="22" width={200/300*555} height="183" fill="currentColor" opacity=".04"/>{[-70,-50,30].map(v=><g key={v}><line x1="50" x2="605" y1={y(v)} y2={y(v)} stroke={v===-50?"var(--n-warm)":"currentColor"} strokeDasharray={v===-50?"5 5":undefined} opacity={v===-50?.7:.12}/><text x="7" y={y(v)+5}>{v}</text></g>)}<path d={trace} fill="none" stroke="var(--n-accent)" strokeWidth="2"/><text x="50" y="18">Membrane voltage (mV)</text><text x="50" y="238">0</text><text x="232" y="238">100</text><text x="417" y="238">200</text><text x="560" y="238">300 ms</text></svg><div className="brain-readouts"><div><span>Net drive</span><strong>{model.netCurrent.toFixed(1)} nA</strong></div><div><span>Spikes in 200 ms</span><strong>{model.spikes.length}</strong></div><div><span>Window firing rate</span><strong>{model.rate.toFixed(0)} Hz</strong></div></div></div>
  </div>
  <details className="brain-details"><summary>What does this model include—and leave out?</summary><p>We use a leaky integrate-and-fire model: τ dV/dt = −(V − Vrest) + RI. Here τ = 20 ms, R = 10 MΩ, Vrest = −70 mV, threshold = −50 mV, reset = −65 mV, and refractory time = 3 ms. These are illustrative parameters. Each drawn spike is a marker at +30 mV; the model does not simulate sodium/potassium channel dynamics, spike shape, synaptic conductances, or a complete biological cell.</p><p>In biological action potentials, ion-channel changes produce a rapid rise and fall in voltage. The sodium–potassium pump helps maintain ion gradients over time; it is not the mechanism that directly produces each spike’s rapid falling phase.</p></details>
  <div className="brain-conduction"><div><span className="brain-kicker">EXPERIMENT / HOW LONG DOES THE SIGNAL TAKE?</span><h3>Change the journey, not the spike height.</h3><p>Compare two chosen conduction speeds along the same axon distance. Myelin affects propagation; it does not change the firing threshold in this separate teaching calculation.</p></div><div><label className="brain-check"><input type="checkbox" checked={myelin} onChange={e=>setMyelin(e.target.checked)}/>Show myelin · use illustrative 50 m/s instead of 2 m/s</label><Slider label="Axon distance" value={distance} set={setDistance} min={.1} max={2} unit="m"/><div className="brain-delay"><span>Travel time = distance ÷ speed</span><strong>{conductionDelay(distance,myelin).toFixed(1)} ms</strong></div></div></div>
  <p className="brain-small">Real conduction depends on axon diameter, myelination, temperature, and other properties. These chosen speeds illustrate the relationship; the drawing is not to scale and the travel time excludes synapses and other processing.</p>
 </div>;
}
