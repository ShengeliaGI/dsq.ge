const VacancyDetailPage = ({
  vacancy,
  onBack,
  onHideVacancy,
  onMessageCompany,
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

  const descriptionLines = vacancy.description
    ? vacancy.description
        .trim()
        .split(/\s+/)
        .reduce((lines, word, index) => {
          const lineIndex = Math.floor(index / 6)
          if (!lines[lineIndex]) {
            lines[lineIndex] = []
          }
          lines[lineIndex].push(word)
          return lines
        }, [])
        .map((line) => line.join(' '))
    : []

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <p className="eyebrow">{t('vacancyDetail.eyebrow')}</p>
            <h1>{getJobTitleLabel(vacancy.title)}</h1>
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
          <div className="vacancy-detail-list">
            <div className="vacancy-detail-row">
              <span className="vacancy-detail-label">
                {t('vacancyDetail.company')}
              </span>
              <span className="vacancy-detail-value">{vacancy.company}</span>
            </div>
            <div className="vacancy-detail-row">
              <span className="vacancy-detail-label">
                {t('vacancyDetail.location')}
              </span>
              <span className="vacancy-detail-value">{vacancy.location}</span>
            </div>
            <div className="vacancy-detail-row">
              <span className="vacancy-detail-label">{t('vacancyDetail.type')}</span>
              <span className="vacancy-detail-value">{vacancy.type}</span>
            </div>
            <div className="vacancy-detail-row">
              <span className="vacancy-detail-label">{t('vacancyDetail.salary')}</span>
              <span className="vacancy-detail-value">{vacancy.salary}</span>
            </div>
          </div>
          <div className="vacancy-detail-description">
            <h3>{t('vacancyDetail.description')}</h3>
            {descriptionLines.length > 0 ? (
              <p>
                {descriptionLines.map((line, index) => (
                  <span key={`${vacancy.id}-line-${index}`}>
                    {line}
                    {index < descriptionLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ) : (
              <p>{vacancy.description}</p>
            )}
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
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VacancyDetailPage
