import { useState } from 'react'
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
  manualTest,
  setManualTest,
  onPublish,
  onBack,
}) => {
  const manualCount = manualTest
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean).length

  const hasResults = vacancies.some((job) => (job.testResults ?? []).length > 0)
  const [expandedResultId, setExpandedResultId] = useState(null)

  const toggleResult = (resultId) => {
    setExpandedResultId((prev) => (prev === resultId ? null : resultId))
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Company</p>
          <h1>Post vacancies</h1>
          <p className="muted">Choose a role and add optional details.</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          Back to vacancies
        </button>
      </header>
      <div className="company-panel">
        <div className="panel-section">
          <h3>Choose vacancy type</h3>
          <div className="chip-grid">
            {COMPANY_JOB_TYPES.map((jobTypeOption) => (
              <button
                key={jobTypeOption}
                type="button"
                className={
                  jobTypeOption === selectedJobType ? 'chip chip-active' : 'chip'
                }
                onClick={() => setSelectedJobType(jobTypeOption)}
              >
                {jobTypeOption}
              </button>
            ))}
          </div>
        </div>
        <div className="panel-section">
          <h3>Vacancy details</h3>
          <div className="form-grid">
            <label>
              Company name
              <input
                type="text"
                placeholder="dsq.ge"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
            </label>
            <label>
              Role title
              <input type="text" value={selectedJobType} readOnly />
            </label>
            <label>
              Job type (optional)
              <input
                type="text"
                placeholder="Full time / Part time"
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
              />
            </label>
            <label>
              Monthly salary (optional)
              <input
                type="text"
                placeholder="$2,500"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
              />
            </label>
            <label>
              Based in
              <input
                type="text"
                placeholder="Tbilisi, GE"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>
            <label>
              Minimum score required
              <input
                type="number"
                min="0"
                max="15"
                placeholder="10"
                value={minScore}
                onChange={(event) => setMinScore(event.target.value)}
              />
            </label>
            <label className="full-width">
              Description
              <textarea
                rows="4"
                placeholder="Describe the role, team, and expectations"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <label className="full-width">
              Test type
              <div className="toggle-row">
                <button
                  className={testMode === 'ai' ? 'chip chip-active' : 'chip'}
                  type="button"
                  onClick={() => setTestMode('ai')}
                >
                  AI test (15 questions)
                </button>
                <button
                  className={
                    testMode === 'manual' ? 'chip chip-active' : 'chip'
                  }
                  type="button"
                  onClick={() => setTestMode('manual')}
                >
                  Company written test
                </button>
              </div>
            </label>
            {testMode === 'manual' && (
              <label className="full-width">
                Company test questions (15 lines)
                <textarea
                  rows="8"
                  placeholder={
                    'Write 15 questions, one per line. Example:\n1. Explain your approach to...'
                  }
                  value={manualTest}
                  onChange={(event) => setManualTest(event.target.value)}
                />
                <span className="helper">{manualCount}/15 questions</span>
              </label>
            )}
          </div>
          <button
            className="primary"
            type="button"
            onClick={onPublish}
            disabled={testMode === 'manual' && manualCount !== 15}
          >
            Publish vacancy
          </button>
        </div>
      </div>

      <div className="company-results">
        <header className="page-header">
          <div>
            <p className="eyebrow">Results</p>
            <h2>Test submissions</h2>
            <p className="muted">Scores are 1 point per answered question.</p>
          </div>
        </header>
        {vacancies.length === 0 ? (
          <div className="empty-state">
            <h3>No vacancies yet</h3>
            <p className="muted">Publish a vacancy to receive test results.</p>
          </div>
        ) : !hasResults ? (
          <div className="empty-state">
            <h3>No results yet</h3>
            <p className="muted">Results will appear here after candidates finish tests.</p>
          </div>
        ) : (
          <div className="grid">
            {vacancies.map((job) => (
              <div key={job.id} className="result-card">
                <div>
                  <h3>{job.title}</h3>
                  <p className="muted">{job.company}</p>
                </div>
                {(job.testResults ?? []).length === 0 ? (
                  <p className="muted">No submissions yet.</p>
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
                        <div className="result-actions">
                          <button
                            className="ghost"
                            type="button"
                            onClick={() => toggleResult(result.id)}
                          >
                            {expandedResultId === result.id
                              ? 'Hide details'
                              : 'View details'}
                          </button>
                          <button
                            className="danger"
                            type="button"
                            onClick={() => onDeleteResult(job.id, result.id)}
                          >
                            Delete
                          </button>
                        </div>
                        {expandedResultId === result.id && (
                          <div className="result-details">
                            <h4>Question breakdown</h4>
                            <ol>
                              {(result.questions ?? []).map((question, index) => {
                                const answer = result.answers?.[index] ?? ''
                                const answered = answer.trim().length > 0
                                return (
                                  <li key={`${result.id}-${index}`}>
                                    <p>{question}</p>
                                    <p
                                      className={
                                        answered
                                          ? 'muted'
                                          : 'muted result-answer-missing'
                                      }
                                    >
                                      {answered ? answer : 'No answer provided.'}
                                    </p>
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
