import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export const registerAuthRoutes = (app, { signToken }) => {
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' })
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(409).json({ message: 'An account with that email already exists.' })
      }

      const passwordHash = await bcrypt.hash(password, 12)
      const user = await User.create({ name, email: email.toLowerCase(), passwordHash })

      const token = signToken(user)
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      })
    } catch (error) {
      console.error('Register error:', error)
      return res.status(500).json({ message: 'Registration failed.' })
    }
  })

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' })
      }

      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash)
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      const token = signToken(user)
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email },
      })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(500).json({ message: 'Login failed.' })
    }
  })
}
