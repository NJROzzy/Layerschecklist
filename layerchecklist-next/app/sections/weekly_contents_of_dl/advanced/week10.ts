import type { CourseLessonData } from "./types";

export const week10: CourseLessonData = {
  week: 10,
  title: "Autoencoders and Variational Autoencoders",
  lead: "How can a network learn a compact latent representation, and what changes when that representation becomes probabilistic? Follow the encoder, bottleneck, and decoder, then build the variational objective one term at a time.",
  alignment: "AI Algorithms 2, supplied Week 10 lecture: Autoencoders and Variational Autoencoders, November 2–8, 2026 (23 slides).",
  prerequisites: "Representation learning, neural network training, reconstruction losses, Gaussian distributions, and backpropagation.",
  outcomes: [
    "Explain how a meaningful bottleneck constrains an autoencoder.",
    "Compare ordinary and denoising autoencoders, including their training targets.",
    "Distinguish a deterministic code from a distribution over latent variables.",
    "Calculate a reparameterized sample and explain its gradient path.",
    "Separate reconstruction, KL divergence, and the negative ELBO.",
    "Investigate posterior collapse using reconstructions, prior samples, and latent interventions.",
  ],
  sections: [
    {
      id: "reconstruction", title: "Learning a representation through reconstruction",
      paragraphs: ["An autoencoder uses an observation as its own reconstruction target. The encoder maps it to a latent code, and the decoder maps that code back into observation space. The learning signal asks which information must survive this round trip."],
      formula: "input x → encoder fφ → code z → decoder gθ → reconstruction x̂\nz = fφ(x),  x̂ = gθ(z)",
    },
    {
      id: "bottleneck", title: "The bottleneck constrains what can pass through",
      paragraphs: ["An unconstrained network with enough capacity can learn to copy its input. A low-dimensional code, sparsity, corruption, or regularization can restrict copying. A small code alone still does not guarantee useful features. The constraint, objective, and data jointly determine what the model preserves."],
      table: { headers: ["Constraint", "What it changes"], rows: [["Low-dimensional code", "Limits the number of latent coordinates"], ["Sparsity", "Encourages only some units to activate"], ["Corruption", "Requires recovering structure from a damaged input"], ["Regularization", "Penalizes selected behaviors"], ["Probabilistic latent structure", "Constrains inferred distributions relative to a prior"]] },
    },
    {
      id: "reconstruction-loss", title: "Reconstruction loss defines what is worth preserving",
      paragraphs: ["Squared error rewards agreement in observation values. A large background error can outweigh a small error in a feature needed for classification. The loss therefore defines a notion of fidelity. Good reconstruction does not establish that a representation is best for every downstream task."],
      formula: "Lrecon(x) = Σk (xk − x̂k)²\nTraining loss = average of per-example losses",
    },
    {
      id: "basic-autoencoder", title: "A basic deterministic autoencoder in PyTorch",
      paragraphs: ["The lecture uses a flattened 784-value image, a 128-unit hidden layer, and a 32-value code. A sigmoid bounds the reconstruction between zero and one. With deterministic layers and fixed parameters, the same input produces the same code. The downloadable experiment uses smaller generated binary images to run without a dataset download."],
      code: "class Autoencoder(nn.Module):\n    def __init__(self, input_dim=784, latent_dim=32):\n        super().__init__()\n        self.encoder = nn.Sequential(\n            nn.Linear(input_dim, 128), nn.ReLU(),\n            nn.Linear(128, latent_dim))\n        self.decoder = nn.Sequential(\n            nn.Linear(latent_dim, 128), nn.ReLU(),\n            nn.Linear(128, input_dim), nn.Sigmoid())\n\n    def forward(self, inputs):\n        latent = self.encoder(inputs)\n        return self.decoder(latent), latent",
    },
    {
      id: "latent-geometry", title: "Compression does not guarantee useful latent geometry",
      paragraphs: ["Training constrains the decoder at codes reached by the encoder. Gaps between those codes can decode poorly. Nearby codes do not automatically represent meaningfully similar observations. Reconstruction alone supplies neither a useful sampling prior nor a full probabilistic generative model."],
    },
    {
      id: "denoising", title: "Denoising autoencoders recover a clean target",
      paragraphs: ["Corrupt the input, then reconstruct the clean original. The target stays clean throughout training. This encourages structure that survives the chosen corruption process. Robustness to flipped pixels does not establish robustness to every possible image change."],
      formula: "clean x → corruption → x̃ → encoder → code → decoder → x̂\nLdenoising = reconstruction_loss(x̂, clean x)",
      code: "corrupted = corrupt(clean)\nreconstruction, latent = autoencoder(corrupted)\nloss = F.mse_loss(reconstruction, clean)",
    },
    {
      id: "probabilistic-latent", title: "The VAE encoder predicts a latent distribution",
      paragraphs: ["A variational autoencoder commonly predicts a mean and log-variance for a diagonal Gaussian over latent variables. Different noise draws can produce different codes for the same input. The decoder receives a sampled code rather than a single deterministic encoder output."],
      formula: "x → encoder → μ(x), log σ²(x) → sample z → decoder\nqφ(z|x) = Normal(μ(x), diag(σ²(x)))",
    },
    {
      id: "posterior-prior-decoder", title: "Approximate posterior, prior, and decoder likelihood",
      paragraphs: ["The encoder distribution qφ(z|x) approximates the model's posterior for an observed input. The prior p(z), commonly Normal(0, I), supplies codes for generation without an input. The decoder distribution pθ(x|z) describes observations conditional on a code."],
      table: { headers: ["Distribution", "Role"], rows: [["qφ(z|x)", "Infer a latent distribution from an observation"], ["p(z)", "Draw latent variables before observing x"], ["pθ(x|z)", "Describe observations given a latent variable"]] },
    },
    {
      id: "gaussian-parameters", title: "Convert log-variance into standard deviation",
      paragraphs: ["Log-variance can take any real value. Exponentiating it gives a positive variance. Sampling requires the standard deviation, so use half the log-variance in the exponent. Confusing these quantities changes the sampling distribution and its gradients."],
      formula: "logvar = log σ²\nvariance = exp(logvar)\nstandard deviation σ = exp(0.5 · logvar)",
    },
    {
      id: "reparameterization", title: "Reparameterization keeps the sample differentiable",
      paragraphs: ["Draw standard-normal noise independently of encoder parameters, then scale and shift it using the predicted standard deviation and mean. For a fixed noise draw, this transformation is differentiable in both learned quantities. Randomness remains while backpropagation follows the sample's dependence on the encoder."],
      formula: "ε ~ Normal(0, I)\nz = μ + exp(0.5 · logvar) ⊙ ε\n∂z/∂μ = 1,  ∂z/∂logvar = 0.5 · exp(0.5 · logvar) ⊙ ε",
      worked: { title: "One reparameterized coordinate", steps: ["Let μ = 1, variance = 4, and ε = −0.5.", "Standard deviation is 2, so z = 1 + 2 × (−0.5) = 0.", "Fresh epsilon draws change z. Reusing epsilon keeps this particular calculation fixed."] },
    },
    {
      id: "reconstruction-term", title: "The VAE reconstruction term is a likelihood term",
      paragraphs: ["The reconstruction term is the expected negative log-likelihood of the observed input under the decoder. A fixed-variance Gaussian likelihood gives scaled squared error plus a constant. Binary cross-entropy represents a Bernoulli likelihood for binary observations. Normalizing continuous pixels into [0, 1] alone does not establish that Bernoulli assumption."],
      formula: "Lrecon = Eqφ(z|x)[−log pθ(x|z)]\nOne sampled z often estimates this expectation during training.",
    },
    {
      id: "kl-term", title: "KL divergence measures departure from the prior",
      paragraphs: ["KL compares the approximate posterior for an observation with the prior. It encourages inferred distributions to stay compatible with the distribution used for generation. Its latent-space comparison answers a different question from reconstruction fidelity."],
      formula: "LKL = KL(qφ(z|x) || p(z))",
    },
    {
      id: "elbo", title: "The VAE objective is the negative ELBO",
      paragraphs: ["The evidence lower bound combines expected log-likelihood with a penalty for posterior departure from the prior. Maximizing the bound is equivalent to minimizing its negative: reconstruction negative log-likelihood plus KL. The bound need not equal the exact log evidence."],
      formula: "ELBO(x) = Eq[log pθ(x|z)] − KL(qφ(z|x) || p(z)) ≤ log pθ(x)\nLoss = −ELBO = Lrecon + LKL",
    },
    {
      id: "latent-regularity", title: "Why prior agreement matters for sampling",
      paragraphs: ["Generation draws codes from the prior rather than an input's encoder distribution. The KL penalty encourages overlap between these sources of codes. That can make prior sampling useful, but prior agreement alone does not guarantee good samples or diversity."],
      takeaway: "Inspect reconstructions and prior samples separately. They exercise different routes through the model.",
    },
    {
      id: "model-comparison", title: "Compare ordinary, denoising, and variational autoencoders",
      paragraphs: ["All three use encoders and decoders. Their training inputs, code structure, and objectives differ, so superficially similar reconstruction tasks can produce representations with different properties."],
      table: { headers: ["Model", "Input and code", "Training objective"], rows: [["Autoencoder", "Clean input, deterministic code", "Reconstruct the input"], ["Denoising autoencoder", "Corrupted input, deterministic code", "Reconstruct the clean original"], ["VAE", "Input-dependent distribution over codes", "Reconstruction NLL plus posterior-to-prior KL"]] },
    },
    {
      id: "vae-implementation", title: "Keep the VAE components explicit",
      paragraphs: ["Lab 3 emphasizes an explicit encoder, mean and log-variance heads, reparameterization, and decoder. This version returns logits for the stable binary_cross_entropy_with_logits loss. Apply sigmoid to display decoder probabilities. The sigmoid decoder in the slides instead pairs with binary_cross_entropy."],
      code: "class VAE(nn.Module):\n    def __init__(self, input_dim=784, latent_dim=16):\n        super().__init__()\n        self.encoder = nn.Sequential(\n            nn.Linear(input_dim, 128), nn.ReLU())\n        self.mu = nn.Linear(128, latent_dim)\n        self.logvar = nn.Linear(128, latent_dim)\n        self.decoder = nn.Sequential(\n            nn.Linear(latent_dim, 128), nn.ReLU(),\n            nn.Linear(128, input_dim))\n\n    def forward(self, inputs):\n        hidden = self.encoder(inputs)\n        mu, logvar = self.mu(hidden), self.logvar(hidden)\n        epsilon = torch.randn_like(mu)\n        latent = mu + torch.exp(0.5 * logvar) * epsilon\n        return self.decoder(latent), mu, logvar, latent",
    },
    {
      id: "gaussian-kl", title: "Calculate KL for a diagonal Gaussian",
      paragraphs: ["With a diagonal Gaussian approximate posterior and standard-normal prior, KL has a closed form. Sum latent coordinates for each example, then average examples. The lecture's negative-half expression equals the positive-half form below."],
      formula: "KL = −0.5 Σj [1 + logvarj − μj² − exp(logvarj)]\n   =  0.5 Σj [μj² + exp(logvarj) − 1 − logvarj]",
      worked: { title: "Check the formula", steps: ["At μ = 0 and logvar = 0, variance is 1 and KL = 0.", "At μ = 1 and logvar = 0, KL = 0.5 nats.", "At μ = 0 and variance = 4, KL = 0.5 × (4 − 1 − log 4) ≈ 0.8069 nats."] },
      lab: "vae",
    },
    {
      id: "tradeoff", title: "Reconstruction and regularization can compete",
      paragraphs: ["A weak KL term may allow detailed reconstruction while inferred codes fit the prior poorly. A strong term may restrict latent information. Keep reductions consistent: averaging reconstruction over pixels while summing KL over coordinates silently changes their relative weight. β = 1 gives the ordinary negative ELBO with a correctly defined reconstruction NLL. Other β values define a modified objective."],
      code: "recon = F.binary_cross_entropy_with_logits(\n    logits, clean, reduction='none').sum(dim=1).mean()\nkl = -0.5 * (1 + logvar - mu.square() - logvar.exp()).sum(dim=1).mean()\nloss = recon + beta * kl",
    },
    {
      id: "posterior-collapse", title: "Posterior collapse means the decoder ignores the latent",
      paragraphs: ["In posterior collapse, the approximate posterior stays near the prior and the latent conveys little useful input information. A capable decoder may explain the data without relying on z. Low KL is a warning to investigate, rather than sufficient proof. Replace or shuffle codes and examine whether reconstructions change."],
    },
    {
      id: "interpolation", title: "Latent interpolation tests a chosen path",
      paragraphs: ["Encode two observations and decode points between their posterior means. Smooth-looking outputs reveal behavior along that path, without establishing overall probabilistic correctness or downstream usefulness. In high-dimensional Gaussian spaces, a straight interpolation can also pass through atypical regions."],
      formula: "z(t) = (1 − t) μ(xa) + t μ(xb),  0 ≤ t ≤ 1\nintermediate output = decoder(z(t))",
    },
    {
      id: "generation", title: "Generate from the prior without an input",
      paragraphs: ["Draw a latent from the prior and pass it through the trained decoder. A decoder mean or probability is a distribution parameter. Drawing an observation adds another random step. For binary images, sigmoid gives pixel probabilities and a Bernoulli draw gives a binary observation."],
      code: "with torch.no_grad():\n    latent = torch.randn(number_of_samples, latent_dim)\n    probabilities = torch.sigmoid(model.decoder(latent))\n    observations = torch.bernoulli(probabilities)",
    },
    {
      id: "diagnostics", title: "Inspect the objective, reconstructions, and latent use",
      paragraphs: ["Track training and validation reconstruction NLL, KL, and their combination separately. Inspect representative reconstructions, fresh prior samples, interpolation, and latent parameter distributions. Compare latent dimensions under the same evaluation protocol. Selected attractive examples can conceal missing modes or weak latent use."],
      table: { headers: ["Diagnostic", "Question"], rows: [["Separate reconstruction and KL curves", "Which term changed when total loss improved?"], ["Clean and corrupted reconstructions", "What survives compression or corruption?"], ["Prior probabilities and observation samples", "Does generation work without an encoded input?"], ["Interpolation", "What happens along this chosen path?"], ["Shuffled-code reconstruction", "Does the decoder use the input-specific code?"]] },
    },
    {
      id: "dimensionality-reduction", title: "Define the goal before comparing with PCA",
      paragraphs: ["An autoencoder can perform dimensionality reduction with a low-dimensional code. Its behavior still depends on architecture, objective, optimization, and data. Define what should be preserved, such as reconstruction fidelity, neighborhood relationships, or downstream prediction. A nonlinear autoencoder does not automatically inherit PCA's orthogonality or variance-ordering properties."],
    },
    {
      id: "week-activities", title: "Week 10 activities and the adversarial-learning preview",
      paragraphs: ["The supplied lecture lists VAE and reparameterization demonstrations, Discussion 10 with an initial post and follow-up, Knowledge Check 10, and Lab 3 on autoencoders and VAEs. For the lab, identify each component in your implementation and explain the reconstruction and KL outputs separately.", "The deck closes with an adversarial-learning preview. A generator receives feedback from a discriminator trained to distinguish generated observations from data. Compare that signal with a VAE's likelihood and KL terms: what supplies the learning signal, and what evidence demonstrates useful generation?"],
    },
  ],
  pitfalls: [
    ["Reconstruction automatically supplies a sampling distribution", "Ordinary autoencoders supply deterministic codes. Useful generation needs additional assumptions or an explicit probabilistic model."],
    ["The denoising target should be corrupted", "Corrupt the input and retain the clean observation as the target."],
    ["Use exp(logvar) as standard deviation", "Standard deviation is exp(0.5 × logvar)."],
    ["Reparameterization removes randomness", "Epsilon remains random. The learned shift and scale make the sample differentiable in the encoder parameters."],
    ["KL is another reconstruction metric", "KL compares latent distributions. Reconstruction NLL evaluates an observation under the decoder."],
    ["Lower KL or total loss proves better generation", "Inspect both loss terms, latent dependence, prior samples, and diversity."],
  ],
  practice: [
    ["Write the inputs and targets for ordinary and denoising autoencoders.", "The ordinary model receives clean x and targets x. The denoising model receives corrupted x̃ and still targets clean x."],
    ["Calculate z for μ = 1, logvar = log 4, and ε = −0.5.", "Standard deviation is exp(0.5 log 4) = 2, so z = 1 + 2 × (−0.5) = 0."],
    ["Calculate KL for μ = (1, 0) and logvar = (0, 0).", "The coordinates contribute 0.5 and 0 nats, giving a per-example KL of 0.5 nats."],
    ["Reconstruction NLL is 8 and KL is 2. Compare β = 1 and β = 0.25.", "The ordinary negative ELBO is 10. The modified objective is 8.5. These differently weighted totals are not directly comparable quality scores."],
    ["Investigate a KL value approaching zero.", "Compare ordinary and shuffled-code reconstructions, latent parameter variation, and prior samples. Similar outputs after replacing the code support the hypothesis of little input-specific latent use."],
    ["Design a report for Lab 3.", "Describe the data split, corruption, encoder, decoder, latent dimension, mean and log-variance heads, reparameterization, likelihood, and loss reductions. Show separate reconstruction and KL curves, representative reconstructions, prior samples, interpolation, and a latent-use diagnostic."],
  ],
  review: [
    ["What can constrain copying in an autoencoder?", "Restricted latent dimension, sparsity, corruption, or regularization, with effectiveness depending on the data and objective."],
    ["What stays clean in denoising training?", "The reconstruction target stays clean even though the input is corrupted."],
    ["What does the VAE encoder output?", "Parameters of an approximate posterior, commonly mean and log-variance vectors."],
    ["Where is the randomness after reparameterization?", "In standard-normal epsilon, transformed by the learned mean and standard deviation."],
    ["Which distributions enter the KL?", "The approximate posterior qφ(z|x) and prior p(z), in KL(qφ(z|x) || p(z))."],
    ["When does Gaussian KL vanish?", "When all means are zero and all variances are one, matching the standard-normal prior."],
    ["Is β = 0.1 the ordinary negative ELBO?", "It is a modified objective with a different KL weight. The ordinary negative ELBO uses β = 1."],
    ["How do prior sampling and reconstruction differ?", "Prior sampling starts with p(z) and needs no input. Reconstruction uses an observed input and its inferred code."],
    ["Does a smooth interpolation prove a good generative distribution?", "It describes one path and does not establish overall quality, diversity, or probabilistic correctness."],
    ["Are decoder probabilities binary observations?", "They parameterize Bernoulli distributions. A further draw produces a binary observation."],
  ],
  experiment: {
    title: "Compare an autoencoder, a denoising autoencoder, and a VAE",
    description: "Train explicit PyTorch models on generated 8×8 binary bar images. Compare clean and corrupted reconstruction, then inspect the VAE's Bernoulli reconstruction NLL, Gaussian KL, prior samples, interpolation, and sensitivity to shuffled codes. Export loss histories and pixel values to CSV for plotting. Validation selects checkpoints, with a separate test split for reporting.",
    checks: ["Confirm that denoising always targets the clean image.", "Follow mean, log-variance, epsilon, and sampled code through the VAE.", "Keep pixel-summed reconstruction and latent-summed KL explicit.", "Inspect decoder probabilities and binary observations from prior draws.", "Compare ordinary and shuffled-code reconstruction alongside other collapse diagnostics.", "Repeat with --beta 0.1 or a different --latent-dim while keeping splits and budgets fixed."],
  },
  bridge: "Reconstruction makes latent representations explicit. Probabilistic inference adds a prior and an objective for generation. Carry the distinction between reconstructing an input and drawing a new observation into comparisons of generative methods.",
  references: [
    { title: "Kingma & Welling — Auto-Encoding Variational Bayes", url: "https://arxiv.org/abs/1312.6114", note: "The probabilistic model, variational objective, and reparameterized gradient estimator." },
    { title: "PyTorch — Binary cross-entropy with logits", url: "https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.binary_cross_entropy_with_logits.html", note: "The stable Bernoulli reconstruction loss used in the binary-image experiment." },
  ],
};
