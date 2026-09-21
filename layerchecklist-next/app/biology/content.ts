export const chapters = [
  ["life", "What biology explains"], ["energy", "Molecules & energy"], ["cells", "Cells & boundaries"],
  ["genes", "Information & inheritance"], ["evolution", "Evolution"], ["systems", "Bodies, brains & feedback"],
  ["ecology", "Populations & ecosystems"], ["computing", "Experiments & computation"],
  ["questions", "Open questions"], ["start", "A path through biology"],
] as const;

export const levelsOfLife = [
  { name: "Molecule", example: "An enzyme catalyzes a reaction.", question: "How do structure, chemistry and the environment affect what it does?" },
  { name: "Cell", example: "A membrane separates an internal environment from its surroundings.", question: "How are energy, materials and signals exchanged?" },
  { name: "Organism", example: "Organs coordinate transport, movement and regulation.", question: "How do parts maintain a functioning whole?" },
  { name: "Population", example: "Individuals reproduce, compete and vary.", question: "How do abundance and inherited traits change across generations?" },
  { name: "Ecosystem", example: "Organisms interact with one another and their physical environment.", question: "How do energy, matter and disturbances move through the system?" },
];

export const bridges = [
  { task: "Protein structure prediction", data: "Amino-acid sequences, evolutionary information and known structures", method: "Learn spatial relationships and predict a structure", check: "Assess confidence and compare against independent experimental measurements. Structure prediction is not a complete account of folding dynamics or function." },
  { task: "Sequence analysis", data: "DNA, RNA or protein sequences", method: "Alignment, statistical models and learned sequence representations", check: "Separate related sequences between training and testing when evaluating generalization; random splits can hide similarity leakage." },
  { task: "Cell imaging", data: "Microscopy images and annotations", method: "Detect, segment and track cells", check: "Check performance across instruments, preparation methods and biological conditions, not only images from the same batch." },
  { task: "Single-cell measurements", data: "Many molecular measurements per cell", method: "Model variation, cluster observations and estimate cell states", check: "Account for donors, batch effects and measurement noise. Nearby points on a 2D embedding do not prove a developmental or causal relationship." },
  { task: "Ecological monitoring", data: "Camera, acoustic and field observations", method: "Classify species and estimate occupancy or abundance", check: "Account for imperfect detection and changes in habitat, season and sampling effort." },
];

export const openQuestions = [
  { title: "How did the first evolving systems arise?", text: "Origin-of-life research connects chemistry, compartments, energy and heredity. Experiments demonstrate individual mechanisms, but a complete historical sequence remains unresolved." },
  { title: "How does a genome build a body?", text: "Development combines regulation, signaling, mechanics and environment. Predicting a whole organism from sequence alone leaves many levels of organization unspecified." },
  { title: "How does neural activity support behavior and experience?", text: "Neural recordings and interventions reveal mechanisms at many scales. A connectome describes wiring; it does not by itself specify dynamics, learning or subjective experience." },
  { title: "When can we predict an ecosystem's response?", text: "Feedback, adaptation, migration and environmental change can alter responses to the same disturbance. Useful models need a stated scale and tests against new observations." },
];

export const learningSteps = [
  { title: "Start with chemistry and cells", task: "Sketch a membrane, identify the main molecular families, and explain why maintaining a gradient requires an energy account." },
  { title: "Follow genetic information", task: "Distinguish replication, transcription and translation. Explain why changing a DNA sequence does not necessarily change a trait." },
  { title: "Think in populations", task: "Separate mutation, selection, drift and gene flow. Read genotype proportions without assuming that dominant means common." },
  { title: "Connect mechanisms across scales", task: "Trace a signal through molecules, cells, tissues and behavior, stating which parts you measured and which you inferred." },
  { title: "Design an experiment before a model", task: "Name the experimental unit, control, response and potential confounder. Keep independent biological replication separate from repeated measurements." },
  { title: "Use computation to test a claim", task: "Write a simple model, inspect its assumptions, and compare its predictions with observations it was not fitted to." },
];

export const resources = [
  { name: "MIT Fundamentals of Biology", note: "Biochemistry, molecular biology and genetics with lectures and exercises.", href: "https://ocw.mit.edu/courses/7-01sc-fundamentals-of-biology-fall-2011/" },
  { name: "OpenStax Biology 2e", note: "A broad introductory textbook spanning cells, organisms, evolution and ecology.", href: "https://openstax.org/details/books/biology-2e" },
  { name: "NHGRI genetics glossary", note: "Definitions and diagrams for the language of genomes and inheritance.", href: "https://www.genome.gov/genetics-glossary" },
  { name: "AlphaFold's 2021 research paper", note: "The original study reports the prediction task, methods, evidence and limits of its evaluation.", href: "https://www.nature.com/articles/s41586-021-03819-2" },
];
