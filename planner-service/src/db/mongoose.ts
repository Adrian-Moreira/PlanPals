import mongoose from 'mongoose'
import config from '../config'

const mongoURI = config.database.connectionString || 'mongodb://localhost:27017'

/**
 * Connects to MongoDB using Mongoose.
 * @param {string} [uri] - The MongoDB connection URI. Defaults to the value of the
 *   `MONGO_URI` environment variable, or `'mongodb://localhost:27017'`.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * @throws {Error} If there is a problem connecting to MongoDB.
 */
export async function connectToMongoDB(uri: string = mongoURI): Promise<void> {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri)
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
    throw err
  }
}


/**
 * Closes the MongoDB connection.
 * If the connection is not already closed, it will be closed.
 * The function returns a Promise that resolves when the connection is closed.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export async function closeMongoConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
}
