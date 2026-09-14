import "./Section.css";
import "./ML.css";

const roadmap = [
    { week: 0, title: "Data Cleaning and Preprocessing in ML", ready: true },
    { week: 1, title: "Foundational ML Models and Sklearn", ready: false },
    { week: 2, title: "Feature Engineering for ML", ready: false },
    { week: 3, title: "Intro to Model Optimization in ML", ready: false },
    { week: 4, title: "Intro to Neural Networks with TensorFlow", ready: false },
  ];

  export default function ML() {
    return (
      <section id="ml" className="learning-section fade-section">
        <h2>ML Fundamentals</h2>
        <p>
          A week-by-week series — starting from the unglamorous but essential
          work of cleaning data, then building up through classical models,
          feature engineering, and optimization.
        </p>
  
        <div className="roadmap">
          {roadmap.map((item) => (
            <div key={item.week} className={`roadmap-item ${item.ready ? "ready" : "pending"}`}>
              <span className="roadmap-week">Week {item.week}</span>
              <span className="roadmap-title">{item.title}</span>
              <span className="roadmap-status">
                {item.ready ? "Available" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
  
        <a href="/ml" className="read-more-link">Explore the full ML series &rarr;</a>
      </section>
    );
  }
