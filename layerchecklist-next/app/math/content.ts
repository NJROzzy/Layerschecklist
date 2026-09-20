// Keep these two in step: reviewedOnISO fills the <time datetime> attribute.
export const reviewedOnISO = "2026-09-19";
export const reviewedOn = "September 19, 2026";

export const chapters = [
  ["numbers", "The number systems"], ["variables", "Variables"], ["foundations", "Sets, logic & graphs"], ["algebra", "Algebra"],
  ["functions", "Functions & graphs"], ["linear-algebra", "Linear algebra"], ["calculus", "Calculus"],
  ["probability", "Probability"], ["statistics", "Statistics & evidence"], ["optimization", "Optimization"], ["numerics", "Numerical stability"], ["combinations", "What combines into AI"],
  ["world", "The same math, elsewhere"], ["frontier", "Where the work is now"], ["first-steps", "Your first steps"],
] as const;

/**
 * Each number system exists because an earlier one could not answer a question
 * people already knew how to ask. That is the honest reason they were invented,
 * and it is a far better order to learn them in than a list of definitions.
 */
export const numberSystems = [
  {
    symbol: "ℕ", name: "Natural numbers", equation: "x + 3 = 5", solution: "x = 2",
    contents: "0, 1, 2, 3, 4, …",
    born: "Counting. How many sheep, how many days, how many examples in the batch.",
    breaks: "x + 5 = 3 has no answer here. You cannot take five from three and still be counting things.",
    inAI: "Array indices, batch sizes, token counts, the number of layers. Anything you could point at and tally.",
  },
  {
    symbol: "ℤ", name: "Integers", equation: "x + 5 = 3", solution: "x = −2",
    contents: "…, −2, −1, 0, 1, 2, …",
    born: "Debt, and direction. Below zero becomes a place you can actually be.",
    breaks: "2x = 1 has no answer here. Splitting a whole is not something integers can express.",
    inAI: "A weight can be negative, and that is the whole point: a negative weight says “this evidence argues against.”",
  },
  {
    symbol: "ℚ", name: "Rational numbers", equation: "2x = 1", solution: "x = 1/2",
    contents: "Every ratio a/b of integers, with b ≠ 0.",
    born: "Sharing and measuring. Ratios, proportions, percentages, probabilities.",
    breaks: "x² = 2 has no answer here — and that is a theorem, not a gap in our cleverness. No fraction squares to 2.",
    inAI: "Learning rates, dropout probabilities, train/test proportions. Probabilities can also be irrational real numbers; rational values are common convenient settings.",
  },
  {
    symbol: "ℝ", name: "Real numbers", equation: "x² = 2", solution: "x = ±√2 ≈ ±1.41421356…",
    contents: "Every point on an unbroken line, rationals and irrationals together.",
    born: "Length, and limits. The diagonal of a unit square is a real length with no fractional name.",
    breaks: "x² = −1 has no answer here. No real number squares to something negative.",
    inAI: "Almost everything. Weights, activations, losses and gradients are modelled as real numbers — and calculus needs the line to have no holes in it.",
  },
  {
    symbol: "ℂ", name: "Complex numbers", equation: "x² = −1", solution: "x = ±i",
    contents: "a + bi, where i² = −1.",
    born: "Rotation and waves. Multiplying by i turns the plane a quarter turn; that is what i actually does.",
    breaks: "Nothing, for algebra: every non-constant polynomial has a root here. This is algebraic closure; it does not mean every kind of equation has a solution.",
    inAI: "Less common on the surface, central underneath: Fourier analysis, signal processing, the eigenvalues that describe whether a recurrent system explodes or decays.",
  },
];

export const algebraMoves = [
  { move: "Add the same thing to both sides", why: "The two sides were equal; adding equally to each keeps them equal.", use: "Move a term across the equals sign." },
  { move: "Subtract the same thing from both sides", why: "Same reason, running backwards.", use: "Strip away a bias term to isolate what multiplies x." },
  { move: "Multiply both sides by the same non-zero number", why: "Scaling both sides by the same factor preserves equality. Zero is excluded because it destroys information: 0 = 0 is true of everything.", use: "Clear a fraction." },
  { move: "Divide both sides by the same non-zero number", why: "The inverse of the move above.", use: "Turn 3x into x." },
  { move: "Replace anything with something equal to it", why: "Substitution. If u = 2x + 1, then anywhere you see 2x + 1 you may write u.", use: "This one move is what makes the chain rule readable." },
];

