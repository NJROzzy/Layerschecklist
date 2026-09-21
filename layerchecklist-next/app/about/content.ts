/**
 * Everything personal lives in this one object.
 *
 * Only you can write these. Anything left as an empty string is simply not
 * rendered, so the page stays coherent while you fill it in — nothing here
 * shows a blank box or a placeholder to a visitor.
 */
export const profile = {
  name: "Nitish John Rawat",

  /** A short line under your name. e.g. "Learning ML in public" */
  tagline: "Learning mathematics, exploring nature, building intelligent systems.",

  /** e.g. "Robotics engineer" — leave empty to hide. */
  role: "",
  /** e.g. "Bengaluru, India" — leave empty to hide. */
  location: "",

  /** Two or three paragraphs in your own voice. Each string is one paragraph. */
  intro: [] as string[],

  /** What you are working on at the moment. Leave empty to hide the section. */
  now: [] as string[],

  /** Add a link and it appears; leave the url empty and it does not. */
  links: [
    { label: "GitHub", url: "", handle: "" },
    { label: "Email", url: "", handle: "" },
    { label: "LinkedIn", url: "", handle: "" },
    { label: "X", url: "", handle: "" },
  ],
};

/** The site's own areas. Counts that are real are imported on the page itself. */
export const areas = [
  { href: "/math", title: "Math", detail: "The first foundation: mathematical ideas, worked examples and an interactive atlas." },
  { href: "/physics", title: "Physics", detail: "The second foundation: physical laws, scales, mechanisms and their connections." },
  { href: "/biology", title: "Biology", detail: "The third foundation: living systems, heredity, evolution and ecology, with interactive models." },
  { href: "/python", title: "Python Fundamentals", detail: "Turn an idea into a program with functions, data structures and small experiments." },
  { href: "/ai", title: "AI Foundations", detail: "What the field is, how a system works, and how to judge a result." },
  { href: "/libraries", title: "Python Libraries", detail: "A practical checklist of the tools used to work with data, numerical models and visualizations." },
  { href: "/ml", title: "Machine Learning", detail: "A week-by-week series, from data and evaluation to learning algorithms." },
  { href: "/dl", title: "Deep Learning", detail: "A learning path through architectures, training and model behavior." },
  { href: "/sql", title: "SQL", detail: "Organize, query and combine the data behind an experiment or application." },
  { href: "/ros", title: "ROS", detail: "Connect sensing, communication and control in a robotics workflow." },
  { href: "/cuda", title: "CUDA", detail: "Explore parallel computation and the hardware behind numerical workloads." },
  { href: "/simulators", title: "Simulation Environments", detail: "Explore the tools and environments used to model physical systems and train agents." },
  { href: "/simulations", title: "Live Simulation Lab", detail: "Eight interactive experiments in motion, collective behavior, robotics, control and sensing." },
];

export const principles = [
  { title: "Build one layer at a time", detail: "Begin with an observation, give it a precise language, then build a model. Definitions, assumptions and worked examples belong beside the result." },
  { title: "Make the model explorable", detail: "Change a parameter and watch a prediction change. The labs calculate in your browser: some step equations through time, while others evaluate a mathematical solution directly." },
  { title: "Check the limits", detail: "Use units, conservation laws and boundary cases to question a calculation. A model is useful only within its assumptions; a smooth animation does not establish that it matches the world." },
  { title: "Keep questions open", detail: "Separate established results, useful approximations and unresolved questions. Follow sources, test an explanation, and revise it when the evidence changes." },
];
