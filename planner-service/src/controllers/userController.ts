import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersByUserNameService,
  updateUserService,
} from '../services/userService'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userName, preferredName } = req.body
  try {
    const user = await createUserService(
      userName as string,
      preferredName as string,
    )
    res.status(StatusCodes.CREATED).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId } = req.params
  try {
    const user = await getUserByIdService(userId)
    res.status(StatusCodes.OK).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId } = req.params
  const { userName, preferredName } = req.body
  try {
    const updatedUser = await updateUserService(
      userId,
      userName as string,
      preferredName as string,
    )
    res.status(StatusCodes.OK).json({ success: true, data: updatedUser })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId } = req.params
  try {
    const deletedUser = await deleteUserService(userId)
    res.status(StatusCodes.OK).json({ success: true, data: deletedUser })
  } catch (error) {
    next(error)
  }
}

export const getUsersByUserName = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { userName } = req.query
    const user = await getUsersByUserNameService(userName as string)
    res.status(StatusCodes.OK).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