export const calculusSteps = [
  { title: "A rate you already understand", text: "Drive 120 km in 2 hours and your average speed is 60 km/h. You divided a change in position by a change in time. Every derivative you will ever meet is that same division.", formula: "average rate = change in output ÷ change in input" },
  { title: "The awkward question", text: "What is your speed at one instant? In an instant, no time passes and you travel no distance, so the division becomes 0 ÷ 0 — which is not a number. The question is good; the arithmetic is not ready for it.", formula: "0 ÷ 0 is undefined" },
  { title: "Do not divide by zero. Shrink instead.", text: "Measure over an interval of width h, which is a perfectly ordinary division. Then ask what the answer approaches as h gets smaller. Not what it is at h = 0 — what it is heading towards.", formula: "(f(x + h) − f(x)) ÷ h" },
  { title: "That destination is the derivative", text: "For f(x) = x², the quotient works out to exactly 2x + h. There is no mystery about where it is going: as h shrinks, it heads to 2x. That limit is the slope of the curve at that point.", formula: "f′(x) = lim(h→0) (f(x + h) − f(x)) / h" },
  { title: "Read it as sensitivity", text: "f′(x) = 2x says: nudge the input near x, and the output moves about 2x times as much. At x = 3 the output moves six times as fast as the input. That is the reading that matters for AI.", formula: "f′(x) ≈ (output nudge) ÷ (input nudge)" },
  { title: "Many inputs: hold the rest still", text: "A loss depends on millions of weights. Ask about one at a time: nudge w₇ and hold everything else fixed. That is a partial derivative. Collect one per weight and you have the gradient.", formula: "∇L = (∂L/∂w₁, ∂L/∂w₂, …, ∂L/∂wₙ)" },
  { title: "The gradient points uphill", text: "The gradient vector aims in the direction of steepest increase, and its length says how steep. To reduce the loss, step the other way. That single sentence is gradient descent, and the whole of training.", formula: "θ ← θ − α∇L(θ)" },
];

export type Combination = { part: string; what: string; concepts: string[]; detail: string };
export const combinations: Combination[] = [
  { part: "One neuron", what: "Turns several inputs into one number.", concepts: ["Variables", "Multiplication", "Addition", "Functions"], detail: "w₁x₁ + w₂x₂ + … + b is arithmetic with named quantities. Nothing more advanced is happening at this level." },
  { part: "A layer", what: "Runs thousands of neurons at once.", concepts: ["Linear algebra", "Functions"], detail: "Stack the neurons' weights as rows of a matrix W and the layer is Wx + b — one matrix–vector product. This is why linear algebra, not calculus, is the first thing to learn: it is the language the forward pass is written in." },
  { part: "A nonlinearity", what: "Lets depth actually buy you something.", concepts: ["Functions", "Composition"], detail: "Composing two linear maps gives another linear map, so a network without nonlinearity is a single layer wearing a costume. ReLU or GELU between layers is what makes depth mean anything." },
  { part: "A loss", what: "Turns “how wrong” into one number.", concepts: ["Probability", "Information theory", "Logarithms"], detail: "Cross-entropy is −log(probability assigned to the right answer). The log is not decoration: it turns multiplying independent probabilities into adding, and it punishes confident mistakes without limit." },
  { part: "Training", what: "Improves the parameters.", concepts: ["Calculus", "Chain rule", "Linear algebra", "Optimization", "Probability"], detail: "Backpropagation is the chain rule applied to a composition of matrix operations; mini-batching makes each gradient a random sample of the true one, which is where probability enters the loop." },
  { part: "Attention", what: "Lets a position read from other positions.", concepts: ["Linear algebra", "Dot products", "Probability", "Exponentials"], detail: "Score every pair with a dot product, divide by √d to keep the scores from saturating, softmax them into a probability distribution, then take a weighted average of values. Four ideas, all from this page." },
  { part: "Embeddings and retrieval", what: "Makes meaning comparable.", concepts: ["Vectors", "Inner products", "Norms", "Geometry"], detail: "Text becomes a vector; “related” becomes an angle between two vectors. Cosine similarity is the dot product with the lengths divided out." },
  { part: "Convolution", what: "Recognises a pattern anywhere in an image.", concepts: ["Linear algebra", "Symmetry", "Signal processing"], detail: "Sliding one small filter across the whole image bakes in an assumption: a feature means the same thing wherever it appears. That assumption is a symmetry, and symmetry is group theory." },
  { part: "Diffusion models", what: "Generates an image from noise.", concepts: ["Probability", "Stochastic processes", "Differential equations", "Calculus"], detail: "Add noise gradually until the data is unrecognisable, learn to estimate the gradient of the log-density at each noise level, then run the process backwards. Generation becomes solving a differential equation." },
  { part: "Numerical stability", what: "Stops the arithmetic from ruining the model.", concepts: ["Real analysis", "Floating-point arithmetic", "Logarithms"], detail: "log-sum-exp tricks, gradient clipping and mixed precision exist because the machine holds approximations of real numbers, not real numbers. Ignore this layer and your loss becomes NaN at three in the morning." },
];

