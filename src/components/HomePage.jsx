const HomePage = ({ userRole, onRoleChange, onStart, onViewProfile }) => (
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

    <section className="role-section">
      <div>
        <h2>Applicant or company?</h2>
        <p className="muted">Choose the workspace that matches your goals.</p>
      </div>
      <div className="role-grid">
        <button
          className={userRole === 'applicant' ? 'role-card active' : 'role-card'}
          type="button"
          onClick={() => onRoleChange('applicant')}
        >
          <h3>Applicant</h3>
          <p className="muted">Browse roles, take tests, track application status.</p>
        </button>
        <button
          className={userRole === 'company' ? 'role-card active' : 'role-card'}
          type="button"
          onClick={() => onRoleChange('company')}
        >
          <h3>Company</h3>
          <p className="muted">Publish vacancies, review tests, move candidates forward.</p>
        </button>
      </div>
    </section>

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
