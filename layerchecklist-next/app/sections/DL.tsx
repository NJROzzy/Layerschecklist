export default function DL() {
    return (
      <section id="dl" className="fade-section">
        <h2>Deep Learning Fundamentals</h2>
  
        <p>
          Deep learning is ML built on neural networks — many layers of simple
          computations stacked together to learn complex patterns directly from data.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every concept: What layer/component is this? What problem does it
            solve? What happens during training vs. inference?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Neurons & Layers</strong>
              <p>
                A neuron computes a weighted sum of its inputs, adds a bias, and
                passes the result through an activation function. Layers stack
                many neurons together.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Be able to trace input → weighted sum → activation → output for a
                single neuron.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import torch.nn as nn
  
  layer = nn.Linear(in_features=10, out_features=5)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Activation Functions</strong>
              <p>
                Introduce non-linearity — without them, stacking layers would be
                mathematically equivalent to just one layer.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why ReLU is preferred over sigmoid in hidden layers (avoids
                vanishing gradients).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import torch.nn.functional as F
  
  x = F.relu(x)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Forward & Backward Pass</strong>
              <p>
                The forward pass computes predictions. The backward pass computes
                gradients of the loss with respect to every parameter, using the
                chain rule.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know that <code>.backward()</code> computes gradients, but doesn&apos;t
                update weights — that&apos;s the optimizer&apos;s job.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`output = model(x)
  loss = loss_fn(output, y)
  
  loss.backward()
  optimizer.step()`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Backpropagation</strong>
              <p>
                The algorithm that efficiently computes gradients for every layer
                by propagating the error backward from the output layer to the
                input layer.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Understand that it&apos;s just repeated application of the chain rule,
                layer by layer.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`# Conceptual:
  # dL/dw = dL/dout * dout/dw
  # computed layer by layer, backward`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Convolutional Layers (CNNs)</strong>
              <p>
                Slide small filters across an image to detect local patterns
                (edges, textures) — much more parameter-efficient than a fully
                connected layer for images.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why CNNs use far fewer parameters than a fully connected
                network for the same image size.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Recurrent & Attention-Based Models</strong>
              <p>
                RNNs process sequences step by step, carrying a hidden state.
                Transformers use attention to look at all positions in a sequence
                at once, which is why they&apos;ve largely replaced RNNs.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the core advantage of attention over RNNs: parallelization
                and better handling of long-range dependencies.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`nn.MultiheadAttention(embed_dim=64, num_heads=8)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Dropout & Batch Normalization</strong>
              <p>
                Dropout randomly zeroes some neurons during training to prevent
                overfitting. BatchNorm normalizes layer inputs to stabilize and
                speed up training.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know that both behave differently during training vs. evaluation
                (<code>model.eval()</code> matters).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`nn.Dropout(p=0.5)
  nn.BatchNorm1d(num_features=64)`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>Deep Learning Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>What does an activation function do, and why is it necessary?</li>
            <li>What is backpropagation, in your own words?</li>
            <li>What is the vanishing gradient problem?</li>
            <li>Why do CNNs work well for images specifically?</li>
            <li>What is the core idea behind attention mechanisms?</li>
            <li>What is the difference between training mode and eval mode in PyTorch?</li>
            <li>What does dropout do, and why does it help prevent overfitting?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>
          You should be able to sketch a simple network architecture for a given
          problem and justify each component&apos;s role — not just name the layers.
        </p>
  
        <p>
          <strong>
            Frameworks hide the math. Interviews expect you to know it anyway.
          </strong>
        </p>
      </section>
    );
  }