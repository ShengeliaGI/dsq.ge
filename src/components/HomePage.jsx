const HomePage = ({ onStart, onViewProfile }) => (
  <div className="page">
    <header className="page-header hero">
      <div>
        <p className="eyebrow">dsq.ge</p>
        <h1>Hire fast. Apply smarter.</h1>
        <p className="muted">
          A talent marketplace with guided tests, clear hiring stages, and built-in
          messaging between companies and applicants.
        </p>
        <div className="hero-actions">
          <button className="primary" type="button" onClick={onStart}>
            Explore vacancies
          </button>
          <button className="ghost" type="button" onClick={onViewProfile}>
            View profile
          </button>
        </div>
      </div>
      <div className="hero-card">
        <h3>How it works</h3>
        <ol>
          <li>Pick your role: applicant or company.</li>
          <li>Applicants take a 15-question multiple-choice test.</li>
          <li>Companies review results and move candidates to next stages.</li>
          <li>Messages and notifications keep everyone aligned.</li>
        </ol>
      </div>
    </header>

    <section className="feature-grid">
      <article className="feature-card">
        <h4>Quick links</h4>
        <p className="muted">Jump to profile, open vacancies, tests, and messages.</p>
      </article>
      <article className="feature-card">
        <h4>Application tracker</h4>
        <p className="muted">See submitted, pending, interview, and accepted stages.</p>
      </article>
      <article className="feature-card">
        <h4>Messaging portal</h4>
        <p className="muted">Chat with companies as soon as you are accepted.</p>
      </article>
    </section>
  </div>
)

export default HomePage
