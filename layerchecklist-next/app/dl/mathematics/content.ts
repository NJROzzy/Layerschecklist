import { foundations } from "./foundations";
import { training } from "./training";
import { architectures } from "./architectures";
import { generative } from "./generative";
import { evaluation } from "./evaluation";

export const chapters = [...foundations, ...training, ...architectures, ...generative, ...evaluation];
export const equationCount = chapters.reduce((total, chapter) => total + chapter.equations.length, 0);

export const notation: [string, string, string][] = [
  ["x, y, ŷ", "input, target, prediction", "An observed input, its target, and a model's prediction; hats mark estimates in this context."],
  ["θ, φ, ψ", "theta, phi, psi", "Learned parameter collections. An activation φ and encoder parameters φ are distinguished in the local definition."],
  ["W, w, b", "weight matrix, weight vector, bias", "Affine transformation parameters; their shapes appear with the relevant equation."],
  ["h, z", "hidden state or representation; pre-activation or latent", "These symbols are reused across architectures. Always read their local definitions."],
  ["L, ℓ, J", "loss, per-example loss, objective", "L may also label total depth, ℓ a layer index, and J a Jacobian. The surrounding equation fixes the meaning."],
  ["N, B, d, C", "dataset size, batch size, feature width, class count", "Common dimension labels. A bin named B or a channel count C has an explicit local definition."],
  ["i, j, k, ℓ, t", "indices", "Select examples, coordinates, layers, or time steps. Summation bounds state the range."],
  ["Σ, ∏", "sum, product", "Add or multiply the indexed terms. These operators do not imply averaging unless a divisor is present."],
  ["∈, ℝ, ℝᵐˣⁿ", "belongs to; real numbers; real matrix", "A matrix in ℝᵐˣⁿ has m rows and n columns."],
  ["ᵀ, ⊙, [a;b]", "transpose, elementwise multiply, concatenate", "Matrix multiplication uses compatible inner dimensions. Elementwise operations require compatible shapes or declared broadcasting."],
  ["∂, ∇, J, H", "partial derivative, gradient, Jacobian, Hessian", "A gradient differentiates a scalar with respect to a vector; a Jacobian differentiates a vector mapping."],
  ["E, ∼, |", "expectation, distributed as, given", "E averages under a stated distribution; z ∼ p means draw z from p; p(y|x) conditions on x."],
  ["p, q, π", "probability models or policy", "p and q denote distributions. π denotes a policy in RL and the circle constant inside Gaussian or trigonometric formulas."],
  ["μ, σ, σ², logvar", "mu, sigma, variance, log variance", "σ also denotes sigmoid when used as an activation. The standard deviation from logvar is exp(logvar/2)."],
  ["η, λ", "eta, lambda", "Learning rate and regularization strength in training. Lambda can instead denote an eigenvalue when stated."],
  ["β, β₁, β₂", "beta coefficients", "VAE KL weight, optimizer retention rates, BatchNorm shift, and diffusion noise variance are separate locally defined quantities."],
  ["γ, τ, ε", "gamma, tau, epsilon", "Examples include RL discount, normalization scale, temperature, target mixing, random noise, numerical stabilizers, and perturbation budgets. They are not interchangeable."],
  ["I, diag(v)", "identity, diagonal matrix", "I preserves a compatible vector. diag(v) puts vector coordinates on a matrix diagonal."],
  ["log, exp, √", "natural logarithm, exponential, square root", "Natural logs use base e; information quantities here are measured in nats."],
  ["‖·‖, |·|", "norm; absolute value or set size", "The norm's subscript determines its geometry. Absolute-value bars around a set give its number of elements."],
  ["argmin, argmax", "minimizing or maximizing argument", "Return an input or index attaining an extremum. min and max instead return the extreme value."],
  ["≈, ∝, ←", "approximately, proportional to, assign", "Approximation need not be exact; proportionality omits a factor; assignment specifies an update."],
  ["stopgrad(v)", "stop gradient", "Use the value v in the forward computation but treat it as constant in that backward path."],
];

export const readings = [
  { title: "Deep Learning, Chapter 6", url: "https://www.deeplearningbook.org/contents/mlp.html", chapters: ["foundations", "prediction", "backpropagation"] },
  { title: "Glorot & Bengio: initialization", url: "https://proceedings.mlr.press/v9/glorot10a.html", chapters: ["stability"] },
  { title: "Adam", url: "https://arxiv.org/abs/1412.6980", chapters: ["optimization"] },
  { title: "Decoupled Weight Decay Regularization", url: "https://arxiv.org/abs/1711.05101", chapters: ["optimization"] },
  { title: "PyTorch Conv2d", url: "https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html", chapters: ["convolution"] },
  { title: "Deep Residual Learning", url: "https://arxiv.org/abs/1512.03385", chapters: ["residual"] },
  { title: "PyTorch LSTM", url: "https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html", chapters: ["recurrence"] },
  { title: "PyTorch GRU", url: "https://docs.pytorch.org/docs/stable/generated/torch.nn.GRU.html", chapters: ["recurrence"] },
  { title: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762", chapters: ["transformers"] },
  { title: "SimCLR", url: "https://arxiv.org/abs/2002.05709", chapters: ["representation"] },
  { title: "Auto-Encoding Variational Bayes", url: "https://arxiv.org/abs/1312.6114", chapters: ["autoencoders"] },
  { title: "Generative Adversarial Nets", url: "https://arxiv.org/abs/1406.2661", chapters: ["adversarial"] },
  { title: "Denoising Diffusion Probabilistic Models", url: "https://arxiv.org/abs/2006.11239", chapters: ["diffusion"] },
  { title: "Classifier-Free Diffusion Guidance", url: "https://arxiv.org/abs/2207.12598", chapters: ["diffusion"] },
  { title: "On Calibration of Modern Neural Networks", url: "https://proceedings.mlr.press/v70/guo17a.html", chapters: ["reliability"] },
  { title: "Axiomatic Attribution for Deep Networks", url: "https://proceedings.mlr.press/v70/sundararajan17a.html", chapters: ["reliability"] },
  { title: "Reinforcement Learning: An Introduction", url: "http://incompleteideas.net/book/the-book-2nd.html", chapters: ["reinforcement"] },
  { title: "DDPG: Continuous Control", url: "https://arxiv.org/abs/1509.02971", chapters: ["reinforcement"] },
  { title: "A3C: Asynchronous Methods", url: "https://arxiv.org/abs/1602.01783", chapters: ["reinforcement"] },
];
