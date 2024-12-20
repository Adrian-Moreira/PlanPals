import mongoose, { Mongoose } from 'mongoose'
import config from '.'

export const mongoURI = config.database.connectionString || 'mongodb://localhost:27017'
let _db: Mongoose

/**
 * Connects to MongoDB using Mongoose.
 * @param {string} [uri] - The MongoDB connection URI. Defaults to the value of the
 *   `MONGO_URI` environment variable, or `'mongodb://localhost:27017'`.
 * @returns {void}
 * @throws {Error} If there is a problem connecting to MongoDB.
 */
export async function connectToMongoDB(uri: string = mongoURI): Promise<Mongoose> {
  try {
    if (mongoose.connection.readyState === 0) {
      _db = await mongoose.connect(uri)
      console.log('Connected to MongoDB')
      return _db
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err)
  }
  return _db
}

/**
 * Closes the MongoDB connection.
 * If the connection is not already closed, it will be closed.
 * The function returns a Promise that resolves when the connection is closed.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 */
export async function closeMongoConnection(db: Mongoose): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await db.disconnect()
    await db.connection.close()
  }
}
