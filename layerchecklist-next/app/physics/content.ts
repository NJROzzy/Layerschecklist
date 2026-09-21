export const reviewedOnISO = "2026-09-20";
export const reviewedOn = "September 20, 2026";

export const chapters = [
  ["method", "How physics works"], ["scales", "Scales"], ["conserved", "What never changes"],
  ["fields", "Fields"], ["chance", "Chance & heat"], ["quantum", "The quantum turn"],
  ["life", "Physics into Biology"], ["bridge", "Physics & machine learning"], ["open", "Still open"], ["start", "Where to start"],
] as const;

export const lifeBridges = [
  { label: "MOTION → TRANSPORT", title: "Small steps, changing concentrations", detail: "Random molecular motion can produce net diffusion. At cellular distances it is an important transport mechanism; over larger distances, bulk flow can move materials faster.", href: "/biology#bio-diffusion", link: "Try the diffusion model", source: "https://openstax.org/books/college-physics-2e/pages/12-7-molecular-transport-phenomena-diffusion-osmosis-and-related-processes" },
  { label: "ENERGY → CELLULAR WORK", title: "Gradients can power a cell", detail: "Electron transport can build a proton gradient across a membrane. Coupling the return flow to ATP synthase connects an electrochemical potential difference to ATP production.", href: "/biology#energy", link: "Explore molecules and energy", source: "https://www.ncbi.nlm.nih.gov/books/NBK26904/" },
  { label: "CHARGE → SIGNALS", title: "Membranes have electrical properties", detail: "Charge separation and selective ion channels shape membrane voltage. Changes in conductance help produce the electrical signals of nerve and muscle cells.", href: "/biology#systems", link: "Explore bodies, brains and feedback", source: "https://openstax.org/books/college-physics-2e/pages/20-7-nerve-conduction-electrocardiograms" },
];

export const pillars = [
  { name: "Conservation", idea: "Some quantities never change, whatever else happens. Energy, momentum, charge.", why: "You can often answer a question about the end without following the middle." },
  { name: "Symmetry", idea: "If a situation looks the same after some change, that change protects a quantity.", why: "Noether's theorem turns an aesthetic observation into a calculation." },
  { name: "Least action", idea: "Of all the paths a system could take, it takes the one that makes the action stationary.", why: "Mechanics, optics and field theory all restate as the same optimisation." },
  { name: "Statistics over detail", idea: "When there are 10²³ particles, stop tracking them and describe the distribution.", why: "Temperature, pressure and entropy are all properties of a distribution, not a particle." },
  { name: "Scale separation", idea: "Most phenomena depend on a narrow band of scales, so you can ignore the rest.", why: "It is why you can build a bridge without quantum mechanics — and why turbulence is hard, because it refuses to separate." },
];

export const scales = [
  { power: -35, label: "Planck length", note: "Where our current theories stop making predictions." },
  { power: -18, label: "Quark", note: "The smallest distance probed by collider experiments." },
  { power: -15, label: "Atomic nucleus", note: "Where the strong force dominates." },
  { power: -10, label: "Atom", note: "Chemistry lives here." },
  { power: -9, label: "Transistor gate", note: "Modern chips are a few tens of atoms across." },
  { power: -6, label: "Bacterium", note: "Where viscosity beats inertia and swimming works differently." },
  { power: 0, label: "A person", note: "The scale our intuition was built for." },
  { power: 7, label: "Earth", note: "Gravity, weather, oceans." },
  { power: 11, label: "Earth to Sun", note: "Light takes eight minutes." },
  { power: 21, label: "The galaxy", note: "Where dark matter shows itself in rotation curves." },
  { power: 26, label: "Observable universe", note: "Limited by how long light has had to travel." },
];

export const bridges = [
  { physics: "Boltzmann distribution", ml: "Softmax and temperature sampling", detail: "The probability of a state falling exponentially with energy over temperature is exactly the softmax over negative logits. Sampling temperature is not a metaphor — it is the same parameter in the same position." },
  { physics: "Non-equilibrium thermodynamics", ml: "Diffusion models", detail: "Adding noise until structure is gone and learning to run it backwards was proposed directly from this literature, and is now written as a stochastic differential equation." },
  { physics: "Spin glasses", ml: "Loss landscapes", detail: "Disordered systems with conflicting interactions and vast numbers of near-degenerate minima are the closest physical analogue to a deep network's landscape, and one of the few sources of real theory about it." },
  { physics: "The Ising model", ml: "Hopfield networks and energy-based models", detail: "Spins preferring to agree with neighbours, with the couplings learned rather than given. The 2024 Nobel Prize in Physics recognised this lineage." },
  { physics: "Noether's theorem", ml: "Equivariant architectures", detail: "Build a symmetry into the model and the corresponding invariance comes free, rather than being learned from data that may not contain enough of it." },
  { physics: "Hamiltonian dynamics", ml: "Hamiltonian Monte Carlo", detail: "Sampling a distribution by treating its negative log-density as a potential energy and rolling a particle across it, using a symplectic integrator to keep the energy honest." },
  { physics: "Variational principles", ml: "Variational inference", detail: "Both replace an intractable problem with the search for the best member of a tractable family. The shared word is not a coincidence." },
  { physics: "Renormalisation group", ml: "Depth and coarse-graining", detail: "An appealing account of what successive layers do to detail. Suggestive, repeatedly proposed, and not established — worth knowing as an open analogy rather than a result." },
];

