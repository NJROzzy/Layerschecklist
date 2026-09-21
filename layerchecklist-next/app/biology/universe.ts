/**
 * A biology atlas, plotted as one circle.
 *
 * Distance from the centre is roughly how much has to be understood first —
 * the middle introduces familiar observations and the outer rings suggest advanced study. Each wedge
 * is a branch. `compute` marks where this subject and machine learning share
 * a method rather than a metaphor, which in biology is unusually often.
 */

export type BranchId =
  | "molecules" | "cell" | "genes" | "central" | "development" | "evolution"
  | "physiology" | "neuro" | "immune" | "ecology" | "medicine" | "methods";

export const branches: { id: BranchId; label: string; short: string }[] = [
  { id: "molecules", label: "Molecules of life", short: "Molecules" },
  { id: "cell", label: "The cell", short: "Cell" },
  { id: "genes", label: "Genetics & genomes", short: "Genetics" },
  { id: "central", label: "Molecular biology", short: "Molecular" },
  { id: "development", label: "Development", short: "Development" },
  { id: "evolution", label: "Evolution", short: "Evolution" },
  { id: "physiology", label: "Physiology & systems", short: "Physiology" },
  { id: "neuro", label: "Neuroscience", short: "Neuroscience" },
  { id: "immune", label: "Microbes & immunity", short: "Immunity" },
  { id: "ecology", label: "Ecology & behaviour", short: "Ecology" },
  { id: "medicine", label: "Medicine & biotechnology", short: "Medicine" },
  { id: "methods", label: "Methods & computation", short: "Methods" },
];

export const levels = ["Starting observations", "School foundations", "Core university", "Deeper connections", "Advanced study"];

export type Idea = {
  id: string; name: string; branch: BranchId; ring: 0 | 1 | 2 | 3 | 4;
  what: string;
  compute?: string;
  world?: string;
  needs?: string[];
};

