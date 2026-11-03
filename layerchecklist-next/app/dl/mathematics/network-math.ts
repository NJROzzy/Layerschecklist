export type NetworkInputs = {
  input: number;
  target: number;
  weight1: number;
  bias1: number;
  weight2: number;
  bias2: number;
  rate: number;
};

export const initialNetwork: NetworkInputs = {
  input: 1, target: 1, weight1: .5, bias1: .1, weight2: -.7, bias2: .2, rate: .1,
};

export function traceNetwork(values: NetworkInputs) {
  const { input, target, weight1, bias1, weight2, bias2, rate } = values;
  const activation = weight1 * input + bias1;
  const hidden = Math.tanh(activation);
  const prediction = weight2 * hidden + bias2;
  const error = prediction - target;
  const hiddenDelta = error * weight2 * (1 - hidden * hidden);
  const gradients = {
    weight1: hiddenDelta * input,
    bias1: hiddenDelta,
    weight2: error * hidden,
    bias2: error,
  };
  const next = {
    weight1: weight1 - rate * gradients.weight1,
    bias1: bias1 - rate * gradients.bias1,
    weight2: weight2 - rate * gradients.weight2,
    bias2: bias2 - rate * gradients.bias2,
  };
  const nextHidden = Math.tanh(next.weight1 * input + next.bias1);
  const nextPrediction = next.weight2 * nextHidden + next.bias2;
  return {
    activation, hidden, prediction, error, hiddenDelta,
    loss: .5 * error * error,
    gradients, next, nextPrediction,
    nextLoss: .5 * (nextPrediction - target) ** 2,
  };
}
