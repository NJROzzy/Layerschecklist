import Link from "next/link";
import { readFileSync } from "node:fs";
import path from "node:path";
import { A3CLab, DDPGLab, HybridLab, StackExplorer } from "./LearningLabs";
import { platformReviewedOn, platformReviewedOnISO } from "./content";
import "./learning-systems.css";

const sources = {
 sim: "https://docs.isaacsim.omniverse.nvidia.com/5.1.0/core_api_tutorials/tutorial_core_hello_world.html",
 lab: "https://isaac-sim.github.io/IsaacLab/v2.3.0/source/overview/reinforcement-learning/rl_existing_scripts.html",
 tasks: "https://isaac-sim.github.io/IsaacLab/main/source/overview/environments.html",
 mujoco: "https://mujoco.readthedocs.io/en/stable/python.html",
 mjx: "https://mujoco.readthedocs.io/en/stable/mjx.html",
 newton: "https://isaac-sim.github.io/IsaacLab/main/source/experimental-features/newton-physics-integration/index.html",
 ddpg: "https://arxiv.org/abs/1509.02971",
 a3c: "https://proceedings.mlr.press/v48/mniha16.html",
};
function Title({n,title,children}:{n:string;title:string;children:React.ReactNode}) {return <header className="sim-chapter-heading"><span className="sim-eyebrow">CHAPTER {n} / SIMULATION MEETS LEARNING</span><h2>{title}</h2>{children}</header>;}
function Code({label,children}:{label:string;children:string}) {return <div className="sl-code"><span className="sim-eyebrow">{label}</span><pre tabIndex={0} aria-label={label}><code>{children}</code></pre></div>;}
function Table({label,headers,rows}:{label:string;headers:string[];rows:string[][]}) {return <div className="sim-table-wrap" tabIndex={0} role="region" aria-label={label}><table><caption>{label}</caption><thead><tr>{headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i?<td key={i}>{cell}</td>:<th scope="row" key={i}>{cell}</th>)}</tr>)}</tbody></table></div>;}
function Download({file,label}:{file:string;label:string}) {const code=readFileSync(path.join(process.cwd(),"public","examples",file),"utf8");return <><a className="sl-download" href={`/examples/${file}`} download>Download {label} ↓</a><details className="sl-details"><summary>Read the complete {label} script</summary><Code label={file}>{code}</Code></details></>;}

