import WeeklyLesson from "../WeeklyLesson";
import { dlRoadmap } from "../roadmap";

const topics = [
  {
    title: "Depth Needs Nonlinearity",
    explanation: "Depth adds successive transformations. If every layer is affine, their composition is still one affine transformation. Nonlinear activations between layers allow the representation to change in ways a single affine map cannot express. Extra depth can be useful, but it does not guarantee better results.",
    code: `# Two affine layers:
# h = W1 @ x + b1
# y = W2 @ h + b2

# Substitute h:
# y = (W2 @ W1) @ x + (W2 @ b1 + b2)

# With an activation between them:
# y = W2 @ tanh(W1 @ x + b1) + b2
# This generally cannot collapse the same way.`,
    check: "If you stack ten linear layers without activations, have you expanded the set of affine functions you can represent?",
  },
  {
    title: "Compare Activations and Their Slopes",
    explanation: "Sigmoid maps values into (0, 1), while tanh maps them into (-1, 1). Both become nearly flat for large input magnitudes. ReLU is zero for negative inputs and has slope one for positive inputs. Its derivative is undefined at zero; implementations commonly choose zero there.",
    code: `from math import exp, tanh

for z in [-6.0, -1.0, 0.0, 1.0, 6.0]:
    sigmoid = 1 / (1 + exp(-z))
    sigmoid_slope = sigmoid * (1 - sigmoid)
    tanh_slope = 1 - tanh(z) ** 2
    relu_slope = 1.0 if z > 0 else 0.0
    print(z, round(sigmoid_slope, 4),
          round(tanh_slope, 4), relu_slope)`,
    check: "Which activations can have a very small slope even when their outputs are far from zero?",
  },
  {
    title: "Gradients Can Shrink or Grow With Depth",
    explanation: "Backpropagation repeatedly multiplies local derivatives. In a scalar chain, factors below one can shrink the gradient, while factors above one can amplify it. In a network, weight matrices and activation derivatives both matter; looking only at the activation does not predict the full behaviour.",
    code: `# Illustrative scalar products:
for depth in [1, 5, 10, 20]:
    shrinking = 0.25 ** depth
    growing = 1.5 ** depth
    print(depth, shrinking, growing)

# These are local-derivative products,
# not a prediction for every neural network.`,
    check: "What happens to an early layer's update when its gradient is tiny? What can a very large gradient do?",
  },
  {
    title: "Initialization and Inactive ReLUs",
    explanation: "Weight scale affects both activations and gradients. He initialization uses a variance of 2/fan_in as a useful starting point for ReLU layers. This is not a guarantee of stable training. A ReLU unit that remains negative for every training input gets no gradient through that activation and may stay inactive.",
    code: `from math import sqrt
from random import Random

rng = Random(0)
fan_in, fan_out = 16, 8
std = sqrt(2 / fan_in)

# Rows are output neurons; columns are inputs.
weights = [
    [rng.gauss(0, std) for _ in range(fan_in)]
    for _ in range(fan_out)
]`,
    check: "Why is 'ReLU solves vanishing gradients' too strong a claim?",
  },
  {
    title: "Inspect a Tiny Chain Yourself",
    explanation: "This experiment computes the output and its derivative with respect to the input through a scalar chain. Each layer has the same weight and no bias. It isolates the effect of depth, weight scale, and activation; a full network has many interacting paths and parameters.",
    code: `from math import tanh

def chain(depth, weight, activation, x=0.1):
    gradient = 1.0
    for _ in range(depth):
        z = weight * x
        if activation == "tanh":
            x = tanh(z)
            slope = 1 - x ** 2
        else:  # ReLU, with slope 0 at z = 0
            x = max(0.0, z)
            slope = 1.0 if z > 0 else 0.0
        gradient *= weight * slope
    return x, gradient

for activation in ["tanh", "relu"]:
    for depth in [1, 5, 20]:
        output, gradient = chain(depth, 1.5, activation)
        print(activation, depth,
              round(output, 6), round(gradient, 6))`,
    check: "Why can the same weight scale produce different gradient behaviour with tanh and ReLU?",
  },
];

export default function Week2() {
  return (
    <WeeklyLesson
      week={2}
      title={dlRoadmap[2].title}
      introduction="Week 1 followed gradients through a tiny network. Now extend that calculation through more layers and see how activation choices and weight scales affect the signal that reaches the early layers."
      coreIdea="Depth changes both what a network can represent and how gradients travel through it. A useful architecture needs enough expressive power and a training signal that can reach its parameters."
      topics={topics}
      exercise="Run the scalar-chain experiment with weights 0.5, 1.0, and 1.5. Compare depths 1, 5, and 20, then repeat with a negative input. Predict the ReLU gradient before running each case. Explain the results using the product of the weight and activation slope at every layer."
      questions={[
        "Why do affine layers collapse without nonlinear activations between them?",
        "What does saturation mean for sigmoid and tanh derivatives?",
        "How do weights and activation derivatives both influence gradient size?",
        "When can a ReLU unit stop receiving a useful gradient?",
        "Why does adding depth sometimes make optimization harder?",
      ]}
      outcome="You should be able to reason about a gradient as a product of local derivatives, compare activation functions, and investigate weight scale and inactive units when a deeper model is difficult to train."
      source={{ title: "Deep Learning — Optimization for Training Deep Models", href: "https://www.deeplearningbook.org/contents/optimization.html" }}
    />
  );
}
