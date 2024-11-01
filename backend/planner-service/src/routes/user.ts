import express from 'express'
import UserValidator from '../controllers/user'
import UserService from '../services/user'

const userRouter = express.Router({ mergeParams: true })

userRouter.post('/', UserValidator.createUser, UserService.createUserDocument)

userRouter.get(
  '/search',
  UserValidator.getUserByUserName,
  UserService.getUserDocumentByName,
)
userRouter.get(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.userId,
  UserService.verifyUserExists,
  UserService.getUserDocumentById,
)
userRouter.patch(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.updateUser,
  UserService.verifyUserExists,
  UserService.updateUserDocument,
)
userRouter.delete(
  '/:userId([0-9a-fA-F]{24})',
  UserValidator.userId,
  UserService.verifyUserExists,
  UserService.deleteUserDocument,
)

export default userRouter
