import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { connectToMongoDB, closeMongoConnection } from '../src/db/mongoose'
import { UserModel, UserSchema } from '../src/models/User'

describe('Create user entry', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017'
    connectToMongoDB(mongoURI)
  })

  afterAll(async () => {
    await closeMongoConnection()
  })

  it('should insert jdoe into User collection', async () => {
    const mockUser = { userName: 'jdoe' }
    const insertedUser = await UserModel.create(
      UserSchema.pick({ userName: true }).parse(mockUser),
    )
    expect(insertedUser.userName).toEqual(mockUser.userName)
	expect(insertedUser._id).toBeDefined()
	expect(insertedUser.createdAt).toBeDefined()
	expect(insertedUser.updatedAt).toBeDefined()
  })
})
