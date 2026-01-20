import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express();
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!mongoUri) {
  console.warn('Missing MONGODB_URI in environment variables.')
}

if (!jwtSecret) {
  console.warn('Missing JWT_SECRET in environment variables.')
}

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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
    questions: { type: [String], default: [] },
    answers: { type: [String], default: [] },
    candidateEmail: { type: String, default: 'anonymous' },
    candidateName: { type: String, default: 'Candidate' },
  },
  { _id: false },
)

const vacancySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Not specified' },
    salary: { type: String, default: 'Not specified' },
    description: { type: String, default: '' },
    testMode: { type: String, default: 'ai' },
    questionSets: { type: [[String]], default: [] },
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
... (232 lines left)
Collapse
message.js
10 KB
[22:48]
Gio

:
import app from "../server.js";
export default app;
﻿
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express();
const port = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!mongoUri) {
  console.warn('Missing MONGODB_URI in environment variables.')
}

if (!jwtSecret) {
  console.warn('Missing JWT_SECRET in environment variables.')
}

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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
    questions: { type: [String], default: [] },
    answers: { type: [String], default: [] },
    candidateEmail: { type: String, default: 'anonymous' },
    candidateName: { type: String, default: 'Candidate' },
  },
  { _id: false },
)

const vacancySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, default: 'Not specified' },
    salary: { type: String, default: 'Not specified' },
    description: { type: String, default: '' },
    testMode: { type: String, default: 'ai' },
    questionSets: { type: [[String]], default: [] },
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

const signToken = (user) => {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured.')
  }
  return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' })
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

app.post('/api/vacancies', async (req, res) => {
  try {
    const vacancy = await Vacancy.create(req.body)
    res.status(201).json(vacancy)
  } catch (error) {
    console.error('Create vacancy error:', error)
    res.status(500).json({ message: 'Failed to create vacancy.' })
  }
})

app.patch('/api/vacancies/:id', async (req, res) => {
  try {
    const vacancy = await Vacancy.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true },
    )

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found.' })
    }

    return res.json(vacancy)
  } catch (error) {
    console.error('Update vacancy error:', error)
    return res.status(500).json({ message: 'Failed to update vacancy.' })
  }
})

app.patch('/api/vacancies/:id/results', async (req, res) => {
  try {
    const { result, status, tryAgain } = req.body
    const vacancy = await Vacancy.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          status: status ?? 'waiting',
          tryAgain: tryAgain ?? false,
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

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found.' })
    }

    return res.json(vacancy)
  } catch (error) {
    console.error('Append result error:', error)
    return res.status(500).json({ message: 'Failed to save results.' })
  }
})

app.delete('/api/vacancies/:id/results/:resultId', async (req, res) => {
  try {
    const vacancy = await Vacancy.findOneAndUpdate(
      { id: req.params.id },
      { $pull: { testResults: { id: req.params.resultId } } },
      { new: true },
    )

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found.' })
    }

    return res.json(vacancy)
  } catch (error) {
    console.error('Delete result error:', error)
    return res.status(500).json({ message: 'Failed to delete result.' })
  }
})

app.delete('/api/vacancies/:id', async (req, res) => {
  try {
    const vacancy = await Vacancy.findOneAndDelete({ id: req.params.id })
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found.' })
    }
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

app.post('/api/cvs', async (req, res) => {
  try {
    const cv = await CvSubmission.create(req.body)
    res.status(201).json(cv)
  } catch (error) {
    console.error('Create CV error:', error)
    res.status(500).json({ message: 'Failed to create CV.' })
  }
})

app.delete('/api/cvs/:id', async (req, res) => {
  try {
    const cv = await CvSubmission.findOneAndDelete({ id: req.params.id })
    if (!cv) {
      return res.status(404).json({ message: 'CV not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error('Delete CV error:', error)
    return res.status(500).json({ message: 'Failed to delete CV.' })
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
