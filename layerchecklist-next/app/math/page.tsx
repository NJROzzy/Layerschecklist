import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "./ChapterNav";
import Formula from "./Formula";
import UniverseMap from "./UniverseMap";
import { FoundationsChapter, StatisticsChapter, NumericsChapter } from "./AdditionalChapters";
import { concepts, sectors } from "./universe";
import { AlgebraLab, ChainRuleLab, CombinationLab, DerivativeLab, DescentLab, GaussianLab, KLLab, NumberLab, ProbabilityLab, RegularizationLab, SVDLab, TaylorLab, VariableLab, VectorLab } from "./Explorers";
import { algebraMoves, calculusSteps, combinations, distributions, firstSteps, frontier, glossary, logRules, matrixFacts, normFamily, optimizerMath, resources, reviewedOn, reviewedOnISO, worldEchoes } from "./content";

export const metadata: Metadata = {
  title: "The Math of AI: From Variables to the Open Questions — Layerchecklist",
  description: "Build the mathematics behind AI in order: number systems, variables, algebra, functions, linear algebra, calculus, probability and optimization — then how they combine, where the same math describes the world, and what is still unsolved.",
};

function ChapterHeading({ number, title, children }: { number: string; title: string; children?: React.ReactNode }) {
  return <header className="math-chapter-heading"><span className="math-eyebrow">CHAPTER {number}</span><h2>{title}</h2>{children}</header>;
}

