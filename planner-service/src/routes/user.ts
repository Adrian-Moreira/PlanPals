import express, { NextFunction, Request, Response } from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsersByUserName,
  updateUser,
} from '../controllers/userController'
import { StatusCodes } from 'http-status-codes'

const userRouter = express.Router({ mergeParams: true })

userRouter.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName } =  req.query
    try {
      const result = await getUsersByUserName({ userName: userName as string })
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

userRouter.get(
  '/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getUserById({ userId: req.params.userId })
      console.log(result, 'LOOGGGGGGGGGGGED')
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

userRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.body
    try {
      const result = await createUser({ userName: userName })
      res.status(StatusCodes.CREATED).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

userRouter.patch(
  '/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await updateUser({
        userId: req.params.userId,
        userName: req.body.userName,
      })
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

userRouter.delete(
  '/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deleteUser({ userId: req.params.userId })
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

export default userRouter
