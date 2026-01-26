const AdminPage = ({ vacancies, cvSubmissions, onBack, t, getJobTitleLabel }) => {
  const totalVacancies = vacancies.length
  const activeVacancies = vacancies.filter((job) => job.status === 'open').length
  const waitingVacancies = vacancies.filter((job) => job.status === 'waiting').length
  const totalCvSubmissions = cvSubmissions.length

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <p className="eyebrow">{t('admin.eyebrow')}</p>
            <h1>{t('admin.title')}</h1>
            <p className="muted">{t('admin.subtitle')}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onBack}>
            {t('admin.backToVacancies')}
          </button>
        </div>
      </header>

      <section className="admin-metrics">
        <div className="metric-card">
          <h3>{totalVacancies}</h3>
          <p className="muted">{t('admin.totalVacancies')}</p>
        </div>
        <div className="metric-card">
          <h3>{activeVacancies}</h3>
          <p className="muted">{t('admin.openVacancies')}</p>
        </div>
        <div className="metric-card">
          <h3>{waitingVacancies}</h3>
          <p className="muted">{t('admin.waitingVacancies')}</p>
        </div>
        <div className="metric-card">
          <h3>{totalCvSubmissions}</h3>
          <p className="muted">{t('admin.cvSubmissions')}</p>
        </div>
      </section>

      <section className="admin-split">
        <div className="admin-panel">
          <h2>{t('admin.recentVacancies')}</h2>
          {vacancies.length === 0 ? (
            <p className="muted">{t('admin.noVacancies')}</p>
          ) : (
            <ul className="admin-list">
              {vacancies.slice(0, 5).map((job) => (
                <li key={job.id}>
                  <strong>{getJobTitleLabel(job.title)}</strong> · {job.company}
                  <span className="muted"> · {job.location}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="admin-panel">
          <h2>{t('admin.recentCvs')}</h2>
          {cvSubmissions.length === 0 ? (
            <p className="muted">{t('admin.noCvs')}</p>
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
