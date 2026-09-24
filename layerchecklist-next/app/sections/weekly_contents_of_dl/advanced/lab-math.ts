export function softmax(scores: number[], temperature = 1): number[] {
  const max = Math.max(...scores);
  const weights = scores.map(s => s === -Infinity ? 0 : Math.exp((s - max) / temperature));
  const total = weights.reduce((a,b) => a+b,0);
  return weights.map(w => total ? w/total : 0);
}
export function gaussianKL(mu: number, logvar: number) {
  return .5 * (mu*mu + Math.exp(logvar) - 1 - logvar);
}
export function lstmStep(previous: number, forget: number, input: number, candidate: number, output: number) {
  const cell = forget*previous + input*candidate;
  return { cell, hidden: output*Math.tanh(cell) };
}
export function diffuse(clean: number, noise: number, alphaBar: number) {
  return Math.sqrt(alphaBar)*clean + Math.sqrt(1-alphaBar)*noise;
}
export function estimateClean(noisy: number, predictedNoise: number, alphaBar: number) {
  return (noisy-Math.sqrt(1-alphaBar)*predictedNoise)/Math.sqrt(alphaBar);
}
export function tdUpdate(q: number, reward: number, next: number, gamma: number, rate: number, terminated: boolean) {
  const target = reward + (terminated ? 0 : gamma*next);
  return { target, error: target-q, updated: q+rate*(target-q) };
}
export function calibration(logits: number[][], labels: number[], temperature: number, binCount = 5) {
  const bins = Array.from({length:binCount}, () => ({count:0, confidence:0, correct:0}));
  let nll=0, correct=0;
  logits.forEach((row,i) => {
    const p=softmax(row,temperature), confidence=Math.max(...p);
    const hit=Number(p.indexOf(confidence)===labels[i]);
    nll-=Math.log(Math.max(p[labels[i]],1e-15)); correct+=hit;
    const bin=bins[Math.min(binCount-1,Math.floor(confidence*binCount))];
    bin.count++; bin.confidence+=confidence; bin.correct+=hit;
  });
  const rows=bins.map((b,i) => ({lower:i/binCount,upper:(i+1)/binCount,count:b.count,confidence:b.count?b.confidence/b.count:0,accuracy:b.count?b.correct/b.count:0}));
  return {bins:rows,nll:nll/labels.length,accuracy:correct/labels.length,ece:rows.reduce((s,b)=>s+b.count/labels.length*Math.abs(b.accuracy-b.confidence),0)};
}
