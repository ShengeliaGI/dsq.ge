import mongoose from 'mongoose'

const cvSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    fileName: { type: String, default: 'No file uploaded' },
    profileImage: { type: String, default: '' },
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

const CvSubmission =
  mongoose.models.CvSubmission || mongoose.model('CvSubmission', cvSchema)

export default CvSubmission
