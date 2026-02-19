import MessageThread from '../models/MessageThread.js'

export const registerMessageRoutes = (app, { requireAuth }) => {
  app.get('/api/messages/threads', requireAuth, async (req, res) => {
    try {
      const email = req.user.email.toLowerCase()
      const threads = await MessageThread.find({
        $or: [{ companyEmail: email }, { candidateEmail: email }],
      }).sort({ updatedAt: -1 })
      res.json(threads)
    } catch (error) {
      console.error('Fetch threads error:', error)
      res.status(500).json({ message: 'Failed to fetch threads.' })
    }
  })

  app.post('/api/messages/threads', requireAuth, async (req, res) => {
    try {
      const { jobId, jobTitle, company, candidateEmail, companyEmail } = req.body

      if (!jobId || !jobTitle || !company || !candidateEmail) {
        return res.status(400).json({ message: 'Missing thread fields.' })
      }

      const normalizedCandidate = candidateEmail.toLowerCase()
      const normalizedCompany = (companyEmail || req.user.email).toLowerCase()

      const existing = await MessageThread.findOne({
        jobId,
        candidateEmail: normalizedCandidate,
      })
      if (existing) {
        return res.json(existing)
      }

      const thread = await MessageThread.create({
        id: `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        jobId,
        jobTitle,
        company,
        companyEmail: normalizedCompany,
        candidateEmail: normalizedCandidate,
        messages: [],
      })

      return res.status(201).json(thread)
    } catch (error) {
      if (error.code === 11000) {
        const existing = await MessageThread.findOne({
          jobId: req.body?.jobId,
          candidateEmail: req.body?.candidateEmail?.toLowerCase(),
        })
        return res.json(existing)
      }
      console.error('Create thread error:', error)
      return res.status(500).json({ message: 'Failed to create thread.' })
    }
  })

  app.post('/api/messages/threads/:id/messages', requireAuth, async (req, res) => {
    try {
      const { sender, body } = req.body
      if (!body) {
        return res.status(400).json({ message: 'Message body is required.' })
      }

      const thread = await MessageThread.findOne({ id: req.params.id })
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found.' })
      }

      const email = req.user.email.toLowerCase()
      if (thread.companyEmail !== email && thread.candidateEmail !== email && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      thread.messages.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        sender: sender || (thread.companyEmail === email ? 'company' : 'applicant'),
        body: body.trim(),
        sentAt: new Date().toISOString(),
      })

      await thread.save()
      return res.json(thread)
    } catch (error) {
      console.error('Send message error:', error)
      return res.status(500).json({ message: 'Failed to send message.' })
    }
  })
}
