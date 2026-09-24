"use client";
import { useMemo, useState } from "react";
import { ddpgStep, fitResidual, hybridTrajectories, rolloutReturns } from "./learning-math";

function Range({label,value,set,min,max,step=.05}:{label:string;value:number;set:(value:number)=>void;min:number;max:number;step?:number}) {return <label className="sl-control"><span>{label}<output>{Number(value.toFixed(3))}</output></span><input type="range" min={min} max={max} step={step} value={value} onChange={e=>set(Number(e.target.value))}/></label>;}
function Stats({values}:{values:[string,string][]}) {return <dl className="sl-stats">{values.map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>;}

const STACKS = {
 isaac:{name:"Isaac Sim + Lab",world:"Isaac Sim / PhysX (2.x path)",task:"Isaac Lab task + environment managers",learning:"Compatible RL library / PyTorch or JAX",example:"Franka reaching with joint-position targets",note:"Isaac Sim supplies the scene. Isaac Lab defines the learning task. The selected RL runner updates the policy."},
 mujoco:{name:"MuJoCo on CPU",world:"MuJoCo dynamics + contacts",task:"Your wrapper or a Gymnasium environment",learning:"Your actor–critic trainer / neural runtime",example:"A motor torque controls a joint",note:"The Python engine advances the physical model. A separate task wrapper computes observations, rewards, and episode endings."},
 mjx:{name:"Accelerated MuJoCo",world:"MJX-JAX or MJX-Warp",task:"Batched task / e.g. MuJoCo Playground",learning:"Compatible batched learner",example:"Many locomotion environments stepped together",note:"Choose the backend by hardware and feature needs. Batching and neural-network training are separate capabilities."},
};
export function StackExplorer() {
 const [selected,setSelected]=useState<keyof typeof STACKS>("isaac"),[substeps,setSubsteps]=useState(4);
 const stack=STACKS[selected];
 return <div className="sim-panel sl-stack">
  <p className="sim-eyebrow">EXPLORE THE CONNECTION</p><div className="sl-choice" role="group" aria-label="Simulation stack">{Object.entries(STACKS).map(([key,item])=><button type="button" key={key} aria-pressed={selected===key} onClick={()=>setSelected(key as keyof typeof STACKS)}>{item.name}</button>)}</div>
  <div className="sl-stack-diagram">
   <article><span>01 / WORLD</span><strong>{stack.world}</strong><p>state + action → next physical state</p></article><b aria-hidden="true">↓</b>
   <article><span>02 / TASK</span><strong>{stack.task}</strong><p>sensors → observation · reward · ending</p></article><b aria-hidden="true">↓</b>
   <article><span>03 / LEARNING</span><strong>{stack.learning}</strong><p>actor chooses actions · optimizer updates weights</p></article>
   <div className="sl-loop-return">Next action returns to the world ↻</div>
  </div>
  <p><strong>{stack.example}.</strong> {stack.note}</p>
  <div className="sl-controls"><Range label="Physics steps per policy action" value={substeps} set={setSubsteps} min={1} max={12} step={1}/></div>
  <Stats values={[["Physics rate (fixed)","120 Hz"],["Policy control rate",`${(120/substeps).toFixed(1)} Hz`],["Action held for",`${(1000*substeps/120).toFixed(1)} ms`]]}/>
  <p className="sim-note">These rates are an illustrative configuration. Changing action decimation changes the control problem; rendering frequency is another independent setting.</p>
 </div>;
}

export function HybridLab() {
 const [drag,setDrag]=useState(.4),[trainedDrag,setTrainedDrag]=useState(.4),[weights,setWeights]=useState(()=>fitResidual(.4));
 const result=useMemo(()=>hybridTrajectories(drag,weights),[drag,weights]);
 const points=(values:number[])=>values.filter((_,i)=>i%4===0).map((v,i)=>`${(45+i*2.65).toFixed(2)},${(150-v*100).toFixed(2)}`).join(" ");
 function train() {setWeights(fitResidual(drag));setTrainedDrag(drag);}
 return <div className="sim-panel sl-hybrid"><p className="sim-eyebrow">BROWSER EXPERIMENT / A LEARNED DYNAMICS CORRECTION</p><h3>Keep the spring model. Learn the missing drag.</h3><p>The reference law is x″ = −x − cv − 0.3 tanh(3v). The incomplete physics model uses x″ = −x − 0.1v. A small neural readout learns the missing acceleration from 49 synthetic velocity samples, with seven fixed tanh features and a velocity feature.</p>
  <div className="sl-controls"><Range label="Reference linear drag c" value={drag} set={setDrag} min={.1} max={1} step={.05}/><div className="sl-fit"><button type="button" onClick={train}>Fit correction to this drag</button><span>Current correction trained at c = {trainedDrag.toFixed(2)}</span></div></div>
  <svg className="sl-chart" viewBox="0 0 620 290" role="img" aria-label={`Eight-second spring trajectories. Physics position RMSE ${result.physicsError.toFixed(4)}; hybrid RMSE ${result.hybridError.toFixed(4)}.`}>
   {[-1,0,1].map(v=><g key={v}><line x1="45" x2="580" y1={150-v*100} y2={150-v*100} stroke="currentColor" opacity=".15"/><text x="12" y={154-v*100}>{v}</text></g>)}
   <text x="45" y="25">Position (m)</text><text x="45" y="278">0 s</text><text x="552" y="278">8 s</text>
   <polyline points={points(result.reference)} fill="none" stroke="var(--color-text)" strokeWidth="3"/>
   <polyline points={points(result.physics)} fill="none" stroke="var(--s-warn)" strokeWidth="2" strokeDasharray="6 4"/>
   <polyline points={points(result.hybrid)} fill="none" stroke="var(--s-accent)" strokeWidth="2.5"/>
  </svg>
  <div className="sl-legend"><span>● Reference law</span><span className="sl-warn">┄ Incomplete physics</span><span className="sl-accent">━ Physics + neural correction</span></div>
  <Stats values={[["Physics rollout RMSE",result.physicsError.toFixed(4)],["Hybrid rollout RMSE",result.hybridError.toFixed(4)],["Training velocity range","−2 to 2 m/s"]]}/>
  <p className="sim-note">Change drag before refitting to expose a distribution shift. Fitting updates eight output weights by gradient descent; it does not train a control policy. All trajectories use the same 0.01 s semi-implicit integrator, so this comparison isolates model error rather than integration accuracy.</p>
 </div>;
}

export function DDPGLab() {
 const [action,setAction]=useState(-.4),[goal,setGoal]=useState(.6),[reward,setReward]=useState(-.2),[rate,setRate]=useState(.1),[tau,setTau]=useState(.05),[terminal,setTerminal]=useState(false);
 const update=ddpgStep(action,goal,reward,.95,rate,tau,terminal);
 return <div className="sim-panel"><p className="sim-eyebrow">WORKED UPDATE / DDPG</p><h3>Follow the critic&apos;s action gradient</h3><p>Use a fixed toy critic Q(a) = −(a − a*)² to expose the calculation. The scalar actor parameter is its action. The old target actor outputs 0.1, the discount is 0.95, and actions are bounded to [−1, 1].</p>
  <div className="sl-controls"><Range label="Current actor action" value={action} set={setAction} min={-1} max={1}/><Range label="Critic-preferred action a*" value={goal} set={setGoal} min={-1} max={1}/><Range label="Observed reward" value={reward} set={setReward} min={-1} max={1}/><Range label="Actor step size" value={rate} set={setRate} min={0} max={.5}/><Range label="Target mixing τ" value={tau} set={setTau} min={0} max={1} step={.01}/></div>
  <label className="sl-check"><input type="checkbox" checked={terminal} onChange={e=>setTerminal(e.target.checked)}/>The transition truly terminates the task</label>
  <Stats values={[["Critic target y",update.bellmanTarget.toFixed(4)],["Action gradient ∂Q/∂a",update.actionGradient.toFixed(4)],["Actor after one step",update.updatedAction.toFixed(4)],["Target actor after mixing",update.targetAction.toFixed(4)]]}/>
  <div className="sl-action-line" role="img" aria-label={`Action moves from ${action.toFixed(2)} to ${update.updatedAction.toFixed(2)}; critic optimum ${goal.toFixed(2)}.`}><i className="sl-action-old" style={{left:`${((action+1)*50).toFixed(2)}%`}}/><i className="sl-action-new" style={{left:`${((update.updatedAction+1)*50).toFixed(2)}%`}}/><i className="sl-action-goal" style={{left:`${((goal+1)*50).toFixed(2)}%`}}/></div>
  <div className="sl-legend"><span>○ Current action</span><span className="sl-accent">● Updated action</span><span className="sl-warn">│ Critic optimum</span></div>
  <p className="sim-note">The critic is deliberately fixed here; this is update arithmetic, not a trained DDPG agent. A real run learns the critic from replay and softly updates both actor and critic targets. At true termination, y becomes the immediate reward.</p>
 </div>;
}

export function A3CLab() {
 const [first,setFirst]=useState(.2),[gamma,setGamma]=useState(.9),[bootstrap,setBootstrap]=useState(.5),[baseline,setBaseline]=useState(.4),[probability,setProbability]=useState(.6),[terminal,setTerminal]=useState(false);
 const rewards=[first,-.1,1],returns=rolloutReturns(rewards,gamma,bootstrap,terminal),advantage=returns[0]-baseline;
 const entropy=-probability*Math.log(probability)-(1-probability)*Math.log(1-probability);
 const actorLoss=-Math.log(probability)*advantage-.01*entropy;
 return <div className="sim-panel"><p className="sim-eyebrow">WORKED ROLLOUT / A3C</p><h3>Turn three rewards into an advantage</h3><p>One worker observes rewards [r₀, −0.1, 1]. Walk backward from its final value estimate to compute returns. The actor example uses a binary policy and an entropy coefficient of 0.01.</p>
  <div className="sl-controls"><Range label="First reward r₀" value={first} set={setFirst} min={-1} max={1}/><Range label="Discount γ" value={gamma} set={setGamma} min={0} max={1} step={.01}/><Range label="Final bootstrap V(s₃)" value={bootstrap} set={setBootstrap} min={-1} max={2}/><Range label="Starting baseline V(s₀)" value={baseline} set={setBaseline} min={-1} max={2}/><Range label="Probability of selected action" value={probability} set={setProbability} min={.01} max={.99} step={.01}/></div>
  <label className="sl-check"><input type="checkbox" checked={terminal} onChange={e=>setTerminal(e.target.checked)}/>The final state is truly terminal (zero bootstrap)</label>
  <div className="sl-return-strip">{returns.map((value,i)=><div key={i}><span>Time {i} · reward {rewards[i].toFixed(2)}</span><strong>R{i} = {value.toFixed(4)}</strong></div>)}</div>
  <Stats values={[["Starting advantage",advantage.toFixed(4)],["Actor + entropy loss",actorLoss.toFixed(4)],["Value loss at t=0",(.5*advantage**2).toFixed(4)]]}/>
  <p>{advantage>0?"A positive advantage supports increasing the selected action's probability in the policy-gradient term.":advantage<0?"A negative advantage supports decreasing the selected action's probability in the policy-gradient term.":"At zero advantage, this sample's policy-gradient term vanishes; the entropy term can still act."}</p>
  <p className="sim-note">Returns and advantages are treated as fixed targets in their respective loss gradients. This panel computes one worker&apos;s arithmetic; it does not launch asynchronous workers or simulate optimizer races.</p>
 </div>;
}