export default function MathPage() {
  return <main className="math-page">
    <Link className="math-back" href="/#math">← Back to the learning path</Link>

    <header className="math-hero">
      <div>
        <p className="math-eyebrow">THE MATH OF AI / LAYER TWO</p>
        <h1>You already read the symbols.<br /><span>Now build the mathematics.</span></h1>
        <p className="math-lead">The layer above taught you to translate an equation into a sentence. This one builds the subject underneath it, in the order the ideas actually depend on each other — starting from what a number is and ending at the questions nobody has answered yet.</p>
        <div className="math-hero-actions"><a className="math-button" href="#universe">See the whole map ↓</a><a href="#numbers">Start from numbers ↗</a><a href="#first-steps">Just tell me what to study ↗</a></div>
      </div>
      <div className="math-hero-stack" aria-label="The dependency order of this guide.">
        {[["Numbers & variables", "What you are manipulating"], ["Algebra & functions", "How to manipulate it"], ["Linear algebra", "The forward pass"], ["Calculus", "How training knows which way to go"], ["Probability", "What a prediction claims"], ["Optimization", "Where all of it meets"]].map(([title, detail], i) =>
          <div key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}
      </div>
    </header>

    <section id="universe" className="math-opening">
      <header className="math-opening-head">
        <span className="math-eyebrow">BEFORE ANY OF THE DETAIL</span>
        <h2>A universe of mathematics. Find your constellation.</h2>
        <p>Explore {concepts.length} ideas across {sectors.length} constellations, from numbers and logic to geometry, dynamics and learning theory. Select a star to see its meaning, connections and available lessons.</p>
      </header>

      <p>The brighter stars have an AI connection listed here. Follow a guided path, search for a topic, or explore a branch. This is a curated atlas with an emphasis on AI foundations; its proportions do not measure how much of all mathematics AI uses.</p>
      <UniverseMap />
      <div className="math-card-grid">
        <article><span className="math-eyebrow">READ IT OUTWARD</span><h3>Study from the inside out</h3><p>The inner region begins with familiar objects. Outer stars introduce more advanced connections. These are approximate study levels, not exact prerequisites; active research exists at every level.</p></article>
        <article><span className="math-eyebrow">READ IT AROUND</span><h3>Branches are conveniences</h3><p>A branch gives an idea a home on the map. Connections cross those boundaries: eigenvalues appear in linear algebra, probability, physics and optimization. Select a star to distinguish what it builds on from what it leads to.</p></article>
        <article><span className="math-eyebrow">FOLLOW THE CONNECTIONS</span><h3>An application is a starting point</h3><p>The AI filter highlights the applications recorded in this atlas. An unmarked star may still have applications elsewhere. A ring around a star means there is a lesson you can open from its detail card.</p></article>
      </div>
      <aside className="math-callout">
        <strong>A map to keep extending</strong>
        <p>This atlas includes number theory, logic and foundations, differential equations, and learning theory alongside the core AI mathematics. It remains a selection, not an exhaustive inventory. Connections show useful study relationships; they are not a unique or mandatory order.</p>
      </aside>
      <p>There is one more thing worth noticing before you scroll on. Trace any glowing dot back through what it is built on and you will land, within a few steps, in the middle of the circle — at counting, at sets, at the idea of a variable. There is no separate advanced mathematics that AI runs on. It is the ordinary material, composed further than usual.</p>
        </section>

    <div className="math-overview-meta">
      <span>No prior mathematics assumed</span><span>15 chapters</span><span>17 interactive labs</span>
      <span>Open questions reviewed <time dateTime={reviewedOnISO}>{reviewedOn}</time></span>
    </div>

    <ChapterNav />

    {/* ---------------------------------------------------------------- */}
    <section id="numbers" className="math-chapter">
      <ChapterHeading number="01" title="Start with what a number even is.">
        <p>It is tempting to skip this. Do not. Every rounding error, every NaN in a training run, and every choice between float32 and bfloat16 is a consequence of the gap between the numbers mathematics describes and the numbers a machine can hold.</p>
      </ChapterHeading>
      <NumberLab />
      <h3>Two operations worth more than the rest</h3>
      <p>Exponents and logarithms carry more weight in this field than anything else at this level, and they are usually rushed. An exponent is repeated multiplication; a logarithm answers the reverse question, <em>what power produces this number?</em> Four rules follow, and each one earns its place later on this page.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Logarithm rules and where they are used">
        <table>
          <thead><tr><th scope="col">Rule</th><th scope="col">What it does</th><th scope="col">Why AI needs it</th></tr></thead>
          <tbody>{logRules.map(rule => <tr key={rule.rule}><th scope="row"><code>{rule.rule}</code></th><td>{rule.why}</td><td>{rule.ai}</td></tr>)}</tbody>
        </table>
      </div>
      <p>The first rule is the one that matters most. The probability of a whole dataset is a product of millions of small numbers, which underflows to zero in any real arithmetic and has a useless derivative besides. Take the log and the product becomes a sum: numerically stable, and differentiable term by term. Almost every loss function you will meet is a log for that reason alone.</p>
      <aside className="math-callout">
        <strong>The pattern worth taking away</strong>
        <p>Mathematics grows by taking a question that has no answer and building a world where it does. Negative numbers were once absurd; so were irrationals, and so was √−1 — the name “imaginary” was originally an insult. Each one is now ordinary. When you meet a definition that looks arbitrary, the useful question is not “what is it?” but “what broke without it?”</p>
      </aside>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="variables" className="math-chapter">
      <ChapterHeading number="02" title="A letter is just a name.">
        <p>Everything symbolic begins here. The moment you can write x instead of a particular number, you can state a rule that holds for every number at once — and that generality is the whole reason mathematics is worth the notation.</p>
      </ChapterHeading>
      <VariableLab />
      <p>The equation in that lab is <strong>y = wx + b</strong>, which is the same equation the layer above translated as <em>&ldquo;take the input, multiply it by its importance, add an adjustment.&rdquo;</em> It is also, exactly, one neuron. Everything from here is that expression scaled up and composed with itself.</p>
    </section>

    {/* ---------------------------------------------------------------- */}
    <FoundationsChapter />

    <section id="algebra" className="math-chapter">
      <ChapterHeading number="04" title="Algebra is not a bag of tricks.">
        <p>It is a very short list of moves you are permitted to make, plus the judgement of which one gets you closer. Most people who believe they are bad at algebra were taught the tricks without the list.</p>
      </ChapterHeading>
      <AlgebraLab />
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="The legal moves of algebra">
        <table>
          <caption>Five moves. Everything else is a combination of them.</caption>
          <thead><tr><th scope="col">Move</th><th scope="col">Why it is allowed</th><th scope="col">What it is for</th></tr></thead>
          <tbody>{algebraMoves.map(move => <tr key={move.move}><th scope="row">{move.move}</th><td>{move.why}</td><td>{move.use}</td></tr>)}</tbody>
        </table>
      </div>
      <h3>The three shapes worth recognising on sight</h3>
      <dl className="math-definition-grid">
        <div><dt>Linear · ax + b</dt><dd>A straight line. One neuron before its activation, and the whole of a layer in matrix form.</dd></div>
        <div><dt>Quadratic · ax² + bx + c</dt><dd>A parabola, with exactly one turning point. Squared-error loss has this shape, which is why it is the example everyone uses.</dd></div>
        <div><dt>Exponential · aᵇˣ</dt><dd>Growth proportional to current size. Softmax, learning-rate decay, and the scaling laws in the frontier chapter all live here.</dd></div>
      </dl>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="functions" className="math-chapter">
      <ChapterHeading number="05" title="A function is a machine with one output per input.">
        <p>That is the entire definition, and the &ldquo;one&rdquo; is the load-bearing word: feed in the same input twice and you must get the same answer. A neural network, all hundred billion parameters of it, is one function.</p>
      </ChapterHeading>
      <div className="math-card-grid">
        <article><span className="math-eyebrow">DOMAIN</span><h3>What you may put in</h3><p>√x refuses negatives over the reals; log x refuses zero and below; division refuses a zero denominator. Most NaN losses are a function being handed something outside its domain.</p></article>
        <article><span className="math-eyebrow">RANGE</span><h3>What can come out</h3><p>A sigmoid can only emit values in (0, 1), which is exactly why it can stand for a probability. Matching a range to a meaning is most of the reason to choose one activation over another.</p></article>
        <article><span className="math-eyebrow">COMPOSITION</span><h3>Feeding one into the next</h3><p>f(g(x)) means do g, then f. A deep network is composition repeated dozens of times, and the chain rule is how you differentiate through it.</p></article>
      </div>
      <p>Composition is the idea that makes depth mean something — and it comes with a warning. Compose two affine layers and you get another affine layer: <Formula tex="W_2(W_1x + b_1) + b_2 = (W_2W_1)x + (W_2b_1 + b_2)" plain="W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂)" />, which is one affine layer with different weights and bias. A hundred stacked linear layers are worth exactly one. Putting a nonlinear function between them is what buys you depth, and it is the only reason activation functions exist.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Function families and where they appear">
        <table>
          <thead><tr><th scope="col">Family</th><th scope="col">Shape</th><th scope="col">Where it shows up in AI</th></tr></thead>
          <tbody>
            <tr><th scope="row">Linear</th><td>A straight line through the space</td><td>Every layer&apos;s matrix multiply</td></tr>
            <tr><th scope="row">Polynomial</th><td>Curves with turning points</td><td>Squared-error loss; Taylor approximations of everything else</td></tr>
            <tr><th scope="row">Exponential</th><td>Doubling, then doubling again</td><td>softmax, decay schedules, likelihoods</td></tr>
            <tr><th scope="row">Logarithm</th><td>The exponential run backwards</td><td>Cross-entropy, log-likelihood, perplexity</td></tr>
            <tr><th scope="row">Sigmoid / tanh</th><td>An S, squashed into a fixed range</td><td>Gates, binary probabilities, older hidden layers</td></tr>
            <tr><th scope="row">Piecewise linear</th><td>Straight segments joined at corners</td><td>ReLU — cheap, and non-linear enough to work</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="linear-algebra" className="math-chapter">
      <ChapterHeading number="06" title="Learn this before calculus.">
        <p>People are told that calculus is the mathematics of machine learning. Linear algebra is the one you will read on day one — it is what every shape in your code means, and what a forward pass is written in. Calculus explains how training works; linear algebra explains what is being trained.</p>
      </ChapterHeading>
      <VectorLab />
      <h3>Four things a matrix is, all at once</h3>
      <dl className="math-definition-grid">
        <div><dt>A grid of numbers</dt><dd>The storage view. Shape (rows, columns), and the shapes must line up: (m × n) times (n × p) gives (m × p).</dd></div>
        <div><dt>A stack of dot products waiting to happen</dt><dd>The computational view. Entry (i, j) of a product is row i of the first dotted with column j of the second.</dd></div>
        <div><dt>A function that moves vectors</dt><dd>The geometric view. A matrix rotates, stretches, flattens or reflects space. This is the view that makes eigenvectors obvious.</dd></div>
        <div><dt>A whole dataset</dt><dd>The practical view. One row per example, one column per feature. Shape (batch, features) is the first thing you will print when something breaks.</dd></div>
      </dl>
      <aside className="math-callout">
        <strong>Eigenvectors, in one sentence</strong>
        <p>Most vectors get rotated when a matrix acts on them; a few only get stretched, and those are the eigenvectors, with the stretch factor as the eigenvalue. That single idea is PCA, it is the stability analysis that says whether a recurrent network explodes or forgets, it is the resonant frequency of a bridge, and it is PageRank.</p>
      </aside>
      <h3>The vocabulary you will actually meet</h3>
      <p>These are the words a paper will use without explaining. None is difficult; each is a small fact about what a matrix does.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Matrix vocabulary">
        <table>
          <thead><tr><th scope="col">Term</th><th scope="col">What it is</th><th scope="col">Where it shows up</th></tr></thead>
          <tbody>{matrixFacts.map(fact => <tr key={fact.name}><th scope="row">{fact.name}</th><td>{fact.what}</td><td>{fact.ai}</td></tr>)}</tbody>
        </table>
      </div>
      <h3>Length has more than one meaning</h3>
      <p>&ldquo;How big is this vector&rdquo; has several answers, and the choice is not cosmetic — it decides what a penalty does to your model.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Vector norms">
        <table>
          <thead><tr><th scope="col">Norm</th><th scope="col">Its unit ball</th><th scope="col">What it does in AI</th></tr></thead>
          <tbody>{normFamily.map(norm => <tr key={norm.name}><th scope="row">{norm.name}</th><td>{norm.shape}</td><td>{norm.ai}</td></tr>)}</tbody>
        </table>
      </div>
      <SVDLab />
      <h3>Two uses of the same geometry</h3>
      <div className="math-definition-grid"><div><h4>Least squares</h4><p>Choose w to minimize ‖Xw − y‖². The residual at an optimum is orthogonal to the column space: Xᵀ(Xw − y) = 0. A unique coefficient solution requires full column rank; the pseudoinverse selects a minimum-norm solution otherwise. In code, use a solver instead of forming an explicit inverse.</p></div><div><h4>Principal component analysis</h4><p>Center the feature columns, write X = UΣVᵀ, and project onto the first k columns of V. Their squared singular values, divided by n − 1, are sample covariance eigenvalues. PCA preserves maximal variance among rank-k orthogonal projections; large variance need not be useful predictive signal.</p></div></div>
      <aside className="math-callout">
        <strong>Tensors are not a new idea</strong>
        <p>A vector is a list, a matrix is a grid, and a tensor is the same thing with as many axes as you need in array libraries — a batch of images is (batch, channels, height, width). Broadcasting is the rule that lets shapes that nearly match line up automatically. This array usage is distinct from the coordinate-transformation definition of a tensor in geometry. Shape rules still need to be checked explicitly.</p>
      </aside>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="calculus" className="math-chapter">
      <ChapterHeading number="07" title="Calculus is one idea, approached carefully.">
        <p>It has a reputation for difficulty that comes almost entirely from how it is taught: rules first, meaning later, if ever. There is really one question — <em>when this changes a little, how much does that change?</em> — and everything else is technique for answering it without doing arithmetic by hand every time.</p>
      </ChapterHeading>
      <ol className="math-steps">
        {calculusSteps.map((step, i) => <li key={step.title}>
          <span className="math-eyebrow">STEP {String(i + 1).padStart(2, "0")}</span>
          <strong>{step.title}</strong>
          <p>{step.text}</p>
          <div className="math-inline-formula">{step.formula}</div>
        </li>)}
      </ol>
      <DerivativeLab />
      <h3>The rules, and why you do not have to memorise them first</h3>
      <p>Every differentiation rule is the limit above, worked out once in general so nobody has to repeat it. Knowing that they are <em>derived</em> rather than decreed is worth more than knowing the list.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Differentiation rules">
        <table>
          <thead><tr><th scope="col">Rule</th><th scope="col">Statement</th><th scope="col">Read it as</th></tr></thead>
          <tbody>
            <tr><th scope="row">Power</th><td>d/dx (xⁿ) = n·xⁿ⁻¹</td><td>The one you will use constantly.</td></tr>
            <tr><th scope="row">Sum</th><td>(f + g)′ = f′ + g′</td><td>Sensitivities add. This is why a loss summed over a batch has a gradient summed over the batch.</td></tr>
            <tr><th scope="row">Product</th><td>(fg)′ = f′g + fg′</td><td>Vary one factor at a time, then add the two effects.</td></tr>
            <tr><th scope="row">Chain</th><td>(f∘g)′ = f′(g(x))·g′(x)</td><td>The important one. Sensitivities multiply along a chain.</td></tr>
            <tr><th scope="row">Exponential</th><td>d/dx (eˣ) = eˣ</td><td>A function that is its own rate of change — which is what makes e the natural base.</td></tr>
            <tr><th scope="row">Logarithm</th><td>d/dx (ln x) = 1/x</td><td>Why log-losses are pleasant to differentiate.</td></tr>
          </tbody>
        </table>
      </div>
      <ChainRuleLab />
      <TaylorLab />
      <h3>More than one input, more than one output</h3>
      <p>Three words get used constantly and are rarely distinguished. They are the same derivative, arranged differently as the number of inputs and outputs grows.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Gradient, Jacobian and Hessian">
        <table>
          <thead><tr><th scope="col">Object</th><th scope="col">Shape</th><th scope="col">Answers</th><th scope="col">In AI</th></tr></thead>
          <tbody>
            <tr><th scope="row">Gradient ∇f</th><td>A vector, one entry per input</td><td>How one output responds to every input</td><td>What an optimiser steps along.</td></tr>
            <tr><th scope="row">Jacobian J</th><td>A matrix, outputs × inputs</td><td>How every output responds to every input</td><td>Reverse-mode backpropagation propagates a vector–Jacobian product (equivalently Jᵀv in column notation), without building the full Jacobian.</td></tr>
            <tr><th scope="row">Hessian H</th><td>A matrix, inputs × inputs</td><td>How the <em>gradient</em> responds to every input — curvature</td><td>Describes local curvature. For a positive-definite quadratic, its largest eigenvalue sets the plain-gradient-descent stability bound. Large models often use Hessian–vector products.</td></tr>
          </tbody>
        </table>
      </div>
      <p>Curvature is worth dwelling on, because it explains a daily frustration. If the loss curves sharply in one direction and gently in another, a single learning rate cannot suit both: large enough to make progress along the flat direction, it oscillates along the sharp one. For a positive-definite quadratic, the ratio of the largest to smallest Hessian eigenvalue measures this conditioning. Neural losses need not have a positive-definite Hessian, and adaptive updates do not directly compute this curvature.</p>
      <h3>How derivatives are actually computed</h3>
      <p>Not by hand, not symbolically, and not by finite differences. A framework records every operation you perform into a <strong>computational graph</strong>, then applies the chain rule backwards through it — <strong>reverse-mode automatic differentiation</strong>. The results are exact to floating-point precision, and one backward sweep produces the gradient for every parameter at once.</p>
      <div className="math-card-grid">
        <article><span className="math-eyebrow">SYMBOLIC</span><h3>Manipulate the formula</h3><p>Exact, and the expressions explode in size for anything deep. Fine for a textbook, hopeless for a network.</p></article>
        <article><span className="math-eyebrow">FINITE DIFFERENCES</span><h3>Nudge and measure</h3><p>What the lab above does. Simple, approximate, and needs one forward pass per parameter — useless at a billion of them, but still the standard way to check that a gradient is right.</p></article>
        <article><span className="math-eyebrow">AUTOMATIC</span><h3>Chain rule on the graph</h3><p>Exact, and one sweep covers every parameter. This is what PyTorch and JAX do, and why <code>.backward()</code> is a single line.</p></article>
      </div>
      <h3>And the other half: integration</h3>
      <p>The derivative breaks a total into rates. The integral puts rates back into a total, and the fundamental theorem of calculus says the two operations undo each other — which is genuinely surprising, because &ldquo;slope of a curve&rdquo; and &ldquo;area under a curve&rdquo; have no obvious reason to be related.</p>
      <p>You need far less of it than of differentiation. It matters where it defines something: an expectation <Formula tex="\mathbb{E}[X] = \int x\,p(x)\,dx" plain="E[X] = ∫ x p(x) dx" /> is an integral, a continuous probability is an area under a density, and the evidence term in Bayes&apos; rule is an integral that is usually impossible to compute — which is precisely why variational methods and sampling exist. You will need to <em>recognise</em> integrals constantly and <em>evaluate</em> them almost never.</p>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="probability" className="math-chapter">
      <ChapterHeading number="08" title="A prediction is a claim about uncertainty.">
        <p>A probabilistic classifier can output a distribution over possible labels, and training grades how surprised that distribution was by the truth. Probability is what makes both halves of that sentence precise.</p>
      </ChapterHeading>
      <ProbabilityLab />
      <div className="math-card-grid">
        <article><span className="math-eyebrow">RANDOM VARIABLE</span><h3>A quantity that depends on chance</h3><p>A random variable maps outcomes to values. Before observing the outcome we describe its distribution; after observing it we have a realization.</p></article>
        <article><span className="math-eyebrow">EXPECTATION</span><h3>The long-run average</h3><p>E[X] weights every possible value by its probability. Nearly every loss you will meet is an expectation estimated from a sample — which is exactly what a mini-batch is.</p></article>
        <article><span className="math-eyebrow">BAYES</span><h3>Updating a belief with evidence</h3><p>P(A|B) = P(B|A)P(A) / P(B). New evidence reweights what you already believed; it does not replace it.</p></article>
      </div>
      <p>Two ideas from information theory follow immediately and are worth meeting by name. <strong>Entropy</strong> is the average surprise of a distribution — how uncertain it is. <strong>Cross-entropy</strong> is the average surprise your predicted distribution feels when reality is drawn from the true one. Minimising it is the same as maximising likelihood, which is why the standard classification loss is not an arbitrary choice but the statistically principled one.</p>
      <h3>Spread, and how two quantities move together</h3>
      <p>The mean says where a distribution sits. <strong>Variance</strong> says how widely it spreads, and its square root, the standard deviation, puts that back in the original units. <strong>Covariance</strong> measures how two centered quantities vary together. Collect the pairwise covariances into a matrix: PCA diagonalizes it, and whitening transforms it toward identity when the required directions are nondegenerate. A multivariate Gaussian requires both a mean vector and a covariance matrix.</p>
      <GaussianLab />
      <h3>The distributions worth knowing by name</h3>
      <p>A distribution is a shape of uncertainty. You do not need many.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Common probability distributions">
        <table>
          <thead><tr><th scope="col">Name</th><th scope="col">Set by</th><th scope="col">What it describes</th><th scope="col">Where it appears in AI</th></tr></thead>
          <tbody>{distributions.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td><code>{item.params}</code></td><td>{item.what}</td><td>{item.ai}</td></tr>)}</tbody>
        </table>
      </div>
      <h3>Choosing parameters: maximum likelihood</h3>
      <p>Given data and a family of distributions, which member produced it? <strong>Maximum likelihood</strong> answers: pick the parameters maximizing the observed data&apos;s probability mass or density. Take the log — by that first rule from chapter one — and for independent observations the product over examples becomes a sum, and maximising it becomes minimising its negative. That negative log-likelihood <em>is</em> cross-entropy. The standard loss was not invented for neural networks; it is a century-old statistical principle arriving under a different name.</p>
      <p>Add a prior belief about the parameters and you get <strong>MAP</strong> estimation instead — and a Gaussian prior on the weights turns out to be exactly an L2 penalty. This equivalence is between particular penalty terms and log priors; not every regularization method is simply MAP estimation.</p>
      <KLLab />
      <aside className="math-callout">
        <strong>The trap this chapter exists to prevent</strong>
        <p>A confident probability is not a correct one. A model can assign 0.99 to a wrong answer and the arithmetic will be perfectly valid — the probability describes the model&apos;s state, not the world&apos;s. Calibration, the question of whether things the model calls 90% likely happen about 90% of the time, is a separate property that has to be measured separately.</p>
      </aside>
    </section>

    {/* ---------------------------------------------------------------- */}
    <StatisticsChapter />

    <section id="optimization" className="math-chapter">
      <ChapterHeading number="10" title="Everything so far, running in a loop.">
        <p>Optimisation is where the previous chapters stop being separate subjects. A function built from matrix operations, differentiated by the chain rule, against a loss defined using probability — and then stepped downhill, over and over.</p>
      </ChapterHeading>
      <DescentLab />
      <div className="math-card-grid">
        <article><span className="math-eyebrow">CONVEX</span><h3>Bowl-shaped, and honest about it</h3><p>For a convex objective on a convex domain, every local minimum is global. Least-squares linear regression and standard logistic negative log-likelihood are convex in their coefficients. Step sizes and regularity still matter for convergence.</p></article>
        <article><span className="math-eyebrow">NON-CONVEX</span><h3>What deep learning actually is</h3><p>A landscape of valleys, ridges and saddles. Typical neural-network objectives are non-convex. A local improvement does not certify global optimality; guarantees depend on specific assumptions about the objective and algorithm.</p></article>
        <article><span className="math-eyebrow">STOCHASTIC</span><h3>Estimating the slope from a sample</h3><p>The full empirical gradient averages the whole dataset. Uniform minibatch sampling estimates it at lower cost per update; sampling noise can help or hinder, depending on the problem. That is the S in SGD.</p></article>
      </div>
      <h3>The optimiser zoo, in four lines</h3>
      <p>Each rule turns a gradient into an update. Plain SGD has no optimizer memory; momentum and adaptive methods keep state across steps.</p>
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Optimiser update rules">
        <table>
          <thead><tr><th scope="col">Optimiser</th><th scope="col">Update</th><th scope="col">The idea</th></tr></thead>
          <tbody>{optimizerMath.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td><code>{item.update}</code></td><td>{item.what}</td></tr>)}</tbody>
        </table>
      </div>
      <p>Second-order methods use curvature as well as slope. A Newton step solves HΔ = −g. Fast local convergence requires conditions on smoothness, curvature and the starting point; an indefinite Hessian may not produce a descent direction. Quasi-Newton and matrix-free methods reduce the cost. Adam instead tracks gradient moments: it is not a Hessian approximation.</p>
      <RegularizationLab />
    </section>

    {/* ---------------------------------------------------------------- */}
    <NumericsChapter />

    <section id="combinations" className="math-chapter">
      <ChapterHeading number="12" title="Which combinations build which parts.">
        <p>This is the chapter the rest of the guide exists for. No component of an AI system is built from one branch of mathematics; each one is a specific recipe, and seeing the recipes is what turns a pile of topics into a subject.</p>
      </ChapterHeading>
      <CombinationLab />
      <div className="math-table-wrap" tabIndex={0} role="region" aria-label="Which mathematics builds which part of an AI system">
        <table>
          <caption>The whole map at once.</caption>
          <thead><tr><th scope="col">Part</th><th scope="col">What it does</th><th scope="col">Mathematics it combines</th></tr></thead>
          <tbody>{combinations.map(item => <tr key={item.part}><th scope="row">{item.part}</th><td>{item.what}</td><td>{item.concepts.join(" · ")}</td></tr>)}</tbody>
        </table>
      </div>
      <aside className="math-callout">
        <strong>Read one row all the way down</strong>
        <p>A single training step: a matrix product runs the forward pass (linear algebra), a nonlinearity makes depth count (functions), cross-entropy scores the output (probability and logs), the chain rule sends sensitivities backwards (calculus), and a step size turns them into a change (optimisation). Five chapters, one step, a few hundred thousand times per training run.</p>
      </aside>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="world" className="math-chapter">
      <ChapterHeading number="13" title="None of this was invented for AI.">
        <p>Every tool in this guide predates the field, most of them by centuries, and was built to answer a question about the physical world. That is not trivia — it is the strongest evidence that you are learning something durable rather than the notation of one passing technology.</p>
      </ChapterHeading>
      <div className="math-echo-grid">
        {worldEchoes.map(echo => <article key={echo.concept}>
          <h3>{echo.concept}</h3>
          <p className="math-echo-ai"><strong>In AI:</strong> {echo.ai}</p>
          <p><strong>In the world:</strong> {echo.world}</p>
        </article>)}
      </div>
      <p>There is a genuine puzzle underneath this, and it is worth sitting with rather than resolving too quickly. Mathematics developed for one purpose keeps turning out to describe something else entirely — the physicist Eugene Wigner called it the unreasonable effectiveness of mathematics in the natural sciences. Complex numbers were a bookkeeping device for solving cubics before they were the language of quantum mechanics. Non-Euclidean geometry was a curiosity before it was general relativity. Whatever you learn here has a strong track record of being useful somewhere you did not expect.</p>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="frontier" className="math-chapter">
      <ChapterHeading number="14" title="Deeper paths and research questions.">
        <p>Deep learning works considerably better than the theory explains. The gap between what practitioners can build and what mathematicians can prove is the honest state of the field, and it is wider than most introductions admit. Each area below lists the level it asks of you, because &ldquo;open problem&rdquo; is not the same as &ldquo;inaccessible&rdquo;.</p>
      </ChapterHeading>
      <p className="math-small">Reviewed on <time dateTime={reviewedOnISO}>{reviewedOn}</time>. These are directions of sustained work rather than a snapshot of this month, and each links the paper that framed the question rather than the latest result — deliberately, because the framing outlives the leaderboard.</p>
      <div className="math-frontier-grid">
        {frontier.map((item, i) => <article key={item.area}>
          <span className="math-eyebrow">OPEN QUESTION {String(i + 1).padStart(2, "0")}</span>
          <h3>{item.area}</h3>
          <p>{item.text}</p>
          <p className="math-level"><strong>Level:</strong> {item.level}</p>
          <a className="math-source" href={item.href}>{item.source} ↗</a>
        </article>)}
      </div>
      <aside className="math-callout">
        <strong>What this means if you are starting out</strong>
        <p>Nobody is holding a complete theory you have failed to be shown. Large parts of why this works are genuinely unresolved, and the honest position for a practitioner is to build carefully and measure rather than to reason from first principles you do not have. It also means the entry price to the research frontier is lower than in most mature fields: several of these questions are open to anyone with solid linear algebra, probability and patience.</p>
      </aside>
    </section>

    {/* ---------------------------------------------------------------- */}
    <section id="first-steps" className="math-chapter">
      <ChapterHeading number="15" title="A concrete order, and how to know you are ready.">
        <p>The most common mistake is starting with calculus because that is what the field is said to require. The second is trying to be rigorous before anything means anything. Here is the order that works, with a test for each stage so you are not guessing.</p>
      </ChapterHeading>
      <ol className="math-steps">
        {firstSteps.map((item, i) => <li key={item.step}>
          <span className="math-eyebrow">STEP {String(i + 1).padStart(2, "0")}</span>
          <strong>{item.step}</strong>
          <p>{item.detail}</p>
          <p className="math-signal"><strong>You are ready to move on when:</strong> {item.signal}</p>
        </li>)}
      </ol>
      <h3>Where to actually learn it</h3>
      <div className="math-resource-grid">
        {resources.map(item => <article key={item.name}>
          <span className="math-eyebrow">{item.kind}</span>
          <h4><a href={item.href}>{item.name}<span aria-hidden="true"> ↗</span></a></h4>
          <p>{item.note}</p>
        </article>)}
      </div>
      <aside className="math-callout">
        <strong>One piece of advice that outranks the rest</strong>
        <p>Do the exercises. Reading mathematics feels like understanding it and is not the same thing — the gap only becomes visible when you have to produce something yourself. A worked problem you struggled through is worth more than a chapter you nodded along to, and it is the single reliable difference between people who learn this and people who keep starting.</p>
      </aside>
      <details className="math-glossary"><summary>Twenty terms, in plain language</summary>
        <dl className="math-definition-grid">{glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
      </details>
      <div className="math-next-grid">
        <Link href="/ai"><span className="math-eyebrow">SIDEWAYS / THE CONCEPTS</span><h3>AI Foundations →</h3><p>What the field is, how a system works, and how to judge a result — without the notation.</p></Link>
        <Link href="/ml"><span className="math-eyebrow">FORWARD / THE PRACTICE</span><h3>Machine Learning →</h3><p>Five weeks putting this mathematics to work on real data, models and training loops.</p></Link>
      </div>
    </section>

    <footer className="math-footer">
      <p>Understand the idea. Do the exercise. Then read the equation again.</p>
      <a href="#numbers">Back to the beginning ↑</a>
    </footer>
  </main>;
}
