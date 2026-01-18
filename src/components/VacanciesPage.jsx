const VacanciesPage = ({ vacancies, onOpenJobTest, onDeleteVacancy, onGoCompany, onLogout }) => (
  <div className="page">
    <header className="page-header">
      <div className="header-left">
        <div>
          <p className="eyebrow">Vacancies</p>
          <h1>Explore open roles</h1>
          <p className="muted">Tap a role to start the company test.</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="ghost" type="button" onClick={onGoCompany}>
          My Page
        </button>
        <button className="ghost" type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
    {vacancies.length === 0 ? (
      <div className="empty-state">
        <h3>No vacancies yet</h3>
        <p className="muted">Use My Page to publish your first vacancy.</p>
      </div>
    ) : (
      <div className="grid">
        {vacancies.map((job) => (
          <div key={job.id} className="job-card">
            <button
              className="job-main"
              type="button"
              onClick={() => onOpenJobTest(job.id)}
            >
              <div>
                <h3>{job.title}</h3>
                <p className="muted">{job.company}</p>
              </div>
              <p className="job-description">{job.description}</p>
              <div className="meta">
                <span>{job.location}</span>
                <span>{job.type}</span>
                <span>{job.salary}</span>
              </div>
              <span className="cta">Start test →</span>
            </button>
            {job.status === 'waiting' && (
              <div className="status-chip waiting" aria-label="Waiting for answer">
                Waiting for answer
              </div>
            )}
            {job.tryAgain && job.status !== 'waiting' && (
              <div className="status-chip warning" aria-label="Try again">
                Try again
              </div>
            )}
            <button
              className="danger"
              type="button"
              onClick={() => onDeleteVacancy(job.id)}
            >
              Delete vacancy
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)

export default VacanciesPage
