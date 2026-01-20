const TestsPage = ({ vacancies, applications, onOpenJobTest, currentUserEmail, onBack }) => {
  const appliedJobIds = new Set(applications.map((entry) => entry.jobId))

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Tests</p>
          <h1>Role assessments</h1>
          <p className="muted">Pick a vacancy and complete the multiple-choice test.</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          Back to vacancies
        </button>
      </header>

      {vacancies.length === 0 ? (
        <div className="empty-state">
          <h3>No tests yet</h3>
          <p className="muted">Companies will publish tests for each vacancy.</p>
        </div>
      ) : (
        <div className="grid">
          {vacancies.map((job) => {
            const alreadyApplied = appliedJobIds.has(job.id)
            return (
              <div key={job.id} className="job-card">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">{job.company}</p>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="meta">
                  <span>{job.location}</span>
                  <span>{job.type}</span>
                </div>
                <button
                  className="primary"
                  type="button"
                  disabled={!currentUserEmail || alreadyApplied}
                  onClick={() => onOpenJobTest(job.id)}
                >
                  {alreadyApplied ? 'Test submitted' : 'Start test'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TestsPage
