import { useMemo, useState } from 'react'

const MessagesPage = ({
  userRole,
  authUser,
  threads,
  applications = [],
  vacancies = [],
  onStartThread,
  onSendMessage,
  onBack,
  t,
  getJobTitleLabel,
}) => {
  const [activeThreadId, setActiveThreadId] = useState(threads[0]?.id ?? null)
  const [draft, setDraft] = useState('')

  const visibleThreads = threads.filter((thread) => {
    if (userRole === 'company') {
      return true
    }
    return (
      thread.candidateEmail?.toLowerCase() === authUser?.email?.toLowerCase()
    )
  })

  const activeThread =
    visibleThreads.find((thread) => thread.id === activeThreadId) ??
    visibleThreads[0] ??
    null

  const handleSend = () => {
    if (!activeThread) {
      return
    }
    onSendMessage(activeThread.id, draft, userRole)
    setDraft('')
  }

  const availableConversations = useMemo(() => {
    if (userRole === 'company') {
      return vacancies.flatMap((job) =>
        (job.testResults ?? []).map((result) => ({
          key: `${job.id}-${result.candidateEmail}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          companyEmail: job.createdBy?.email,
          candidateEmail: result.candidateEmail,
          label: result.candidateEmail,
        })),
      )
    }

    return applications.map((application) => ({
      key: `${application.jobId}-${application.id}`,
      jobId: application.jobId,
      jobTitle: application.title,
      company: application.company,
      companyEmail:
        vacancies.find((job) => job.id === application.jobId)?.createdBy?.email,
      candidateEmail: authUser?.email,
      label: application.company,
    }))
  }, [applications, authUser?.email, userRole, vacancies])

  const handleStartThread = async (conversation) => {
    const thread = await onStartThread({
      jobId: conversation.jobId,
      jobTitle: conversation.jobTitle,
      company: conversation.company,
      candidateEmail: conversation.candidateEmail,
      companyEmail: conversation.companyEmail,
    })
    if (thread?.id) {
      setActiveThreadId(thread.id)
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t('messages.eyebrow')}</p>
          <h1>{t('messages.title')}</h1>
          <p className="muted">{t('messages.subtitle')}</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          {t('messages.back')}
        </button>
      </header>

      {availableConversations.length === 0 ? (
        <div className="empty-state">
          <h3>{t('messages.emptyTitle')}</h3>
          <p className="muted">{t('messages.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="messages-layout">
          <aside className="thread-list">
            {availableConversations.map((conversation) => {
              const existingThread = visibleThreads.find(
                (thread) =>
                  thread.jobId === conversation.jobId &&
                  thread.candidateEmail?.toLowerCase() ===
                    conversation.candidateEmail?.toLowerCase(),
              )
              return (
                <div
                  key={conversation.key}
                  className={
                    existingThread?.id === activeThread?.id
                      ? 'thread-card active'
                      : 'thread-card'
                  }
                >
                  <div>
                    <h4>{getJobTitleLabel(conversation.jobTitle)}</h4>
                    <p className="muted">{conversation.label}</p>
                  </div>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() =>
                      existingThread
                        ? setActiveThreadId(existingThread.id)
                        : handleStartThread(conversation)
                    }
                  >
                    {t('messages.message')}
                  </button>
                </div>
              )
            })}
          </aside>

          <section className="thread-panel">
            {activeThread ? (
              <>
                <header className="thread-header">
                  <div>
                    <h3>{getJobTitleLabel(activeThread.jobTitle)}</h3>
                    <p className="muted">
                      {userRole === 'company'
                        ? activeThread.candidateEmail
                        : activeThread.company}
                    </p>
                  </div>
                </header>
                <div className="message-list">
                  {activeThread.messages.length === 0 ? (
                    <p className="muted">{t('messages.startConversation')}</p>
                  ) : (
                    [...activeThread.messages]
                      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
                      .map((message) => (
                      <div key={message.id} className={`message-bubble ${message.sender}`}>
                        <p>{message.body}</p>
                        <span>{new Date(message.sentAt).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="message-composer">
                  <input
                    type="text"
                    placeholder={t('messages.writePlaceholder')}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <button className="primary" type="button" onClick={handleSend}>
                    {t('messages.send')}
                  </button>
                </div>
              </>
            ) : (
              <p className="muted">{t('messages.selectThread')}</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default MessagesPage
