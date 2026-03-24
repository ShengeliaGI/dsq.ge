const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const MAX_HISTORY_MESSAGES = 8

const PROFILE_FIELDS = [
  '',
  'firstName',
  'lastName',
  'profession',
  'phone',
  'email',
  'address',
  'country',
  'city',
  'about',
]

const SUGGESTION_TYPES = [
  'set_profile_field',
  'add_skills',
  'add_social_links',
  'set_work_draft',
  'set_education_draft',
  'set_language_draft',
  'set_certificate_draft',
  'set_training_draft',
]

const EMPTY_ENTRY = {
  position: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  degree: '',
  school: '',
  faculty: '',
  name: '',
  level: '',
  title: '',
  organization: '',
  issueDate: '',
}

const assistantResponseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply: { type: 'string' },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          summary: { type: 'string' },
          type: {
            type: 'string',
            enum: SUGGESTION_TYPES,
          },
          field: {
            type: 'string',
            enum: PROFILE_FIELDS,
          },
          text: { type: 'string' },
          items: {
            type: 'array',
            items: { type: 'string' },
          },
          entry: {
            type: 'object',
            additionalProperties: false,
            properties: {
              position: { type: 'string' },
              company: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              current: { type: 'boolean' },
              description: { type: 'string' },
              degree: { type: 'string' },
              school: { type: 'string' },
              faculty: { type: 'string' },
              name: { type: 'string' },
              level: { type: 'string' },
              title: { type: 'string' },
              organization: { type: 'string' },
              issueDate: { type: 'string' },
            },
            required: [
              'position',
              'company',
              'startDate',
              'endDate',
              'current',
              'description',
              'degree',
              'school',
              'faculty',
              'name',
              'level',
              'title',
              'organization',
              'issueDate',
            ],
          },
        },
        required: ['id', 'label', 'summary', 'type', 'field', 'text', 'items', 'entry'],
      },
    },
  },
  required: ['reply', 'suggestions'],
}

const trimText = (value, maxLength = 1200) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const getAssistantModel = () => process.env.OPENAI_ASSISTANT_MODEL || 'gpt-5-mini'

const normalizeItems = (items) =>
  Array.isArray(items)
    ? items
        .map((item) => trimText(item, 160))
        .filter(Boolean)
        .slice(0, 12)
    : []

const normalizeEntry = (entry) => ({
  ...EMPTY_ENTRY,
  ...(entry && typeof entry === 'object' ? entry : {}),
  position: trimText(entry?.position, 140),
  company: trimText(entry?.company, 140),
  startDate: trimText(entry?.startDate, 60),
  endDate: trimText(entry?.endDate, 60),
  current: Boolean(entry?.current),
  description: trimText(entry?.description, 1200),
  degree: trimText(entry?.degree, 140),
  school: trimText(entry?.school, 140),
  faculty: trimText(entry?.faculty, 140),
  name: trimText(entry?.name, 80),
  level: trimText(entry?.level, 80),
  title: trimText(entry?.title, 140),
  organization: trimText(entry?.organization, 140),
  issueDate: trimText(entry?.issueDate, 60),
})

const isEntryPopulated = (entry, keys) =>
  keys.some((key) => (key === 'current' ? entry[key] : Boolean(entry[key])))

const normalizeSuggestion = (suggestion, index) => {
  if (!suggestion || typeof suggestion !== 'object') {
    return null
  }

  const type = SUGGESTION_TYPES.includes(suggestion.type) ? suggestion.type : null
  if (!type) {
    return null
  }

  const field = PROFILE_FIELDS.includes(suggestion.field) ? suggestion.field : ''
  const entry = normalizeEntry(suggestion.entry)
  const items = normalizeItems(suggestion.items)
  const text = trimText(suggestion.text, 1800)

  if (type === 'set_profile_field' && (!field || !text)) {
    return null
  }

  if (type === 'add_skills' && items.length === 0) {
    return null
  }

  if (type === 'add_social_links' && items.length === 0) {
    return null
  }

  if (
    type === 'set_work_draft' &&
    !isEntryPopulated(entry, ['position', 'company', 'startDate', 'endDate', 'current', 'description'])
  ) {
    return null
  }

  if (
    type === 'set_education_draft' &&
    !isEntryPopulated(entry, ['degree', 'school', 'faculty', 'startDate', 'endDate'])
  ) {
    return null
  }

  if (type === 'set_language_draft' && !isEntryPopulated(entry, ['name', 'level'])) {
    return null
  }

  if (
    type === 'set_certificate_draft' &&
    !isEntryPopulated(entry, ['title', 'organization', 'issueDate'])
  ) {
    return null
  }

  if (
    type === 'set_training_draft' &&
    !isEntryPopulated(entry, ['title', 'organization', 'startDate', 'endDate'])
  ) {
    return null
  }

  return {
    id: trimText(suggestion.id, 80) || `suggestion-${index + 1}`,
    label: trimText(suggestion.label, 120) || 'Suggestion',
    summary: trimText(suggestion.summary, 260) || '',
    type,
    field,
    text,
    items,
    entry,
  }
}

const normalizeHistory = (history) =>
  Array.isArray(history)
    ? history
        .slice(-MAX_HISTORY_MESSAGES)
        .map((item) => {
          const role =
            item?.role === 'assistant' || item?.role === 'system' ? item.role : 'user'
          const text = trimText(item?.text, 2000)
          if (!text) {
            return null
          }
          return { role, content: text }
        })
        .filter(Boolean)
    : []

