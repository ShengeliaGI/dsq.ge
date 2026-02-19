import { useMemo } from 'react'
import { buildMatchInsight } from '../utils/matchInsights'

const VacancyDetailPage = ({
  vacancy,
  onBack,
  onHideVacancy,
  onMessageCompany,
  currentUserEmail,
  userRole,
  cvSubmissions,
  applications,
  getJobTitleLabel,
  getStatusLabel,
  t,
}) => {
  const matchInsight = useMemo(
    () =>
      buildMatchInsight({
        vacancy,
        currentUserEmail,
        cvSubmissions,
        applications,
        getStatusLabel,
      }),
    [
      vacancy,
      currentUserEmail,
      cvSubmissions,
      applications,
      getStatusLabel,
    ],
  )

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

  const descriptionTitle =
    vacancy.descriptionTitle?.trim() || t('vacancy.defaults.descriptionTitle')

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
            <h3>{descriptionTitle}</h3>
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
        {userRole === 'applicant' && currentUserEmail && matchInsight && (
          <section className="vacancy-detail-card match-insight-card">
            <div className="match-insight-header">
              <div>
                <p className="eyebrow">Match Insight</p>
                <h3>{matchInsight.fitLevel}</h3>
                <p className="muted">
                  Personalized score for this vacancy based on your CV and test history.
                </p>
              </div>
              <div className="match-score-badge" aria-label={`Match score ${matchInsight.score}`}>
                <strong>{matchInsight.score}</strong>
                <span>/100</span>
              </div>
            </div>

            {matchInsight.applicationStatus && (
              <p className="muted">
                Current application status: <strong>{matchInsight.applicationStatus}</strong>
              </p>
            )}

            <div className="match-breakdown">
              {matchInsight.breakdown.map((row) => (
                <div key={row.label} className="match-breakdown-row">
                  <span>{row.label}</span>
                  <span>{row.value}% ({row.points} pts)</span>
                </div>
              ))}
            </div>

            {matchInsight.highlights.length > 0 && (
              <div>
                <p className="vacancy-detail-label">Keyword overlap</p>
                <div className="match-keyword-list">
                  {matchInsight.highlights.map((keyword) => (
                    <span key={keyword} className="cv-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="vacancy-detail-label">How to improve quickly</p>
              <ul className="match-tip-list">
                {matchInsight.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default VacancyDetailPage