export const worldEchoes = [
  { concept: "The derivative", ai: "How much the loss moves when a weight moves.", world: "Velocity is the derivative of position; acceleration is the derivative of velocity. Marginal cost in economics, reaction rate in chemistry, the slope of an epidemic curve — all the same operation." },
  { concept: "Gradient descent", ai: "Step downhill on the loss surface until the model stops improving.", world: "Water finds the valley. A soap film pulls itself to minimal area. Light takes the fastest path. Physics is full of systems that settle into a minimum, and the mathematics is the same mathematics." },
  { concept: "Eigenvalues", ai: "Principal components, spectral norms, whether a recurrent network explodes or forgets.", world: "The frequencies a bridge will resonate at, the stable modes of a vibrating drum, the ranking behind PageRank, the long-run state of a Markov chain." },
  { concept: "The exponential and the log", ai: "Softmax, cross-entropy, log-likelihood, learning-rate decay.", world: "Compound interest, radioactive half-life, bacterial growth, the decibel scale, the Richter scale. Wherever a quantity's rate of change is proportional to itself, e shows up." },
  { concept: "Probability distributions", ai: "The model outputs a distribution; the loss is its surprise at the truth.", world: "Statistical mechanics describes a gas by a distribution over states rather than by tracking every molecule. Insurance, polling, quality control and quantum mechanics all take that same step." },
  { concept: "Convolution", ai: "The core operation of a vision network.", world: "A camera blurring an image, a room adding echo to a sound, a moving average smoothing a noisy time series. All one operation: slide, multiply, add." },
  { concept: "Optimal transport", ai: "Wasserstein distances between distributions; the transport view of diffusion models.", world: "Its original question, posed in 1781, was how to move a pile of earth into a new shape with the least total effort. The logistics problem and the generative-model problem are the same problem." },
];

/**
 * Open questions, with the mathematical level each one actually asks of you.
 * These are directions of active work rather than a scoreboard; the citations are
 * the durable papers that framed each question.
 */
