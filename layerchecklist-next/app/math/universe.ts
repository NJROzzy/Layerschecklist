import { additionalConcepts } from "./universe-additions";

/** A curated atlas. Radius is a rough study level, not a prerequisite count. */
export type SectorId =
  | "number" | "algebra" | "analysis" | "geometry" | "linear" | "calculus"
  | "probability" | "statistics" | "information" | "optimization" | "discrete" | "computation"
  | "number-theory" | "foundations" | "dynamics" | "learning";

export const sectors: { id: SectorId; label: string; short: string }[] = [
  { id: "number", label: "Number & arithmetic", short: "Number" },
  { id: "number-theory", label: "Number theory", short: "Number theory" },
  { id: "algebra", label: "Algebra", short: "Algebra" },
  { id: "analysis", label: "Functions & analysis", short: "Functions" },
  { id: "geometry", label: "Geometry & topology", short: "Geometry" },
  { id: "linear", label: "Linear algebra", short: "Linear" },
  { id: "calculus", label: "Calculus", short: "Calculus" },
  { id: "dynamics", label: "Differential equations & dynamics", short: "Dynamics" },
  { id: "probability", label: "Probability", short: "Probability" },
  { id: "statistics", label: "Statistics", short: "Statistics" },
  { id: "information", label: "Information theory", short: "Information" },
  { id: "optimization", label: "Optimization", short: "Optimization" },
  { id: "learning", label: "Learning theory", short: "Learning" },
  { id: "discrete", label: "Discrete mathematics", short: "Discrete" },
  { id: "foundations", label: "Logic & foundations", short: "Foundations" },
  { id: "computation", label: "Computation & numerics", short: "Computation" },
];

export const ringNames = ["Starting ideas", "School foundations", "Core university", "Deeper connections", "Advanced study"];

export type Concept = {
  id: string; name: string; sector: SectorId; ring: 0 | 1 | 2 | 3 | 4;
  what: string;
  ai?: string;      // present when AI leans on it directly
  world?: string;   // present when it describes something outside mathematics
  needs?: string[]; // prerequisite ids, for the dependency lines
  taught?: true;    // accompanied by an actual lesson link
  lesson?: string;
};

