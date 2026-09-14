import "./Section.css";
import "./ROS.css";

export default function ROS() {
    return (
      <section id="ros" className="learning-section fade-section">
        <h2>ROS (Robot Operating System)</h2>
  
        <p>
          ROS is the standard middleware for robotics — it doesn&apos;t run robots
          directly, but provides the communication framework that lets different
          parts of a robotic system talk to each other.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every ROS setup: What nodes exist? What topics are they publishing
            or subscribing to? What message type is flowing between them?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Nodes</strong>
              <p>
                A node is a single process performing one job — reading a sensor,
                running a controller, processing an image.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why splitting a robot&apos;s software into many small nodes is
                preferred over one giant program.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`rosrun my_package my_node.py`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Topics & Pub/Sub</strong>
              <p>
                Nodes communicate by publishing messages to topics, and other nodes
                subscribe to receive them — a decoupled, many-to-many communication
                pattern.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know that a publisher doesn&apos;t need to know who (or how many) is
                subscribing.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`pub = rospy.Publisher('velocity', Twist, queue_size=10)
  pub.publish(msg)
  
  rospy.Subscriber('velocity', Twist, callback)`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Messages</strong>
              <p>
                Strictly typed data structures passed between nodes — like a schema
                for what a topic is allowed to carry.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know that a publisher and subscriber must agree on the exact message
                type to communicate.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`from geometry_msgs.msg import Twist
  
  msg = Twist()
  msg.linear.x = 1.0`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Launch Files</strong>
              <p>
                A single file that starts multiple nodes together with their
                configuration, instead of running each manually.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why launch files matter once a system has more than a couple
                of nodes.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`<launch>
    <node pkg="my_package" type="my_node.py" name="my_node" />
  </launch>`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>ROS Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>What is a ROS node?</li>
            <li>How does the publish/subscribe model work?</li>
            <li>What is a message, and why does it need a fixed type?</li>
            <li>What&apos;s the benefit of splitting robot software into multiple nodes?</li>
            <li>What is a launch file used for?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>
          You should be able to sketch out a basic node graph for a simple robot
          task — what nodes exist, what topics connect them, and what data flows
          where.
        </p>
  
        <p>
          <strong>
            ROS is about communication design as much as it is about robotics.
          </strong>
        </p>
      </section>
    );
  }
