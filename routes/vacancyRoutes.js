import Vacancy from '../models/Vacancy.js'

export const registerVacancyRoutes = (app, { requireAuth, isOwnerOrAdmin }) => {
  app.get('/api/vacancies', async (req, res) => {
    try {
      const vacancies = await Vacancy.find().sort({ createdAt: -1 })
      res.json(vacancies)
    } catch (error) {
      console.error('Fetch vacancies error:', error)
      res.status(500).json({ message: 'Failed to fetch vacancies.' })
    }
  })

  app.post('/api/vacancies', requireAuth, async (req, res) => {
    try {
      const vacancy = await Vacancy.create({
        ...req.body,
        createdBy: {
          id: req.user.id,
          email: req.user.email,
        },
      })
      res.status(201).json(vacancy)
    } catch (error) {
      console.error('Create vacancy error:', error)
      res.status(500).json({ message: 'Failed to create vacancy.' })
    }
  })

  app.patch('/api/vacancies/:id', requireAuth, async (req, res) => {
    try {
      const vacancy = await Vacancy.findOne({ id: req.params.id })

      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found.' })
      }

      if (!isOwnerOrAdmin(vacancy, req.user)) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      const { createdBy: _createdBy, ...updatePayload } = req.body || {}
      const updated = await Vacancy.findOneAndUpdate(
        { id: req.params.id },
        { $set: updatePayload },
        { new: true },
      )

      return res.json(updated)
    } catch (error) {
      console.error('Update vacancy error:', error)
      return res.status(500).json({ message: 'Failed to update vacancy.' })
    }
  })

  app.patch('/api/vacancies/:id/results', requireAuth, async (req, res) => {
    try {
      const { result, status, tryAgain } = req.body
      if (!result) {
        return res.status(400).json({ message: 'Result payload is required.' })
      }

      const vacancy = await Vacancy.findOne({ id: req.params.id })

      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found.' })
      }

      const canManage = isOwnerOrAdmin(vacancy, req.user)
      const nextStatus = canManage ? status ?? 'waiting' : 'waiting'
      const nextTryAgain = canManage ? tryAgain ?? false : false

      const updated = await Vacancy.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            status: nextStatus,
            tryAgain: nextTryAgain,
          },
          $push: {
            testResults: {
              $each: [result],
              $position: 0,
            },
          },
        },
        { new: true },
      )

      return res.json(updated)
    } catch (error) {
      console.error('Append result error:', error)
      return res.status(500).json({ message: 'Failed to save results.' })
    }
  })

  app.patch('/api/vacancies/:id/results/:resultId', requireAuth, async (req, res) => {
    try {
      const vacancy = await Vacancy.findOne({ id: req.params.id })

      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found.' })
      }

      if (!isOwnerOrAdmin(vacancy, req.user)) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      const { status } = req.body || {}
      const result = vacancy.testResults.find((entry) => entry.id === req.params.resultId)

      if (!result) {
        return res.status(404).json({ message: 'Result not found.' })
      }

      result.status = status || result.status
      await vacancy.save()

      return res.json(vacancy)
    } catch (error) {
      console.error('Update result error:', error)
      return res.status(500).json({ message: 'Failed to update result.' })
    }
  })

  app.delete('/api/vacancies/:id/results/:resultId', requireAuth, async (req, res) => {
    try {
      const vacancy = await Vacancy.findOne({ id: req.params.id })

      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found.' })
      }

      if (!isOwnerOrAdmin(vacancy, req.user)) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      const updated = await Vacancy.findOneAndUpdate(
        { id: req.params.id },
        { $pull: { testResults: { id: req.params.resultId } } },
        { new: true },
      )

      return res.json(updated)
    } catch (error) {
      console.error('Delete result error:', error)
      return res.status(500).json({ message: 'Failed to delete result.' })
    }
  })

  app.delete('/api/vacancies/:id', requireAuth, async (req, res) => {
    try {
      const vacancy = await Vacancy.findOne({ id: req.params.id })
      if (!vacancy) {
        return res.status(404).json({ message: 'Vacancy not found.' })
      }

      if (!isOwnerOrAdmin(vacancy, req.user)) {
        return res.status(403).json({ message: 'Forbidden.' })
      }

      await Vacancy.findOneAndDelete({ id: req.params.id })
      return res.json({ ok: true })
    } catch (error) {
      console.error('Delete vacancy error:', error)
      return res.status(500).json({ message: 'Failed to delete vacancy.' })
    }
  })
}
