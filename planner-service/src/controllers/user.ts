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
    throw new MalformedRequestException({ requestType: 'createUser' })
  })

  const createdUser = await UserModel.create(
    UserSchema.pick({ userName: true }).parse(newUser),
  )

  return { data: createdUser }
}

export async function getUserById({ userId }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
      throw new MalformedRequestException({ requestType: 'getUserById' })
  })
  const user = await UserModel.findById(userId)
  if (!user) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId })
  }
  return { data: user }
}

export async function getAllUsers() {
  const users = await UserModel.find()
  return { data: users }
}

export async function updateUser({ userId, userName }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({ requestType: 'updateUser' })
  })
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { userName: userName },
    { new: true },
  )
  if (!updatedUser) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId })
  }
  return { data: updatedUser }
}

export async function deleteUser({ userId }: UserParams) {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({ requestType: 'deleteUser' })
  })
  const deletedUser = await UserModel.findByIdAndDelete(userId)
  if (!deletedUser) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId })
  }
  return { data: deletedUser }
}

export async function getUsersByUserName({ userName }: UserParams) {
  const user = await UserModel.find({ userName: { $regex: new RegExp(userName || '', 'i') } })
  if (!user) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userName })
  }
  return { data: user }
}
