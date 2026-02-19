import CvSubmission from '../models/CvSubmission.js'

export const registerCvRoutes = (app, { requireAuth, isOwnerOrAdmin }) => {
  app.get('/api/cvs', async (req, res) => {
    try {
      const cvs = await CvSubmission.find().sort({ createdAt: -1 })
      res.json(cvs)
    } catch (error) {
      console.error('Fetch CVs error:', error)
      res.status(500).json({ message: 'Failed to fetch CVs.' })
    }
  })

  app.post('/api/cvs', requireAuth, async (req, res) => {
    try {
      const cv = await CvSubmission.create({
        ...req.body,
        createdBy: {
          id: req.user.id,
          email: req.user.email,
        },
      })
      res.status(201).json(cv)
    } catch (error) {
      console.error('Create CV error:', error)
      res.status(500).json({ message: 'Failed to create CV.' })
    }
  })

  app.delete('/api/cvs/:id', requireAuth, async (req, res) => {
    try {
      const cv = await CvSubmission.findOne({ id: req.params.id })
      if (!cv) {
        return res.status(404).json({ message: 'CV not found.' })
      }

      if (!isOwnerOrAdmin(cv, req.user)) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      await CvSubmission.findOneAndDelete({ id: req.params.id })
      return res.json({ ok: true })
    } catch (error) {
      console.error('Delete CV error:', error)
      return res.status(500).json({ message: 'Failed to delete CV.' })
    }
  })
}
