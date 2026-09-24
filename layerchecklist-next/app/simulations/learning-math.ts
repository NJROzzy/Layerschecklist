export const clampAction = (value: number) => Math.max(-1, Math.min(1, value));
export function ddpgStep(action:number, goal:number, reward:number, gamma:number, rate:number, tau:number, terminated:boolean) {
 const oldTargetAction = .1;
 const targetQ = -((oldTargetAction-goal)**2);
 const bellmanTarget = reward + (terminated ? 0 : gamma*targetQ);
 const actionGradient = 2*(goal-action);
 const updatedAction = clampAction(action + rate*actionGradient);
 return {targetQ,bellmanTarget,actionGradient,updatedAction,targetAction:(1-tau)*oldTargetAction+tau*updatedAction};
}
export function rolloutReturns(rewards:number[],gamma:number,bootstrap:number,terminated:boolean) {
 const returns = Array(rewards.length).fill(0) as number[];
 let future=terminated?0:bootstrap;
 for(let i=rewards.length-1;i>=0;i--) {future=rewards[i]+gamma*future;returns[i]=future;}
 return returns;
}
const features = (v:number) => [v,...[.5,1,1.5,2,3,4,6].map(scale=>Math.tanh(scale*v))];
export const residualPrediction=(v:number,weights:number[])=>features(v).reduce((s,h,i)=>s+h*weights[i],0);
export function fitResidual(drag:number) {
 const samples=Array.from({length:49},(_,i)=>{
  const v=-2+i/12;
  return {h:features(v),y:-(drag-.1)*v-.3*Math.tanh(3*v)+.004*Math.sin(i*2.7)};
 });
 const weights=Array(8).fill(0) as number[];
 for(let step=0;step<900;step++) {
  const gradient=Array(8).fill(0) as number[];
  for(const {h,y} of samples) {
   const error=h.reduce((s,v,i)=>s+v*weights[i],0)-y;
   h.forEach((v,i)=>{gradient[i]+=2*error*v/samples.length;});
  }
  weights.forEach((_,i)=>{weights[i]-=.025*gradient[i];});
 }
 return weights;
}
export function hybridTrajectories(drag:number,weights:number[]) {
 const run=(kind:"reference"|"physics"|"hybrid")=>{
  let x=1,v=0;const values=[x];
  for(let step=0;step<800;step++) {
   let acceleration=-x-.1*v;
   if(kind==="reference") acceleration=-x-drag*v-.3*Math.tanh(3*v);
   if(kind==="hybrid") acceleration+=residualPrediction(v,weights);
   v+=.01*acceleration;x+=.01*v;values.push(x);
  }
  return values;
 };
 const reference=run("reference"),physics=run("physics"),hybrid=run("hybrid");
 const rmse=(values:number[])=>Math.sqrt(values.reduce((s,v,i)=>s+(v-reference[i])**2,0)/values.length);
 return {reference,physics,hybrid,physicsError:rmse(physics),hybridError:rmse(hybrid)};
}
