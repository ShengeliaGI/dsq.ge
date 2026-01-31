const TestsPage = ({
  vacancies,
  applications,
  onOpenJobTest,
  currentUserEmail,
  onBack,
  t,
  getJobTitleLabel,
}) => {
  const appliedJobIds = new Set(applications.map((entry) => entry.jobId))

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('tests.eyebrow')}</p>
          <h1>{t('tests.title')}</h1>
          <p className="muted">{t('tests.subtitle')}</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          {t('tests.backToVacancies')}
        </button>
      </header>

      {vacancies.length === 0 ? (
        <div className="empty-state">
          <h3>{t('tests.emptyTitle')}</h3>
          <p className="muted">{t('tests.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="grid">
          {vacancies.map((job) => {
            const alreadyApplied = appliedJobIds.has(job.id)
            const hasTest =
              job.testMode !== 'none' && (job.questionSets ?? []).length > 0
            return (
              <div key={job.id} className="job-card">
                <div>
                  <h3>{getJobTitleLabel(job.title)}</h3>
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
                  disabled={!currentUserEmail || alreadyApplied || !hasTest}
                  onClick={() => onOpenJobTest(job.id)}
                >
                  {alreadyApplied
                    ? t('tests.submitted')
                    : hasTest
                      ? t('tests.start')
                      : t('tests.noTest')}
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
