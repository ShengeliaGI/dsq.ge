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
}) => (
  <div className="page">
    <header className="page-header">
      <div>
        <p className="eyebrow">Test</p>
        <h1>{selectedJob ? selectedJob.title : 'Role test'}</h1>
        <p className="muted">Company test assignment</p>
      </div>
      <button className="ghost" type="button" onClick={onBack}>
        Back to vacancies
      </button>
    </header>
    <div className="test-panel">
      <div className="test-header">
        <p className="muted">Company: {selectedJob?.company ?? 'Unknown'}</p>
        <span className="timer">
          Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>
      <p className="test-copy">
        {selectedJob?.testMode === 'ai'
          ? 'AI generated test tailored to this role.'
          : 'Company written test.'}
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
          Finish test
        </button>
        <button className="ghost" type="button" onClick={onAbandon}>
          Abandon
        </button>
      </div>
    </div>
    {showTimeUp && (
      <div className="modal-backdrop" role="dialog" aria-modal="true">
        <div className="modal">
          <h3>Time is up</h3>
          <p className="muted">Sorry, the test time has expired.</p>
          <button className="primary" type="button" onClick={onTimeUpOk}>
            OK
          </button>
        </div>
      </div>
    )}
  </div>
)

export default TestPage
