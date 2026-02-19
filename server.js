import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDatabase } from './services/db.js'
import { createAuthService } from './services/auth.js'
import { registerHealthRoutes } from './routes/healthRoutes.js'
import { registerAuthRoutes } from './routes/authRoutes.js'
import { registerVacancyRoutes } from './routes/vacancyRoutes.js'
import { registerCvRoutes } from './routes/cvRoutes.js'
import { registerMessageRoutes } from './routes/messageRoutes.js'

dotenv.config()

export const app = express()
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET
const adminEmail = process.env.ADMIN_EMAIL || 'dtbkyroxxx@gmail.com'

if (!mongoUri) {
  console.warn('Missing MONGODB_URI in environment variables.')
}

if (!jwtSecret) {
  console.warn('Missing JWT_SECRET in environment variables.')
}

const authService = createAuthService({ jwtSecret, adminEmail })

app.use(cors())
app.use(express.json())

app.use(async (req, res, next) => {
  try {
    await connectToDatabase(mongoUri)
    next()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    res.status(500).json({ message: 'Database connection failed.' })
  }
})

registerHealthRoutes(app)
registerAuthRoutes(app, authService)
registerVacancyRoutes(app, authService)
registerCvRoutes(app, authService)
registerMessageRoutes(app, authService)

if (!process.env.VERCEL) {
  connectToDatabase(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB')
      app.listen(port, () => {
        console.log(`Auth server running on port ${port}`)
      })
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error)
      process.exit(1)
    })
}

export default app
