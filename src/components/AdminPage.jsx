const AdminPage = ({ vacancies, cvSubmissions, onBack }) => {
  const totalVacancies = vacancies.length
  const activeVacancies = vacancies.filter((job) => job.status === 'open').length
  const waitingVacancies = vacancies.filter((job) => job.status === 'waiting').length
  const totalCvSubmissions = cvSubmissions.length

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1>Activity overview</h1>
            <p className="muted">Monitor recent activity across the platform.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onBack}>
            Back to vacancies
          </button>
        </div>
      </header>

      <section className="admin-metrics">
        <div className="metric-card">
          <h3>{totalVacancies}</h3>
          <p className="muted">Total vacancies</p>
        </div>
        <div className="metric-card">
          <h3>{activeVacancies}</h3>
          <p className="muted">Open vacancies</p>
        </div>
        <div className="metric-card">
          <h3>{waitingVacancies}</h3>
          <p className="muted">Waiting for response</p>
        </div>
        <div className="metric-card">
          <h3>{totalCvSubmissions}</h3>
          <p className="muted">CV submissions</p>
        </div>
      </section>

      <section className="admin-split">
        <div className="admin-panel">
          <h2>Recent vacancies</h2>
          {vacancies.length === 0 ? (
            <p className="muted">No vacancies created yet.</p>
          ) : (
            <ul className="admin-list">
              {vacancies.slice(0, 5).map((job) => (
                <li key={job.id}>
                  <strong>{job.title}</strong> · {job.company}
                  <span className="muted"> · {job.location}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-panel">
          <h2>Recent CV submissions</h2>
          {cvSubmissions.length === 0 ? (
            <p className="muted">No CV submissions yet.</p>
          ) : (
            <ul className="admin-list">
              {cvSubmissions.slice(0, 5).map((cv) => (
                <li key={cv.id}>
                  <strong>{cv.fileName}</strong>
                  <span className="muted"> · {cv.summary}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

export default AdminPage