const catalogue: Concept[] = [
  // ---- Number & arithmetic -------------------------------------------------
  { id: "counting", name: "Counting", sector: "number", ring: 0, what: "One, two, three. The first abstraction anybody makes.", ai: "Batch sizes, token counts, layer counts, array lengths.", world: "Every tally, census and inventory ever kept.", taught: true },
  { id: "zero", name: "Zero", sector: "number", ring: 0, what: "A number for nothing, and a placeholder that makes place value work.", ai: "Padding, masking, sparsity, the additive identity in every sum.", world: "Took civilisations millennia to accept as a number." },
  { id: "integers", name: "Integers", sector: "number", ring: 0, what: "Counting numbers plus zero and their negatives.", ai: "A negative weight is evidence against — that is the whole point of allowing them.", world: "Debt, temperature below freezing, altitude below sea level.", needs: ["counting", "zero"], taught: true },
  { id: "rationals", name: "Rational numbers", sector: "number", ring: 1, what: "A ratio of two integers with a nonzero denominator.", ai: "Learning rates, dropout probabilities, train/test proportions.", world: "Sharing, measuring, musical intervals.", needs: ["integers"], taught: true },
  { id: "reals", name: "Real numbers", sector: "number", ring: 1, what: "The unbroken line: rationals and irrationals together, no gaps.", ai: "Weights, activations, losses and gradients all live here in the mathematics.", world: "Length, time, temperature — anything that varies smoothly.", needs: ["rationals"], taught: true },
  { id: "complex", name: "Complex numbers", sector: "number", ring: 2, what: "a + bi, where i² = −1. Multiplying by i rotates the plane a quarter turn.", ai: "Under the surface: Fourier methods, and the spectra that say whether a system explodes.", world: "Alternating current, quantum states, wave mechanics.", needs: ["reals"], taught: true },
  { id: "primes", name: "Prime numbers", sector: "number-theory", ring: 1, what: "Positive integers greater than one with exactly two positive divisors: one and themselves.", world: "Integer factorization underlies cryptosystems such as RSA; other public-key systems use different hard problems." },
  { id: "modular", name: "Modular arithmetic", sector: "number-theory", ring: 2, what: "Arithmetic that wraps around, like a clock.", ai: "Hashing, positional encodings that cycle, reproducible pseudorandom streams.", world: "Calendars, clocks, check digits on a barcode.", needs: ["integers"] },
  { id: "exponents", name: "Exponents", sector: "number", ring: 1, what: "Repeated multiplication, then generalised to any power at all.", ai: "Softmax, parameter counts, every mention of scale.", world: "Compound interest, population growth, square-cube scaling.", needs: ["integers"], taught: true },
  { id: "logarithms", name: "Logarithms", sector: "number", ring: 1, what: "The exponent run backwards: what power gives this number?", ai: "Cross-entropy, log-likelihood, perplexity, log-odds, learning-rate schedules.", world: "Decibels, the Richter scale, pH, human perception of brightness and pitch.", needs: ["exponents"], taught: true },
  { id: "magnitude", name: "Orders of magnitude", sector: "number", ring: 1, what: "Reasoning in powers of ten rather than exact figures.", ai: "The only sane way to compare a 7B model with a 700B one.", world: "Estimating anything before you measure it.", needs: ["logarithms"] },
  { id: "infinity", name: "Infinity & cardinality", sector: "number", ring: 3, what: "Some infinities are strictly larger than others.", world: "Cantor's proof that the reals outnumber the integers is one of the great arguments.", needs: ["reals"] },
  { id: "floats", name: "Floating point", sector: "number", ring: 2, what: "The machine's finite, gappy stand-in for the real line.", ai: "float32, bfloat16, mixed precision, and every NaN you will ever debug.", world: "Every scientific simulation carries the same compromise.", needs: ["reals"], taught: true },

  // ---- Algebra -------------------------------------------------------------
  { id: "variable", name: "Variable", sector: "algebra", ring: 0, what: "A name for a quantity you have not fixed yet.", ai: "x for data, w and b for parameters, θ for all of them at once.", world: "The move that lets one statement cover every case.", taught: true },
  { id: "expression", name: "Expression", sector: "algebra", ring: 0, what: "Numbers and variables combined by operations.", ai: "wx + b, the smallest complete piece of a neural network.", needs: ["variable"], taught: true },
  { id: "equation", name: "Equation", sector: "algebra", ring: 1, what: "A claim that two expressions are equal.", ai: "Every line of a paper's method section.", needs: ["expression"], taught: true },
  { id: "rearranging", name: "Rearranging", sector: "algebra", ring: 1, what: "Five legal moves that preserve an equation's truth.", ai: "The skill that decides whether a derivation is readable or opaque.", needs: ["equation"], taught: true },
  { id: "inequality", name: "Inequalities", sector: "algebra", ring: 1, what: "Less than, greater than — bounds rather than exact values.", ai: "Constraints, clipping, and nearly every theoretical guarantee.", world: "Budgets, tolerances, speed limits.", needs: ["equation"] },
  { id: "polynomial", name: "Polynomials", sector: "algebra", ring: 1, what: "Sums of powers of a variable.", ai: "Squared-error loss; the local approximation of everything else.", world: "Trajectories under gravity, area and volume formulas.", needs: ["exponents", "expression"], taught: true },
  { id: "factoring", name: "Factoring", sector: "algebra", ring: 1, what: "Writing an expression as a product, which exposes its roots.", needs: ["polynomial"] },
  { id: "systems", name: "Systems of equations", sector: "algebra", ring: 2, what: "Several equations that must hold at once.", ai: "Solving one is exactly a matrix problem — this is the doorway to linear algebra.", world: "Circuit analysis, chemical balancing, supply and demand.", needs: ["equation"], taught: true },
  { id: "sequences", name: "Sequences & series", sector: "algebra", ring: 2, what: "Ordered lists of numbers, and what their sums approach.", ai: "Training curves, learning-rate schedules, convergence arguments.", world: "Compound growth, fractals, the harmonic series.", needs: ["variable"] },
  { id: "binomial", name: "Binomial theorem", sector: "algebra", ring: 2, what: "How (a + b)ⁿ expands, with combinatorial coefficients.", needs: ["polynomial", "combinatorics"] },
  { id: "group", name: "Groups", sector: "algebra", ring: 3, what: "A set with one operation that composes, inverts and has an identity — the algebra of symmetry.", ai: "Why convolution works, and the foundation of equivariant architectures.", world: "Crystal structures, conservation laws, the Rubik's cube.", needs: ["symmetry"] },
  { id: "ring-field", name: "Rings & fields", sector: "algebra", ring: 4, what: "Structures where addition and multiplication both behave.", needs: ["group"] },
  { id: "galois", name: "Galois theory", sector: "algebra", ring: 4, what: "Which equations can be solved by radicals, answered through symmetry.", world: "The proof that no formula solves the general quintic.", needs: ["group", "ring-field"] },

  // ---- Functions & analysis ------------------------------------------------
  { id: "function", name: "Function", sector: "analysis", ring: 0, what: "A rule giving exactly one output per input.", ai: "A whole network, all of its parameters, is one function.", world: "Any dependable cause-and-effect relationship.", needs: ["variable"], taught: true },
  { id: "domain-range", name: "Domain & range", sector: "analysis", ring: 1, what: "What may go in, and what can come out.", ai: "Why a sigmoid can stand for a probability, and where most NaNs are born.", needs: ["function"], taught: true },
  { id: "composition", name: "Composition", sector: "analysis", ring: 1, what: "Feeding one function's output into the next.", ai: "Depth. A deep network is composition repeated dozens of times.", needs: ["function"], taught: true },
  { id: "inverse-fn", name: "Inverse functions", sector: "analysis", ring: 1, what: "The function that undoes another.", ai: "log undoes exp; the logit undoes the sigmoid.", needs: ["function"] },
  { id: "linear-fn", name: "Linear functions", sector: "analysis", ring: 1, what: "A linear map preserves addition and scaling; ax + b is affine when b is nonzero.", ai: "The matrix multiplication is linear; adding a bias makes the whole preactivation affine.", world: "Hooke's law, Ohm's law, anything proportional.", needs: ["function"], taught: true },
  { id: "exp-fn", name: "Exponential function", sector: "analysis", ring: 1, what: "eˣ — a function equal to its own rate of change.", ai: "softmax, decay schedules, likelihoods.", world: "Radioactive decay, epidemics, cooling, interest.", needs: ["exponents", "function"], taught: true },
  { id: "trig", name: "Trigonometric functions", sector: "analysis", ring: 2, what: "Sine and cosine: circular motion written as functions.", ai: "Positional encodings in Transformers; rotary embeddings.", world: "Waves, oscillation, tides, alternating current.", needs: ["function", "circle"] },
  { id: "sigmoid", name: "Sigmoid & tanh", sector: "analysis", ring: 2, what: "S-shaped curves squashing the whole line into a fixed range.", ai: "Binary probabilities, LSTM gates, older hidden layers.", needs: ["exp-fn"], taught: true },
  { id: "relu", name: "Piecewise linear & ReLU", sector: "analysis", ring: 1, what: "Straight pieces joined at corners.", ai: "max(0, x). Cheap, and non-linear just enough to work.", needs: ["linear-fn"], taught: true },
  { id: "continuity", name: "Continuity", sector: "analysis", ring: 2, what: "No sudden jumps: small input changes give small output changes.", ai: "A basic regularity property; continuity alone does not imply differentiability or trainability.", needs: ["function", "limit"] },
  { id: "convergence", name: "Convergence", sector: "analysis", ring: 3, what: "Whether a sequence settles on a value, and how fast.", ai: "The question every training curve is implicitly asking.", needs: ["sequences", "limit"] },
  { id: "real-analysis", name: "Real analysis", sector: "analysis", ring: 4, what: "Calculus rebuilt on proofs: epsilon, delta, and completeness.", ai: "Where the guarantees come from, once you want guarantees.", needs: ["continuity", "convergence"] },
  { id: "fourier", name: "Fourier analysis", sector: "analysis", ring: 3, what: "Represent suitable functions or signals using sinusoidal components, with convergence depending on the setting.", ai: "Spectral methods, positional encodings, efficient convolution.", world: "Audio compression, MRI, optics, seismology.", needs: ["trig", "complex"] },
  { id: "functional", name: "Functional analysis", sector: "analysis", ring: 4, what: "Treating whole functions as points in an infinite-dimensional space.", ai: "Kernel methods and the infinite-width limits of networks.", needs: ["real-analysis", "vector-space"] },

  // ---- Geometry & topology -------------------------------------------------
  { id: "point-line", name: "Point, line, plane", sector: "geometry", ring: 0, what: "The objects everything geometric is assembled from.", world: "The oldest formal mathematics we have written records of." },
  { id: "distance", name: "Distance & metric", sector: "geometry", ring: 1, what: "A rule for how far apart two things are.", ai: "Nearest-neighbour search, clustering, embedding similarity.", world: "Maps, navigation, any notion of closeness.", needs: ["point-line"] },
  { id: "pythagoras", name: "Pythagoras", sector: "geometry", ring: 1, what: "a² + b² = c², which is where Euclidean distance comes from.", ai: "The L2 norm is Pythagoras in as many dimensions as you like.", needs: ["distance"] },
  { id: "coordinates", name: "Coordinates", sector: "geometry", ring: 1, what: "Descartes' idea: turn geometry into arithmetic by naming every point with numbers.", ai: "Without it there are no vectors, and so no machine learning.", world: "Latitude and longitude; every screen pixel.", needs: ["point-line", "reals"] },
  { id: "circle", name: "Circle & angle", sector: "geometry", ring: 1, what: "All points at one distance from a centre, and the measure of turning.", world: "Wheels, orbits, anything that repeats.", needs: ["distance"] },
  { id: "convex-set", name: "Convex sets", sector: "geometry", ring: 2, what: "Shapes where the line between any two points stays inside.", ai: "Convex domains are useful when paired with a convex objective; the domain alone does not guarantee easy optimization.", needs: ["coordinates"] },
  { id: "hyperplane", name: "Hyperplanes", sector: "geometry", ring: 2, what: "A flat slice one dimension below the space it sits in.", ai: "A linear classifier's decision boundary is exactly one of these.", needs: ["coordinates", "vector"] },
  { id: "highdim", name: "High-dimensional geometry", sector: "geometry", ring: 3, what: "In many dimensions almost all volume is near the surface and most vectors are nearly orthogonal.", ai: "Why embeddings can pack so much in, and why distance-based intuition misleads.", needs: ["pythagoras", "vector"] },
  { id: "manifold", name: "Manifolds", sector: "geometry", ring: 3, what: "A surface that looks flat close up, however curved it is overall.", ai: "The hypothesis that real data occupies a thin curved sheet inside a huge space.", world: "The Earth's surface. Spacetime.", needs: ["highdim", "continuity"] },
  { id: "curvature", name: "Curvature", sector: "geometry", ring: 3, what: "How sharply a space or surface bends.", ai: "The Hessian is curvature, and it is what sets a workable learning rate.", world: "Gravity, in general relativity, is curvature.", needs: ["manifold", "hessian"] },
  { id: "topology", name: "Topology", sector: "geometry", ring: 4, what: "What survives stretching: holes, connectedness, continuity without distance.", ai: "Topological data analysis; the shape of a loss landscape.", world: "Why a mug and a doughnut are the same object.", needs: ["continuity"] },
  { id: "diffgeom", name: "Differential geometry", sector: "geometry", ring: 4, what: "Calculus done on curved spaces.", ai: "Natural gradients, information geometry, equivariant networks.", world: "The mathematical language of general relativity.", needs: ["manifold", "curvature"] },
  { id: "noneuclid", name: "Non-Euclidean geometry", sector: "geometry", ring: 3, what: "Geometry where parallel lines meet, or never come close.", ai: "Hyperbolic embeddings, which hold tree-shaped data far more efficiently.", world: "Invented as a curiosity; became the shape of the universe.", needs: ["point-line", "curvature"] },
  { id: "symmetry", name: "Symmetry", sector: "geometry", ring: 2, what: "A change that leaves something looking the same.", ai: "A cat is a cat wherever it sits in the frame — that assumption is what convolution encodes.", world: "Noether's theorem: every symmetry gives a conservation law.", needs: ["circle"] },

  // ---- Linear algebra ------------------------------------------------------
  { id: "vector", name: "Vector", sector: "linear", ring: 1, what: "An ordered list of numbers; also an arrow in space.", ai: "An embedding, a gradient, a layer's activations — all vectors.", world: "Velocity, force, anything with size and direction.", needs: ["coordinates"], taught: true },
  { id: "vector-space", name: "Vector space", sector: "linear", ring: 2, what: "A set you can add and scale within, obeying eight rules.", ai: "The setting that makes 'add the gradient' meaningful.", needs: ["vector"] },
  { id: "dot", name: "Dot product", sector: "linear", ring: 1, what: "Multiply matching entries and add. One number measuring alignment.", ai: "Attention scores, cosine similarity, and every single neuron.", world: "Work done by a force along a direction.", needs: ["vector"], taught: true },
  { id: "norm", name: "Norms", sector: "linear", ring: 1, what: "Length of a vector. L2 is Euclidean, L1 sums absolute values, L∞ takes the largest.", ai: "Weight decay, gradient clipping, the sparsity of L1 penalties.", needs: ["vector", "pythagoras"], taught: true },
  { id: "matrix", name: "Matrix", sector: "linear", ring: 1, what: "A grid of numbers; equally, a function that moves vectors.", ai: "A layer's weights, a batch of data, an attention map.", needs: ["vector"], taught: true },
  { id: "matmul", name: "Matrix multiplication", sector: "linear", ring: 2, what: "A grid of dot products. Shapes must agree.", ai: "The single operation that consumes most of the world's AI compute.", needs: ["matrix", "dot"], taught: true },
  { id: "transpose", name: "Transpose", sector: "linear", ring: 1, what: "Flip a matrix across its diagonal.", ai: "The backward pass multiplies by transposes of the forward matrices.", needs: ["matrix"] },
  { id: "identity-inverse", name: "Identity & inverse", sector: "linear", ring: 2, what: "The matrix that changes nothing, and the one that undoes another.", ai: "Solving least squares; whitening; why singular matrices break things.", needs: ["matmul"] },
  { id: "independence", name: "Linear independence", sector: "linear", ring: 2, what: "No vector in the set is a combination of the others.", ai: "Redundant features are dependent ones, and they waste capacity.", needs: ["vector-space"] },
  { id: "span-basis", name: "Span & basis", sector: "linear", ring: 2, what: "Everything you can reach by combining a set, and a minimal set that reaches it all.", ai: "What a layer can and cannot represent; the axes PCA chooses.", needs: ["independence"] },
  { id: "rank", name: "Rank", sector: "linear", ring: 2, what: "How many genuinely independent directions a matrix has.", ai: "LoRA works because weight updates turn out to be close to low-rank.", needs: ["span-basis"] },
  { id: "determinant", name: "Determinant", sector: "linear", ring: 2, what: "The factor by which a matrix scales volume. Zero means it flattens space.", ai: "Change-of-variables in normalising flows.", needs: ["matmul"] },
  { id: "nullspace", name: "Column & null space", sector: "linear", ring: 3, what: "What a matrix can output, and what it destroys.", needs: ["span-basis", "rank"] },
  { id: "orthogonality", name: "Orthogonality", sector: "linear", ring: 2, what: "Right angles: a zero dot product, meaning no shared component.", ai: "Orthogonal initialisation; independent directions in an embedding space.", needs: ["dot"], taught: true },
  { id: "projection", name: "Projection", sector: "linear", ring: 2, what: "The shadow one vector casts on another.", ai: "Least squares is a projection; so is every attention read.", needs: ["dot", "orthogonality"], taught: true },
  { id: "eigen", name: "Eigenvalues & eigenvectors", sector: "linear", ring: 3, what: "Directions a matrix only stretches, and by how much.", ai: "PCA, spectral norms, whether a recurrent network explodes or forgets.", world: "Resonant frequencies, vibration modes, PageRank, Markov steady states.", needs: ["matmul", "determinant"], taught: true },
  { id: "svd", name: "Singular value decomposition", sector: "linear", ring: 3, what: "Every matrix is a rotation, then a scaling, then another rotation.", ai: "PCA, low-rank compression, LoRA, and the conditioning of a layer.", world: "Image compression; latent-factor recommendation.", needs: ["eigen", "rank"], taught: true },
  { id: "decompositions", name: "QR, LU & Cholesky", sector: "linear", ring: 3, what: "Factorisations that make solving and inverting tractable.", ai: "Inside every linear solver and Gaussian-process implementation.", needs: ["identity-inverse"] },
  { id: "posdef", name: "Positive definiteness", sector: "linear", ring: 3, what: "A matrix that curves upward in every direction.", ai: "A positive definite Hessian means you are in a genuine minimum.", needs: ["eigen"] },
  { id: "trace", name: "Trace", sector: "linear", ring: 2, what: "The sum down the diagonal; also the sum of the eigenvalues.", needs: ["matrix", "eigen"] },
  { id: "tensor", name: "Tensors & broadcasting", sector: "linear", ring: 2, what: "Arrays of more than two dimensions, and the rules for aligning their shapes.", ai: "The thing you actually argue with in code: (batch, heads, seq, dim).", needs: ["matrix"], taught: true },

  // ---- Calculus ------------------------------------------------------------
  { id: "rate", name: "Rate of change", sector: "calculus", ring: 1, what: "How much one quantity moves when another does.", world: "Speed, growth, inflation, cooling.", needs: ["function"], taught: true },
  { id: "limit", name: "Limit", sector: "calculus", ring: 2, what: "Where an expression is heading, whether or not it gets there.", ai: "The move that makes the derivative legal without dividing by zero.", needs: ["rate", "sequences"], taught: true },
  { id: "derivative", name: "Derivative", sector: "calculus", ring: 2, what: "The instantaneous rate of change; the sensitivity of output to input.", ai: "The question training asks a few hundred billion times per step.", world: "Velocity, marginal cost, reaction rate.", needs: ["limit"], taught: true },
  { id: "diff-rules", name: "Differentiation rules", sector: "calculus", ring: 2, what: "Power, sum, product, quotient — each the limit worked out once, in general.", needs: ["derivative"], taught: true },
  { id: "chain", name: "Chain rule", sector: "calculus", ring: 2, what: "Sensitivities multiply along a chain of composed functions.", ai: "Backpropagation. Not analogous to it — it is it.", needs: ["derivative", "composition"], taught: true },
  { id: "partial", name: "Partial derivatives", sector: "calculus", ring: 2, what: "Vary one input, hold the rest still.", ai: "One per parameter, which is how a billion-dimensional problem stays askable.", needs: ["derivative"], taught: true },
  { id: "gradient", name: "Gradient", sector: "calculus", ring: 2, what: "All the partial derivatives collected into a vector pointing steepest uphill.", ai: "∇L(θ). The direction training walks away from.", world: "A ball on a hillside rolls along the negative gradient.", needs: ["partial", "vector"], taught: true },
  { id: "jacobian", name: "Jacobian", sector: "calculus", ring: 3, what: "The matrix of every output's sensitivity to every input.", ai: "What backpropagation multiplies at each layer, without ever forming it.", needs: ["gradient", "matrix"], taught: true },
  { id: "hessian", name: "Hessian", sector: "calculus", ring: 3, what: "The matrix of second derivatives: curvature in every pair of directions.", ai: "Sets the largest stable learning rate; the basis of second-order methods.", needs: ["jacobian"], taught: true },
  { id: "taylor", name: "Taylor series", sector: "calculus", ring: 3, what: "Any smooth function as a polynomial, accurate near a chosen point.", ai: "Gradient descent is a first-order Taylor step; Newton's method is second-order.", world: "How calculators evaluate sin, exp and log.", needs: ["derivative", "polynomial"], taught: true },
  { id: "integral", name: "Integral", sector: "calculus", ring: 2, what: "Accumulated total; area under a curve.", ai: "An expectation is an integral; so is the evidence term in Bayes' rule.", world: "Distance from speed, charge from current, dose over time.", needs: ["limit"], taught: true },
  { id: "ftc", name: "Fundamental theorem", sector: "calculus", ring: 2, what: "Differentiation and integration undo each other — which is not obvious at all.", needs: ["derivative", "integral"], taught: true },
  { id: "multi-integral", name: "Multiple integrals", sector: "calculus", ring: 3, what: "Accumulating over areas, volumes and higher spaces.", ai: "Marginalising a joint distribution — usually impossible, hence sampling.", needs: ["integral", "partial"] },
  { id: "ode", name: "Differential equations", sector: "dynamics", ring: 3, what: "Equations relating a quantity to its own rate of change.", ai: "Neural ODEs; diffusion sampling written as solving one.", world: "Nearly all of physics is written this way.", needs: ["derivative", "integral"] },
  { id: "sde", name: "Stochastic differential equations", sector: "dynamics", ring: 4, what: "Differential equations driven by noise.", ai: "The modern formulation of diffusion and score-based generative models.", world: "Brownian motion, option pricing.", needs: ["ode", "stochastic-process"] },
  { id: "vector-calc", name: "Vector calculus", sector: "calculus", ring: 3, what: "Divergence, curl and flux: calculus of fields.", world: "Maxwell's equations; fluid flow.", needs: ["gradient", "multi-integral"] },
  { id: "variations", name: "Calculus of variations", sector: "calculus", ring: 4, what: "Optimising over whole functions rather than numbers.", ai: "Variational inference and the objective behind a VAE.", world: "The principle of least action, from which mechanics follows.", needs: ["integral", "gradient"] },
  { id: "autodiff", name: "Automatic differentiation", sector: "calculus", ring: 3, what: "Evaluating exact derivatives by applying the chain rule across a computational graph.", ai: "What every framework actually does. Not symbolic, and not finite differences.", needs: ["chain", "graph"], taught: true },

  // ---- Probability ---------------------------------------------------------
  { id: "event", name: "Outcome & event", sector: "probability", ring: 1, what: "What can happen, and the sets of happenings you care about.", needs: ["set"] },
  { id: "prob-axioms", name: "Probability axioms", sector: "probability", ring: 1, what: "Non-negative, totals one, adds over exclusive cases. Everything follows.", needs: ["event"] },
  { id: "conditional", name: "Conditional probability", sector: "probability", ring: 2, what: "The probability of A once you know B.", ai: "A language model is one enormous conditional distribution.", needs: ["prob-axioms"], taught: true },
  { id: "independence-p", name: "Independence", sector: "probability", ring: 2, what: "Knowing one tells you nothing about the other.", ai: "Assumed constantly, true less often — and that gap causes real leakage.", needs: ["conditional"] },
  { id: "bayes", name: "Bayes' rule", sector: "probability", ring: 2, what: "Update a belief with evidence instead of replacing it.", ai: "Bayesian inference, posterior sampling, the framing of diffusion.", world: "Medical testing, forensics, search and rescue.", needs: ["conditional"], taught: true },
  { id: "random-var", name: "Random variable", sector: "probability", ring: 2, what: "A quantity whose value depends on chance. It has a distribution, not a value.", needs: ["prob-axioms"], taught: true },
  { id: "expectation", name: "Expectation", sector: "probability", ring: 2, what: "The long-run average, weighting every value by its probability.", ai: "Nearly every loss is an expectation; a mini-batch is an estimate of one.", needs: ["random-var", "integral"], taught: true },
  { id: "variance", name: "Variance & standard deviation", sector: "probability", ring: 2, what: "How widely a random quantity spreads around its mean.", ai: "Initialisation scales by 1/√n precisely to keep this stable through depth.", world: "Volatility, measurement error, quality control.", needs: ["expectation"], taught: true },
  { id: "covariance", name: "Covariance", sector: "probability", ring: 2, what: "Whether two quantities move together, and a matrix of all such pairs.", ai: "PCA diagonalises it; whitening removes it; Gaussians are defined by it.", needs: ["variance"], taught: true },
  { id: "distribution", name: "Distribution", sector: "probability", ring: 2, what: "How probability is spread over the possible values.", ai: "A classifier's output is one. So is the noise a diffusion model removes.", needs: ["random-var"], taught: true },
  { id: "bernoulli", name: "Bernoulli & binomial", sector: "probability", ring: 2, what: "One coin flip, and the count of heads in many.", ai: "Binary classification; dropout masks.", needs: ["distribution"], taught: true },
  { id: "categorical", name: "Categorical", sector: "probability", ring: 2, what: "One choice among k options with given probabilities.", ai: "Exactly what softmax produces, and what next-token sampling draws from.", needs: ["distribution"], taught: true },
  { id: "uniform", name: "Uniform", sector: "probability", ring: 2, what: "Every outcome equally likely.", ai: "Random initialisation, shuffling, the base of most samplers.", needs: ["distribution"], taught: true },
  { id: "gaussian", name: "Gaussian (normal)", sector: "probability", ring: 2, what: "The bell curve, fixed entirely by its mean and variance.", ai: "Weight initialisation, VAE latents, the noise diffusion adds and removes.", world: "Measurement error, heights, anything that is many small effects added up.", needs: ["variance", "clt"], taught: true },
  { id: "poisson", name: "Poisson", sector: "probability", ring: 3, what: "Counts of rare events in a fixed window.", world: "Calls to a switchboard, mutations, radioactive decays.", needs: ["distribution"] },
  { id: "exponential-d", name: "Exponential distribution", sector: "probability", ring: 3, what: "Waiting time until the next event, with no memory of how long you have waited.", world: "Component lifetimes, queueing.", needs: ["poisson"] },
  { id: "beta-dirichlet", name: "Beta & Dirichlet", sector: "probability", ring: 3, what: "Distributions over probabilities themselves.", ai: "Bayesian priors; topic models.", needs: ["distribution", "bayes"] },
  { id: "joint", name: "Joint & marginal", sector: "probability", ring: 2, what: "Several variables at once, and what is left after ignoring some.", ai: "Generative modelling is learning a joint distribution.", needs: ["distribution", "conditional"], taught: true },
  { id: "clt", name: "Central limit theorem", sector: "probability", ring: 3, what: "Add up enough independent things and the total is Gaussian, whatever they were.", ai: "Why Gaussian assumptions survive being wrong about the details.", world: "The reason the bell curve appears everywhere in nature.", needs: ["variance", "independence-p"], taught: true },
  { id: "lln", name: "Law of large numbers", sector: "probability", ring: 3, what: "Sample averages converge on the true mean.", ai: "The licence to estimate a loss from a mini-batch.", world: "Why casinos and insurers can be confident in aggregate.", needs: ["expectation", "convergence"] },
  { id: "markov", name: "Markov chains", sector: "probability", ring: 3, what: "The next state depends only on the present one.", ai: "The forward noising process in diffusion; the MDP behind reinforcement learning.", world: "Weather models, PageRank, queueing systems.", needs: ["conditional"] },
  { id: "monte-carlo", name: "Monte Carlo", sector: "probability", ring: 3, what: "Estimate a quantity by sampling instead of solving.", ai: "How intractable expectations actually get computed.", world: "Nuclear physics, finance, election forecasting.", needs: ["expectation", "lln"], taught: true },
  { id: "mcmc", name: "MCMC", sector: "probability", ring: 4, what: "Build a Markov chain whose long-run behaviour is the distribution you want.", ai: "Bayesian posteriors; energy-based model sampling.", needs: ["markov", "monte-carlo"] },
  { id: "stochastic-process", name: "Stochastic processes", sector: "probability", ring: 4, what: "Randomness unfolding over time.", ai: "The formal setting for diffusion and for SGD's trajectory.", world: "Brownian motion, population dynamics.", needs: ["markov"] },
  { id: "measure", name: "Measure-theoretic probability", sector: "probability", ring: 4, what: "Probability rebuilt on measure theory so continuous cases stop being awkward.", needs: ["real-analysis", "prob-axioms"] },
  { id: "concentration", name: "Concentration inequalities", sector: "probability", ring: 4, what: "Bounds saying a random quantity is very unlikely to stray far.", ai: "Tools for relating finite-sample quantities to population expectations.", needs: ["variance", "prob-axioms"] },

  // ---- Statistics ----------------------------------------------------------
  { id: "sample", name: "Sample & population", sector: "statistics", ring: 1, what: "The part you measured against the whole you care about.", ai: "Your training set is a sample. Every claim about the world inherits that.", needs: ["prob-axioms"] },
  { id: "averages", name: "Mean, median, mode", sector: "statistics", ring: 1, what: "Three different answers to 'what is typical'.", world: "Why average income and median income tell different stories.", needs: ["sample"] },
  { id: "estimator", name: "Estimator", sector: "statistics", ring: 2, what: "A recipe for guessing an unknown quantity from data.", needs: ["sample", "expectation"] },
  { id: "bias-variance", name: "Bias & variance", sector: "statistics", ring: 3, what: "Being wrong on average, against being unstable across samples.", ai: "The classical framing of underfitting and overfitting — which deep learning strains.", needs: ["estimator", "variance"] },
  { id: "mle", name: "Maximum likelihood", sector: "statistics", ring: 3, what: "Choose the parameters that make the observed data most probable.", ai: "Minimising cross-entropy is exactly this. The standard loss is not arbitrary.", needs: ["estimator", "distribution"], taught: true },
  { id: "map", name: "MAP estimation", sector: "statistics", ring: 3, what: "Maximum likelihood with a prior attached.", ai: "L2 regularisation is a Gaussian prior on the weights, written differently.", needs: ["mle", "bayes"], taught: true },
  { id: "regression", name: "Regression", sector: "statistics", ring: 2, what: "Fitting a relationship between inputs and a numeric outcome.", ai: "Linear regression is the smallest complete machine-learning model.", world: "Dose–response curves, econometrics.", needs: ["linear-fn", "estimator"] },
  { id: "correlation", name: "Correlation", sector: "statistics", ring: 2, what: "Covariance rescaled to sit between −1 and 1.", ai: "Feature screening — and the standard caution that it is not causation.", needs: ["covariance"] },
  { id: "overfitting", name: "Generalisation", sector: "statistics", ring: 3, what: "Performing on data you have not seen, not the data you fitted.", ai: "The whole point, and still not fully explained for deep networks.", needs: ["bias-variance", "sample"], taught: true },
  { id: "cross-val", name: "Cross-validation", sector: "statistics", ring: 2, what: "Rotate which part of the data is held out, and average the results.", ai: "Model selection, done without touching the final test set.", needs: ["sample", "overfitting"] },
  { id: "confidence", name: "Confidence intervals", sector: "statistics", ring: 3, what: "A range, with a stated procedure for how often it captures the truth.", ai: "Error bars on a benchmark, which papers still too often omit.", needs: ["estimator", "clt"] },
  { id: "hypothesis", name: "Hypothesis testing", sector: "statistics", ring: 3, what: "Asking whether an effect could plausibly be chance.", ai: "Whether model A really beats model B, or you ran it three times.", needs: ["confidence"] },
  { id: "bootstrap", name: "Bootstrap", sector: "statistics", ring: 3, what: "Resample your own data to estimate how uncertain a statistic is.", needs: ["monte-carlo", "estimator"] },
  { id: "bayesian-inf", name: "Bayesian inference", sector: "statistics", ring: 3, what: "Carry a distribution over parameters rather than one best guess.", ai: "Uncertainty estimates; Bayesian neural networks.", needs: ["bayes", "mle"] },
  { id: "causal", name: "Causal inference", sector: "statistics", ring: 4, what: "Distinguishing what causes what from what merely moves together.", ai: "The gap between a model that predicts and one you can act on.", world: "Clinical trials, policy evaluation.", needs: ["correlation", "conditional"] },

  // ---- Information theory --------------------------------------------------
  { id: "bit", name: "The bit", sector: "information", ring: 1, what: "One yes-or-no answer: the unit information is measured in.", ai: "Quantization and storage; log-base-2 losses are in bits, while natural-log losses are in nats.", world: "All of digital communication and storage.", needs: ["logarithms"] },
  { id: "entropy", name: "Entropy", sector: "information", ring: 2, what: "Average surprise: how uncertain a distribution is.", ai: "The floor a loss can reach when the data itself is ambiguous.", world: "Statistical-mechanical entropy connects to Shannon entropy through physical units and a choice of states.", needs: ["distribution", "logarithms"], taught: true },
  { id: "cross-entropy", name: "Cross-entropy", sector: "information", ring: 2, what: "Your predicted distribution's average surprise at reality.", ai: "The standard classification and language-modelling loss.", needs: ["entropy"], taught: true },
  { id: "kl", name: "KL divergence", sector: "information", ring: 3, what: "The excess surprise from using the wrong distribution. Nonnegative, but not symmetric in general.", ai: "VAE objectives, distillation, the constraint term in RLHF.", needs: ["cross-entropy"], taught: true },
  { id: "mutual-info", name: "Mutual information", sector: "information", ring: 3, what: "How much knowing one variable reduces uncertainty about another.", ai: "Feature selection, representation learning objectives.", needs: ["kl", "joint"], taught: true },
  { id: "perplexity", name: "Perplexity", sector: "information", ring: 3, what: "Exponentiated cross-entropy: the effective number of choices the model felt it had.", ai: "The traditional headline number for a language model.", needs: ["cross-entropy", "exponents"] },
  { id: "coding", name: "Coding & compression", sector: "information", ring: 3, what: "Entropy bounds expected lossless code length; block coding can approach the bound under appropriate source assumptions.", ai: "The argument that good prediction and good compression are the same thing.", world: "ZIP, JPEG, every codec you use.", needs: ["entropy"] },
  { id: "channel", name: "Channel capacity", sector: "information", ring: 4, what: "The maximum rate you can communicate reliably over a noisy channel.", world: "Sets the limit for every modem, fibre and radio link.", needs: ["mutual-info"] },
  { id: "rate-distortion", name: "Rate–distortion", sector: "information", ring: 4, what: "The best fidelity achievable at a given number of bits.", ai: "A principled way to think about what a representation should discard.", needs: ["coding", "mutual-info"] },
  { id: "mdl", name: "Minimum description length", sector: "information", ring: 4, what: "Prefer the model that compresses the data best, itself included.", ai: "A formal statement of Occam's razor for model selection.", needs: ["coding", "overfitting"] },

  // ---- Optimization --------------------------------------------------------
  { id: "extremum", name: "Minimum & maximum", sector: "optimization", ring: 1, what: "The best and worst a quantity can get.", world: "Every economic and engineering decision is one of these.", needs: ["function"] },
  { id: "objective", name: "Objective function", sector: "optimization", ring: 1, what: "The single number you have decided to make small.", ai: "Choosing it is the most consequential design decision in a project.", needs: ["extremum"], taught: true },
  { id: "grad-descent", name: "Gradient descent", sector: "optimization", ring: 2, what: "Read the slope, step against it, repeat.", ai: "The basis of training for many differentiable models; trees and other methods use different procedures.", world: "Water finding the valley; a physical system settling into low energy.", needs: ["gradient", "objective"], taught: true },
  { id: "learning-rate", name: "Learning rate", sector: "optimization", ring: 2, what: "A multiplier on the update direction, not on the remaining error.", ai: "The hyperparameter most likely to be the reason it is not training.", needs: ["grad-descent"], taught: true },
  { id: "sgd", name: "Stochastic gradient descent", sector: "optimization", ring: 2, what: "Estimate the slope from a small sample rather than all the data.", ai: "Often cheaper per update; sampling noise can help or hinder, depending on the problem and settings.", needs: ["grad-descent", "monte-carlo"], taught: true },
  { id: "momentum", name: "Momentum", sector: "optimization", ring: 3, what: "Accumulate a running direction so you stop zig-zagging across a valley.", world: "Related to a discretized heavy-ball model, with damping.", needs: ["sgd"], taught: true },
  { id: "adam", name: "Adaptive methods (Adam)", sector: "optimization", ring: 3, what: "Give each parameter its own step size from its recent gradient history.", ai: "A widely used adaptive optimizer for neural networks.", needs: ["momentum", "rmsprop"], taught: true },
  { id: "convexity", name: "Convexity", sector: "optimization", ring: 3, what: "Bowl-shaped: every local minimum is the global one.", ai: "Convex objectives have global optimality properties; typical neural-network objectives are non-convex.", needs: ["convex-set", "hessian"], taught: true },
  { id: "local-minima", name: "Local vs global minima", sector: "optimization", ring: 2, what: "The bottom of a valley need not be the bottom of the landscape.", ai: "Distinguishing local from global improvement helps interpret optimization results.", needs: ["extremum"], taught: true },
  { id: "saddle", name: "Saddle points", sector: "optimization", ring: 3, what: "Flat, but downhill in some direction — up in another.", ai: "One potential obstacle in non-convex optimization; prevalence depends on the objective.", needs: ["hessian", "local-minima"] },
  { id: "newton", name: "Newton's method", sector: "optimization", ring: 3, what: "Use curvature as well as slope to jump nearer the minimum.", ai: "Too expensive at scale, but the reason people care about the Hessian.", needs: ["hessian", "taylor"], taught: true },
  { id: "regularization", name: "Regularisation", sector: "optimization", ring: 2, what: "Add a penalty for complexity so the fit does not chase noise.", ai: "L1 penalties can produce sparse solutions. L2 penalties and decoupled weight decay differ with adaptive optimizers.", needs: ["norm", "overfitting"], taught: true },
  { id: "constrained", name: "Constrained optimization", sector: "optimization", ring: 3, what: "Find the best point that also satisfies some rules.", world: "Scheduling, portfolios, resource allocation.", needs: ["objective", "inequality"] },
  { id: "lagrange", name: "Lagrange multipliers", sector: "optimization", ring: 3, what: "Introduce multipliers to express stationarity and constraint conditions through a Lagrangian.", ai: "Behind the KL constraint in RLHF and the derivation of softmax from entropy.", needs: ["constrained", "gradient"] },
  { id: "kkt", name: "KKT conditions", sector: "optimization", ring: 4, what: "First-order optimality conditions under suitable constraint qualifications; in convex problems they can certify global optimality.", needs: ["lagrange"] },
  { id: "linear-prog", name: "Linear programming", sector: "optimization", ring: 3, what: "Optimise a linear objective under linear constraints.", world: "Logistics, refinery scheduling, diet problems.", needs: ["constrained", "hyperplane"] },
  { id: "transport", name: "Optimal transport", sector: "optimization", ring: 4, what: "The cheapest way to move one distribution onto another.", ai: "Wasserstein distances; the transport view of diffusion and flow matching.", world: "Posed in 1781 about moving piles of earth.", needs: ["distribution", "constrained"] },
  { id: "landscape", name: "Loss landscape", sector: "optimization", ring: 3, what: "The surface training walks across, in as many dimensions as there are parameters.", ai: "Flat minima, mode connectivity, and why the picture in your head is wrong.", needs: ["convexity", "highdim"] },

  // ---- Discrete & logic ----------------------------------------------------
  { id: "set", name: "Sets", sector: "foundations", ring: 0, what: "A collection of things. Most of mathematics is written in this language.", needs: [] },
  { id: "logic", name: "Logic", sector: "foundations", ring: 0, what: "And, or, not, implies — and what follows from what.", ai: "Symbolic AI was built on this, and neurosymbolic work is returning to it.", world: "Law, argument, and every circuit in your machine." },
  { id: "proof", name: "Proof", sector: "foundations", ring: 1, what: "An argument that leaves no room for doubt.", world: "What separates mathematics from every other discipline.", needs: ["logic"] },
  { id: "induction", name: "Induction", sector: "foundations", ring: 2, what: "True for the first case, and each case forces the next — so true for all.", needs: ["proof"] },
  { id: "combinatorics", name: "Combinatorics", sector: "discrete", ring: 2, what: "Counting arrangements without listing them.", ai: "Why exhaustive search fails, and how large a hypothesis space really is.", world: "Lotteries, scheduling, card games.", needs: ["counting", "set"] },
  { id: "permutations", name: "Permutations & combinations", sector: "discrete", ring: 2, what: "Orderings, and selections where order does not matter.", needs: ["combinatorics"] },
  { id: "graph", name: "Graphs", sector: "discrete", ring: 2, what: "Things, and connections between them.", ai: "Graph neural networks; attention as a fully connected graph; the autodiff graph.", world: "Social networks, molecules, road systems, the internet.", needs: ["set"], taught: true },
  { id: "tree", name: "Trees", sector: "discrete", ring: 2, what: "Connected undirected graphs with no cycles; selecting a root introduces a hierarchy.", ai: "Decision trees, gradient boosting, search trees, parse structure.", world: "Family trees, file systems, taxonomies.", needs: ["graph"] },
  { id: "recursion", name: "Recursion", sector: "discrete", ring: 2, what: "Defining something in terms of a smaller version of itself.", ai: "Recurrent networks; divide-and-conquer; the structure of backprop itself.", world: "Fractals, nested reflections.", needs: ["induction"] },
  { id: "boolean", name: "Boolean algebra", sector: "foundations", ring: 1, what: "Algebra on true and false.", ai: "Attention masks, and quantisation taken to its extreme.", world: "Every transistor in every chip.", needs: ["logic"] },
  { id: "relations", name: "Relations & orders", sector: "discrete", ring: 2, what: "How elements of a set relate, and how they can be ranked.", ai: "Ranking losses, preference learning, and the pairwise data behind RLHF.", needs: ["set"] },
  { id: "countability", name: "Countability", sector: "foundations", ring: 3, what: "Which infinite sets can be listed, and which cannot.", needs: ["set", "infinity"] },
  { id: "computability", name: "Computability", sector: "foundations", ring: 4, what: "What no algorithm can decide, however long it runs.", ai: "A hard ceiling that no amount of scale removes.", world: "Turing's halting problem.", needs: ["logic", "countability"] },
  { id: "category", name: "Category theory", sector: "foundations", ring: 4, what: "Structure described by how things map to each other rather than what they contain.", ai: "An emerging language for composing learning systems.", needs: ["set", "group"] },

  // ---- Computation & numerics ----------------------------------------------
  { id: "algorithm", name: "Algorithm", sector: "computation", ring: 1, what: "An effective step-by-step procedure; termination is a property that needs to be established for its intended inputs.", ai: "Training is one. So is inference.", world: "Long division is one you already know.", needs: ["logic"] },
  { id: "bigo", name: "Big-O complexity", sector: "computation", ring: 2, what: "How cost grows with size, ignoring constants.", ai: "Why attention's O(n²) in sequence length is the defining engineering problem.", needs: ["algorithm", "magnitude"] },
  { id: "precision", name: "Numerical precision", sector: "computation", ring: 2, what: "How many digits you actually have, and where they go.", ai: "float32 against bfloat16; quantisation to eight bits and below.", needs: ["floats"], taught: true },
  { id: "stability", name: "Numerical stability", sector: "computation", ring: 3, what: "Whether small errors stay small or compound catastrophically.", ai: "log-sum-exp, gradient clipping, and shifting logits before softmax.", needs: ["precision"], taught: true },
  { id: "conditioning", name: "Conditioning", sector: "computation", ring: 3, what: "How much a problem's answer moves when its input is nudged.", ai: "An ill-conditioned Hessian is why one learning rate cannot suit every direction.", needs: ["stability", "eigen"] },
  { id: "iterative", name: "Iterative solvers", sector: "computation", ring: 3, what: "Approach an answer by repetition rather than solving outright.", ai: "Conjugate gradients; every training loop is one of these.", needs: ["algorithm", "convergence"] },
  { id: "vectorization", name: "Vectorisation & parallelism", sector: "computation", ring: 2, what: "Do many identical operations at once instead of one after another.", ai: "The entire reason GPUs transformed this field.", needs: ["matmul", "algorithm"] },
  { id: "prng", name: "Pseudorandom numbers", sector: "computation", ring: 2, what: "Deterministic sequences that pass for random.", ai: "Seeds, reproducibility, shuffling, dropout masks.", needs: ["modular", "uniform"] },
  { id: "discretization", name: "Discretisation", sector: "computation", ring: 3, what: "Replacing something continuous with finitely many steps.", ai: "Diffusion timesteps; every numerical integrator.", needs: ["integral", "precision"] },
  { id: "fixed-point", name: "Fixed-point iteration", sector: "computation", ring: 3, what: "Apply a map repeatedly until the output stops moving.", ai: "Deep equilibrium models; the analysis of recurrent dynamics.", needs: ["iterative", "convergence"] },
  { id: "matrix-free", name: "Matrix-free methods", sector: "computation", ring: 4, what: "Work with a matrix you never build, only multiply by.", ai: "How Hessian-vector products stay affordable at scale.", needs: ["iterative", "jacobian"] },
  ...additionalConcepts,
];

