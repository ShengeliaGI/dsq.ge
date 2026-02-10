const VacancyDetailPage = ({
  vacancy,
  onBack,
  onHideVacancy,
  onMessageCompany,
  onStartTest,
  getJobTitleLabel,
  t,
}) => {
  if (!vacancy) {
    return (
      <div className="page">
        <header className="page-header">
          <div className="header-left">
            <div>
              <p className="eyebrow">{t('vacancyDetail.eyebrow')}</p>
              <h1>{t('vacancyDetail.title')}</h1>
              <p className="muted">{t('vacancyDetail.missing')}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="ghost" type="button" onClick={onBack}>
              {t('vacancyDetail.back')}
            </button>
          </div>
        </header>
      </div>
    )
  }

  const hasTest =
    vacancy.testMode !== 'none' && (vacancy.questionSets ?? []).length > 0

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <p className="eyebrow">{t('vacancyDetail.eyebrow')}</p>
            <h1>{getJobTitleLabel(vacancy.title)}</h1>
            <p className="muted">{vacancy.company}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="ghost" type="button" onClick={onBack}>
            {t('vacancyDetail.back')}
          </button>
        </div>
      </header>

      <div className="vacancy-detail">
        <section className="vacancy-detail-card">
          <div className="vacancy-detail-meta">
            <span>{vacancy.location}</span>
            <span>{vacancy.type}</span>
            <span>{vacancy.salary}</span>
          </div>
          <div className="vacancy-detail-description">
            <h3>{t('vacancyDetail.description')}</h3>
            <p>{vacancy.description}</p>
          </div>
          <div className="vacancy-detail-footer">
            {!hasTest && <p className="muted">{t('vacancies.noTest')}</p>}
            <div className="test-actions">
              <button className="ghost" type="button" onClick={onHideVacancy}>
                {t('vacancyDetail.hide')}
              </button>
              <button className="ghost" type="button" onClick={onMessageCompany}>
                {t('vacancyDetail.message')}
              </button>
              <button
                className="primary"
                type="button"
                onClick={onStartTest}
                disabled={!hasTest}
              >
                {t('vacancyDetail.startTest')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VacancyDetailPage
