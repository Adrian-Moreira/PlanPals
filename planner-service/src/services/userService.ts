import { Types } from 'mongoose'
import { ObjectIdSchema } from '../models/Planner'
import { BasicUserSchema, UserModel } from '../models/User'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'

export async function createUserService(
  userName: string,
  preferredName: string,
): Promise<any> {
  const newUser = await BasicUserSchema.parseAsync({
    userName: userName as string,
    preferredName: preferredName as string,
  }).catch(() => {
    throw new MalformedRequestException({
      requestType: 'createUser',
      message: 'Invalid request data for creating a new user',
    })
  })

  if (await UserModel.exists({ userName: newUser.userName })) {
    throw new RecordConflictException({
      requestType: 'createUser',
      message: 'User already exists',
    })
  }
  const createdUser = await UserModel.create(newUser)

  return createdUser
}

export async function getUserByIdService(userId: string): Promise<any> {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId as string)).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getUserById',
      message: 'Invalid user ID provided',
    })
  })

  const user = await UserModel.findById(userId)
  if (!user) {
    throw new RecordNotFoundException({ recordType: 'User', recordId: userId })
  }

  return user
}

export async function updateUserService(
  userId: string,
  userName: string,
  preferredName: string,
): Promise<any> {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId as string)).catch(() => {
    throw new MalformedRequestException({
      requestType: 'updateUser',
      message: 'Invalid user ID provided for update',
    })
  })
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { userName: userName, preferredName: preferredName },
    { new: true },
  )
  if (!updatedUser) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userId,
      message: `User with ID ${userId} not found for update`,
    })
  }
  return updatedUser
}

export async function deleteUserService(userId: string): Promise<any> {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId)).catch(() => {
    throw new MalformedRequestException({
      requestType: 'deleteUser',
      message: 'Invalid user ID provided for deletion',
    })
  })
  const user = await UserModel.findByIdAndDelete(userId)
  if (!user) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userId,
    })
  }
  return user
}
export async function getUsersByUserNameService(
  userName: string,
): Promise<any> {
  const user = await UserModel.findOne({ userName })
  if (!user) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userName,
    })
  }
  return user
}
