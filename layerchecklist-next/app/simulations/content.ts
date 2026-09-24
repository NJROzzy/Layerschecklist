export const reviewedOnISO = "2026-09-20";
export const reviewedOn = "September 20, 2026";
export const platformReviewedOnISO = "2026-09-23";
export const platformReviewedOn = "September 23, 2026";

export const chapters = [
  ["why", "Why simulate"], ["integrators", "Stepping time"], ["timestep", "Stability"],
  ["contact", "Contact"], ["emergence", "Emergence"], ["environments", "Environments"],
  ["kinematics", "Robot kinematics"], ["control", "Control"], ["sensing", "Sensing & pose"],
  ["sim2real", "The reality gap"], ["tools", "The tool landscape"],
  ["learning-stack", "Isaac & MuJoCo"], ["simulator-examples", "Simulator examples"],
  ["physics-neural-hybrid", "Physics + neural models"], ["ddpg", "DDPG"],
  ["a3c", "A3C"], ["learning-comparison", "Choose & compare"], ["build", "Build one"],
] as const;

export const reasons = [
  { title: "Speed", text: "A simulator can run faster than real time, and thousands of copies at once. A policy can see more episodes before lunch than a physical robot will see in its lifetime.", cost: "Only if the thing you sped up is the thing that mattered." },
  { title: "Safety", text: "A failed grasp costs nothing. A failed grasp on real hardware costs a gripper, and a failed manoeuvre on a real vehicle costs considerably more.", cost: "Safe failure teaches you less urgency than unsafe failure does." },
  { title: "Resets", text: "The single most underrated property. A simulator can be returned to an exact starting state, instantly, forever. Reinforcement learning is largely unworkable without it.", cost: "Real environments have no reset button, which is why deployment is a different problem." },
  { title: "Ground truth", text: "You know every position, velocity, contact force and object identity exactly, with no sensor noise, because you computed them.", cost: "A perception model trained on perfect labels has never met an occluded, motion-blurred frame." },
  { title: "Rare events", text: "You can make the improbable routine: the pedestrian who steps out, the joint that seizes, the sensor that drops a frame.", cost: "You can only generate the failures you already thought of." },
];

export const contactModels = [
  { name: "Penalty (spring) contact", how: "Let bodies overlap slightly and push them apart in proportion to the overlap.", good: "Simple, smooth, and differentiable — which matters if gradients flow through the simulator.", bad: "Stiff. A believable surface needs a very high spring constant, and that forces a tiny timestep on the whole scene." },
  { name: "Impulse-based contact", how: "Detect the interpenetration, then apply an instantaneous velocity change to resolve it.", good: "Handles hard surfaces without demanding tiny steps.", bad: "Discontinuous, so gradients are unhelpful, and stacked objects can jitter as impulses fight one another." },
  { name: "Constraint solvers (LCP)", how: "Treat all contacts as a single system of inequalities and solve them together each step.", good: "Stable stacks and coherent multi-contact behaviour. This is what most robotics engines do.", bad: "Solved iteratively with a step budget, so a hard scene returns an approximation and tells you it is done." },
  { name: "Soft-body and deformables", how: "Discretise the object itself and simulate its internal forces.", good: "Cloth, rope, tissue, deformable grasps.", bad: "Expensive, and the parameters are genuinely hard to identify from a real material." },
];

export type ToolCategory = "Physics engines" | "Robotics platforms" | "Robot-learning frameworks" | "RL environments" | "Domain simulators";
export const toolCategories: ToolCategory[] = ["Physics engines", "Robotics platforms", "Robot-learning frameworks", "RL environments", "Domain simulators"];
export const tools: { name: string; category: ToolCategory; what: string; check: string; href: string }[] = [
  { name: "MuJoCo", category: "Physics engines", what: "An open-source engine for articulated dynamics and contact, with CPU and accelerated ecosystem options.", check: "Inspect the MJCF model or programmatic model specification, actuator settings, and backend before comparing results.", href: "https://mujoco.org/" },
  { name: "Bullet / PyBullet", category: "Physics engines", what: "A widely used open-source engine with a direct Python interface and a large body of example environments.", check: "Compare its contact settings with whatever you are reproducing; defaults differ between engines.", href: "https://pybullet.org/" },
  { name: "Brax", category: "Physics engines", what: "A differentiable engine written in JAX, built to run many environments in parallel on accelerators.", check: "Throughput comes from batching. A single environment is not where it wins.", href: "https://github.com/google/brax" },
  { name: "NVIDIA Isaac Sim", category: "Robotics platforms", what: "A GPU-accelerated robotics simulator with photorealistic rendering and synthetic-data tooling.", check: "Check the hardware requirement and whether you need the rendering fidelity you are paying for.", href: "https://developer.nvidia.com/isaac/sim" },
  { name: "NVIDIA Isaac Lab", category: "Robot-learning frameworks", what: "Task definitions, observations, rewards, resets, and batched robot-learning workflows, with integrations for RL libraries.", check: "Distinguish the framework from the physics backend and training algorithm. See the version-specific examples below.", href: "https://isaac-sim.github.io/IsaacLab/main/" },
  { name: "Gazebo", category: "Robotics platforms", what: "The long-standing simulator of the ROS ecosystem, with sensor models and plugin support.", check: "Its value is the ROS integration. Evaluate it against your actual middleware, not in isolation.", href: "https://gazebosim.org/" },
  { name: "Webots", category: "Robotics platforms", what: "An open-source robot simulator with a large library of modelled robots and sensors.", check: "Good for getting a known robot moving quickly; check fidelity for contact-heavy tasks.", href: "https://cyberbotics.com/" },
  { name: "Gymnasium", category: "RL environments", what: "The maintained standard interface for RL environments — reset, step, observation, reward, termination.", check: "It is an API, not a physics engine. What is underneath still decides your results.", href: "https://gymnasium.farama.org/" },
  { name: "Unity ML-Agents", category: "RL environments", what: "Turns a Unity scene into a trainable environment, with a Python side for the learning.", check: "Strong for custom visual scenes; the physics is a game engine's, with the trade-offs that implies.", href: "https://unity-technologies.github.io/ml-agents/" },
  { name: "CARLA", category: "Domain simulators", what: "An open-source driving simulator with maps, traffic, weather and sensor suites.", check: "Sensor realism and traffic behaviour are the parts that decide whether results transfer.", href: "https://carla.org/" },
  { name: "Habitat", category: "Domain simulators", what: "A fast simulator for embodied agents navigating scanned indoor scenes.", check: "Built for throughput on navigation; check what it does and does not model about interaction.", href: "https://aihabitat.org/" },
];

