import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getTokenFromHeader = (req) => {
  const header = req.headers.authorization
  if (!header) {
    return null
  }
  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) {
    return null
  }
  return token
}

export const createAuthService = ({ jwtSecret, adminEmail }) => {
  const normalizedAdminEmail = (adminEmail || '').toLowerCase()

  const signToken = (user) => {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured.')
    }
    return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })
  }

  const isAdminUser = (user) =>
    user?.email?.toLowerCase() === normalizedAdminEmail

  const requireAuth = async (req, res, next) => {
    try {
      const token = getTokenFromHeader(req)
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' })
      }
      const payload = jwt.verify(token, jwtSecret)
      const user = await User.findById(payload.id)
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized.' })
      }
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: isAdminUser(user),
      }
      return next()
    } catch (error) {
      if (error?.name !== 'TokenExpiredError') {
        console.error('Auth error:', error)
      }
      return res.status(401).json({ message: 'Unauthorized.' })
    }
  }

  const isOwnerOrAdmin = (doc, user) => {
    if (user?.isAdmin) {
      return true
    }
    const ownerId = doc?.createdBy?.id
    return ownerId && user?.id && ownerId.toString() === user.id.toString()
  }

  return {
    signToken,
    requireAuth,
    isOwnerOrAdmin,
    isAdminUser,
  }
}