export const frontier = [
  {
    area: "Why does an overparameterised network generalise at all?",
    level: "Entry: undergraduate probability and statistics. Frontier: high-dimensional probability, concentration inequalities, PAC-Bayes.",
    text: "A network with far more parameters than training examples can fit random labels perfectly — so classical capacity bounds cannot explain why the same network generalises on real labels. Test error can even fall again after the interpolation point, which the classical bias–variance picture does not predict.",
    source: "Zhang et al., Rethinking generalization", href: "https://arxiv.org/abs/1611.03530",
  },
  {
    area: "What is gradient descent actually doing in a non-convex landscape?",
    level: "Entry: multivariable calculus. Frontier: dynamical systems, stochastic differential equations, random matrix theory.",
    text: "There is no theorem promising that SGD finds a good minimum of a deep network's loss, yet it reliably does. Training also tends to drift to the boundary of stability rather than settling somewhere comfortable, which ordinary optimisation theory does not predict.",
    source: "Cohen et al., Edge of Stability", href: "https://arxiv.org/abs/2103.00065",
  },
  {
    area: "Which limits of a network can we actually solve exactly?",
    level: "Entry: linear algebra and calculus. Frontier: kernel methods, functional analysis, tensor programs.",
    text: "As width goes to infinity, training behaves like a fixed kernel method — the Neural Tangent Kernel — which is exactly solvable. It is also the wrong regime for explaining feature learning, so the open work is finding limits that stay tractable while keeping what matters.",
    source: "Jacot et al., Neural Tangent Kernel", href: "https://arxiv.org/abs/1806.07572",
  },
  {
    area: "Why are scaling laws so clean, and what sets the exponents?",
    level: "Entry: logarithms and curve fitting. Frontier: statistical physics, approximation theory, information theory.",
    text: "Loss falls as a power law in parameters, data and compute across many orders of magnitude, and those curves are accurate enough to plan training runs against. What mechanism produces a power law, and what determines its exponent, is not settled.",
    source: "Hoffmann et al., Training compute-optimal LLMs", href: "https://arxiv.org/abs/2203.15556",
  },
  {
    area: "What can a Transformer represent, and what does it learn in context?",
    level: "Entry: linear algebra and probability. Frontier: approximation theory, circuit complexity, learning theory.",
    text: "Universal approximation says a large enough network can represent almost anything, which is nearly useless as engineering guidance — it says nothing about what training will find. Sharper work asks what attention can compute at a given depth and width, and why examples in a prompt change behaviour without changing a single weight.",
    source: "von Oswald et al., Transformers learn in-context by gradient descent", href: "https://arxiv.org/abs/2212.07677",
  },
  {
    area: "Can generative modelling be stated as transport between distributions?",
    level: "Entry: probability and calculus. Frontier: optimal transport, measure theory, SDEs.",
    text: "Diffusion and flow-matching models are increasingly described as learning to move one probability distribution onto another along a path. That framing has produced faster samplers and cleaner objectives, and connects image generation to a problem first posed about moving piles of earth.",
    source: "Song et al., Score-based generative modeling through SDEs", href: "https://arxiv.org/abs/2011.13456",
  },
  {
    area: "How much does symmetry buy you?",
    level: "Entry: linear algebra. Frontier: group and representation theory, differential geometry.",
    text: "Convolution works because a cat is a cat wherever it appears in the frame. Geometric deep learning takes that observation seriously and derives architectures from the symmetries of the data — grids, graphs, groups, manifolds — rather than discovering them by trial.",
    source: "Bronstein et al., Geometric Deep Learning", href: "https://arxiv.org/abs/2104.13478",
  },
  {
    area: "What are the features, mathematically?",
    level: "Entry: linear algebra. Frontier: sparse coding, compressed sensing, high-dimensional geometry.",
    text: "Interpretability work increasingly treats a network's internal state as a sparse combination of directions, with more features packed in than there are dimensions to hold them. Recovering those directions is a dictionary-learning problem, and how far the linear picture holds is open.",
    source: "Elhage et al., Toy Models of Superposition", href: "https://transformer-circuits.pub/2022/toy_model/index.html",
  },
];

export const firstSteps = [
  { step: "Get comfortable rearranging", detail: "Before anything else: move terms across an equals sign without hesitating, handle fractions, and read powers and logs as operations rather than decoration. This is the layer everything else silently assumes.", signal: "You can rearrange y = wx + b to solve for w without thinking about it." },
  { step: "Learn linear algebra before calculus", detail: "This is the order people get wrong. The forward pass of every network is a matrix product; you will read shapes and dot products on day one and derivatives on day thirty. Vectors, dot products, matrix multiplication, and what a matrix does to space.", signal: "Given shapes (32, 784) and (784, 128), you can say what comes out and why." },
  { step: "Then the derivative, slowly", detail: "One idea, approached properly: the derivative as sensitivity of output to input. Then the chain rule, then partial derivatives, then the gradient. Do not detour into integration techniques — they are beautiful and you do not need them yet.", signal: "You can explain why backpropagation is the chain rule, out loud, to someone else." },
  { step: "Add probability", detail: "Random variables, distributions, expectation, independence, conditional probability and Bayes' rule, then likelihood and log-likelihood. This is what turns a score into a loss and a prediction into a claim about uncertainty.", signal: "You can say why cross-entropy loss is −log(p) and why the log belongs there." },
  { step: "Finish with optimisation", detail: "Gradient descent, learning rates, momentum, why convexity matters and why deep learning does not have it. At this point the four earlier layers combine and the training loop stops being a black box.", signal: "You can explain what a learning rate that is too large actually does to the update." },
  { step: "Now go back and be rigorous", detail: "Only once the machinery makes sense is it worth the formal treatment: proofs, epsilon–delta limits, measure-theoretic probability, convex analysis. Doing it in this order means the abstractions land on something you already understand.", signal: "You want the proof, rather than being told you need it." },
];

