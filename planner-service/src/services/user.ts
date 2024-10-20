import { Types } from 'mongoose'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { BasicUser, User, UserModel } from '../models/User'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

/**
 * Creates a new user document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If the user already exists.
 */
const createUserDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const newUser: BasicUser = req.body.data as BasicUser
  const userCreated = await UserModel.create(newUser).catch(() => {
    req.body.err = new RecordConflictException({
      requestType: 'createUser',
      conflict: 'User already exists',
    })
    next(req.body.err)
  })
  req.body.data = userCreated
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Updates an existing user document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If the user already exists.
 */
const updateUserDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const updatedUser = req.body.data as {
    userId: Types.ObjectId
    userName: string
    preferredName: string
  }
  const userUpdated = await UserModel.findOneAndUpdate(
    { _id: updatedUser.userId },
    {
      userName: updatedUser.userName,
      preferredName: updatedUser.preferredName,
    },
    {
      new: true,
    },
  ).catch((err) => {
    req.body.err = new RecordConflictException({
      requestType: 'updateUser',
      conflict:
        'User with name ' +
        updatedUser.userName +
        ' already exists ' +
        err.message,
    })
    next(req.body.err)
  })
  if (!userUpdated) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: updatedUser.userId.toString(),
    })
    next(req.body.err)
  } else {
    req.body.data = userUpdated
    req.body.status = StatusCodes.OK
  }
  next()
}

/**
 * Deletes an existing user document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 */
const deleteUserDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId }: { userId: Types.ObjectId } = req.body.data
  const userDeleted = await UserModel.findOneAndDelete({ _id: userId })
  if (!userDeleted) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: userId.toString(),
    })
    next(req.body.err)
  } else {
    req.body.data = userDeleted
    req.body.status = StatusCodes.OK
  }
  next()
}

/**
 * Retrieves an existing user document from the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 */
const getUserDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId }: { userId: Types.ObjectId } = req.body.data
  const user = await UserModel.findOne({ _id: userId })
  if (!user) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: userId.toString(),
    })
    next(req.body.err)
  } else {
    req.body.data = user
    req.body.status = StatusCodes.OK
  }
  next()
}

/**
 * Retrieves an existing user document from the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 */
const getUserDocumentByName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userName }: { userName: string } = req.body.data
  const user = await UserModel.findOne({ userName })
  if (!user) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: userName,
    })
    next(req.body.err)
  } else {
    req.body.data = user
    req.body.status = StatusCodes.OK
  }
  next()
}

const UserService = {
  createUserDocument,
  updateUserDocument,
  deleteUserDocument,
  getUserDocumentById,
  getUserDocumentByName,
}
export default UserService
