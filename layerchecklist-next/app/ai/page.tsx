import type { Metadata } from "next";
import Link from "next/link";
import ChapterNav from "./ChapterNav";
import { AIMap, EmbeddingLab, RuleLearningLab, SplitLab, TokenLab, TokenizerLab, ToolExplorer } from "./Explorers";
import { aiTools, glossary, history, reviewedOn, reviewedOnISO, reviewQuestions, toolCategories, trends } from "./content";

export const metadata: Metadata = {
  title: "AI Foundations: History, How It Works, and Today’s Tools — Layerchecklist",
  description: "Start before machine learning: explore AI history, how systems learn and generate, the relationship between AI and ML, current trends, and a practical guide to AI tools.",
};

function ChapterHeading({ number, title, children }: { number: string; title: string; children?: React.ReactNode }) {
  return <header className="ai-chapter-heading"><span className="ai-eyebrow">CHAPTER {number}</span><h2>{title}</h2>{children}</header>;
}

export default function AIPage() {
  return <main className="ai-page">
    <Link className="ai-back" href="/#ai">← Back to the learning path</Link>
    <header className="ai-hero">
      <div><p className="ai-eyebrow">AI FOUNDATIONS / BEGIN HERE</p><h1>Understand AI.<br /><span>Then build with it.</span></h1><p className="ai-lead">Before a library, a model, or a training loop, understand the ideas behind them. Follow AI from its early ambitions to the systems and tools you can use today.</p><div className="ai-hero-actions"><a className="ai-button" href="#history">Start with the history ↓</a><a href="#tools">Explore the tools ↗</a></div></div>
      <div className="ai-hero-map" aria-label="Learning path: AI foundations, Python libraries, machine learning, and deep learning.">{[["01", "AI foundations", "Understand the field"], ["02", "Python libraries", "Handle data and computation"], ["03", "Machine learning", "Learn from examples"], ["04", "Deep learning", "Learn representations"]].map(([n, title, detail]) => <div key={n}><span>{n}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}</div>
    </header>
    <div className="ai-overview-meta"><span>No coding prerequisite</span><span>10 guided chapters</span><span>6 interactive labs</span><span>Current overview checked <time dateTime={reviewedOnISO}>{reviewedOn}</time></span></div>
    <ChapterNav />

    <section id="history" className="ai-chapter">
      <ChapterHeading number="01" title="AI did not begin with a chatbot."><p>Its history brings together logic, search, statistics, learning, and computing. These selected milestones overlap; one school of thought did not simply erase the others.</p></ChapterHeading>
      <ol className="ai-timeline">{history.map(item => <li key={item.year}><div className="ai-timeline-year">{item.year}</div><article><p className="ai-eyebrow">{item.people}</p><h3>{item.title}</h3><p>{item.text}</p><p className="ai-history-lesson"><strong>What to take forward:</strong> {item.lesson}</p><a className="ai-source" href={item.href}>{item.source} ↗</a></article></li>)}</ol>
      <aside className="ai-callout"><strong>Why the story matters</strong><p>AI progress comes from combinations: a useful formulation of a problem, suitable data or knowledge, effective algorithms, computing resources, and careful evaluation. Today’s generative tools inherit this longer history.</p></aside>
    </section>

    <section id="what-is-ai" className="ai-chapter">
      <ChapterHeading number="02" title="AI is a field, not a single algorithm."><p>Artificial intelligence studies and builds computational systems that perform tasks involving perception, reasoning, language, planning, learning, or action. A system’s goal and environment determine what “good” behavior means.</p></ChapterHeading>
      <div className="ai-card-grid">
        <article><span className="ai-eyebrow">PERCEIVE</span><h3>Turn signals into information</h3><p>Recognize speech, identify objects, or extract text from a page. The input can be sound, images, text, sensor readings, or a mixture.</p></article>
        <article><span className="ai-eyebrow">REASON & PLAN</span><h3>Work toward an objective</h3><p>Search routes, satisfy scheduling constraints, or select the next move in a game. Rules and search can work alongside learned models.</p></article>
        <article><span className="ai-eyebrow">PREDICT & GENERATE</span><h3>Produce a useful output</h3><p>Estimate demand, classify a ticket, recommend an item, or generate a draft. Prediction quality depends on the task and the evidence available.</p></article>
      </div>
      <p>A robot is a physical system that may use AI, but AI does not require a body. Automation executes a process; it may use fixed software, AI, or both. A language model is a model; a chat application also includes interfaces, tools, policies, and other software.</p>
      <aside className="ai-callout"><strong>Capability is different from consciousness.</strong><p>Performance on a task does not by itself demonstrate human-like understanding, subjective experience, or reliable general intelligence. When you hear “AGI,” ask what definition, tasks, and evidence the speaker is using.</p></aside>
      <p className="ai-source">Further grounding: <a href="https://www.nist.gov/itl/ai-risk-management-framework">NIST’s framework for AI systems and their context</a>.</p>
    </section>

    <section id="ai-to-ml" className="ai-chapter">
      <ChapterHeading number="03" title="From specifying behavior to learning it."><p>A rule-based system starts with knowledge expressed by people. A machine-learning system uses a learning procedure to fit a model from examples or experience. Both still depend on human choices about the task, representation, and evaluation.</p></ChapterHeading>
      <AIMap />
      <div className="ai-table-wrap" tabIndex={0} role="region" aria-label="Comparison of AI approaches"><table><caption>Several approaches can coexist inside one product.</caption><thead><tr><th scope="col">Approach</th><th scope="col">Where behavior comes from</th><th scope="col">Example</th><th scope="col">Key question</th></tr></thead><tbody>
        <tr><th scope="row">Rules and search</th><td>Explicit knowledge, possible actions, and a search or inference procedure</td><td>A planner finds a route satisfying constraints.</td><td>Are the rules, state, and objective adequate?</td></tr>
        <tr><th scope="row">Classical ML</th><td>Fitting a model using data and an objective</td><td>A decision tree predicts a ticket category.</td><td>Does it generalize to appropriate held-out examples?</td></tr>
        <tr><th scope="row">Deep learning</th><td>Training a multilayer neural network</td><td>A network recognizes patterns in images.</td><td>Do the data, architecture, and training support the task?</td></tr>
        <tr><th scope="row">Hybrid system</th><td>A combination of learned and explicitly programmed components</td><td>A model classifies a request; rules route it; search retrieves a document.</td><td>Does the complete workflow succeed, including its failure paths?</td></tr>
      </tbody></table></div>
      <RuleLearningLab />
      <h3>Four learning settings you will keep meeting</h3>
      <dl className="ai-definition-grid"><div><dt>Supervised learning</dt><dd>Learn from inputs paired with target labels. Examples include predicting a duration or classifying a document.</dd></div><div><dt>Unsupervised learning</dt><dd>Find structure without the task’s target labels, such as groups of similar observations or compact representations.</dd></div><div><dt>Self-supervised learning</dt><dd>Construct training targets from the data itself, such as predicting a hidden or subsequent token. This still uses a defined learning objective.</dd></div><div><dt>Reinforcement learning</dt><dd>Learn behavior through actions and rewards over time. The aim concerns a sequence of decisions, not just a single labeled row.</dd></div></dl>
      <p className="ai-source">Read more: <a href="https://developers.google.com/machine-learning/intro-to-ml/what-is-ml">Google’s introduction to machine learning</a>. These learning settings describe how supervision is supplied; they are not separate brands of AI software.</p>
    </section>

    <section id="how-ai-works" className="ai-chapter">
      <ChapterHeading number="04" title="Follow a system from task to feedback."><p>There is no universal AI mechanism. Here is the lifecycle of a learned prediction system, using support-ticket classification as a running example.</p></ChapterHeading>
      <ol className="ai-process">
        <li><strong>Define the task.</strong><p>Input: the ticket available when it arrives. Output: a category or priority. Decide which mistakes matter and when the system should defer to a person.</p></li>
        <li><strong>Collect and represent the evidence.</strong><p>Gather representative examples, inspect labels, handle missing data, and convert inputs into a representation the model can use. Future information must not sneak into the inputs.</p></li>
        <li><strong>Separate development from evaluation.</strong><p>Use training data to fit the model, validation data to choose settings, and an appropriate reserved test set to assess the final procedure. Respect groups and time when a random split would be misleading.</p></li>
        <li><strong>Fit a baseline, then learn.</strong><p>Begin with a simple reference. A training algorithm adjusts parameters to improve an objective. For many neural models, backpropagation computes gradients and an optimizer updates weights.</p></li>
        <li><strong>Evaluate more than an average score.</strong><p>Inspect false positives and negatives, performance across relevant groups, unusual inputs, latency, and cost. A small training error can coexist with poor real-world predictions.</p></li>
        <li><strong>Run inference and monitor.</strong><p>Apply the fitted model to a new ticket, route the result, and measure behavior over time. Changes in customers, language, or labeling can reduce performance and prompt a new development cycle.</p></li>
      </ol>
      <SplitLab />
      <div className="ai-comparison"><article><span className="ai-eyebrow">TRAINING</span><h3>Examples → adjusted parameters</h3><p>A learning procedure changes the model. Some methods optimize differentiable losses; others fit trees or use different procedures. Training is not always gradient descent.</p></article><article><span className="ai-eyebrow">INFERENCE</span><h3>New input → computed output</h3><p>The fitted model produces a prediction or generated output. An ordinary request does not necessarily update its weights, even when the surrounding application saves conversation history.</p></article></div>
      <p className="ai-source">Implementation connection: <a href="https://scikit-learn.org/stable/common_pitfalls.html">scikit-learn on preprocessing, leakage, and pipelines</a>.</p>
    </section>

    <section id="generative-ai" className="ai-chapter">
      <ChapterHeading number="05" title="What happens when you ask a model a question?"><p>For a typical autoregressive language model, generation is a sequence of computations over the available context. The chat interface is only the visible end of that system.</p></ChapterHeading>
      <ol className="ai-process ai-process-compact">
        <li><strong>Represent the input.</strong><p>Text becomes tokens, which may be words, word pieces, or other units. The system turns those tokens into numeric representations.</p></li>
        <li><strong>Use context to compute scores.</strong><p>In a Transformer, attention helps representations incorporate information from other positions. The trained network computes scores for possible next tokens.</p></li>
        <li><strong>Select a continuation.</strong><p>A decoding procedure chooses a token from those scores. That token joins the context, and the computation continues until a stopping condition is met.</p></li>
        <li><strong>In a tool-enabled application, do more.</strong><p>The surrounding system may retrieve documents, run code, or call an authorized tool. Its result can become new context for another model step.</p></li>
      </ol>
      <p className="ai-source">Sources: <a href="https://developers.google.com/machine-learning/crash-course/llm">Google’s language-model introduction</a> and <a href="https://arxiv.org/abs/1706.03762">the Transformer paper</a>.</p>
      <TokenizerLab />
      <TokenLab />
      <EmbeddingLab />
      <h3>Pretraining is the beginning, not the whole product.</h3><p>A foundation model is trained broadly enough to support a range of downstream uses. Pretraining learns patterns from large datasets. Additional training may improve instruction following, specialized behavior, or alignment with feedback. The final application adds context, tools, interfaces, and evaluations.</p>
      <div className="ai-card-grid"><article><h3>Prompting</h3><p>Change the instructions, examples, or context for a request. You are usually conditioning a model with fixed weights.</p></article><article><h3>Retrieval / RAG</h3><p>Find relevant external material and provide it to the generator. This changes the evidence available at answer time; it does not guarantee the answer uses that evidence correctly.</p><a className="ai-source" href="https://arxiv.org/abs/2005.11401">RAG paper ↗</a></article><article><h3>Fine-tuning</h3><p>Update parameters through further training on selected examples. It can adapt behavior, but it needs suitable data and evaluation. It is not a substitute for a reliable source of changing facts.</p></article></div>
      <p>Text generation is one example. Diffusion models learn a denoising process and can generate samples through repeated refinement. Generating an image does not have to mean predicting the next text token. <a className="ai-source" href="https://arxiv.org/abs/2006.11239">Denoising diffusion research ↗</a></p>
      <aside className="ai-callout"><strong>A model + tools + a control loop can form an agent.</strong><p>An agentic application may choose a tool, inspect its result, and select a next action. It still needs an objective, stopping rules, permissions, and observable results. A fixed workflow can be more appropriate when the sequence is already known.</p><a className="ai-source" href="https://www.anthropic.com/engineering/building-effective-agents">Anthropic’s distinction between workflows and agents ↗</a></aside>
    </section>

    <section id="ai-today" className="ai-chapter">
      <ChapterHeading number="06" title="The present: more capable, still uneven."><p>This snapshot was checked on {reviewedOn}. It describes documented directions and available tools, rather than predicting when a future capability will arrive.</p></ChapterHeading>
      <p>Stanford’s 2026 AI Index reports that 88% of surveyed organizations used AI in 2025, while agent adoption was still at an earlier stage. That is a survey result about organizations in the study, not a claim that 88% of every business task is automated. <a className="ai-source" href="https://hai.stanford.edu/ai-index/2026-ai-index-report/economy">Read the economic evidence ↗</a></p>
      <div className="ai-trend-grid">{trends.map((trend, i) => <article key={trend.title}><span className="ai-eyebrow">DIRECTION {String(i + 1).padStart(2, "0")}</span><h3>{trend.title}</h3><p>{trend.text}</p><p className="ai-history-lesson"><strong>What it means for you:</strong> {trend.implication}</p><a className="ai-source" href={trend.href}>{trend.source} ↗</a></article>)}</div>
    </section>

    <section id="tools" className="ai-chapter">
      <ChapterHeading number="07" title="Choose the kind of tool before the brand."><p>An assistant, a model, a library, and a cloud platform solve different parts of a problem. This representative guide covers {aiTools.length} tools; it is not a ranking or an exhaustive market directory.</p></ChapterHeading>
      <div className="ai-table-wrap" tabIndex={0} role="region" aria-label="Match a task to a tool category"><table><thead><tr><th scope="col">You want to…</th><th scope="col">Start by exploring…</th><th scope="col">Compare using…</th></tr></thead><tbody>
        <tr><th scope="row">Use AI for everyday work</th><td>An assistant or research application</td><td>Result quality, source support, document handling, and account controls</td></tr>
        <tr><th scope="row">Predict an outcome from a table</th><td>Python data tools and a classical ML library</td><td>A baseline, leakage-free validation, and the errors that matter</td></tr>
        <tr><th scope="row">Build a neural model</th><td>A deep learning framework and appropriate data</td><td>Task performance, training effort, hardware, and deployment needs</td></tr>
        <tr><th scope="row">Add an AI feature to an application</th><td>A model API or local runtime, plus application code</td><td>Latency, cost, data handling, reliability, and integration effort</td></tr>
        <tr><th scope="row">Coordinate actions across tools</th><td>A workflow or agent framework</td><td>Actual task completion, recovery behavior, permissions, and monitoring</td></tr>
      </tbody></table></div>
      <p className="ai-small">Product names and capabilities were checked against official pages on {reviewedOn}. Plans, prices, regional availability, and model catalogs can change; use each official link for current details.</p>
      <ToolExplorer tools={aiTools} categories={toolCategories} />
    </section>

    <section id="judgment" className="ai-chapter">
      <ChapterHeading number="08" title="A convincing result still needs evidence."><p>Choose the test before choosing the tool. “Looks intelligent” is not a success criterion.</p></ChapterHeading>
      <div className="ai-card-grid"><article><h3>Incorrect or unsupported output</h3><p>A generated explanation can contain invented facts or citations. Check the referenced material and recompute consequential calculations.</p></article><article><h3>Unrepresentative data</h3><p>A model may work on common cases and fail on a different group, time period, language, or environment. Test the conditions that match intended use.</p></article><article><h3>Failures beyond the model</h3><p>Retrieval can miss evidence, a tool call can fail, and an action can be inappropriate. Inspect the entire workflow, including access to data and the point at which a person reviews a result.</p></article></div>
      <h3>A small evaluation you can actually run</h3><ol className="ai-practice-list"><li>Write one task and a definition of success, such as categorizing support tickets into a fixed set of categories.</li><li>Prepare representative examples and an expected answer or scoring rubric. Include ambiguous cases and cases the system should defer.</li><li>Compare a simple baseline and candidate tools on the same examples. Separate selection examples from a final evaluation set.</li><li>Record correctness, failure types, time, and cost. Keep enough context to reproduce the result.</li><li>Choose based on the evidence, then monitor new inputs and repeat the evaluation when the system changes.</li></ol>
      <p className="ai-source">Lifecycle perspective: <a href="https://www.nist.gov/itl/ai-risk-management-framework">NIST AI Risk Management Framework</a>.</p>
      <details className="ai-glossary"><summary>Keep these twelve terms nearby</summary><dl className="ai-definition-grid">{glossary.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></details>
    </section>

    <section id="practice" className="ai-chapter">
      <ChapterHeading number="09" title="Explain it, experiment, then check."><p>You are ready to move on when you can describe a system without treating every part as a mysterious “AI.”</p></ChapterHeading>
      <ol className="ai-practice-list"><li><strong>Classify three systems.</strong> Pick a route planner, a spam classifier, and an image generator. Identify which parts might use rules, search, ML, or deep learning. State what information you would need to know for sure.</li><li><strong>Change evidence versus input.</strong> In the threshold demo, change the training label and then move the new ticket’s waiting time. Explain which action changes the fitted model.</li><li><strong>Inspect a generated answer.</strong> Ask an available assistant a factual question with a source you can independently inspect. Compare its claims with the source and record any unsupported details.</li><li><strong>Design a small comparison.</strong> Select two tools from the same category. Specify five trial inputs, a scoring rubric, and a simple baseline before looking at their outputs. Treat this as an exploratory exercise, not a definitive benchmark.</li></ol>
      <div className="ai-review">{reviewQuestions.map(([question, answer], i) => <details key={question}><summary><span>{String(i + 1).padStart(2, "0")}</span>{question}</summary><p>{answer}</p></details>)}</div>
    </section>

    <section id="next" className="ai-chapter">
      <ChapterHeading number="10" title="Now give the ideas a working toolkit."><p>Python libraries supply operations for arrays, tables, plots, and models. ML supplies the discipline for learning from data and evaluating what was learned. Knowing one does not replace the other.</p></ChapterHeading>
      <div className="ai-next-grid"><Link href="/#python-libraries"><span className="ai-eyebrow">NEXT / THE TOOLS</span><h3>Python Libraries →</h3><p>Work with data and numerical computation before composing a modeling pipeline.</p></Link><Link href="/ml"><span className="ai-eyebrow">THEN / THE METHODS</span><h3>Machine Learning →</h3><p>Follow five connected weeks: preprocessing, models, features, optimization, and neural networks.</p></Link></div>
      <p className="ai-small">Already comfortable with Python? <Link href="/ml/week-0">Start ML Week 0</Link>. Need the language first? <Link href="/#python-fundamentals">Review Python fundamentals</Link>. Deep learning follows in the <Link href="/dl">DL learning map</Link>.</p>
    </section>
    <footer className="ai-footer"><p>Learn the idea. Test the behavior. Keep asking what the evidence supports.</p><a href="#history">Back to the beginning ↑</a></footer>
  </main>;
}

