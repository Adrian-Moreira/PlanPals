import mongoose, { Mongoose } from 'mongoose'
import config from '.'

export const mongoURI = config.database.connectionString || 'mongodb://localhost:27017'
export let db: Mongoose
/**
 * Connects to MongoDB using Mongoose.
 * @param {string} [uri] - The MongoDB connection URI. Defaults to the value of the
 *   `MONGO_URI` environment variable, or `'mongodb://localhost:27017'`.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 * @throws {Error} If there is a problem connecting to MongoDB.
 */
export async function connectToMongoDB(uri: string = mongoURI): Promise<Mongoose> {
  try {
    if (mongoose.connection.readyState === 0) {
      db = await mongoose.connect(uri)

      console.log('Connected to MongoDB')

      return db
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
    throw err
  }

  return db
}

/**
 * Closes the MongoDB connection.
 * If the connection is not already closed, it will be closed.
 * The function returns a Promise that resolves when the connection is closed.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export async function closeMongoConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await db.disconnect()
    await mongoose.connection.close()
  }
}
