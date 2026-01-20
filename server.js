import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

export const app = express()
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!mongoUri) {
  console.warn('Missing MONGODB_URI in environment variables.')
}

if (!jwtSecret) {
  console.warn('Missing JWT_SECRET in environment variables.')
}

app.use(cors())
app.use(express.json())

const connectToDatabase = async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
  }
  if (mongoose.connection.readyState === 1) {
    return
  }
  await mongoose.connect(mongoUri)
}

app.use(async (req, res, next) => {
  try {
    await connectToDatabase()
    next()
  } catch (error) {
    console.error('MongoDB connection error:', error)
    res.status(500).json({ message: 'Database connection failed.' })
  }
})

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

const resultSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    submittedAt: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    answers: { type: [mongoose.Schema.Types.Mixed], default: [] },
    candidateEmail: { type: String, default: 'anonymous' },
    candidateName: { type: String, default: 'Candidate' },
    status: { type: String, default: 'submitted' },
  },
  { _id: false },
)

const vacancySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    createdBy: {
      id: { type: String },
      email: { type: String },
    },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Not specified' },
    salary: { type: String, default: 'Not specified' },
    description: { type: String, default: '' },
    testMode: { type: String, default: 'ai' },
    questionSets: { type: [[mongoose.Schema.Types.Mixed]], default: [] },
    status: { type: String, default: 'open' },
    tryAgain: { type: Boolean, default: false },
    minScore: { type: Number, default: 0 },
    testResults: { type: [resultSchema], default: [] },
  },
  { timestamps: true },
)

const Vacancy = mongoose.model('Vacancy', vacancySchema)

const cvSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fileName: { type: String, default: 'No file uploaded' },
    createdBy: {
      id: { type: String },
      email: { type: String },
    },
    summary: { type: String, default: '' },
    personalInfo: { type: String, default: '' },
    workExperience: { type: String, default: '' },
    education: { type: String, default: '' },
    languages: { type: String, default: '' },
    skills: { type: String, default: '' },
    certificates: { type: String, default: '' },
    trainings: { type: String, default: '' },
    socialNetworks: { type: String, default: '' },
  },
  { timestamps: true },
)

const CvSubmission = mongoose.model('CvSubmission', cvSchema)

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: String, required: true },
  },
  { _id: false },
)

const messageThreadSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    companyEmail: { type: String, required: true, lowercase: true, trim: true },
    candidateEmail: { type: String, required: true, lowercase: true, trim: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
)

messageThreadSchema.index({ jobId: 1, candidateEmail: 1 }, { unique: true })

const MessageThread = mongoose.model('MessageThread', messageThreadSchema)

const signToken = (user) => {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured.')
  }
  return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })
}

const adminEmail = (process.env.ADMIN_EMAIL || 'dtbkyroxxx@gmail.com').toLowerCase()

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

const isAdminUser = (user) => user?.email?.toLowerCase() === adminEmail

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
    console.error('Auth error:', error)
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

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

    const { createdBy, ...updatePayload } = req.body || {}
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

    const existing = await MessageThread.findOne({ jobId, candidateEmail: normalizedCandidate })
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
      const existing = await MessageThread.findOne({ jobId, candidateEmail: req.body.candidateEmail?.toLowerCase() })
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

    thread.messages.unshift({
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

if (!process.env.VERCEL) {
  connectToDatabase()
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
export default app;
