import mongoose from 'mongoose'

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

const MessageThread =
  mongoose.models.MessageThread || mongoose.model('MessageThread', messageThreadSchema)

export default MessageThread
