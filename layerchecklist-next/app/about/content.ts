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
  tagline: "Learning machines, learning mathematics, learning how to learn.",

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
  { href: "/ai", title: "AI Foundations", detail: "What the field is, how a system works, and how to judge a result — before any notation." },
  { href: "/math", title: "The Math of AI", detail: "From what a number is to the open problems, with an interactive atlas of the whole subject." },
  { href: "/ml", title: "Machine Learning", detail: "A week-by-week series, from cleaning data to neural networks." },
  { href: "/dl", title: "Deep Learning", detail: "The longer path through architectures, training and the things that break." },
  { href: "/simulations", title: "Simulation & Robotics", detail: "Eight simulations running live: integrators, chaos, flocking, kinematics, control, sensing." },
  { href: "/physics", title: "Physics", detail: "An atlas of the subject underneath, and where it shares equations with machine learning." },
];

export const principles = [
  { title: "Nothing is pre-recorded", detail: "Every simulation on this site is integrating real equations in your browser, frame by frame. The orbits drift because the integrator drifts, not because a designer drew them that way." },
  { title: "The numbers are checked", detail: "Each interactive piece was verified against a separate reference run before it was written about. Where a claim is made about a result, the result was computed first." },
  { title: "Say what is not known", detail: "Every subject here ends with its open problems rather than a tidy summary. Deep learning works better than the theory explains, and pretending otherwise helps nobody." },
  { title: "Build it to understand it", detail: "The fastest way to find out whether you understand something is to make it work, watch it fail, and be unable to look away from the reason." },
];