const buildCvSnapshot = (cvForm) => ({
  profile: {
    firstName: trimText(cvForm?.profile?.firstName, 120),
    lastName: trimText(cvForm?.profile?.lastName, 120),
    profession: trimText(cvForm?.profile?.profession, 160),
    phone: trimText(cvForm?.profile?.phone, 120),
    email: trimText(cvForm?.profile?.email, 160),
    address: trimText(cvForm?.profile?.address, 200),
    country: trimText(cvForm?.profile?.country, 120),
    city: trimText(cvForm?.profile?.city, 120),
    about: trimText(cvForm?.profile?.about, 2000),
  },
  socialLinks: normalizeItems(cvForm?.socialLinks),
  workEntries: Array.isArray(cvForm?.workEntries)
    ? cvForm.workEntries.slice(0, 6).map(normalizeEntry)
    : [],
  educationEntries: Array.isArray(cvForm?.educationEntries)
    ? cvForm.educationEntries.slice(0, 6).map(normalizeEntry)
    : [],
  languageEntries: Array.isArray(cvForm?.languageEntries)
    ? cvForm.languageEntries.slice(0, 10).map(normalizeEntry)
    : [],
  skillsList: normalizeItems(cvForm?.skillsList),
  certificateEntries: Array.isArray(cvForm?.certificateEntries)
    ? cvForm.certificateEntries.slice(0, 6).map(normalizeEntry)
    : [],
  trainingEntries: Array.isArray(cvForm?.trainingEntries)
    ? cvForm.trainingEntries.slice(0, 6).map(normalizeEntry)
    : [],
})

const buildSystemPrompt = ({ user, surface }) => `
You are the DSQ.ge AI assistant embedded inside the ${surface} page.

You help users:
- write and improve CV content
- brainstorm stronger summaries, skill lists, and draft descriptions
- answer questions about how the DSQ.ge platform works
- answer general career questions when they relate to the user's CV or job search

Platform facts you can rely on:
- Applicants can browse vacancies, publish CVs, take tests, track statuses, and message companies.
- Companies can publish vacancies, review test results, and message candidates.
- This assistant can suggest text and draft form content, but the user must explicitly approve each change before it is applied.

Rules:
- Never invent employers, dates, degrees, certificates, contact details, or achievements as facts.
- If details are missing, ask for clarification or offer a template that the user should edit.
- Keep the reply concise and useful.
- Suggestions are optional. Only include them when they are genuinely actionable.
- Suggestions must use only the supported suggestion types and fields.
- For platform questions, answer directly even if no suggestion is needed.
- If the user asks to update the CV, return suggestions that are safe to review and apply manually.

Supported suggestion types:
- set_profile_field
- add_skills
- add_social_links
- set_work_draft
- set_education_draft
- set_language_draft
- set_certificate_draft
- set_training_draft

Supported profile fields:
- firstName
- lastName
- profession
- phone
- email
- address
- country
- city
- about

Current signed-in user:
- Name: ${trimText(user?.name, 160) || 'Unknown'}
- Email: ${trimText(user?.email, 160) || 'Unknown'}
`.trim()

const parseStructuredResponse = (payload) => {
  const rawText = trimText(payload?.output_text, 12000)
  if (!rawText) {
    return null
  }

  try {
    return JSON.parse(rawText)
  } catch (error) {
    console.error('Failed to parse OpenAI assistant JSON:', error)
    return null
  }
}

export const registerAiRoutes = (app, { requireAuth }) => {
  app.post('/api/ai/assistant', requireAuth, async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return res.status(503).json({
        message: 'AI assistant is not configured. Add OPENAI_API_KEY on the server.',
      })
    }

    const message = trimText(req.body?.message, 2000)
    const surface = trimText(req.body?.surface, 40) || 'cv'
    const history = normalizeHistory(req.body?.history)
    const cvSnapshot = buildCvSnapshot(req.body?.cvForm)

    if (!message) {
      return res.status(400).json({ message: 'Message is required.' })
    }

    try {
      const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: getAssistantModel(),
          store: false,
          max_output_tokens: 1400,
          input: [
            {
              role: 'system',
              content: buildSystemPrompt({ user: req.user, surface }),
            },
            ...history,
            {
              role: 'user',
              content: [
                `Current CV form snapshot:`,
                JSON.stringify(cvSnapshot, null, 2),
                '',
                `Latest user request:`,
                message,
              ].join('\n'),
            },
          ],
          text: {
            format: {
              type: 'json_schema',
              name: 'cv_assistant_response',
              strict: true,
              schema: assistantResponseSchema,
            },
          },
        }),
      })

      const payload = await openAiResponse.json().catch(() => null)

      if (!openAiResponse.ok) {
        console.error('OpenAI assistant error:', payload)
        return res.status(502).json({
          message: payload?.error?.message || 'AI assistant request failed.',
        })
      }

      const parsed = parseStructuredResponse(payload)
      if (!parsed) {
        return res.status(502).json({
          message: 'AI assistant returned an unreadable response.',
        })
      }

      const suggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions.map(normalizeSuggestion).filter(Boolean).slice(0, 4)
        : []

      return res.json({
        reply:
          trimText(parsed.reply, 3000) ||
          'I could not generate a useful reply yet. Please try rephrasing your request.',
        suggestions,
      })
    } catch (error) {
      console.error('AI assistant route error:', error)
      return res.status(500).json({ message: 'Failed to contact the AI assistant.' })
    }
  })
}
