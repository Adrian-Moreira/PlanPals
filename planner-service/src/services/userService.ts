import { Types } from 'mongoose'
import { ObjectIdSchema } from '../models/Planner'
import { BasicUserSchema, UserModel, UserSchema } from '../models/User'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'

export const createUserService = async ({
  userName,
  preferredName,
}: any): Promise<any> => {
  const newUser = await BasicUserSchema.parseAsync({
    userName: userName as string,
    preferredName: preferredName as string,
  }).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'createUser',
      requestBody: 'Invalid request data for creating a new user ' + err.message,
    })
  })

  if (await UserModel.exists({ userName: newUser.userName })) {
    throw new RecordConflictException({
      requestType: 'createUser',
      conflict: 'User already exists',
    })
  }

  const user = await UserModel.create(newUser)
  return await UserSchema.omit({}).parseAsync(user)
}

export const getUserByIdService = async ({ userId }: any): Promise<any> => {
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

  return await UserSchema.omit({}).parseAsync(user)
}

export const updateUserService = async ({
  userId,
  userName,
  preferredName,
}: any): Promise<any> => {
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
  ).catch(() => {
    throw new RecordConflictException({
      requestType: 'updateUser',
      conflict: 'User with name ' + userName + ' already exists',
    })
  })
  if (!updatedUser) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userId,
      message: `User with ID ${userId} not found for update`,
    })
  }
  return await UserSchema.omit({}).parseAsync(updatedUser)
}

export const deleteUserService = async ({ userId }: any): Promise<any> => {
  ObjectIdSchema.parseAsync(new Types.ObjectId(userId as string)).catch(() => {
    throw new MalformedRequestException({
      requestType: 'deleteUser',
      requestBody: `Invalid user ID provided for deletion ${userId}`,
    })
  })
  const user = await UserModel.findByIdAndDelete(userId)
  if (!user) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userId,
    })
  }
  return await UserSchema.omit({}).parseAsync(user)
}
export const getUsersByUserNameService = async ({
  userName,
}: any): Promise<any> => {
  UserSchema.pick({ userName: true })
    .parseAsync({ userName })
    .catch(() => {
      throw new MalformedRequestException({
        requestType: 'getUsersByUserName',
        requestBody: `Invalid user name provided ${userName}`,
      })
    })
  const user = await UserModel.findOne({ userName })
  if (!user) {
    throw new RecordNotFoundException({
      recordType: 'User',
      recordId: userName,
    })
  }
  return await UserSchema.omit({}).parseAsync(user)
}
