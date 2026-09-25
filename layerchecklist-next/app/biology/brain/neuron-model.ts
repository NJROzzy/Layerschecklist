export type VoltageSample={time:number;voltage:number};
/** A teaching model, with mV, ms, MΩ and nA units. It does not simulate ion-channel gating. */
export function simulateNeuron(excitation:number,inhibition:number) {
 const dt=.2,rest=-70,threshold=-50,reset=-65,tau=20,resistance=10;
 let voltage=rest,refractoryUntil=-1;
 const samples:VoltageSample[]=[],spikes:number[]=[];
 for(let step=0;step<=1500;step++) {
  const time=step*dt,current=time>=20&&time<220?excitation-inhibition:0;
  if(time<refractoryUntil) voltage=reset;
  else {
   voltage+=dt*(-(voltage-rest)+resistance*current)/tau;
   if(voltage>=threshold) {
    spikes.push(time);samples.push({time,voltage:30});
    voltage=reset;refractoryUntil=time+3;continue;
   }
  }
  samples.push({time,voltage});
 }
 return {samples,spikes,rate:spikes.length/.2,netCurrent:excitation-inhibition};
}
export function conductionDelay(distanceMeters:number,myelinated:boolean) {
 // Chosen illustrative speeds, not a fit to a particular axon.
 return 1000*distanceMeters/(myelinated?50:2);
}