export const resources = [
  { name: "Mathematics for Machine Learning", kind: "Free book", note: "Deisenroth, Faisal and Ong. Built in exactly the order above, and free as a PDF.", href: "https://mml-book.github.io/" },
  { name: "Essence of linear algebra", kind: "Video series", note: "3Blue1Brown. The geometric intuition first, which is the part textbooks skip.", href: "https://www.3blue1brown.com/topics/linear-algebra" },
  { name: "Essence of calculus", kind: "Video series", note: "3Blue1Brown. Derives the ideas rather than presenting them finished.", href: "https://www.3blue1brown.com/topics/calculus" },
  { name: "MIT 18.06 Linear Algebra", kind: "Full course", note: "Gilbert Strang's lectures, problem sets and exams, all open.", href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
  { name: "MIT 18.01SC Single Variable Calculus", kind: "Full course", note: "A complete first calculus course with worked solutions.", href: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/" },
  { name: "Harvard Stat 110", kind: "Full course", note: "Blitzstein's probability course. Strong on building intuition for distributions.", href: "https://projects.iq.harvard.edu/stat110/home" },
  { name: "Khan Academy Math", kind: "Practice", note: "For filling specific gaps with exercises rather than lectures.", href: "https://www.khanacademy.org/math" },
  { name: "Convex Optimization", kind: "Free book", note: "Boyd and Vandenberghe. The reference once optimisation becomes the thing you care about.", href: "https://web.stanford.edu/~boyd/cvxbook/" },
];

export const glossary = [
  ["Variable", "A name for a quantity that can take different values."],
  ["Parameter", "A value the model adjusts during training, such as a weight."],
  ["Function", "A rule assigning exactly one output to each input."],
  ["Vector", "An ordered list of numbers; also a point or an arrow in space."],
  ["Matrix", "A rectangular grid of numbers; also a function that maps vectors to vectors."],
  ["Dot product", "Multiply matching entries of two vectors and add the results. One number out."],
  ["Norm", "The length of a vector, written ‖v‖."],
  ["Limit", "The value an expression approaches as its input approaches something, whether or not it arrives."],
  ["Derivative", "The rate at which an output changes as an input changes."],
  ["Partial derivative", "The derivative with respect to one variable, holding the others fixed."],
  ["Gradient", "The vector of partial derivatives; under Euclidean geometry it gives steepest first-order increase when nonzero."],
  ["Chain rule", "The derivative of a composition is the product of the derivatives of its stages."],
  ["Integral", "Accumulated total; the reverse of the derivative."],
  ["Random variable", "A quantity whose value depends on the outcome of a random process."],
  ["Expectation", "The long-run average value of a random variable, written E[X]."],
  ["Likelihood", "The data probability mass or density, considered as a function of the parameters."],
  ["Entropy", "The average surprise of a distribution; how uncertain it is."],
  ["Convex", "Bowl-shaped: every local minimum is the global one. Deep networks are not."],
  ["Floating point", "The computer's finite approximation of a real number."],
  ["Eigenvector", "A direction a matrix only stretches, without rotating it; the stretch factor is its eigenvalue."],
];


/* ------------------------------------------------------------------
   Deepening the basics: reference tables the chapters draw on.
------------------------------------------------------------------ */

export const logRules = [
  { rule: "log(ab) = log a + log b", why: "Turns multiplying into adding.", ai: "Why the likelihood of a whole dataset becomes a sum you can differentiate." },
  { rule: "log(a/b) = log a − log b", why: "Turns dividing into subtracting.", ai: "KL divergence is an average of log(p/q), which is why it reads as a difference of surprises." },
  { rule: "log(aⁿ) = n log a", why: "Pulls an exponent down to the front.", ai: "How a product over n tokens becomes an average, and how perplexity is defined." },
  { rule: "log is monotonic", why: "Bigger in, bigger out — always.", ai: "Maximising the log-likelihood and maximising the likelihood give the same answer, so you may always take the log." },
];

export const matrixFacts = [
  { name: "Transpose · Aᵀ", what: "Flip the grid across its diagonal; rows become columns.", ai: "For a linear operation, its backward pass multiplies by the transpose of the forward matrix. That is not a coincidence — it is what the chain rule requires." },
  { name: "Identity · I", what: "Ones down the diagonal, zeros elsewhere. It changes nothing.", ai: "A residual block x + F(x) has Jacobian I + JF, giving an additional gradient route without guaranteeing stable gradients." },
  { name: "Inverse · A⁻¹", what: "For a square matrix, the inverse exists exactly when its columns are linearly independent.", ai: "Solving least squares in closed form; whitening a covariance." },
  { name: "Rank", what: "How many genuinely independent directions the matrix has.", ai: "LoRA freezes the big weight matrix and learns a low-rank update instead — fine-tuning gets cheap because the update turns out not to need full rank." },
  { name: "Determinant · det A", what: "The factor by which volume is scaled. Zero means space gets flattened.", ai: "The change-of-variables term in a normalising flow." },
  { name: "Span & basis", what: "Everything reachable by combining a set, and a smallest set that reaches it all.", ai: "What a layer can represent at all; the axes PCA selects." },
  { name: "Trace · tr A", what: "Sum of the diagonal, which also equals the sum of the eigenvalues.", ai: "Appears throughout matrix calculus identities." },
];

export const normFamily = [
  { name: "L1 · Σ|vᵢ|", shape: "A diamond", ai: "An L1 penalty can favor exact zeros at an optimum. Sparsity depends on the objective, penalty strength and solver." },
  { name: "L2 · √Σvᵢ²", shape: "A circle", ai: "Ordinary length. Weight decay, gradient clipping, the distance behind cosine similarity." },
  { name: "L∞ · max|vᵢ|", shape: "A square", ai: "Worst-case bounds; the radius used in adversarial robustness." },
  { name: "Frobenius · √ΣAᵢⱼ²", shape: "L2, applied to a matrix", ai: "How far two weight matrices are apart; the size of an update." },
];

export const distributions = [
  { name: "Bernoulli", params: "p", what: "One flip of a biased coin.", ai: "Binary classification; a dropout mask on one unit." },
  { name: "Categorical", params: "p₁…p_k", what: "One choice among k options.", ai: "Exactly what softmax emits, and what next-token sampling draws from." },
  { name: "Uniform", params: "a, b", what: "Every value in a range equally likely.", ai: "Shuffling, random initialisation, the raw material of every sampler." },
  { name: "Gaussian", params: "μ, σ²", what: "The bell curve, fixed entirely by its mean and variance.", ai: "Weight initialisation, VAE latents, and the noise a diffusion model adds and then learns to remove." },
  { name: "Poisson", params: "λ", what: "Counts of rare events in a fixed window.", ai: "Modelling arrival counts; some token-frequency models." },
  { name: "Exponential", params: "λ", what: "Waiting time to the next event, with no memory of how long you have waited.", ai: "Survival and time-to-event models." },
  { name: "Beta / Dirichlet", params: "α", what: "Distributions over probabilities themselves.", ai: "Bayesian priors; topic models; Dirichlet routing in some mixtures of experts." },
];

export const optimizerMath = [
  { name: "SGD", update: "θ ← θ − α·g", what: "The plain step. g is the gradient from one mini-batch." },
  { name: "Momentum", update: "v ← βv + g;  θ ← θ − α·v", what: "Accumulate an exponentially weighted sum of past gradients. Consistent directions reinforce one another; β controls how fast history decays." },
  { name: "RMSProp", update: "s ← βs + (1−β)g²;  θ ← θ − α·g/(√s + ε)", what: "Divide by the recent size of each parameter's gradient, so every parameter gets a step scaled to its own terrain." },
  { name: "Adam", update: "both, plus bias correction", what: "Momentum on the gradient and RMSProp on its square, with a correction because both averages start at zero and are biased low early on." },
];
