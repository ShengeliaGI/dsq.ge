import { useEffect, useState } from 'react'

const MessagesPage = ({ userRole, authUser, threads, onSendMessage, onBack }) => {
  const [activeThreadId] = useState(threads[0]?.id ?? null)
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

      {visibleThreads.length === 0 ? (
        <div className="empty-state">
          <h3>No conversations yet</h3>
          <p className="muted">Messages will appear after a company responds.</p>
        </div>
      ) : (
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
                  activeThread.messages.map((message) => (
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
      )}
    </div>
  )
}

export default MessagesPage
