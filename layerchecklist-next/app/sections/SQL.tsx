import "./Section.css";
import "./SQL.css";

export default function SQL() {
    return (
      <section id="sql" className="learning-section fade-section">
        <h2>SQL</h2>
  
        <p>
          Most real-world data starts in a database. Being able to pull exactly what
          you need with SQL is often the first step before any ML work even begins.
        </p>
  
        <div className="interview-note">
          <strong>Interview mindset:</strong>
          <p>
            For every query: What table(s) do I need? What am I filtering, grouping,
            or joining? What would break if there are duplicates or NULLs?
          </p>
        </div>
  
        <div className="topic-grid">
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>SELECT & WHERE</strong>
              <p>The basic building blocks — choosing columns and filtering rows.</p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the difference between filtering with <code>WHERE</code>
                (before grouping) and <code>HAVING</code> (after grouping).
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`SELECT name, age
  FROM users
  WHERE age > 25;`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>JOINs</strong>
              <p>Combine rows from two or more tables based on a related column.</p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know the difference between INNER, LEFT, and RIGHT joins — and what
                happens to unmatched rows in each.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`SELECT orders.id, users.name
  FROM orders
  LEFT JOIN users
    ON orders.user_id = users.id;`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>GROUP BY & Aggregations</strong>
              <p>
                Groups rows sharing a value and computes something across each group
                — counts, sums, averages.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know why every non-aggregated column in SELECT must appear in
                GROUP BY.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`SELECT department, AVG(salary)
  FROM employees
  GROUP BY department;`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Subqueries</strong>
              <p>
                A query nested inside another — useful for filtering based on a
                computed value.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Know when a subquery could be rewritten as a JOIN, and why that
                might be more efficient.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`SELECT name FROM users
  WHERE id IN (
    SELECT user_id FROM orders
    WHERE total > 100
  );`}</code></pre>
            </div>
          </div>
  
          <div className="topic-row">
            <div className="topic-explain">
              <strong>Indexes</strong>
              <p>
                A data structure that speeds up lookups on a column, at the cost of
                extra storage and slower writes.
              </p>
              <p className="interview-tip">
                <strong>Interview check:</strong>
                Explain why indexes speed up reads but can slow down inserts/updates.
              </p>
            </div>
            <div className="topic-code">
              <pre><code>{`CREATE INDEX idx_user_id
  ON orders (user_id);`}</code></pre>
            </div>
          </div>
  
        </div>
  
        <h3>SQL Interview Questions You Should Be Able to Answer</h3>
  
        <div className="interview-questions">
          <ul>
            <li>What is the difference between WHERE and HAVING?</li>
            <li>What is the difference between INNER JOIN and LEFT JOIN?</li>
            <li>What does GROUP BY actually do?</li>
            <li>When would you use a subquery instead of a JOIN?</li>
            <li>What is an index, and what&apos;s the tradeoff of using one?</li>
            <li>What is the difference between COUNT(*) and COUNT(column)?</li>
          </ul>
        </div>
  
        <h3>The Standard You Want</h3>
  
        <p>
          You should be able to write a query from a plain-English question without
          hesitating, and explain what happens to your result if the data has
          duplicates or missing values.
        </p>
  
        <p>
          <strong>
            A working query isn&apos;t enough — know why it returns exactly what it does.
          </strong>
        </p>
      </section>
    );
  }
