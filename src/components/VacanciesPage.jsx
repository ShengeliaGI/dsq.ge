import { useMemo, useState } from 'react'

const VacanciesPage = ({
  vacancies,
  onOpenJobTest,
  onDeleteVacancy,
  onGoCompany,
  onLogout,
  currentUserEmail,
  isAuthed,
  t,
  getStatusLabel,
  getJobTitleLabel,
  deletingVacancyIds = [],
}) => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = useMemo(() => {
    const unique = Array.from(new Set(vacancies.map((job) => job.title)))
    return ['all', ...unique]
  }, [vacancies])

  const filteredVacancies =
    activeCategory === 'all'
      ? vacancies
      : vacancies.filter((job) => job.title === activeCategory)

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <p className="eyebrow">{t('vacancies.eyebrow')}</p>
            <h1>{t('vacancies.title')}</h1>
            <p className="muted">{t('vacancies.subtitle')}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onGoCompany}>
            {t('vacancies.myPage')}
          </button>
          {isAuthed && (
            <button className="ghost" type="button" onClick={onLogout}>
              {t('vacancies.logout')}
            </button>
          )}
        </div>
      </header>
      {vacancies.length === 0 ? (
        <div className="empty-state">
          <h3>{t('vacancies.emptyTitle')}</h3>
          <p className="muted">{t('vacancies.emptySubtitle')}</p>
        </div>
      ) : (
        <>
          <div className="vacancy-filters">
            <p className="muted">{t('vacancies.filterLabel')}</p>
            <div className="filter-row">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    category === activeCategory
                      ? 'filter-chip filter-chip-active'
                      : 'filter-chip'
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all'
                    ? t('vacancies.filterAll')
                    : getJobTitleLabel(category)}
                </button>
              ))}
            </div>
          </div>
          {filteredVacancies.length === 0 ? (
            <div className="empty-state">
              <h3>{t('vacancies.emptyTitle')}</h3>
              <p className="muted">{t('vacancies.emptySubtitle')}</p>
            </div>
          ) : (
            <div className="grid">
              {filteredVacancies.map((job) => {
                const applicantResult = (job.testResults ?? []).find(
                  (result) =>
                    result.candidateEmail?.toLowerCase() ===
                    currentUserEmail?.toLowerCase(),
                )

                const isDeleting = deletingVacancyIds.includes(job.id)
                const hasTest =
                  job.testMode !== 'none' && (job.questionSets ?? []).length > 0
                return (
                  <div
                    key={job.id}
                    className={hasTest ? 'job-card' : 'job-card job-card-disabled'}
                  >
                    <button
                      className="job-main"
                      type="button"
                      onClick={() => onOpenJobTest(job.id)}
                      disabled={!hasTest}
                    >
                      <div>
                        <h3>{getJobTitleLabel(job.title)}</h3>
                        <p className="muted">{job.company}</p>
                      </div>
                      <p className="job-description">{job.description}</p>
                      <div className="meta">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        <span>{job.salary}</span>
                      </div>
                      <span className="cta">
                        {hasTest ? t('vacancies.startTest') : t('vacancies.noTest')}
                      </span>
                    </button>
                    {applicantResult?.status && (
                      <div className={`status-chip ${applicantResult.status}`}>
                        {getStatusLabel(applicantResult.status)}
                      </div>
                    )}
                    {job.status === 'waiting' && (
                      <div
                        className="status-chip waiting"
                        aria-label="Waiting for answer"
                      >
                        {t('vacancies.waiting')}
                      </div>
                    )}
                    {job.tryAgain && job.status !== 'waiting' && (
                      <div className="status-chip warning" aria-label="Try again">
                        {t('vacancies.tryAgain')}
                      </div>
                    )}
                    <button
                      className="danger"
                      type="button"
                      onClick={() => onDeleteVacancy(job.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? t('vacancies.deleting') : t('vacancies.delete')}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default VacanciesPage