// A badge is backed by a destination, not inferred from a branch.
const coverage: Record<string, string[]> = {
  numbers: ["counting", "integers", "rationals", "reals", "complex", "exponents", "logarithms", "floats"],
  variables: ["variable", "expression"],
  foundations: ["set", "logic", "proof", "induction", "boolean", "quantifiers", "contradiction", "graph"],
  algebra: ["equation", "rearranging", "polynomial", "systems"],
  functions: ["function", "domain-range", "composition", "linear-fn", "exp-fn", "sigmoid", "relu"],
  "linear-algebra": ["vector", "dot", "norm", "matrix", "matmul", "transpose", "identity-inverse", "span-basis", "rank", "determinant", "eigen", "svd", "trace", "tensor", "pca", "least-squares", "projection"],
  calculus: ["rate", "limit", "derivative", "diff-rules", "chain", "partial", "gradient", "jacobian", "hessian", "taylor", "integral", "ftc", "autodiff"],
  probability: ["conditional", "bayes", "random-var", "expectation", "variance", "covariance", "distribution", "bernoulli", "categorical", "uniform", "gaussian", "poisson", "exponential-d", "beta-dirichlet", "clt", "mle", "map", "entropy", "cross-entropy", "kl", "calibration"],
  statistics: ["sample", "averages", "estimator", "standard-error", "confidence", "hypothesis", "cross-val", "overfitting", "empirical-risk", "bias-variance"],
  optimization: ["objective", "grad-descent", "learning-rate", "sgd", "momentum", "rmsprop", "adam", "convexity", "local-minima", "newton", "regularization"],
  numerics: ["precision", "stability", "conditioning", "softmax"],
};
const lessonById = new Map(Object.entries(coverage).flatMap(([chapter, ids]) => ids.map(id => [id, "#" + chapter] as const)));
lessonById.set("adamw", "/dl/week-3#w3-regularization");
lessonById.set("early-stopping", "/dl/week-3#w3-checkpoints");
export const concepts: Concept[] = catalogue.map(concept => ({ ...concept, taught: lessonById.has(concept.id) ? true : undefined, lesson: lessonById.get(concept.id) }));

export const conceptById = new Map(concepts.map(concept => [concept.id, concept]));
export const aiConcepts = concepts.filter(concept => concept.ai);
export const taughtConcepts = concepts.filter(concept => concept.taught);
