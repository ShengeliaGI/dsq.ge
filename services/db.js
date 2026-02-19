import mongoose from 'mongoose'

export const connectToDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured.')
  }
  if (mongoose.connection.readyState === 1) {
    return
  }
  await mongoose.connect(mongoUri)
}
