import { useMemo, useState } from 'react'
import { hasUserCv, matchesVacancyByCv } from '../utils/cvVacancyFilter'

const VacanciesPage = ({
  vacancies,
  onOpenVacancy,
  onDeleteVacancy,
  onGoCompany,
  onLogout,
  currentUserEmail,
  cvSubmissions,
  userRole,
  isAuthed,
  isAdmin,
  t,
  getStatusLabel,
  getJobTitleLabel,
  deletingVacancyIds = [],
  hiddenVacancyIds = [],
}) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [onlyMyCvMatches, setOnlyMyCvMatches] = useState(false)

  const visibleVacancies = vacancies.filter(
    (job) => !hiddenVacancyIds.includes(job.id),
  )

  const userHasCv = useMemo(
    () => hasUserCv(cvSubmissions, currentUserEmail),
    [cvSubmissions, currentUserEmail],
  )

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(visibleVacancies.map((job) => job.title)),
    )
    return ['all', ...unique]
  }, [visibleVacancies])

  const filteredVacancies =
    activeCategory === 'all'
      ? visibleVacancies
      : visibleVacancies.filter((job) => job.title === activeCategory)

  const cvMatchedVacancies = useMemo(() => {
    if (!onlyMyCvMatches || userRole !== 'applicant') {
      return filteredVacancies
    }
    return filteredVacancies.filter((job) =>
      matchesVacancyByCv({
        vacancy: job,
        cvSubmissions,
        currentUserEmail,
      }),
    )
  }, [
    onlyMyCvMatches,
    userRole,
    filteredVacancies,
    cvSubmissions,
    currentUserEmail,
  ])

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
      {visibleVacancies.length === 0 ? (
        <div className="empty-state">
          <h3>{t('vacancies.emptyTitle')}</h3>
          <p className="muted">{t('vacancies.emptySubtitle')}</p>
        </div>
      ) : (
        <>
          <div className="vacancy-filters">
            <p className="muted">{t('vacancies.filterLabel')}</p>
            <div className="filter-row vacancy-filter-toolbar">
              <label className="vacancy-filter-select">
                <span>{t('vacancies.categoryButton')}</span>
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all'
                        ? t('vacancies.filterAll')
                        : getJobTitleLabel(category)}
                    </option>
                  ))}
                </select>
              </label>
              {isAuthed && userRole === 'applicant' && (
                <button
                  type="button"
                  className={
                    onlyMyCvMatches ? 'filter-chip filter-chip-active' : 'filter-chip'
                  }
                  onClick={() => setOnlyMyCvMatches((prev) => !prev)}
                  disabled={!userHasCv}
                >
                  {t('vacancies.byMyCv')}
                </button>
              )}
            </div>
            {isAuthed && userRole === 'applicant' && !userHasCv && (
              <p className="muted">{t('vacancies.byMyCvHint')}</p>
            )}
          </div>
          {cvMatchedVacancies.length === 0 ? (
            <div className="empty-state">
              <h3>{t('vacancies.emptyTitle')}</h3>
              <p className="muted">
                {onlyMyCvMatches
                  ? t('vacancies.byMyCvEmpty')
                  : t('vacancies.emptySubtitle')}
              </p>
            </div>
          ) : (
            <div className="grid vacancy-grid">
              {cvMatchedVacancies.map((job) => {
                const applicantResult = (job.testResults ?? []).find(
                  (result) =>
                    result.candidateEmail?.toLowerCase() ===
                    currentUserEmail?.toLowerCase(),
                )

                const isDeleting = deletingVacancyIds.includes(job.id)
                const hasTest =
                  job.testMode !== 'none' && (job.questionSets ?? []).length > 0
                const canDelete =
                  isAdmin ||
                  (isAuthed &&
                    job.createdBy?.email?.toLowerCase() ===
                      currentUserEmail?.toLowerCase())
                return (
                  <div key={job.id} className="job-card vacancy-card">
                    <button
                      className="job-main"
                      type="button"
                      onClick={() => onOpenVacancy(job.id)}
                    >
                      <div>
                        <h3>{getJobTitleLabel(job.title)}</h3>
                        <p className="muted">{job.company}</p>
                      </div>
                      <div className="meta">
                        <span>{job.location}</span>
                        <span>{job.type}</span>
                        <span>{job.salary}</span>
                      </div>
                      <span className="cta">{t('vacancies.moreDetails')}</span>
                      {!hasTest && (
                        <span className="muted">{t('vacancies.noTest')}</span>
                      )}
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
                    {canDelete && (
                      <button
                        className="danger"
                        type="button"
                        onClick={() => onDeleteVacancy(job.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting
                          ? t('vacancies.deleting')
                          : t('vacancies.delete')}
                      </button>
                    )}
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
