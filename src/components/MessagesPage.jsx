import { useEffect, useMemo, useState } from 'react'

const MessagesPage = ({
  userRole,
  authUser,
  threads,
  applications = [],
  vacancies = [],
  onStartThread,
  onSendMessage,
  onBack,
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

  useEffect(() => {
    if (!activeThreadId && visibleThreads[0]?.id) {
      setActiveThreadId(visibleThreads[0].id)
    }
  }, [activeThreadId, visibleThreads])

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
          <p className="eyebrow">Messages</p>
          <h1>Messaging portal</h1>
          <p className="muted">Connect applicants and companies in one place.</p>
        </div>
        <button className="ghost" type="button" onClick={onBack}>
          Back
        </button>
      </header>

      {availableConversations.length === 0 ? (
        <div className="empty-state">
          <h3>No conversations yet</h3>
          <p className="muted">Messages will appear after a company responds.</p>
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
                    <h4>{conversation.jobTitle}</h4>
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
                    Message
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
                    <h3>{activeThread.jobTitle}</h3>
                    <p className="muted">
                      {userRole === 'company'
                        ? activeThread.candidateEmail
                        : activeThread.company}
                    </p>
                  </div>
                </header>
                <div className="message-list">
                  {activeThread.messages.length === 0 ? (
                    <p className="muted">Start the conversation.</p>
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
                    placeholder="Write a message..."
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                  <button className="primary" type="button" onClick={handleSend}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p className="muted">Select a thread to begin.</p>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default MessagesPage
