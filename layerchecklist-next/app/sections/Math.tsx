import "./Section.css";
import "./Math.css";

export default function Math() {
    return (
      <section id="math" className="learning-section fade-section">
        <h2>Math: Learn to Read It, Not Fear It</h2>
  
        <p>
          In Machine Learning, equations are easier when you stop looking at them as
          complicated math and start reading them like sentences.
        </p>
  
        <p className="math-takeaway">
          <strong>Think of it this way:</strong><br />
          Symbols are just words.<br />
          An equation is just a sentence made from those words.
        </p>
  
        <h3>Start With the Most Common Symbols</h3>
  
        <ul className="math-symbol-grid">
          <li>
            <strong>x</strong> — the <strong>input</strong> or data given to the model.
            <br />
            Example: age, height, temperature, pixels in an image, etc.
          </li>
  
          <li>
            <strong>y</strong> — the <strong>actual answer</strong>.
            <br />
            This is what we already know to be correct.
          </li>
  
          <li>
            <strong>ŷ (y-hat)</strong> — the model&apos;s <strong>predicted answer</strong>.
            <br />
            Think: <em>&quot;What did the model guess?&quot;</em>
          </li>
  
          <li>
            <strong>w</strong> — a <strong>weight</strong>.
            <br />
            It tells the model how important an input should be.
          </li>
  
          <li>
            <strong>b</strong> — the <strong>bias</strong>.
            <br />
            Think of it as an extra adjustable value that helps the model fit the data.
          </li>
  
          <li>
            <strong>θ (theta)</strong> — all of the model&apos;s adjustable parameters together.
            <br />
            Usually this means the model&apos;s weights and biases.
          </li>
  
          <li>
            <strong>L or J</strong> — the <strong>loss/error</strong>.
            <br />
            Think: <em>&quot;How wrong is the model?&quot;</em>
          </li>
  
          <li>
            <strong>α (alpha)</strong> — the <strong>learning rate</strong>.
            <br />
            Think: <em>&quot;How big of a step should the model take while learning?&quot;</em>
          </li>
        </ul>
  
        <h3>Symbols That Tell Us What to Do</h3>
  
        <ul className="math-symbol-grid">
          <li>
            <strong>Σ (sigma)</strong> — <strong>&quot;add all of these.&quot;</strong>
            <br />
            If the model makes many errors, Σ can tell us to add those errors together.
          </li>
  
          <li>
            <strong>∇ (nabla)</strong> — the <strong>gradient</strong>.
            <br />
            For now, read it as:
            <em>&quot;Which direction should the model change?&quot;</em>
            <br />
            More precisely, it tells us how the loss changes when the model&apos;s parameters change.
          </li>
  
          <li>
            <strong>E[X]</strong> — the <strong>expected value</strong>.
            <br />
            Think:
            <em>&quot;What average result should I expect if this happened many times?&quot;</em>
          </li>
  
          <li>
            <strong>argmax</strong> — <strong>&quot;which choice gives me the biggest result?&quot;</strong>
          </li>
  
          <li>
            <strong>argmin</strong> — <strong>&quot;which choice gives me the smallest result?&quot;</strong>
            <br />
            In ML, we often use this idea because we want the parameters that give us
            the smallest loss.
          </li>
        </ul>
  
        <h3>Small Symbols Around Other Symbols</h3>
  
        <ul className="math-symbol-grid">
          <li>
            <strong>x<sub>i</sub></strong> — the <strong>i-th item</strong>.
            <br />
            If we have many values, the subscript tells us which one we are talking about.
            <br />
            Example:
            x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>.
          </li>
  
          <li>
            <strong>x²</strong> — x multiplied by itself.
            <br />
            Example: 5² = 5 × 5 = 25.
          </li>
  
          <li>
            <strong>x<sup>(i)</sup></strong> — usually means the
            <strong>i-th example</strong> in a dataset.
            <br />
            The parentheses are important: this usually does <strong>not</strong>
            mean &quot;x to the power of i.&quot;
          </li>
        </ul>
  
        <h3>Now Read an Equation Like a Sentence</h3>
  
        <p>Suppose you see:</p>
  
        <p className="math-equation"><strong>ŷ = wx + b</strong></p>
  
        <p>Don&apos;t immediately think, <em>&quot;Oh no, math.&quot;</em></p>
  
        <p>Translate each symbol:</p>
  
        <ul className="math-breakdown">
          <li><strong>x</strong> = input</li>
          <li><strong>w</strong> = importance of that input</li>
          <li><strong>b</strong> = extra adjustment</li>
          <li><strong>ŷ</strong> = prediction</li>
        </ul>
  
        <p>So the equation is simply saying:</p>
  
        <p className="math-takeaway">
          <strong>
            &quot;Take the input, multiply it by its importance, add an adjustment,
            and you get the model&apos;s prediction.&quot;
          </strong>
        </p>
  
        <h3>A More Machine-Learning-Looking Equation</h3>
  
        <p>You may eventually see something like:</p>
  
        <p className="math-equation"><strong>θ := θ − α∇J(θ)</strong></p>
  
        <p>Instead of memorizing it, translate it:</p>
  
        <ul className="math-breakdown">
          <li><strong>θ</strong> = the model&apos;s current settings</li>
          <li><strong>J</strong> = how wrong the model is</li>
          <li><strong>∇J</strong> = which direction makes the error increase</li>
          <li><strong>α</strong> = how big of a step we take</li>
          <li><strong>−</strong> = move in the opposite direction</li>
        </ul>
  
        <p>In normal English:</p>
  
        <p className="math-takeaway">
          <strong>
            &quot;Change the model&apos;s settings a little bit in the direction that reduces
            its error.&quot;
          </strong>
        </p>
  
        <p>That is the basic idea behind <strong>gradient descent</strong>.</p>
  
        <h3>The Main Idea</h3>
  
        <p>
          You do not need to memorize every mathematical symbol immediately.
          When you see an ML equation:
        </p>
  
        <ol>
          <li>Identify what each symbol means.</li>
          <li>Figure out what operation is happening.</li>
          <li>Translate the equation into normal English.</li>
          <li>Only then worry about the formal mathematics.</li>
        </ol>
  
        <p>Once you can translate the symbols, an equation stops looking like:</p>
  
        <p><strong>&quot;θ, α, ∇, Σ ... what is going on?&quot;</strong></p>
  
        <p>and starts sounding like:</p>
  
        <p className="math-takeaway">
          <strong>
            &quot;Make a prediction, compare it with the real answer, measure the error,
            and adjust the model so the next prediction is better.&quot;
          </strong>
        </p>
      </section>
    );
  }
