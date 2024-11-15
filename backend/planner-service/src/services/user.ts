import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { BasicUser, UserCollection, UserModel } from '../models/User'

const verifyUserExists = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let { userId, createdBy }: { userId: any; createdBy: any } = req.body.out
  userId ||= createdBy // Assuming either userId or createdBy is provided

  const user = await UserModel.findOne({ _id: userId })

  if (!user) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: userId.toString(),
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, targetUser: user }
  }
  next()
}

/**
 * Creates a new user document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If the user already exists.
 */
const createUserDocument = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const newUser: BasicUser = req.body.out as BasicUser
  const userCreated = await UserModel.create(newUser).catch((err) => {
    req.body.err = new RecordConflictException({
      requestType: 'createUser',
      conflict: 'User already exists',
    })
    next(req.body.err)
  })
  req.body.result = userCreated
  req.body.dataType = UserCollection
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
const updateUserDocument = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { targetUser, userName, preferredName } = req.body.out

  targetUser.userName = userName || targetUser.userName
  targetUser.preferredName = preferredName || targetUser.preferredName

  const userUpdated = await UserModel.findOneAndUpdate({ _id: targetUser._id }, targetUser, {
    new: true,
  }).catch((err) => {
    req.body.err = new RecordConflictException({
      requestType: 'updateUser',
      conflict: 'User with name ' + userName + ' already exists ' + err.message,
    })
    next(req.body.err)
  })

  if (!userUpdated) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: targetUser._id.toString(),
    })
    next(req.body.err)
  }

  req.body.result = userUpdated
  req.body.dataType = UserCollection
  req.body.status = StatusCodes.OK

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
const deleteUserDocument = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { targetUser } = req.body.out
  const userDeleted = await UserModel.findOneAndDelete({ _id: targetUser._id })

  req.body.result = userDeleted
  req.body.dataType = UserCollection
  req.body.status = StatusCodes.OK

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
const getUserDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { targetUser } = req.body.out
  req.body.result = targetUser
  req.body.status = StatusCodes.OK
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
const getUserDocumentByName = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userName }: { userName: string } = req.body.out
  const user = await UserModel.findOne({ userName })
  if (!user) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
      recordId: userName,
    })
    next(req.body.err)
  } else {
    req.body.result = user
    req.body.status = StatusCodes.OK
  }
  next()
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const users = await UserModel.find().lean()
  if (!users || users.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'User',
    })
    next(req.body.err)
  } else {
    req.body.result = users
    req.body.status = StatusCodes.OK
  }
  next()
}

const UserService = {
  verifyUserExists,
  createUserDocument,
  updateUserDocument,
  deleteUserDocument,
  getUserDocumentById,
  getUserDocumentByName,
  getAllUsers,
}
export default UserService