export default function LearningSystems() {
 return <>
  <section id="learning-stack" className="sim-chapter sl-chapter">
   <Title n="12" title="The world, the task, and the learner."><p>Isaac Sim, Isaac Lab, and MuJoCo occupy different layers. Start by separating the system that advances the world from the system that chooses actions and learns from the results.</p></Title>
   <StackExplorer />
   <div className="sl-three">
    <article><span className="sim-eyebrow">SIMULATION PLATFORM</span><h3>Isaac Sim</h3><p>Build robot scenes, run physics, simulate sensors, render images, and connect robotics software. A cube can fall correctly without any neural network in the application.</p><a href={sources.sim}>Isaac Sim example ↗</a></article>
    <article><span className="sim-eyebrow">ROBOT-LEARNING FRAMEWORK</span><h3>Isaac Lab</h3><p>Define observations, actions, rewards, resets, randomization, and batches of robot environments. An integrated RL library supplies the training algorithm.</p><a href={sources.lab}>Isaac Lab training workflows ↗</a></article>
    <article><span className="sim-eyebrow">PHYSICS ENGINE + ECOSYSTEM</span><h3>MuJoCo</h3><p>Model articulated bodies, actuators, and contacts. Use its Python bindings directly or an environment wrapper. Its simulator does not automatically train a policy.</p><a href={sources.mujoco}>MuJoCo Python API ↗</a></article>
   </div>
   <Table label="Which is better for which job? These are starting choices to validate on your task." headers={["Your main need","Useful starting point","Why / what to measure"]} rows={[
    ["Learn dynamics and control on a laptop","MuJoCo CPU","Compact headless experiments; inspect equations, control rates, and solver behavior."],
    ["Camera-rich robotics scenes and sensor integration","Isaac Sim","Scene and sensor workflows; measure rendering cost and the realism your task needs."],
    ["Train many robot environments together in the Isaac ecosystem","Isaac Lab + an RL library","Task construction and batched rollouts; measure total training throughput and GPU memory."],
    ["Large batched MuJoCo experiments","MJX-JAX or MJX-Warp, with a learning stack","Select by hardware and feature support; include compilation, transfer, and contact costs."],
    ["Differentiate through dynamics","A supported differentiable backend, such as MJX-JAX","Validate actual gradients and contact behavior. GPU acceleration alone does not imply differentiation."],
    ["Compare contact-rich manipulation results","Both, with matched physical and control settings","Compare penetration, slip, grasp success, solver convergence, and sensitivity. There is no task-independent accuracy winner."],
   ]}/>
   <p className="sim-note">The accelerated MuJoCo options differ: MJX-JAX supports automatic differentiation for supported operations; the current MJX-Warp documentation explicitly excludes autodiff. Check the feature matrix for your model. <a href={sources.mjx}>MJX implementation reference ↗</a></p>
   <aside className="sim-callout"><strong>The connection is becoming more direct.</strong><p>The familiar Isaac Lab 2.x stack uses Isaac Sim and PhysX. The documented Isaac Lab 3.0 beta also explores Newton with a MuJoCo-Warp solver. Treat that as a version-specific integration with its own limitations, not evidence that every Isaac task already uses MuJoCo. <a href={sources.newton}>Newton integration status ↗</a></p></aside>
   <p>Moving a policy between engines requires matching joint order, units, observation normalization, action meaning, limits, control frequency, and reset conditions. A shared robot file or a successful import does not guarantee identical dynamics.</p>
  </section>

  <section id="simulator-examples" className="sim-chapter sl-chapter">
   <Title n="13" title="Three examples, three different jobs."><p>First make a physical system move. Then add a task and a learning loop. These examples separate those steps so you can see what each tool contributes.</p></Title>
   <article className="sl-example"><span className="sim-eyebrow">EXAMPLE A / MUJOCO / CPU</span><h3>A carriage follows a target on a rail</h3><p>A proportional–derivative controller turns position error and velocity into force. MuJoCo advances the constrained body. Physics runs at 400 Hz; the command is held for four steps, giving a 100 Hz controller. There is no neural network in this baseline.</p>
    <Code label="Run in a Python environment">{"python -m pip install mujoco\npython sim-mujoco-servo.py"}</Code>
    <Download file="sim-mujoco-servo.py" label="MuJoCo servo"/>
    <p className="sim-note">The CSV records time, position, velocity, and force. Compare overshoot, settling, and saturation while changing mass or damping. This rail example does not test contact fidelity. <a href={sources.mujoco}>API reference ↗</a></p>
   </article>
   <article className="sl-example"><span className="sim-eyebrow">EXAMPLE B / ISAAC SIM / COMPATIBLE WORKSTATION</span><h3>A cube falls and settles on a ground plane</h3><p>Create a scene, give a cube collision geometry and mass, reset, and advance physics. Inspect its center height as contact brings it to rest. Adding a camera would add an observation source; it would not add a learning objective.</p>
    <Code label="Isaac Sim 5.1 Core API environment">{"# From a compatible Isaac Sim installation:\n./python.sh /path/to/sim-isaac-cube.py\n# Windows uses python.bat. This is not ordinary system Python."}</Code>
    <Download file="sim-isaac-cube.py" label="Isaac Sim cube"/>
    <p className="sim-note">This download targets the documented 5.1 Core API; newer releases may use different APIs. It is source-checked, not executed here. Use a supported OS/GPU or a remote machine; macOS is not listed for the full Isaac Sim application. <a href={sources.sim}>Versioned example API ↗</a> · <a href="https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html">Current hardware requirements ↗</a></p>
   </article>
   <article className="sl-example"><span className="sim-eyebrow">EXAMPLE C / ISAAC LAB / ROBOT LEARNING</span><h3>A Franka arm learns to reach a target</h3><p>The environment supplies robot observations, actions, target-pose error, reward terms, and episode resets. The RL runner collects experience and updates a policy. Start with the official task and inspect its configuration before changing the reward.</p>
    <Code label="Documented Isaac Lab 2.3 / RSL-RL workflow">{"# In an installed, compatible Isaac Lab checkout:\n./isaaclab.sh -i rsl_rl\n./isaaclab.sh -p scripts/reinforcement_learning/rsl_rl/train.py \\\n  --task Isaac-Reach-Franka-v0 --num_envs 64 --headless\n# List tasks in your checkout before choosing a different one:\n./isaaclab.sh -p scripts/environments/list_envs.py"}</Code>
    <p className="sim-note">This is a starting command for the task&apos;s configured RSL-RL agent, commonly PPO; it is not a DDPG or A3C command. Increase environment count only after checking memory and throughput. Commands were checked against the versioned documentation, not run on this site. <a href={sources.lab}>Training reference ↗</a> · <a href={sources.tasks}>Task catalog ↗</a> · <a href="https://isaac-sim.github.io/IsaacLab/v2.3.0/source/setup/installation/index.html">Compatible installation ↗</a></p>
   </article>
   <Table label="Make a reaching experiment precise" headers={["Piece","Example specification","Check before training"]} rows={[
    ["Observation","Joint positions/velocities and target-relative pose","Are all inputs available at deployment?"],
    ["Action","Joint-position offsets, Cartesian targets, or torques","These are different control problems; record the mapping."],
    ["Reward","Position/orientation error plus chosen effort penalties","Units, weights, and unwanted shortcuts."],
    ["Reset and ending","Sample targets; distinguish failure from time limits","Bootstrap correctly and use the actual final observation."],
    ["Evaluation","Success within a pose tolerance on held-out targets","Report multiple seeds, cost, and failure cases."],
   ]}/>
  </section>

  <section id="physics-neural-hybrid" className="sim-chapter sl-chapter">
   <Title n="14" title="Physics and neural networks can share the work."><p>A physics engine advances a modeled state. A neural runtime, such as PyTorch or JAX, evaluates parameterized functions and computes training gradients. The connection between them can take several forms.</p></Title>
   <Table label="Four arrangements that are often confused" headers={["Arrangement","What the neural network does","What remains physical"]} rows={[
    ["Policy in a simulator","Maps observations to actions","The engine advances the world. DDPG and A3C fit here."],
    ["Learned dynamics surrogate","Predicts the next state or state change","Physical training data may inform it, but constraints are not automatically preserved."],
    ["Residual dynamics model","Predicts a correction to a known dynamics model","The analytical model carries the structure it already explains."],
    ["Residual controller","Adds a learned action correction to a baseline controller","The engine or real plant still defines the dynamics."],
   ]}/>
   <Code label="Two distinct hybrid designs">{"Dynamics:  x_next = f_physics(x, u) + residual_theta(x, u)\nControl:   u = clip(u_baseline(x) + policy_theta(observation))\n\nA policy trained in simulation is not automatically a learned simulator.\nModel-free policy training does not require gradients through the physics engine."}</Code>
   <HybridLab />
   <p>Residual learning helps when the known model captures useful structure and the correction sees representative data. Test longer rollouts and new parameter settings: a small one-step error can accumulate, and a learned correction can violate energy or stability properties. A physics-informed loss or differentiable simulator is another design choice, not a synonym for every hybrid model.</p>
   <p className="sim-note">For a research example of combining an existing controller with learned corrections, see <a href="https://arxiv.org/abs/1812.03201">Johannink et al., Residual Reinforcement Learning for Robot Control</a>. The browser experiment above learns a dynamics correction, which is a different placement of the learned component.</p>
  </section>

  <section id="ddpg" className="sim-chapter sl-chapter">
   <Title n="15" title="DDPG: learn a continuous action and its value."><p>Deep Deterministic Policy Gradient uses an actor μ(s) that proposes a continuous action and a critic Q(s,a) that estimates its return. Think of a torque-controlled joint: the action is a number in a range, not a class label.</p></Title>
   <div className="sl-flow" role="group" aria-label="DDPG data flow"><span>Actor + exploration noise</span><b>→</b><span>Physics environment</span><b>→</b><span>Replay transitions</span><b>→</b><span>Critic + actor updates</span></div>
   <p>DDPG is off-policy: it learns from stored transitions collected by earlier behavior policies. Exploration noise is added while collecting data; evaluation normally uses the deterministic actor. Slowly updated target networks provide the bootstrap target.</p>
   <Code label="DDPG update equations">{"y = r + gamma * (1 - terminated) * Q_target(s_next, mu_target(s_next))\ncritic_loss = mean((Q(s, a) - stop_gradient(y))^2)\nactor_loss  = -mean(Q(s, mu(s)))\ntarget_parameters = (1 - tau) * target_parameters + tau * online_parameters"}</Code>
   <p>The critic trains on the action actually stored in replay. The actor trains on its current proposed action and follows the critic&apos;s gradient with respect to that action. During the actor step, keep the critic&apos;s input gradient while holding its parameters fixed. Target calculations do not receive gradients. These are the mechanisms introduced by the <a href={sources.ddpg}>DDPG paper</a>.</p>
   <DDPGLab />
   <h3>Connect it to MuJoCo or Isaac Lab</h3><p>A MuJoCo wrapper or an Isaac Lab task can provide observations, rewards, and transitions. The trainer must match the task&apos;s action bounds, vectorization, tensor device, and reset semantics. Neither engine forces DDPG. Availability in a particular RL library is a separate compatibility question.</p>
   <Code label="Training-loop sketch / conceptual, not a package API">{"observe state\naction = clamp(actor(state) + exploration_noise, action_limits)\nnext_state, reward, terminated, truncated = environment.step(action)\nreplay.store(state, action, reward, actual_next_state, terminated)\n\nfor sampled_batch in replay:\n    update_critic_with_detached_target(sampled_batch)\n    update_actor_through_critic_action_gradient(sampled_batch.states)\n    softly_update_both_target_networks()\n\n# Reset on termination OR truncation.\n# Remove bootstrap only for true task termination."}</Code>
   <aside className="sim-callout"><strong>What to inspect when it fails</strong><p>Check action scaling, exploration coverage, critic overestimation, target updates, and reward scale. A falling critic loss does not guarantee better control. DDPG is an instructive baseline; TD3 and SAC address some of its difficulties and are useful comparisons for continuous control. <a href="https://spinningup.openai.com/en/latest/algorithms/ddpg.html">Implementation guide ↗</a></p></aside>
  </section>

  <section id="a3c" className="sim-chapter sl-chapter">
   <Title n="16" title="A3C: several workers, one evolving policy."><p>Asynchronous Advantage Actor-Critic collects short rollouts in multiple environment workers. Each worker uses a local copy of shared parameters, computes policy and value gradients, and applies updates without waiting for every other worker.</p></Title>
   <div className="sl-workers" role="group" aria-label="Independent rollout workers update shared actor and critic"><div><span>Worker 1 · local rollout</span><span>Worker 2 · local rollout</span><span>Worker 3 · local rollout</span></div><b aria-hidden="true">→</b><article><strong>Shared actor + value function</strong><p>Updates arrive at different times. Workers refresh their local weights.</p></article></div>
   <p>The actor represents a stochastic policy π(a|s); the critic estimates V(s). An n-step return combines observed rewards with a final value estimate when the rollout remains nonterminal. Subtracting V(s) produces an advantage estimate. An entropy term can encourage exploration. The original method and its asynchronous design are described in <a href={sources.a3c}>Mnih et al. (2016)</a>.</p>
   <Code label="A3C rollout objectives">{"R_t = r_t + gamma*r_(t+1) + ... + gamma^n * V(s_(t+n))\n# Use zero final bootstrap at true termination.\nadvantage_t = R_t - V(s_t)\nactor_loss  = -log pi(a_t|s_t) * stop_gradient(advantage_t) - beta * entropy\nvalue_loss  = 0.5 * (V(s_t) - stop_gradient(R_t))^2"}</Code>
   <A3CLab />
   <h3>Asynchronous is a training schedule, not a physics feature</h3><p>A3C can use categorical actions or a continuous-action distribution, such as a Gaussian with a properly handled bounded-action transformation. It does not need a differentiable engine. Separate MuJoCo CPU environments are a natural teaching setup for independent workers. A large synchronized GPU batch in Isaac Lab is not automatically A3C.</p>
   <p>A3C is conventionally treated as on-policy because updates use recent local rollouts without a large replay buffer. Asynchronous parameter delay still introduces policy lag. A2C synchronizes worker updates; PPO uses a different update objective. Parallel environments alone do not make these algorithms equivalent.</p>
   <Code label="Worker-loop sketch / conceptual, not executable multiprocessing code">{"repeat in each worker:\n    local_parameters = copy(shared_parameters)\n    collect up to n steps using the local policy\n    bootstrap = 0 if truly_terminal else local_value(final_observation)\n    walk rewards backward to compute n-step returns\n    compute actor, value, and entropy losses\n    apply local gradients to shared parameters\n    refresh local parameters\n\n# Correct shared optimizer state and update synchronization are implementation work.\n# Using fresh independent local optimizers is not automatically equivalent to A3C."}</Code>
  </section>

  <section id="learning-comparison" className="sim-chapter sl-chapter">
   <Title n="17" title="Choose the simulator and algorithm separately."><p>There is no fixed pairing of MuJoCo with DDPG or Isaac Lab with A3C. Choose the environment for its physics, sensors, hardware, and task workflow. Choose the algorithm for its action space, data reuse, and update behavior.</p></Title>
   <Table label="DDPG and A3C at a glance" headers={["Dimension","DDPG","A3C"]} rows={[
    ["Actor","Deterministic continuous-action mapping","Stochastic policy; discrete or continuous variants"],
    ["Critic","Action value Q(s,a)","State value V(s)"],
    ["Data","Off-policy replay batches","Recent local rollouts; asynchronous policy lag"],
    ["Target","Bootstrapped Q with slow target networks","n-step return with a final value bootstrap"],
    ["Exploration","Behavior noise around the actor","Policy sampling, often entropy regularization"],
    ["Parallelism","Possible, but not its defining mechanism","Independent workers update shared parameters"],
    ["Typical concern","Critic errors can misdirect the actor","Stale gradients, variance, and update coordination"],
   ]}/>
   <div className="sl-three">
    <article><span className="sim-eyebrow">PROJECT 1</span><h3>A controlled joint</h3><p>Start with the MuJoCo PD example. Define observations and reward, then compare a DDPG agent with the same action limits and control rate. Report tracking error, effort, and environment steps.</p></article>
    <article><span className="sim-eyebrow">PROJECT 2</span><h3>Parallel reaching</h3><p>Use Isaac Lab&apos;s reaching task with its supported baseline. Scale the number of environments while recording end-to-end throughput, GPU memory, and held-out success—not just frames per second.</p></article>
    <article><span className="sim-eyebrow">PROJECT 3</span><h3>Independent workers</h3><p>Use a small CPU control task to compare one rollout worker with several A3C workers. Keep the environment-step budget fixed and report wall time, return variation, and parameter lag.</p></article>
   </div>
   <details className="sl-details"><summary>Why does a learned policy not require differentiable physics?</summary><p>DDPG differentiates the learned critic with respect to the actor&apos;s action. A3C differentiates policy log-probabilities. Both can learn from sampled transitions without differentiating the simulator. Differentiable physics supports a different route: backpropagating through modeled state transitions.</p></details>
   <details className="sl-details"><summary>What must match before comparing engines?</summary><p>Robot mass and inertia, geometry and contact parameters, joint order and limits, actuator model, observation processing, reward, reset distribution, physics step, control rate, and evaluation targets. Report settings that cannot be matched instead of attributing every difference to the engine.</p></details>
   <details className="sl-details"><summary>How does a hybrid result earn trust?</summary><p>Compare the baseline model or controller against the hybrid using unseen trajectories and parameter conditions. Report the training domain, rollout horizon, constraint violations, failure cases, and sensitivity to timestep. A successful fit to training transitions is only the first check.</p></details>
   <p className="sim-note">Platform and backend notes reviewed <time dateTime={platformReviewedOnISO}>{platformReviewedOn}</time>. Versioned example links identify the APIs used. The browser labs are small mathematical models implemented for this course; they do not embed Isaac Sim, Isaac Lab, or MuJoCo.</p>
   <div className="sim-next-grid"><Link href="/dl/week-13"><span className="sim-eyebrow">DEEP LEARNING / WEEK 13</span><h3>Values, policies, and DQN →</h3><p>Connect the actor–critic discussion to Bellman targets and reinforcement-learning foundations.</p></Link><Link href="/simulators"><span className="sim-eyebrow">QUICK REFERENCE</span><h3>Simulation environments →</h3><p>Return to the tool overview and choose your next experiment.</p></Link></div>
  </section>
 </>;
}