export const ideas: Idea[] = [
  /* ---- Molecules of life --------------------------------------------------- */
  { id: "water", name: "Water", branch: "molecules", ring: 0, what: "A polar molecule that forms hydrogen bonds and dissolves many ionic and polar substances; it does not dissolve every biological material.", world: "Water is a major component of cells and a medium for many biochemical reactions." },
  { id: "carbon", name: "Carbon chemistry", branch: "molecules", ring: 1, what: "Carbon commonly forms four covalent bonds, allowing diverse chains, rings and molecular structures.", world: "Every organic molecule you have ever eaten." },
  { id: "macromolecule", name: "The four families", branch: "molecules", ring: 1, what: "Proteins, nucleic acids, carbohydrates and lipids. Almost everything in a cell is one of these.", needs: ["carbon"] },
  { id: "amino-acid", name: "Amino acids", branch: "molecules", ring: 2, what: "The standard genetic code specifies 20 common amino acids; additional genetically encoded amino acids occur in particular biological contexts.", compute: "Protein sequence models learn statistical patterns in amino-acid sequences; the alphabet alone does not guarantee useful prediction.", needs: ["macromolecule"] },
  { id: "protein", name: "Proteins", branch: "molecules", ring: 2, what: "Amino-acid chains with structural, catalytic and regulatory roles. Function depends on structure, dynamics, interactions and environment.", compute: "Models such as AlphaFold predict protein structures; they do not completely solve folding dynamics or biological function.", world: "Enzymes, antibodies, muscle, hair.", needs: ["amino-acid"] },
  { id: "folding", name: "Protein folding", branch: "molecules", ring: 3, what: "A polypeptide explores conformations and can adopt functional structures. Timescales, partners and cellular conditions matter.", compute: "Structure prediction and molecular simulation address related but different questions about proteins.", needs: ["protein", "thermo-bio"] },
  { id: "enzyme", name: "Enzymes", branch: "molecules", ring: 2, what: "Biological catalysts, usually proteins but sometimes RNA, that lower activation barriers without changing reaction equilibrium.", compute: "Learned models can help propose or evaluate enzyme variants; their activity needs experimental testing.", world: "Digestion, laundry detergent, brewing.", needs: ["protein"] },
  { id: "lipid", name: "Lipids & membranes", branch: "molecules", ring: 2, what: "A diverse molecular family. Amphipathic lipids can assemble into bilayers; other lipids store energy or act as signals.", world: "The reason a cell has an inside at all.", needs: ["macromolecule", "water"] },
  { id: "atp", name: "ATP & energy currency", branch: "molecules", ring: 2, what: "A nucleotide used to couple reactions and support cellular work through favorable hydrolysis under cellular conditions.", world: "ATP is continually produced and consumed in metabolism.", needs: ["macromolecule"] },
  { id: "thermo-bio", name: "Thermodynamics of life", branch: "molecules", ring: 3, what: "Living things build order locally by exporting more disorder. The second law is obeyed, not dodged.", compute: "The free-energy expressions here are the same ones behind energy-based models.", needs: ["atp"] },
  { id: "structure-bio", name: "Structural biology", branch: "molecules", ring: 3, what: "Determining molecular shapes by X-ray crystallography, NMR or cryo-electron microscopy.", compute: "Cryo-EM reconstruction is a large inverse problem, and learned denoisers are now standard in the pipeline.", needs: ["protein"] },
  { id: "molecular-machine", name: "Molecular machines", branch: "molecules", ring: 4, what: "Protein assemblies that rotate, walk and pump — physical mechanisms at the nanometre scale.", world: "ATP synthase couples ion gradients to ATP synthesis in many cellular systems.", needs: ["enzyme", "atp"] },

  /* ---- The cell ------------------------------------------------------------ */
  { id: "cell-theory", name: "Cells", branch: "cell", ring: 0, what: "Everything alive is made of them, and every one comes from another one.", world: "You are roughly thirty trillion of them, plus about as many bacteria." },
  { id: "membrane", name: "The cell membrane", branch: "cell", ring: 1, what: "A lipid sheet that decides what gets in and out. The first thing life needed was a boundary.", needs: ["lipid", "cell-theory"] },
  { id: "organelle", name: "Organelles", branch: "cell", ring: 1, what: "A specialized subcellular structure. Many organelles are membrane-bound; the term also includes structures without a surrounding membrane.", needs: ["membrane"] },
  { id: "mitochondria", name: "Mitochondria", branch: "cell", ring: 2, what: "Organelles involved in energy metabolism and other processes, with an evolutionary origin in bacterial endosymbiosis.", world: "Human mitochondrial DNA is generally maternally inherited and is useful in studying maternal lineages.", needs: ["organelle", "atp"] },
  { id: "transport", name: "Transport across membranes", branch: "cell", ring: 2, what: "Diffusion, pumps and channels — some free, some paid for in ATP.", needs: ["membrane", "atp"] },
  { id: "signalling", name: "Cell signalling", branch: "cell", ring: 3, what: "Receptors, cascades and second messengers: how a cell learns what is happening outside it.", compute: "A signalling network is a directed graph, and is analysed as one.", needs: ["protein", "membrane"] },
  { id: "cell-cycle", name: "The cell cycle", branch: "cell", ring: 2, what: "Grow, copy the DNA, check, divide. Checkpoints stop a damaged cell proceeding.", world: "Cancer is largely this control system failing.", needs: ["cell-theory", "dna"] },
  { id: "mitosis", name: "Mitosis & meiosis", branch: "cell", ring: 2, what: "One division makes identical copies; the other halves the chromosomes and shuffles them.", needs: ["cell-cycle", "chromosome"] },
  { id: "apoptosis", name: "Programmed cell death", branch: "cell", ring: 3, what: "Cells that dismantle themselves on cue. Essential rather than pathological.", world: "It is how your fingers separated in the womb.", needs: ["signalling"] },
  { id: "cytoskeleton", name: "The cytoskeleton", branch: "cell", ring: 3, what: "A dynamic scaffold that gives shape, moves cargo and pulls chromosomes apart.", needs: ["protein", "organelle"] },

  /* ---- Genetics & genomes ---------------------------------------------------- */
  { id: "inheritance", name: "Inheritance", branch: "genes", ring: 0, what: "Offspring resemble parents, in a pattern regular enough to have been worked out from pea plants.", world: "Eye colour, height, and every family resemblance." },
  { id: "gene", name: "Genes", branch: "genes", ring: 1, what: "A DNA region that contributes to a functional RNA or protein product; processing and regulation complicate a simple one-gene/one-product view.", needs: ["inheritance", "dna"] },
  { id: "dna", name: "DNA", branch: "genes", ring: 1, what: "A nucleic acid whose complementary bases support information storage and template-based copying. Replication requires molecular machinery.", compute: "Sequence models can learn genomic patterns, but useful prediction depends on biological context and suitable evaluation.", needs: ["macromolecule"] },
  { id: "chromosome", name: "Chromosomes", branch: "genes", ring: 2, what: "A DNA-containing structure carrying genes. Most human somatic cells have 23 chromosome pairs; gametes and some other cell types differ.", needs: ["dna"] },
  { id: "allele", name: "Alleles & dominance", branch: "genes", ring: 2, what: "A variant at a genetic locus. Dominance describes a heterozygote phenotype for a specified trait, not how common or advantageous an allele is.", needs: ["gene"] },
  { id: "mutation", name: "Mutation", branch: "genes", ring: 2, what: "Changes to the sequence, from copying errors to radiation. The raw material of evolution.", compute: "Predicting which mutations matter is a classification problem with badly imbalanced labels.", needs: ["dna"] },
  { id: "recombination", name: "Recombination", branch: "genes", ring: 3, what: "Chromosomes swapping segments during meiosis, so offspring are not either parent.", needs: ["mitosis", "chromosome"] },
  { id: "genome", name: "Genomes", branch: "genes", ring: 3, what: "The complete sequence. Human: three billion bases, of which protein-coding genes are about 2%.", compute: "Sequencing costs fell faster than Moore's law, and the bottleneck moved to interpretation.", needs: ["chromosome"] },
  { id: "gwas", name: "Genome-wide association", branch: "genes", ring: 3, what: "Scanning many genomes for variants statistically linked to a trait.", compute: "A multiple-testing problem at a scale that forced the field to be rigorous about false discovery.", needs: ["genome", "stats-bio"] },
  { id: "polygenic", name: "Polygenic traits", branch: "genes", ring: 4, what: "Traits influenced by variation at multiple genetic loci, often together with environmental effects.", compute: "Polygenic-score performance can vary across populations and study settings, requiring careful validation.", needs: ["gwas"] },
  { id: "epigenetics", name: "Epigenetics", branch: "genes", ring: 3, what: "Heritable changes in gene activity that do not change the sequence, such as methylation.", compute: "Methylation clocks estimate biological age from these marks.", needs: ["gene-reg"] },

  /* ---- Molecular biology ------------------------------------------------------ */
  { id: "central-dogma", name: "The central dogma", branch: "central", ring: 1, what: "A framework for sequence-information transfer: transcription produces RNA and translation produces protein. RNA-to-DNA transfer also occurs; proteins do not generally specify nucleic-acid sequences.", compute: "Computational models study sequence-to-expression and sequence-to-structure relationships.", needs: ["dna", "protein"] },
  { id: "transcription", name: "Transcription", branch: "central", ring: 2, what: "Copying a gene into RNA, which is where most regulation happens.", needs: ["central-dogma"] },
  { id: "translation", name: "Translation", branch: "central", ring: 2, what: "Ribosomes reading RNA three bases at a time and building the protein chain.", needs: ["central-dogma", "rna"] },
  { id: "rna", name: "RNA", branch: "central", ring: 2, what: "DNA's single-stranded relative. Messenger, machine and regulator all at once.", world: "mRNA vaccines are this molecule used as a temporary instruction.", needs: ["dna"] },
  { id: "genetic-code", name: "The genetic code", branch: "central", ring: 2, what: "Which triplet means which amino acid. Nearly universal across all life, which is itself evidence of common descent.", compute: "A mapping from codons to amino acids or stop signals; multiple codons can specify the same amino acid.", needs: ["translation", "amino-acid"] },
  { id: "gene-reg", name: "Gene regulation", branch: "central", ring: 3, what: "Processes controlling gene-product abundance and activity. Many cell types share most of their genome but differ in expression and regulation.", compute: "Regulatory networks are graphs, and predicting expression from sequence is an active benchmark.", needs: ["transcription"] },
  { id: "splicing", name: "Splicing", branch: "central", ring: 3, what: "Cutting and rejoining RNA, so one gene can produce several different proteins.", compute: "Splice-site prediction was one of the first genuine deep-learning wins in genomics.", needs: ["rna"] },
  { id: "crispr", name: "CRISPR", branch: "central", ring: 3, what: "A bacterial immune system repurposed into programmable gene editing.", compute: "Guide design and off-target prediction are both learned models.", world: "The first approved CRISPR therapy was licensed in 2023.", needs: ["gene", "immune-innate"] },
  { id: "noncoding", name: "Non-coding DNA", branch: "central", ring: 4, what: "Most of the genome does not code for protein. How much of it does anything is still argued over.", needs: ["genome", "gene-reg"] },

  /* ---- Development ------------------------------------------------------------ */
  { id: "growth", name: "Growing", branch: "development", ring: 0, what: "One cell becomes an organism with the right parts in the right places, without a blueprint anywhere.", world: "Every living thing you have ever seen did this." },
  { id: "stem-cell", name: "Stem cells", branch: "development", ring: 2, what: "Cells that can become other kinds. Potency narrows as development proceeds.", world: "Bone-marrow transplants; regenerative medicine.", needs: ["cell-cycle", "growth"] },
  { id: "differentiation", name: "Differentiation", branch: "development", ring: 3, what: "A cell committing to an identity by switching on one set of genes and shutting others.", compute: "Waddington's landscape — a valley picture of cell fate — is now fitted numerically from single-cell data.", needs: ["gene-reg", "stem-cell"] },
  { id: "morphogen", name: "Morphogen gradients", branch: "development", ring: 3, what: "A chemical spread in a gradient, with cells reading the concentration to learn their position.", compute: "A reaction–diffusion PDE, solved by the embryo rather than by you.", needs: ["signalling", "growth"] },
  { id: "hox", name: "Hox genes & body plans", branch: "development", ring: 3, what: "A conserved set of genes laying out the head-to-tail axis, in ordered clusters, across most animals.", needs: ["gene-reg", "morphogen"] },
  { id: "pattern", name: "Pattern formation", branch: "development", ring: 4, what: "How stripes, spots and digits arise from uniform tissue. Turing proposed a mechanism in 1952.", compute: "Turing patterns are the classic demonstration that simple local rules produce global structure.", world: "Animal coat markings, fingerprints.", needs: ["morphogen"] },
  { id: "regeneration", name: "Regeneration", branch: "development", ring: 4, what: "Some animals regrow limbs and organs. Why mammals largely cannot is unresolved.", needs: ["stem-cell", "differentiation"] },

  /* ---- Evolution ---------------------------------------------------------------- */
  { id: "variation", name: "Variation", branch: "evolution", ring: 0, what: "No two individuals are identical, and some of the difference is heritable.", world: "Obvious in any litter of puppies." },
  { id: "natural-selection", name: "Natural selection", branch: "evolution", ring: 1, what: "Differences in reproductive success associated with heritable variation in a particular environment, without foresight or a predetermined goal.", compute: "Evolutionary and genetic algorithms are this loop run deliberately, and are competitive where gradients are unavailable.", needs: ["variation", "inheritance"] },
  { id: "fitness", name: "Fitness landscapes", branch: "evolution", ring: 3, what: "A surface over genotypes whose height is reproductive success. Populations climb it locally.", compute: "The metaphor machine learning borrowed for loss landscapes, running the other way up.", needs: ["natural-selection"] },
  { id: "drift", name: "Genetic drift", branch: "evolution", ring: 3, what: "Allele frequencies wander by chance, and in small populations chance beats selection.", compute: "A random walk with absorbing states.", needs: ["allele", "natural-selection"] },
  { id: "speciation", name: "Speciation", branch: "evolution", ring: 3, what: "Populations diverging until they no longer interbreed. Usually geography first, then genetics.", needs: ["drift", "natural-selection"] },
  { id: "phylogeny", name: "Phylogenetics", branch: "evolution", ring: 3, what: "Reconstructing the tree of relationships from sequence differences.", compute: "Tree inference over an enormous discrete space — solved with likelihood and MCMC.", needs: ["genome", "speciation"] },
  { id: "common-descent", name: "Common descent", branch: "evolution", ring: 2, what: "The shared genetic code, shared machinery and nested similarities all point to a single origin.", needs: ["genetic-code", "natural-selection"] },
  { id: "evo-devo", name: "Evo-devo", branch: "evolution", ring: 4, what: "Large changes in form often come from altering when and where existing genes are used, not from new genes.", needs: ["hox", "speciation"] },
  { id: "origin-life", name: "The origin of life", branch: "evolution", ring: 4, what: "How chemistry became something that copies itself with variation. Genuinely unsolved.", needs: ["rna", "thermo-bio"] },

  /* ---- Physiology & systems ------------------------------------------------------ */
  { id: "breathing", name: "Breathing & circulation", branch: "physiology", ring: 0, what: "Oxygen in, carbon dioxide out, pumped around by a muscle that does not stop.", world: "You did it about twenty thousand times today." },
  { id: "homeostasis", name: "Homeostasis", branch: "physiology", ring: 1, what: "Holding internal conditions steady against a changing outside, by negative feedback.", compute: "A control loop with a setpoint — the same structure as the PID panel in the simulation lab.", world: "Body temperature, blood glucose, pH.", needs: ["breathing"] },
  { id: "metabolism", name: "Metabolism", branch: "physiology", ring: 2, what: "The whole network of reactions that extract energy and build material.", compute: "Flux balance analysis models it as linear programming over a stoichiometric matrix.", needs: ["enzyme", "atp"] },
  { id: "hormones", name: "Hormones", branch: "physiology", ring: 2, what: "Chemical messages released into the blood, acting slowly and everywhere.", needs: ["signalling", "homeostasis"] },
  { id: "muscle", name: "Muscle & movement", branch: "physiology", ring: 2, what: "Protein filaments ratcheting past each other, powered by ATP.", compute: "Musculoskeletal models drive most humanoid robotics simulation.", needs: ["protein", "atp"] },
  { id: "organ-systems", name: "Organ systems", branch: "physiology", ring: 2, what: "Tissues organised into organs, organs into systems, each with a job and a failure mode.", needs: ["cell-theory", "homeostasis"] },
  { id: "microbiome", name: "The microbiome", branch: "physiology", ring: 4, what: "The bacteria living in and on you, which affect digestion, immunity and possibly mood.", compute: "Analysed with the same compositional statistics as ecology, and easy to over-interpret.", needs: ["bacteria", "organ-systems"] },
  { id: "ageing", name: "Ageing", branch: "physiology", ring: 4, what: "Accumulated damage, cellular senescence and shortening telomeres. No single agreed cause.", needs: ["cell-cycle", "epigenetics"] },

  /* ---- Neuroscience ---------------------------------------------------------------- */
  { id: "senses", name: "Senses", branch: "neuro", ring: 0, what: "Physical signals — light, pressure, chemicals — converted into nerve impulses.", world: "Everything you know about the world arrived this way." },
  { id: "neuron", name: "Neurons", branch: "neuro", ring: 1, what: "Cells that carry electrical signals and pass chemical messages to each other.", compute: "The inspiration for the artificial neuron — and far more complicated than one. The analogy is historical, not structural.", needs: ["cell-theory", "senses"] },
  { id: "action-potential", name: "Action potentials", branch: "neuro", ring: 2, what: "An all-or-nothing voltage spike travelling down an axon, driven by ion channels.", compute: "Spiking neural networks model this directly; standard deep learning does not.", needs: ["neuron", "transport"] },
  { id: "synapse", name: "Synapses", branch: "neuro", ring: 2, what: "The junction where one neuron influences the next, mostly chemically.", compute: "Synaptic strength is where the weight analogy comes from.", needs: ["action-potential"] },
  { id: "plasticity", name: "Synaptic plasticity", branch: "neuro", ring: 3, what: "Connections strengthen and weaken with use. Neurons that fire together wire together.", compute: "Hebbian learning, which produced Hopfield networks and the 2024 Nobel Prize lineage.", needs: ["synapse"] },
  { id: "brain-regions", name: "Brain organisation", branch: "neuro", ring: 2, what: "Regions with specialised roles, heavily interconnected rather than modular in any clean way.", needs: ["neuron"] },
  { id: "coding-neuro", name: "Neural coding", branch: "neuro", ring: 3, what: "How information is represented in spike rates, timing and population patterns.", compute: "Decoding it from recordings is a supervised learning problem, and the basis of brain–computer interfaces.", needs: ["action-potential", "brain-regions"] },
  { id: "learning-memory", name: "Learning & memory", branch: "neuro", ring: 3, what: "Encoding, consolidation and retrieval, distributed across regions rather than stored in one.", needs: ["plasticity"] },
  { id: "predictive-brain", name: "Predictive processing", branch: "neuro", ring: 4, what: "The proposal that the brain continually predicts its input and attends to the error.", compute: "Structurally close to a self-supervised objective, though the correspondence is contested.", needs: ["coding-neuro", "learning-memory"] },
  { id: "consciousness", name: "Consciousness", branch: "neuro", ring: 4, what: "Why any of this is accompanied by experience. There is not yet an agreed way to test the competing answers.", needs: ["brain-regions"] },
  { id: "connectome", name: "Connectomics", branch: "neuro", ring: 4, what: "Mapping neural connections at a chosen scale and resolution. Wiring is one part of an explanation that also needs dynamics and cell properties.", compute: "Image segmentation and tracing models assist reconstruction from microscopy, with proofreading and validation.", needs: ["synapse", "brain-regions"] },

  /* ---- Microbes & immunity --------------------------------------------------------- */
  { id: "germs", name: "Germs", branch: "immune", ring: 0, what: "Illness is often caused by living things too small to see. This took until the 1800s to accept.", world: "Handwashing, and why it was once controversial." },
  { id: "bacteria", name: "Bacteria", branch: "immune", ring: 1, what: "Single cells without a nucleus, vastly outnumbering everything else, mostly harmless.", needs: ["cell-theory", "germs"] },
  { id: "virus", name: "Viruses", branch: "immune", ring: 2, what: "Genetic material in a shell that can only reproduce inside a host cell. Arguably not alive.", compute: "Variant surveillance is sequence classification at global scale.", needs: ["dna", "cell-theory"] },
  { id: "immune-innate", name: "Innate immunity", branch: "immune", ring: 2, what: "Fast, general defences that do not need to have seen the threat before.", needs: ["cell-theory", "germs"] },
  { id: "immune-adaptive", name: "Adaptive immunity", branch: "immune", ring: 3, what: "A system that learns specific threats and remembers them, by generating and selecting receptors.", compute: "It generates enormous diversity and then selects — a search procedure implemented in tissue.", world: "Immune memory is an important mechanism through which many vaccines provide protection.", needs: ["immune-innate", "protein"] },
  { id: "antibody", name: "Antibodies", branch: "immune", ring: 3, what: "Immunoglobulin proteins that recognize molecular features and can support neutralization and other immune functions.", compute: "Models can help study antibody sequences, structures and binding, with experimental validation.", needs: ["immune-adaptive"] },
  { id: "antibiotic", name: "Antibiotic resistance", branch: "immune", ring: 3, what: "Evolution in real time under a selection pressure we applied ourselves.", compute: "Computational screening can prioritize candidate antimicrobial compounds for experimental investigation.", needs: ["bacteria", "natural-selection"] },
  { id: "epidemiology", name: "Epidemiology", branch: "immune", ring: 3, what: "How disease spreads through populations, and what changes the curve.", compute: "Compartmental models are coupled differential equations, fitted to noisy and biased data.", needs: ["virus", "stats-bio"] },

  /* ---- Ecology & behaviour ----------------------------------------------------------- */
  { id: "food-chain", name: "Eating and being eaten", branch: "ecology", ring: 0, what: "Feeding relationships transfer energy and matter. Primary production can use light or chemical energy, and energy available to consumers is reduced through metabolism.", world: "Why there are far fewer predators than prey." },
  { id: "ecosystem", name: "Ecosystems", branch: "ecology", ring: 1, what: "Organisms and their environment as one interacting system.", needs: ["food-chain"] },
  { id: "population", name: "Population dynamics", branch: "ecology", ring: 2, what: "How numbers change with birth, death and limits. Growth is never exponential for long.", compute: "The logistic map lives here, and was one of the first places chaos was noticed.", needs: ["ecosystem"] },
  { id: "predator-prey", name: "Predator and prey", branch: "ecology", ring: 3, what: "Coupled oscillations where each population drives the other, described by Lotka–Volterra.", compute: "A two-variable ODE system, and a standard test problem for learned dynamics.", needs: ["population"] },
  { id: "niche", name: "Niches & competition", branch: "ecology", ring: 3, what: "A species occupies a set of environmental conditions and resource relationships. Competition and coexistence depend on the mechanisms and setting.", needs: ["population", "natural-selection"] },
  { id: "behaviour", name: "Animal behaviour", branch: "ecology", ring: 2, what: "What animals do and why, from reflexes to learned strategy.", compute: "Pose-estimation and tracking models can assist behavioral measurement; validity depends on the species, setup and annotations.", needs: ["neuron", "ecosystem"] },
  { id: "collective", name: "Collective behaviour", branch: "ecology", ring: 3, what: "Flocks, shoals and colonies coordinating with no leader and only local information.", compute: "Exactly the flocking panel in the simulation lab — three local rules, global structure.", needs: ["behaviour"] },
  { id: "biodiversity", name: "Biodiversity & extinction", branch: "ecology", ring: 4, what: "Variation in genes, species and ecosystems, and the processes that maintain or reduce that variation.", compute: "Camera and acoustic classifiers can assist monitoring while accounting for detection and sampling biases.", needs: ["niche", "speciation"] },

  /* ---- Medicine & biotechnology ------------------------------------------------------- */
  { id: "disease", name: "What makes you ill", branch: "medicine", ring: 0, what: "Infection, injury, genetics, environment, or the body attacking itself. Different causes, different fixes.", world: "The first question any clinician is actually asking." },
  { id: "drug", name: "How drugs work", branch: "medicine", ring: 2, what: "Biological effects arise through mechanisms such as binding targets, altering pathways or replacing missing functions.", compute: "Virtual screening and molecular docking are among the oldest applications of learned scoring functions.", needs: ["protein", "enzyme"] },
  { id: "trial", name: "Clinical trials", branch: "medicine", ring: 3, what: "Studies designed to evaluate interventions in people. Designs differ; randomization, controls and blinding can address particular sources of bias.", compute: "Study design and independent evaluation are relevant to both clinical research and model assessment.", needs: ["stats-bio"] },
  { id: "cancer", name: "Cancer", branch: "medicine", ring: 3, what: "Cells that stop obeying growth controls, accumulate mutations, and evolve inside a body.", compute: "Tumour evolution is modelled phylogenetically, using the same trees as species.", needs: ["cell-cycle", "mutation"] },
  { id: "diagnostics", name: "Medical imaging & diagnostics", branch: "medicine", ring: 3, what: "Seeing inside a body without opening it, and deciding what the image means.", compute: "Image models can assist specific clinical tasks, with task-specific validation and evaluation across populations and settings.", needs: ["organ-systems"] },
  { id: "vaccine", name: "Vaccines", branch: "medicine", ring: 3, what: "An intervention designed to induce protective immune responses against a target. Platforms and mechanisms differ.", world: "Vaccines use immune recognition and memory through several types of biological platform.", needs: ["immune-adaptive", "rna"] },
  { id: "gene-therapy", name: "Gene therapy", branch: "medicine", ring: 4, what: "Approaches intended to treat disease by adding, altering or regulating genetic material in targeted cells.", needs: ["crispr", "virus"] },
  { id: "synthetic-bio", name: "Synthetic biology", branch: "medicine", ring: 4, what: "Designing biological parts and circuits deliberately, rather than only studying what exists.", compute: "Sequence and network models can support biological design, with laboratory experiments needed to establish function.", needs: ["gene-reg", "crispr"] },

  /* ---- Methods & computation -------------------------------------------------------- */
  { id: "microscope", name: "Microscopy", branch: "methods", ring: 0, what: "Most of biology began with somebody looking at something too small to see.", world: "Cells were discovered in 1665 by looking at cork." },
  { id: "experiment-bio", name: "Controls & experiments", branch: "methods", ring: 1, what: "Change one thing, hold the rest fixed, and include the condition where you change nothing.", compute: "An ablation is a control, and the same reasoning applies." },
  { id: "stats-bio", name: "Statistics in biology", branch: "methods", ring: 2, what: "Biological variation is large, so nearly every claim is statistical.", compute: "Where p-values, multiple testing and effect sizes had to be taken seriously before ML met them.", needs: ["experiment-bio"] },
  { id: "sequencing", name: "Sequencing", branch: "methods", ring: 2, what: "Determining the order of bases in nucleic acids, using technologies with different error patterns and measurement properties.", compute: "Base-calling from raw signal is itself a learned sequence model.", needs: ["dna"] },
  { id: "omics", name: "Omics", branch: "methods", ring: 3, what: "Measuring everything at once — every transcript, protein or metabolite in a sample.", compute: "Thousands of features, few samples. The p ≫ n regime where regularisation is mandatory.", needs: ["sequencing"] },
  { id: "single-cell", name: "Single-cell analysis", branch: "methods", ring: 3, what: "Measuring cells separately can reveal variation that is obscured by averaging across a tissue.", compute: "UMAP and t-SNE plots are the field's default view — and are routinely over-read as if distances between clusters meant something.", needs: ["omics"] },
  { id: "alignment-bio", name: "Sequence alignment", branch: "methods", ring: 2, what: "Comparing sequences with a scoring model to identify correspondences and possible shared ancestry.", compute: "Needleman–Wunsch uses dynamic programming for global alignment; it is related to edit-distance methods, with its result determined by the scoring scheme.", needs: ["sequencing"] },
  { id: "bioinformatics", name: "Bioinformatics", branch: "methods", ring: 3, what: "The computational side: databases, pipelines, and the reproducibility problems that come with them.", compute: "Most of the work is data engineering, which is also true of most machine learning.", needs: ["alignment-bio", "stats-bio"] },
  { id: "systems-bio", name: "Systems biology", branch: "methods", ring: 4, what: "Modelling networks of interacting components rather than one gene at a time.", compute: "ODE models, Boolean networks and graph learning, depending on how much you know.", needs: ["gene-reg", "metabolism"] },
  { id: "model-organism", name: "Model organisms", branch: "methods", ring: 2, what: "Mice, flies, worms, yeast and zebrafish — chosen for convenience, and standing in for everything else.", compute: "A training distribution, with exactly the generalisation caveat you would expect.", needs: ["experiment-bio"] },
  { id: "ml-biology", name: "Machine learning in biology", branch: "methods", ring: 4, what: "Learned models support structure prediction, variant analysis, imaging and other biological tasks.", compute: "Useful results require suitable data, independent evaluation and experiments appropriate to the biological claim.", needs: ["bioinformatics", "single-cell"] },
];

export const ideaById = new Map(ideas.map(idea => [idea.id, idea]));
