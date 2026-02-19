import mongoose from 'mongoose'

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

const Vacancy = mongoose.models.Vacancy || mongoose.model('Vacancy', vacancySchema)

export default Vacancy
