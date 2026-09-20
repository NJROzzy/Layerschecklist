import Link from "next/link";
import "./Section.css";
import "./SimulationsLive.css";

/** The layer under the simulator reference: the physics, running. */
export default function SimulationsLive() {
  return <section id="simulations-live" className="learning-section fade-section" aria-labelledby="sims-live-title">
    <p className="sl-eyebrow">LAYER TWO · NOTHING HERE IS A RECORDING</p>
    <h2 id="sims-live-title">Run the Physics Yourself</h2>
    <p>
      Knowing which simulator to name is the easy half. The half that decides whether
      your policy survives contact with hardware is what happens inside the step
      function — how time is advanced, where stability breaks, how an arm finds its
      own joint angles, and which of your assumptions the real world declines to
      honour. Every demonstration on the next page is integrating live in your browser.
    </p>

    <ol className="sl-path">
      <li><Link href="/simulations#integrators"><span>01</span><strong>Race three integrators</strong><small>Same orbit, same start — one of them spirals away</small></Link></li>
      <li><Link href="/simulations#timestep"><span>02</span><strong>Find the speed limit</strong><small>Push the timestep until the simulation detonates</small></Link></li>
      <li><Link href="/simulations#emergence"><span>03</span><strong>Watch a flock appear</strong><small>150 agents, three rules, no leader anywhere</small></Link></li>
      <li><Link href="/simulations#environments"><span>04</span><strong>Balance a real CartPole</strong><small>Standard dynamics, and you are the optimiser</small></Link></li>
      <li><Link href="/simulations#kinematics"><span>05</span><strong>Drag a robot arm</strong><small>Inverse kinematics solving live, and the singularities it hits</small></Link></li>
      <li><Link href="/simulations#control"><span>06</span><strong>Tune a PID loop</strong><small>Watch a joint overshoot, ring, and settle short of target</small></Link></li>
      <li><Link href="/simulations#sensing"><span>07</span><strong>Lose a robot</strong><small>90 lidar rays, and odometry quietly drifting away from the truth</small></Link></li>
      <li><Link href="/simulations#sim2real"><span>08</span><strong>Break it with reality</strong><small>240 episodes per drag as the physics drifts</small></Link></li>
    </ol>

    <Link href="/simulations" className="sl-start">Open the simulation lab <span aria-hidden="true">→</span></Link>
    <p className="sl-note">12 chapters · 8 live simulations · Kinematics, control, sensing, contact models, the reality gap, and 10 simulators compared</p>
  </section>;
}
