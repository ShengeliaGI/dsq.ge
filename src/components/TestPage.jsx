const TestPage = ({
  selectedJob,
  timeLeft,
  activeQuestions,
  answers,
  setAnswers,
  showTimeUp,
  onFinish,
  onAbandon,
  onTimeUpOk,
  onBack,
  t,
  getJobTitleLabel,
  formatTime,
}) => (
  <div className="page">
    <header className="page-header">
      <div>
        <p className="eyebrow">{t('test.eyebrow')}</p>
        <h1>
          {selectedJob ? getJobTitleLabel(selectedJob.title) : t('test.titleFallback')}
        </h1>
        <p className="muted">{t('test.subtitle')}</p>
      </div>
      <button className="ghost" type="button" onClick={onBack}>
        {t('test.backToVacancies')}
      </button>
    </header>
    <div className="test-panel">
      <div className="test-header">
        <p className="muted">
          {t('test.company', { company: selectedJob?.company ?? 'Unknown' })}
        </p>
        <span className="timer">
          {t('test.timeLeft', { time: formatTime(timeLeft) })}
        </span>
      </div>
      <p className="test-copy">
        {selectedJob?.testMode === 'ai'
          ? t('test.aiCopy')
          : t('test.manualCopy')}
      </p>
      <div className="answer-grid">
        <ol className="question-list">
          {activeQuestions.map((question, index) => (
            <li key={`${selectedJob?.id}-${question.id ?? index}`}>
              <p>{question.prompt ?? question}</p>
              <div className="option-list">
                {(question.options ?? []).map((option, optionIndex) => (
                  <label key={`${question.id}-${optionIndex}`} className="option-item">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === optionIndex}
                      onChange={() => {
                        const next = [...answers]
                        next[index] = optionIndex
                        setAnswers(next)
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="test-actions">
        <button className="primary" type="button" onClick={onFinish}>
          {t('test.finish')}
        </button>
        <button className="ghost" type="button" onClick={onAbandon}>
          {t('test.abandon')}
        </button>
      </div>
    </div>
    {showTimeUp && (
      <div className="modal-backdrop" role="dialog" aria-modal="true">
        <div className="modal">
          <h3>{t('test.timeUpTitle')}</h3>
          <p className="muted">{t('test.timeUpText')}</p>
          <button className="primary" type="button" onClick={onTimeUpOk}>
            {t('test.ok')}
          </button>
        </div>
      </div>
    )}
  </div>
)

export default TestPage
