import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createCommentService,
  getCommentByIdService,
  updateCommentService,
  deleteCommentService,
  getCommentsByActivityIdService,
} from '../services/commentService'

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId, userId, content } = req.body
  try {
    const comment = await createCommentService({
      activityId,
      userId,
      content,
    })
    res.status(StatusCodes.CREATED).json({ success: true, data: comment })
  } catch (error) {
    next(error)
  }
}

export const getCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { commentId } = req.params
  try {
    const comment = await getCommentByIdService(commentId)
    res.status(StatusCodes.OK).json({ success: true, data: comment })
  } catch (error) {
    next(error)
  }
}

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { commentId } = req.params
  const { content } = req.body
  try {
    const updatedComment = await updateCommentService({
      commentId,
      content,
    })
    res.status(StatusCodes.OK).json({ success: true, data: updatedComment })
  } catch (error) {
    next(error)
  }
}

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { commentId } = req.params
  try {
    const deletedComment = await deleteCommentService(commentId)
    res.status(StatusCodes.OK).json({ success: true, data: deletedComment })
  } catch (error) {
    next(error)
  }
}

export const getCommentsByActivityId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.query
  try {
    const comments = await getCommentsByActivityIdService(activityId as string)
    res.status(StatusCodes.OK).json({ success: true, data: comments })
  } catch (error) {
    next(error)
  }
}