export const openQuestions = [
  { q: "What is dark matter?", detail: "Roughly five times more mass than everything visible, detected only through gravity. Decades of direct searches have returned nothing.", level: "Entry: orbital mechanics. Frontier: particle astrophysics, detector design." },
  { q: "Why is the expansion accelerating?", detail: "Called dark energy, which names the observation rather than explaining it. It is about 70% of the universe's energy budget.", level: "Entry: Hubble's law. Frontier: general relativity, observational cosmology." },
  { q: "How do gravity and quantum mechanics fit together?", detail: "Our two best theories use incompatible mathematics and disagree wherever both matter — inside black holes, and at the first instant.", level: "Entry: special relativity and quantum states. Frontier: quantum field theory in curved spacetime." },
  { q: "What actually happens in a measurement?", detail: "The formalism predicts outcomes with extraordinary precision and does not say what selects one. Interpretations differ; experiments so far do not.", level: "Entry: superposition. Frontier: decoherence, foundations." },
  { q: "Can turbulence be solved?", detail: "The equations have been known since 1845. Their behaviour across scales still resists both analysis and complete simulation.", level: "Entry: Reynolds number. Frontier: PDE analysis, spectral methods, learned closures." },
  { q: "What makes high-temperature superconductors work?", detail: "The low-temperature theory is settled and does not explain the materials discovered in 1986. Nearly forty years on, there is no consensus.", level: "Entry: band structure. Frontier: strongly correlated electron systems." },
  { q: "Why is there more matter than antimatter?", detail: "The Standard Model allows an asymmetry far too small to explain why anything exists at all.", level: "Entry: particle conservation laws. Frontier: CP violation, neutrino physics." },
];

export const startHere = [
  { step: "Get the units habit first", detail: "Before any topic, make dimensional analysis automatic. If both sides of an equation do not describe the same kind of thing, nothing after that matters.", signal: "You catch your own errors by inspection rather than by checking the answer." },
  { step: "Mechanics, slowly and with your hands", detail: "Position, velocity, acceleration, force, momentum, energy. Do the problems. This is where physical intuition is actually built and there is no shortcut past it.", signal: "You can predict roughly what will happen before you calculate." },
  { step: "Then waves and oscillations", detail: "The harmonic oscillator is the most reused model in the subject and it appears in every branch after this one. Time spent here pays back everywhere.", signal: "You recognise a restoring force when you see one." },
  { step: "Electromagnetism, for the field idea", detail: "The content matters, but the bigger prize is learning to think in fields — a quantity defined everywhere, acting locally.", signal: "“Action at a distance” starts to sound like the strange idea it is." },
  { step: "Thermodynamics before quantum", detail: "Entropy, temperature and the statistical view of many particles. It is also the branch that connects most directly to machine learning.", signal: "You can explain why entropy in physics and entropy in information theory are the same quantity." },
  { step: "Now quantum, and expect discomfort", detail: "The mathematics is learnable and the interpretation is genuinely unsettled. Learn to calculate first and argue about meaning afterwards.", signal: "You are comfortable saying “the formalism predicts this and nobody agrees what it means”." },
];

export const resources = [
  { name: "The Feynman Lectures on Physics", kind: "Free online", note: "The whole thing, free from Caltech. Still the best explanation of why anybody would care.", href: "https://www.feynmanlectures.caltech.edu/" },
  { name: "MIT 8.01 Classical Mechanics", kind: "Full course", note: "A complete first mechanics course with problem sets and exams.", href: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/" },
  { name: "MIT 8.02 Electricity and Magnetism", kind: "Full course", note: "The follow-on, and where the field idea is properly built.", href: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/" },
  { name: "MIT 8.04 Quantum Physics I", kind: "Full course", note: "A serious undergraduate introduction rather than a popularisation.", href: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/" },
  { name: "3Blue1Brown", kind: "Video series", note: "Not physics-specific, but the differential-equations and Fourier series are the right intuition for most of this atlas.", href: "https://www.3blue1brown.com/topics/differential-equations" },
  { name: "arXiv physics", kind: "Preprints", note: "Where the research actually appears, months before journals.", href: "https://arxiv.org/archive/physics" },
];