export const gapCauses = [
  { cause: "Unmodelled friction and compliance", detail: "Real joints have stiction, backlash and flex. Most engines give you a friction coefficient and stop there." },
  { cause: "Actuator dynamics", detail: "A commanded torque is not an achieved torque. Motors saturate, lag and heat up; simulators usually apply the number you asked for." },
  { cause: "Sensor and latency realism", detail: "Real observations arrive late, noisy, quantised and occasionally not at all. A policy trained on instant perfect state has never had to cope." },
  { cause: "Contact parameters nobody measured", detail: "Restitution and friction are usually set to whatever looked right. They are rarely identified from the actual materials." },
  { cause: "Distribution of situations", detail: "The simulator contains the scenarios you wrote. The world contains the ones you did not." },
];

export const closing = [
  { name: "Domain randomisation", what: "Sample physics, textures and latencies afresh each episode so the policy cannot depend on any single value.", note: "Cheap and effective. Too wide a distribution can make the task unlearnable." },
  { name: "System identification", what: "Measure the real system and fit the simulator's parameters to match it.", note: "Narrows the gap rather than papering over it, but needs hardware access and careful experiments." },
  { name: "Actuator modelling", what: "Learn a small model of what the motors actually do, and put it between the policy and the simulated joint.", note: "Often the single highest-value addition for legged and manipulation work." },
  { name: "Real-world fine-tuning", what: "Train in simulation, then adapt with a small amount of real experience.", note: "Powerful, and reintroduces every safety and reset problem simulation was avoiding." },
  { name: "Observation grounding", what: "Feed the policy quantities you can measure reliably on the real robot, not privileged simulator state.", note: "A policy that reads a true object pose in simulation has no equivalent input on hardware." },
];

export const buildSteps = [
  { step: "Write the reset before anything else", detail: "An environment you cannot return to a known state is not an environment, it is an animation. Decide what a starting state is and make it exact.", signal: "Two resets with the same seed produce byte-identical observations." },
  { step: "Choose the integrator and the step deliberately", detail: "Semi-implicit Euler at a fixed step is the right default. Write the step size down somewhere visible; it will explain a bug later.", signal: "You can say what your stability limit is and why." },
  { step: "Define the observation and be honest about it", detail: "List every quantity the agent sees. Mark the ones you could not measure on real hardware. Those are your future problems.", signal: "No observation is privileged simulator state you cannot obtain outside the simulator." },
  { step: "Write the reward last and distrust it", detail: "Reward shaping is where projects quietly go wrong: the agent will optimise exactly what you wrote, including the parts you did not mean.", signal: "You have watched a high-reward episode and agreed it deserved the score." },
  { step: "Randomise before you tune", detail: "Add variation to masses, friction, latency and starting states early. Tuning against one fixed world produces a policy that only works there.", signal: "Performance is reported across a distribution, with a spread, not as one number." },
  { step: "Keep a fixed evaluation set", detail: "Hold out specific seeds and scenarios that you never train on and never adjust.", signal: "You can compare this week's run with last month's and mean it." },
];


/** Where a robotics stack actually spends its time, and which part this page touches. */
export const stack = [
  { layer: "Perception", what: "Turn raw sensor returns into something about the world: obstacles, surfaces, objects, people.", here: "The lidar panel casts real rays against real walls." },
  { layer: "State estimation", what: "Work out where the robot is and how it is moving, from sources that each lie in different ways.", here: "The drifting odometry, and why one sensor is never enough." },
  { layer: "Planning", what: "Choose a path or a sequence of actions that reaches the goal without hitting anything.", here: "Touched only — the waypoint follower is the simplest possible version." },
  { layer: "Kinematics & dynamics", what: "Relate joint angles to where the hand is, and torques to how things move.", here: "The arm panel: forward, inverse, and the Jacobian." },
  { layer: "Control", what: "Make the actual joint reach the commanded position despite load, friction and delay.", here: "The PID panel, holding a joint against gravity." },
];
