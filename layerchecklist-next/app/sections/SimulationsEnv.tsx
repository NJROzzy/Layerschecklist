import Link from "next/link";
import "./Section.css";
import "./SimulationsEnv.css";

const tools = [
  { name: "MuJoCo", role: "Physics engine", text: "Articulated dynamics, actuators, and contact. A compact starting point for CPU control experiments; MJX adds accelerated options with backend-specific capabilities.", example: "Run a force-controlled carriage, inspect its trajectory, and then replace the controller with a policy.", href: "/simulations#simulator-examples" },
  { name: "NVIDIA Isaac Sim", role: "Robotics simulation platform", text: "Create scenes, simulate physical interactions and sensors, render observations, and integrate robotics software. Simulation itself does not train a neural network.", example: "Drop a dynamic cube onto a ground plane, inspect its height, then add the sensors your robot needs.", href: "/simulations#simulator-examples" },
  { name: "NVIDIA Isaac Lab", role: "Robot-learning framework", text: "Define tasks, rewards, observations, actions, resets, and batches of environments. Connect those environments to a compatible RL training library.", example: "Train a Franka reaching task with an official runner, then evaluate on held-out target poses.", href: "/simulations#simulator-examples" },
  { name: "Physics + neural models", role: "A choice of architecture", text: "A network can choose actions, approximate dynamics, correct a physical model, or supplement a controller. Each arrangement learns a different function.", example: "Fit a neural correction for missing drag and compare its rollout against an incomplete physics model.", href: "/simulations#physics-neural-hybrid" },
  { name: "DDPG", role: "Off-policy continuous control", text: "A deterministic actor proposes actions; a Q critic evaluates them. Replay reuses experience and slow target networks provide bootstrapped targets.", example: "Follow the critic's action gradient and calculate one actor and target-network update.", href: "/simulations#ddpg" },
  { name: "A3C", role: "Asynchronous actor–critic", text: "Independent workers collect short rollouts and update a shared stochastic policy and value function. The worker schedule is separate from the physics engine.", example: "Compute n-step returns and advantages, including the difference between termination and a rollout cutoff.", href: "/simulations#a3c" },
];

export default function SimulationsEnv() {
  return <section id="simulations" className="learning-section fade-section">
    <h2>Simulation Environments</h2>
    <p>Choose the world, the task, and the learner separately. Isaac Sim provides a robotics simulation platform; Isaac Lab adds robot-learning workflows; MuJoCo supplies another physics engine and ecosystem. The full simulation lab shows how they connect.</p>
    <div className="interview-note"><strong>Start with the comparison.</strong><p>For local control experiments, consider MuJoCo. For sensor-rich scenes, investigate Isaac Sim. For batched robot learning in that ecosystem, investigate Isaac Lab. Validate the choice with your actual model, hardware, and evaluation task.</p><Link href="/simulations#learning-stack">Explore the interactive stack and comparison →</Link></div>
    <div className="topic-grid">{tools.map(tool => <article className="topic-row" key={tool.name}>
      <div className="topic-explain"><span className="senv-role">{tool.role}</span><h3>{tool.name}</h3><p>{tool.text}</p><p className="interview-tip"><strong>Try it:</strong> {tool.example}</p></div>
      <div className="senv-action"><Link href={tool.href}>Open the lesson and example →</Link></div>
    </article>)}</div>
    <p><strong>Keep the comparison honest.</strong> Match robot parameters, action units, observation processing, physics and control rates, and evaluation conditions. A photorealistic image, high throughput, or a low training loss answers only part of the question. <Link href="/simulations#learning-comparison">Compare DDPG and A3C, and choose an experiment →</Link></p>
    <Link className="senv-more" href="/simulations#tools">See the wider tool landscape: Gazebo, Webots, Gymnasium, and more →</Link>
  </section>;
}
