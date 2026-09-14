import "./Section.css";
import "./SimulationsEnv.css";

export default function SimulationsEnv() {
    return (
      <section id="simulations" className="learning-section fade-section">
        <h2>Simulation Environments</h2>
  
        <p>
          Before deploying to real hardware, robotics and RL models are usually
          trained and tested in simulation — faster, safer, and far cheaper than
          breaking real robots.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every simulator: What's being modeled physically? How well does
            simulated behavior transfer to the real world?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>MuJoCo</strong>
              <p>
                A physics engine (Multi-Joint dynamics with Contact) built for
                fast, accurate simulation of contact-rich robotics tasks.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know that MuJoCo models are typically defined declaratively in
                XML, describing bodies and joints rather than coding them.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`import mujoco
  
  mujoco.mj_step(model, data)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>NVIDIA Isaac Sim</strong>
              <p>
                A GPU-accelerated simulation platform that can run thousands of
                environments in parallel — built specifically for training RL
                policies at scale.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why massive parallelism matters specifically for RL (which
                needs huge amounts of experience to train well).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`# Conceptual — thousands of environments
  # stepped together on GPU
  envs = IsaacEnv(num_envs=4096)
  obs = envs.reset()`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Domain Randomization</strong>
              <p>
                Randomizing simulation parameters (friction, lighting, mass)
                during training so a policy generalizes better to the real world.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why this directly addresses the &quot;sim-to-real gap.&quot;
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`# Conceptual
  env.randomize_physics(friction_range=(0.5, 1.5))`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Sim-to-Real Transfer</strong>
              <p>
                Taking a policy trained entirely in simulation and deploying it on
                physical hardware — rarely a perfect 1:1 match.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Name at least one technique used to close the sim-to-real gap
                (domain randomization, fine-tuning on real data).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`policy.load("trained_in_sim.pt")
  real_robot.run(policy)`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>Simulation Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>Why use a physics simulator instead of testing directly on real hardware?</li>
            <li>What's the difference between MuJoCo and Isaac Sim in terms of scale?</li>
            <li>What is domain randomization, and what problem does it solve?</li>
            <li>What is the &quot;sim-to-real gap&quot;?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>
          You should understand simulation not just as a testing tool, but as a
          way to generate cheap, safe training data at a scale real hardware
          can&apos;t match.
        </p>
  
        <p>
          <strong>
            Simulation scale is often the difference between an RL policy that works and one that doesn't.
          </strong>
        </p>
      </section>
    );
  }
