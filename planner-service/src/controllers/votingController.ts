import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  castVoteService,
  getVotesByActivityIdService,
} from '../services/votingService'

export const castVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId, userId, voteValue } = req.body
  try {
    const vote = await castVoteService({
      activityId,
      userId,
      voteValue,
    })
    res.status(StatusCodes.OK).json({ success: true, data: vote })
  } catch (error) {
    next(error)
  }
}

export const getVotesByActivityId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.query
  try {
    const votes = await getVotesByActivityIdService(activityId as string)
    res.status(StatusCodes.OK).json({ success: true, data: votes })
  } catch (error) {
    next(error)
  }
}
