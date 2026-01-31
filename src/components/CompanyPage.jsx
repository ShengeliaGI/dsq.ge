import { useState } from 'react'
import { COMPANY_JOB_TYPES, parseManualQuestions } from '../utils/testUtils'

const CompanyPage = ({
  vacancies,
  onDeleteResult,
  selectedJobType,
  setSelectedJobType,
  companyName,
  setCompanyName,
  jobType,
  setJobType,
  salary,
  setSalary,
  location,
  setLocation,
  description,
  setDescription,
  minScore,
  setMinScore,
  testMode,
  setTestMode,
  manualTest,
  setManualTest,
  onPublish,
  onBack,
  onUpdateResultStatus,
  onOpenMessages,
  t,
  getStatusLabel,
  getJobTitleLabel,
  isPublishing,
}) => {
  const manualCount = parseManualQuestions(manualTest).length
  const isOtherVacancy = selectedJobType === 'Other'

  const hasResults = vacancies.some((job) => (job.testResults ?? []).length > 0)
  const [expandedResultId, setExpandedResultId] = useState(null)

  const toggleResult = (resultId) => {
    setExpandedResultId((prev) => (prev === resultId ? null : resultId))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('company.eyebrow')}</p>
          <h1>{t('company.title')}</h1>
          <p className="muted">{t('company.subtitle')}</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          {t('company.backToVacancies')}
        </button>
      </header>
      <div className="company-panel">
        <div className="panel-section">
          <h3>{t('company.chooseType')}</h3>
          <div className="chip-grid">
            {COMPANY_JOB_TYPES.map((jobTypeOption) => (
              <button
                key={jobTypeOption}
                type="button"
                className={
                  jobTypeOption === selectedJobType ? 'chip chip-active' : 'chip'
                }
                onClick={() => {
                  setSelectedJobType(jobTypeOption)
                  if (jobTypeOption === 'Other') {
                    setTestMode('none')
                    setManualTest('')
                  } else if (testMode === 'none') {
                    setTestMode('ai')
                  }
                }}
              >
                {getJobTitleLabel(jobTypeOption)}
              </button>
            ))}
          </div>
        </div>
        <div className="panel-section">
          <h3>{t('company.details')}</h3>
          <div className="form-grid">
            <label>
              {t('company.companyName')}
              <input
                type="text"
                placeholder={t('company.companyNamePlaceholder')}
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
            </label>
            <label>
              {t('company.roleTitle')}
              <input type="text" value={getJobTitleLabel(selectedJobType)} readOnly />
            </label>
            <label>
              {t('company.jobTypeOptional')}
              <input
                type="text"
                placeholder={t('company.jobTypePlaceholder')}
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
              />
            </label>
            <label>
              {t('company.salaryOptional')}
              <input
                type="text"
                placeholder={t('company.salaryPlaceholder')}
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
              />
            </label>
            <label>
              {t('company.basedIn')}
              <input
                type="text"
                placeholder={t('company.locationPlaceholder')}
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>
            <label>
              {t('company.minScore')}
              <input
                type="number"
                min="0"
                max="15"
                placeholder={t('company.minScorePlaceholder')}
                value={minScore}
                onChange={(event) => setMinScore(event.target.value)}
              />
            </label>
            <label className="full-width">
              {t('company.description')}
              <textarea
                rows="4"
                placeholder={t('company.descriptionPlaceholder')}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <label className="full-width">
              {t('company.testType')}
              {isOtherVacancy ? (
                <p className="muted">{t('company.noTest')}</p>
              ) : (
                <div className="toggle-row">
                  <div className="test-option">
                    <span className="recommend-badge">
                      {t('company.recommended')}
                    </span>
                    <button
                      className={testMode === 'ai' ? 'chip chip-active' : 'chip'}
                      type="button"
                      onClick={() => setTestMode('ai')}
                    >
                      {t('company.aiTest')}
                    </button>
                  </div>
                  <div className="test-option">
                    <span className="recommend-badge">
                      {t('company.recommended')}
                    </span>
                    <button
                      className={
                        testMode === 'manual' ? 'chip chip-active' : 'chip'
                      }
                      type="button"
                      onClick={() => setTestMode('manual')}
                    >
                      {t('company.manualTest')}
                    </button>
                  </div>
                </div>
              )}
            </label>
            {testMode === 'manual' && (
              <label className="full-width">
                {t('company.manualQuestions')}
                <textarea
                  rows="8"
                  placeholder={t('company.manualPlaceholder')}
                  value={manualTest}
                  onChange={(event) => setManualTest(event.target.value)}
                />
                <span className="helper">
                  {t('company.questionsCount', { count: manualCount })}
                </span>
              </label>
            )}
          </div>
          <button
            className="primary"
            type="button"
            onClick={onPublish}
            disabled={isPublishing || (testMode === 'manual' && manualCount !== 15)}
          >
            {isPublishing ? t('company.publishing') : t('company.publish')}
          </button>
        </div>
      </div>

      <div className="company-results">
        <header className="page-header">
          <div>
            <p className="eyebrow">{t('company.resultsEyebrow')}</p>
            <h2>{t('company.resultsTitle')}</h2>
            <p className="muted">{t('company.resultsSubtitle')}</p>
          </div>
        </header>
        {vacancies.length === 0 ? (
          <div className="empty-state">
            <h3>{t('company.emptyVacanciesTitle')}</h3>
            <p className="muted">{t('company.emptyVacanciesSubtitle')}</p>
          </div>
        ) : !hasResults ? (
          <div className="empty-state">
            <h3>{t('company.emptyResultsTitle')}</h3>
            <p className="muted">{t('company.emptyResultsSubtitle')}</p>
          </div>
        ) : (
          <div className="grid">
            {vacancies.map((job) => (
              <div key={job.id} className="result-card">
                <div>
                  <h3>{getJobTitleLabel(job.title)}</h3>
                  <p className="muted">{job.company}</p>
                </div>
                {(job.testResults ?? []).length === 0 ? (
                  <p className="muted">{t('company.noSubmissions')}</p>
                ) : (
                  <ul className="result-list">
                    {job.testResults.slice(0, 5).map((result) => (
                      <li key={result.id} className="result-item">
                        <div className="result-meta">
                          <strong>{result.candidateName}</strong>
                          <span className="muted">{result.candidateEmail}</span>
                        </div>
                        <span
                          className={
                            result.score < (job.minScore ?? 0)
                              ? 'result-score result-score-low'
                              : 'result-score'
                          }
                        >
                          {result.score}/{result.total}
                        </span>
                        <span className={`status-chip ${result.status || 'submitted'}`}>
                          {getStatusLabel(result.status || 'submitted')}
                        </span>
                        <div className="result-actions">
                          <button
                            className="ghost"
                            type="button"
                            onClick={() => toggleResult(result.id)}
                          >
                            {expandedResultId === result.id
                              ? t('company.hideDetails')
                              : t('company.viewDetails')}
                          </button>
                          <button
                            className="danger"
                            type="button"
                            onClick={() => onDeleteResult(job.id, result.id)}
                          >
                            {t('company.delete')}
                          </button>
                          <button
                            className="ghost"
                            type="button"
                            onClick={() => onOpenMessages(job.id, result)}
                          >
                            {t('company.message')}
                          </button>
                        </div>
                        <div className="result-status-actions">
                          <button
                            className="ghost"
                            type="button"
                            onClick={() => onUpdateResultStatus(job.id, result.id, 'pending')}
                          >
                            {t('company.pending')}
                          </button>
                          <button
                            className="ghost"
                            type="button"
                            onClick={() =>
                              onUpdateResultStatus(job.id, result.id, 'interview')
                            }
                          >
                            {t('company.interview')}
                          </button>
                          <button
                            className="ghost"
                            type="button"
                            onClick={() =>
                              onUpdateResultStatus(job.id, result.id, 'accepted')
                            }
                          >
                            {t('company.accept')}
                          </button>
                          <button
                            className="danger"
                            type="button"
                            onClick={() =>
                              onUpdateResultStatus(job.id, result.id, 'rejected')
                            }
                          >
                            {t('company.reject')}
                          </button>
                        </div>
                        {expandedResultId === result.id && (
                          <div className="result-details">
                            <h4>{t('company.questionBreakdown')}</h4>
                            <ol>
                              {(result.questions ?? []).map((question, index) => {
                                const prompt = question?.prompt ?? question
                                const options = question?.options ?? []
                                const correctIndex = question?.correctIndex ?? null
                                const selectedIndex = result.answers?.[index] ?? null
                                const answered = Number.isFinite(selectedIndex)
                                return (
                                  <li key={`${result.id}-${index}`}>
                                    <p>{prompt}</p>
                                    {options.length > 0 ? (
                                      <ul className="answer-options">
                                        {options.map((option, optionIndex) => (
                                          <li
                                            key={`${result.id}-${index}-${optionIndex}`}
                                            className={
                                              optionIndex === correctIndex
                                                ? 'answer-option correct'
                                                : optionIndex === selectedIndex
                                                  ? 'answer-option selected'
                                                  : 'answer-option'
                                            }
                                          >
                                            {option}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p
                                        className={
                                          answered
                                            ? 'muted'
                                            : 'muted result-answer-missing'
                                        }
                                      >
                                        {answered ? t('company.answered') : t('company.noAnswer')}
                                      </p>
                                    )}
                                  </li>
                                )
                              })}
                            </ol>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyPage
