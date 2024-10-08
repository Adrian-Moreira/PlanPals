import { Types } from 'mongoose'
import { ObjectIdSchema } from '../models/Planner'
import { UserSchema, UserModel } from '../models/User'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'

interface UserParams {
  userId?: string
  userName?: string
}

export async function createUser({ userName }: UserParams) {
  const newUser = {
    userName: userName,
  }

  UserSchema.pick({ userName: true }).parseAsync(newUser).catch(() => {
    throw new MalformedRequestException({ requestType: 'createUser', message: 'Invalid request data for creating a new user' })
  })

  const createdUser = await UserModel.create(
    UserSchema.pick({ userName: true }).parse(newUser),
  )

  return { data: createdUser }
}

export async function getUserById({ userId }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({ requestType: 'getUserById', message: 'Invalid user ID provided' })
  })
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId })
  } else {
    return { data: user }
  }
}

export async function getAllUsers() {
  const users = await UserModel.find()
  return { data: users }
}

export async function updateUser({ userId, userName }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({ requestType: 'updateUser', message: 'Invalid user ID provided for update' })
  })
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { userName: userName },
    { new: true },
  )
  if (!updatedUser) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId, message: `User with ID ${userId} not found for update` })
  }
  return { data: updatedUser }
}

export async function deleteUser({ userId }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({ requestType: 'deleteUser', message: 'Invalid user ID provided for deletion' })
  })
  const deletedUser = await UserModel.findByIdAndDelete(userId)
  if (!deletedUser) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId, message: `User with ID ${userId} not found for deletion` })
  }
  return { data: deletedUser }
}

export async function getUsersByUserName({ userName = 'null' }: UserParams) {
  const user = await UserModel.find({ userName: { $regex: new RegExp(userName, 'i') } })
  if (!user) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userName, message: `No users found with username ${userName}` })
  }
  return { data: user }
}