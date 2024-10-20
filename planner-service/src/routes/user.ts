import express from 'express'
import UserValidator from '../controllers/user'
import UserService from '../services/user'
import RequestUtils from '../utils/RequestUtils'
import { User } from '../models/User'

const userRouter = express.Router({ mergeParams: true })

userRouter.post(
  '/',
  UserValidator.createUser,
  UserService.createUserDocument,
  RequestUtils.mkSuccessResponse<User>,
  RequestUtils.mkErrorResponse,
)
userRouter.get(
  '/search',
  UserValidator.getUserByUserName,
  UserService.getUserDocumentByName,
  RequestUtils.mkSuccessResponse<User>,
  RequestUtils.mkErrorResponse,
)
userRouter.get(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.userId,
  UserService.getUserDocumentById,
  RequestUtils.mkSuccessResponse<User>,
  RequestUtils.mkErrorResponse,
)
userRouter.patch(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.updateUser,
  UserService.updateUserDocument,
  RequestUtils.mkSuccessResponse<User>,
  RequestUtils.mkErrorResponse,
)
userRouter.delete(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.userId,
  UserService.deleteUserDocument,
  RequestUtils.mkSuccessResponse<User>,
  RequestUtils.mkErrorResponse,
)

export default userRouter
