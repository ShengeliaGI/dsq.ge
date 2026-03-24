import { useState } from 'react'

const STARTER_PROMPTS = [
  'Write an About Me section from my current CV.',
  'Suggest stronger skills I should add.',
  'Draft a better work experience description.',
  'How does this platform work?',
]

const uniqueStrings = (items) => {
  const seen = new Set()

  return items.filter((item) => {
    const normalized = item.trim().toLowerCase()
    if (!normalized || seen.has(normalized)) {
      return false
    }
    seen.add(normalized)
    return true
  })
}

const CvAssistantPanel = ({
  cvProfile,
  socialLinks,
  skillsList,
  setCvProfile,
  setSocialLinks,
  setSkillsList,
  setWorkEntry,
  setEducationEntry,
  setLanguageEntry,
  setCertificateEntry,
  setTrainingEntry,
  onAskAssistant,
}) => {
  const [messages, setMessages] = useState([])
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantError, setAssistantError] = useState('')
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState({})

  const applySuggestion = (suggestion) => {
    switch (suggestion.type) {
      case 'set_profile_field': {
        if (!suggestion.field) {
          return
        }
        setCvProfile((prev) => ({
          ...prev,
          [suggestion.field]: suggestion.text,
        }))
        break
      }
      case 'add_skills': {
        setSkillsList((prev) =>
          uniqueStrings([...prev, ...(Array.isArray(suggestion.items) ? suggestion.items : [])]),
        )
        break
      }
      case 'add_social_links': {
        setSocialLinks((prev) =>
          uniqueStrings([...prev, ...(Array.isArray(suggestion.items) ? suggestion.items : [])]),
        )
        break
      }
      case 'set_work_draft': {
        setWorkEntry({
          position: suggestion.entry.position || '',
          company: suggestion.entry.company || '',
          startDate: suggestion.entry.startDate || '',
          endDate: suggestion.entry.endDate || '',
          current: Boolean(suggestion.entry.current),
          description: suggestion.entry.description || '',
        })
        break
      }
      case 'set_education_draft': {
        setEducationEntry({
          degree: suggestion.entry.degree || '',
          school: suggestion.entry.school || '',
          faculty: suggestion.entry.faculty || '',
          startDate: suggestion.entry.startDate || '',
          endDate: suggestion.entry.endDate || '',
        })
        break
      }
      case 'set_language_draft': {
        setLanguageEntry({
          name: suggestion.entry.name || '',
          level: suggestion.entry.level || '',
        })
        break
      }
      case 'set_certificate_draft': {
        setCertificateEntry({
          title: suggestion.entry.title || '',
          organization: suggestion.entry.organization || '',
          issueDate: suggestion.entry.issueDate || '',
        })
        break
      }
      case 'set_training_draft': {
        setTrainingEntry({
          title: suggestion.entry.title || '',
          organization: suggestion.entry.organization || '',
          startDate: suggestion.entry.startDate || '',
          endDate: suggestion.entry.endDate || '',
        })
        break
      }
      default:
        return
    }

    setAppliedSuggestionIds((prev) => ({
      ...prev,
      [suggestion.id]: true,
    }))
  }

  const submitPrompt = async (rawPrompt) => {
    const prompt = rawPrompt.trim()
    if (!prompt || isAssistantLoading) {
      return
    }

    const nextUserMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt,
      suggestions: [],
    }

    const history = messages.map(({ role, text }) => ({ role, text })).slice(-8)

    setAssistantInput('')
    setAssistantError('')
    setMessages((prev) => [...prev, nextUserMessage])
    setIsAssistantLoading(true)

    try {
      const response = await onAskAssistant({ message: prompt, history })
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: response.reply,
          suggestions: Array.isArray(response.suggestions) ? response.suggestions : [],
        },
      ])
    } catch (error) {
      setAssistantError(error?.message || 'AI assistant request failed.')
    } finally {
      setIsAssistantLoading(false)
    }
  }

  return (
    <section className="panel-section">
      <div className="cv-section-card cv-assistant-card">
        <div className="cv-section-header">
          <div>
            <h2>AI CV Assistant</h2>
            <p className="muted">
              Tell it what you do, ask for CV wording, or ask platform questions.
            </p>
          </div>
        </div>

        <div className="assistant-permission-note">
          It will never change your CV automatically. Suggestions are only applied when
          you click `Apply`.
        </div>

        {messages.length === 0 ? (
          <div className="assistant-empty">
            <p className="muted">
              Current context: {cvProfile.profession || 'No profession set yet'}
              {skillsList.length > 0 ? ` • ${skillsList.length} skills listed` : ''}
              {socialLinks.length > 0 ? ` • ${socialLinks.length} social links` : ''}
            </p>
            <div className="assistant-prompt-row">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  className="assistant-prompt"
                  type="button"
                  onClick={() => submitPrompt(prompt)}
                  disabled={isAssistantLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="assistant-messages">
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === 'assistant'
                    ? 'assistant-bubble assistant-bubble-assistant'
                    : 'assistant-bubble assistant-bubble-user'
                }
              >
                <strong>{message.role === 'assistant' ? 'AI' : 'You'}</strong>
                <p>{message.text}</p>
                {message.role === 'assistant' && message.suggestions?.length > 0 && (
                  <div className="assistant-suggestions">
                    {message.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="assistant-suggestion-card">
                        <div className="assistant-suggestion-copy">
                          <strong>{suggestion.label}</strong>
                          {suggestion.summary && <p>{suggestion.summary}</p>}
                        </div>
                        <button
                          className="primary assistant-apply-button"
                          type="button"
                          onClick={() => applySuggestion(suggestion)}
                          disabled={Boolean(appliedSuggestionIds[suggestion.id])}
                        >
                          {appliedSuggestionIds[suggestion.id] ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {assistantError && <p className="assistant-error">{assistantError}</p>}

        <div className="assistant-composer">
          <textarea
            className="assistant-textarea"
            rows="3"
            placeholder="Example: I worked as a frontend developer for 2 years. Write a strong About Me section."
            value={assistantInput}
            onChange={(event) => setAssistantInput(event.target.value)}
          />
          <div className="assistant-actions">
            <button
              className="ghost"
              type="button"
              onClick={() => setAssistantInput('')}
              disabled={isAssistantLoading || !assistantInput.trim()}
            >
              Clear
            </button>
            <button
              className="primary"
              type="button"
              onClick={() => submitPrompt(assistantInput)}
              disabled={isAssistantLoading || !assistantInput.trim()}
            >
              {isAssistantLoading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CvAssistantPanel
