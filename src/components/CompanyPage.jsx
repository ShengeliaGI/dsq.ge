import { useMemo, useState } from 'react'
import { COMPANY_JOB_TYPES } from '../utils/testUtils'

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
  manualQuestionCount,
  setManualQuestionCount,
  manualQuestions,
  setManualQuestions,
  onBack,
  onUpdateResultStatus,
  onOpenMessages,
  t,
  getStatusLabel,
  getJobTitleLabel,
  isPublishing,
}) => {
  const isOtherVacancy = selectedJobType === 'Other'
  const manualCount = useMemo(
    () =>
      manualQuestions.filter(
        (question) =>
          question.prompt?.trim() &&
          (question.options ?? []).length === 3 &&
          (question.options ?? []).every((option) => option?.trim()),
      ).length,
    [manualQuestions],
  )
  const [expandedResultId, setExpandedResultId] = useState(null)

  const handleQuestionCountChange = (event) => {
    const nextCount = Math.max(1, Math.min(30, Number(event.target.value) || 1))
    setManualQuestionCount(nextCount)
    setManualQuestions((prev) => {
      const next = [...prev]
      if (nextCount > next.length) {
        const missing = nextCount - next.length
        for (let i = 0; i < missing; i += 1) {
          next.push({ prompt: '', options: ['', '', ''], correctIndex: 0 })
        }
      }
      return next.slice(0, nextCount)
    })
  }

  const updateManualQuestion = (index, updates) => {
    setManualQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...updates } : question,
      ),
    )
  }

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
                    setManualQuestionCount(1)
                    setManualQuestions([
                      { prompt: '', options: ['', '', ''], correctIndex: 0 },
                    ])
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
                      className={
                        testMode === 'manual' ? 'chip chip-active' : 'chip'
                      }
                      type="button"
                      onClick={() => setTestMode('manual')}
                    >
                      {t('company.manualTest')}
                    </button>
                  </div>
                  <div className="test-option">
                    <button
                      className={testMode === 'ai' ? 'chip chip-active' : 'chip'}
                      type="button"
                      onClick={() => setTestMode('ai')}
                    >
                      {t('company.aiTest')}
                    </button>
                  </div>
                </div>
              )}
            </label>
            {testMode === 'manual' && (
              <div className="full-width manual-builder">
                <label className="manual-count">
                  {t('company.manualQuestionCount')}
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={manualQuestionCount}
                    onChange={handleQuestionCountChange}
                  />
                </label>
                <div className="manual-grid">
                  {manualQuestions.map((question, index) => (
                    <div key={`manual-${index}`} className="manual-card">
                      <label>
                        {t('company.manualQuestionLabel', { index: index + 1 })}
                        <input
                          type="text"
                          value={question.prompt}
                          placeholder={t('company.manualQuestionPlaceholder')}
                          onChange={(event) =>
                            updateManualQuestion(index, {
                              prompt: event.target.value,
                            })
                          }
                        />
                      </label>
                      <div className="manual-options">
                        {['A', 'B', 'C'].map((label, optionIndex) => (
                          <label key={`${index}-${label}`}>
                            {t('company.optionLabel', { label })}
                            <input
                              type="text"
                              value={question.options?.[optionIndex] ?? ''}
                              onChange={(event) => {
                                const nextOptions = [...(question.options ?? [])]
                                while (nextOptions.length < 3) {
                                  nextOptions.push('')
                                }
                                nextOptions[optionIndex] = event.target.value
                                updateManualQuestion(index, {
                                  options: nextOptions,
                                })
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      <label>
                        {t('company.correctAnswer')}
                        <select
                          value={question.correctIndex ?? 0}
                          onChange={(event) =>
                            updateManualQuestion(index, {
                              correctIndex: Number(event.target.value),
                            })
                          }
                        >
                          <option value={0}>{t('company.correctOptionA')}</option>
                          <option value={1}>{t('company.correctOptionB')}</option>
                          <option value={2}>{t('company.correctOptionC')}</option>
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
                <span className="helper">
                  {t('company.questionsCount', { count: manualCount })}
                </span>
              </div>
            )}
          </div>
          <button
            className="primary"
            type="button"
            onClick={onPublish}
            disabled={
              isPublishing ||
              (testMode === 'manual' && manualCount !== manualQuestionCount)
            }
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
