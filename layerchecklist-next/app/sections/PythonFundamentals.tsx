export default function PythonFundamentals() {
    return (
      <section id="python-fundamentals" className="fade-section">
        <h2>Python Fundamentals</h2>
  
        <p>
          These are the Python concepts that show up constantly in AI, ML, and DL work —
          and just as importantly, the ones you should be comfortable explaining during
          a technical interview.
        </p>
  
        <p>
          The goal is not to memorize syntax. The goal is to understand what the code
          is doing well enough that you can explain it, modify it, debug it, and write
          a small version of it under pressure.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every concept below, ask yourself three questions:
            What does it do? Why would I use it? What happens if I change it?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Lists &amp; list comprehensions</strong>
              <p>
                Lists store ordered collections of values. In ML code, they appear in
                preprocessing, filtering, batching, feature construction, and quick data
                transformations.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to convert a normal loop into a list comprehension and explain
                when readability is more important than making the code shorter.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`squares = [x**2 for x in range(5)]
  
  # Same idea written normally:
  squares = []
  
  for x in range(5):
      squares.append(x**2)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Dictionaries</strong>
              <p>
                Dictionaries store information as key-value pairs. They are everywhere
                in ML projects: configurations, label mappings, model outputs,
                hyperparameters, and experiment results.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know how to access, update, loop through, and safely retrieve dictionary
                values using <code>.get()</code>.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`config = {
      "lr": 0.001,
      "epochs": 10
  }
  
  print(config["lr"])
  
  config["epochs"] = 20
  
  batch_size = config.get("batch_size", 32)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Tuples &amp; unpacking</strong>
              <p>
                Tuples often represent fixed groups of values. Unpacking lets you pull
                those values apart cleanly.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Understand why
                <code>batch_size, channels, height, width = x.shape</code>
                is useful and what error occurs if the number of values does not match.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`shape = (32, 3, 224, 224)
  
  batch_size, channels, h, w = shape
  
  print(batch_size)
  # 32`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Functions &amp; default arguments</strong>
              <p>
                Functions organize reusable logic. Training loops, preprocessing steps,
                evaluation functions, and model utilities are usually built from small
                reusable functions.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to explain parameters, return values, default arguments, and
                why mutable default arguments can be dangerous.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`def train(model, epochs=10, lr=0.001):
      print(f"Training for {epochs} epochs")
      print(f"Learning rate: {lr}")`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>*args and **kwargs</strong>
              <p>
                <code>*args</code> collects extra positional arguments.
                <code>**kwargs</code> collects extra named arguments.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to explain the difference between positional arguments and
                keyword arguments.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`def example(*args, **kwargs):
      print(args)
      print(kwargs)
  
  example(1, 2, lr=0.001, epochs=10)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Classes &amp; __init__</strong>
              <p>
                Classes let us group data and behavior together. In deep learning,
                models are usually represented as objects.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to explain what <code>self</code>, <code>__init__</code>,
                inheritance, and <code>super()</code> are doing.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`class Net(nn.Module):
  
      def __init__(self):
          super().__init__()
          self.fc = nn.Linear(10, 1)
  
      def forward(self, x):
          return self.fc(x)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Loops with enumerate()</strong>
              <p>
                <code>enumerate()</code> gives you both the position and the value while
                looping.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why <code>enumerate()</code> is usually cleaner than manually
                maintaining a counter.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`losses = [0.9, 0.6, 0.3]
  
  for epoch, loss in enumerate(losses):
      print(epoch, loss)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>zip()</strong>
              <p>
                <code>zip()</code> lets you loop through multiple collections together.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know what happens if the collections have different lengths.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`predictions = [1, 0, 1]
  labels = [1, 1, 1]
  
  for pred, label in zip(predictions, labels):
      print(pred, label)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Lambda functions</strong>
              <p>
                Lambda functions are small anonymous functions used when a full function
                definition would be unnecessary.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the syntax, but also know when a normal function would be more
                readable.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`numbers = [1, 2, 3, 4]
  
  squares = list(map(lambda x: x**2, numbers))`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Exception handling</strong>
              <p>
                Real ML pipelines fail: missing files, invalid inputs, corrupt samples,
                bad API responses, and shape mismatches all happen.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Understand <code>try</code>, <code>except</code>, and why catching every
                error with a bare <code>except</code> is usually a bad idea.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`try:
      value = int(user_input)
  
  except ValueError:
      print("Input must be a number.")`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Decorators</strong>
              <p>
                Decorators modify the behavior of a function without changing the
                function itself.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                You do not always need to implement a decorator from scratch, but you
                should understand what the <code>@</code> syntax means.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`@torch.no_grad()
  def evaluate(model, x):
      return model(x)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Iterators &amp; generators</strong>
              <p>
                Generators produce values one at a time instead of storing everything
                in memory at once.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to explain why <code>yield</code> can use less memory than
                returning one huge list.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`def batches(data, batch_size):
  
      for i in range(0, len(data), batch_size):
          yield data[i:i + batch_size]`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>Python Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>What is the difference between a list and a tuple?</li>
            <li>What is the difference between <code>==</code> and <code>is</code>?</li>
            <li>What is the difference between a shallow copy and a deep copy?</li>
            <li>What are mutable and immutable objects?</li>
            <li>What do <code>*args</code> and <code>**kwargs</code> do?</li>
            <li>What does <code>self</code> mean inside a Python class?</li>
            <li>What does <code>super()</code> do?</li>
            <li>What is a generator and why would you use one?</li>
            <li>What is the difference between <code>append()</code> and <code>extend()</code>?</li>
            <li>What happens when you assign one list to another variable?</li>
            <li>What is a dictionary lookup and why is it usually fast?</li>
            <li>What is the difference between <code>range()</code> and a list?</li>
            <li>What does a decorator do?</li>
            <li>Why are exceptions useful?</li>
            <li>What is the difference between a method and a function?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>You are interview-ready when you can do more than recognize the syntax.</p>
  
        <p>You should be able to look at a short piece of Python code and:</p>
  
        <ul>
          <li>Explain what it does line by line.</li>
          <li>Predict its output before running it.</li>
          <li>Find a bug or edge case.</li>
          <li>Rewrite it in a cleaner way.</li>
          <li>Explain why you chose one data structure over another.</li>
          <li>Connect the Python concept to how it appears in ML code.</li>
        </ul>
  
        <p>
          <strong>
            Syntax gets you through the code. Understanding gets you through the interview.
          </strong>
        </p>
      </section>
    );
  }