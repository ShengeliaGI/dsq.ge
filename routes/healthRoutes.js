export const registerHealthRoutes = (app) => {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
  })
}
