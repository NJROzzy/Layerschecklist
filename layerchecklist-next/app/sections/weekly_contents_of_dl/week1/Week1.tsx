import WeeklyLesson from "../WeeklyLesson";
import { dlRoadmap } from "../roadmap";

const topics = [
  {
    title: "Start With One Neuron",
    explanation: "A neuron multiplies each input by a weight, adds a bias, and applies an activation. Weights control how inputs contribute; the bias shifts the result. The activation lets the neuron contribute a nonlinear transformation.",
    code: `from math import tanh

x = 2.0
w, b = 0.3, 0.1
z = w * x + b
h = tanh(z)
print(round(h, 4))  # 0.6044`,
    check: "Which quantities come from the example, and which quantities can training change?",
  },
  {
    title: "Compose a Forward Pass",
    explanation: "Feed the hidden activation into a second weighted sum. This tiny regression network has one input, one hidden neuron, and one linear output. A forward pass calculates a prediction using the current parameters; it does not update them.",
    code: `# Same hidden neuron as above:
# h = tanh(w1 * x + b1)

w2, b2 = -0.5, 0.2
prediction = w2 * h + b2

# x -> weighted sum -> tanh
#   -> weighted sum -> prediction`,
    check: "Why does the output use a linear function here? What output would a binary classifier need instead?",
  },
  {
    title: "Measure Error With a Loss",
    explanation: "For this regression example, use half the squared error. It is zero when the prediction equals the target, and its derivative with respect to the prediction is simply prediction minus target. The factor of one half makes that derivative easier to read.",
    code: `target = 1.0
error = prediction - target
loss = 0.5 * error ** 2

# d(loss) / d(prediction)
grad_prediction = error`,
    check: "A loss is a number. A gradient tells us how that number changes. Why do we need both?",
  },
  {
    title: "Backpropagation Is the Chain Rule",
    explanation: "Follow the calculation backward. The output depends on the hidden activation, and the hidden activation depends on its weighted input. Multiply those local derivatives to find how each parameter affects the loss. Compute every gradient using the same forward pass before changing any weights.",
    code: `# Gradients for the output parameters:
grad_w2 = error * h
grad_b2 = error

# tanh derivative: 1 - h**2
grad_z = error * w2 * (1 - h ** 2)

# Gradients for the hidden parameters:
grad_w1 = grad_z * x
grad_b1 = grad_z`,
    check: "Why must grad_z use the old w2 rather than a weight that has already been updated?",
  },
  {
    title: "Train the Network Without Autograd",
    explanation: "Run this complete example with Python. Gradient descent subtracts the learning rate times each gradient. Repeating the forward pass, backward pass, and update reduces the error on this one example. This demonstrates the training mechanics; one example cannot establish that a model generalizes.",
    code: `from math import tanh

x, target = 2.0, 1.0
w1, b1 = 0.3, 0.1
w2, b2 = -0.5, 0.2
learning_rate = 0.1

for step in range(200):
    h = tanh(w1 * x + b1)
    prediction = w2 * h + b2
    error = prediction - target

    grad_w2 = error * h
    grad_b2 = error
    grad_z = error * w2 * (1 - h ** 2)
    grad_w1 = grad_z * x
    grad_b1 = grad_z

    w1 -= learning_rate * grad_w1
    b1 -= learning_rate * grad_b1
    w2 -= learning_rate * grad_w2
    b2 -= learning_rate * grad_b2

prediction = w2 * tanh(w1 * x + b1) + b2
print("Prediction:", round(prediction, 4))
print("Loss:", 0.5 * (prediction - target) ** 2)`,
    check: "Which lines compute gradients, and which lines actually learn by updating parameters?",
  },
];

export default function Week1() {
  return (
    <WeeklyLesson
      week={1}
      title={dlRoadmap[1].title}
      introduction="Build a tiny neural network from arithmetic and derivatives. Start with a neuron, connect it to an output, measure the error, and work backward to update every parameter. The examples use Python's standard library."
      coreIdea="A neural network is a composition of parameterized functions. Learning means calculating how the loss changes with each parameter, then using that information to adjust the parameters."
      topics={topics}
      exercise="Run the complete training example, then reset the parameters and compare learning rates of 0.01, 0.1, and 1.0. Record the starting and final losses. Next, perturb w1 slightly before training: does the change in loss agree with the sign of its calculated gradient?"
      questions={[
        "What are weights, biases, and activations responsible for?",
        "What changes during the forward pass, backward pass, and update?",
        "How does the chain rule connect an early weight to the final loss?",
        "Why do we calculate all gradients before updating any parameter?",
        "Why does a low loss on one training example say little about new examples?",
      ]}
      outcome="You should be able to trace a prediction by hand, derive the gradients for this two-layer network, and explain every line of its training loop."
      source={{ title: "Deep Learning — Deep Feedforward Networks", href: "https://www.deeplearningbook.org/contents/mlp.html" }}
    />
  );
}
