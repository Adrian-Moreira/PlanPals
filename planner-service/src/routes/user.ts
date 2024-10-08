import express from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsersByUserName,
  updateUser,
} from '../controllers/userController'

const userRouter = express.Router({ mergeParams: true })

userRouter.post('/', createUser)
userRouter.get('/search', getUsersByUserName)
userRouter.get('/:userId', getUserById)
userRouter.patch('/:userId', updateUser)
userRouter.delete('/:userId', deleteUser)

export default userRouter
