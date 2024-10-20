import { NextFunction, Request, Response } from 'express'
import { VoteModel } from '../models/Vote'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { StatusCodes } from 'http-status-codes'

/**
 * Upvotes an object in the planner with the given objectId and type.
 *
 * If the given user has already upvoted the object, this endpoint will return
 * the existing vote document. If the user has downvoted the object, this endpoint
 * will remove the downvote and add the upvote.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
const upVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, userId } = req.body.data
  let existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    existingVotes = await VoteModel.create({
      objectId: { id: objectId, collection: type },
      upVotes: [],
      downVotes: [],
    })
  }
  if (!existingVotes.upVotes.includes(userId)) {
    existingVotes.upVotes.push(userId)
  }
  if (existingVotes.downVotes.includes(userId)) {
    existingVotes.downVotes = existingVotes.downVotes.filter(
      (vote) => !vote.equals(userId),
    )
  }
  await existingVotes.save()
  req.body.data = existingVotes
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Downvotes an object in the planner with the given objectId and type.
 *
 * If the given user has already downvoted the object, this endpoint will return
 * the existing vote document. If the user has upvoted the object, this endpoint
 * will remove the upvote and add the downvote.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
const downVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, userId } = req.body.data
  let existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    existingVotes = await VoteModel.create({
      objectId: { id: objectId, collection: type },
      upVotes: [],
      downVotes: [],
    })
  }
  if (!existingVotes.downVotes.includes(userId)) {
    existingVotes.downVotes.push(userId)
  }
  if (existingVotes.upVotes.includes(userId)) {
    existingVotes.upVotes = existingVotes.upVotes.filter(
      (vote) => !vote.equals(userId),
    )
  }
  await existingVotes.save()
  req.body.data = existingVotes
  req.body.status = StatusCodes.OK
  next()
}

const removeVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, userId } = req.body.data
  let existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    const err = new RecordNotFoundException({
      recordType: 'Vote',
      recordId: `${type}: ${objectId}, User: ${userId}`,
    })
    req.body.err = err
    next(err)
  } else {
    if (existingVotes.upVotes.includes(userId)) {
      existingVotes.upVotes = existingVotes.upVotes.filter(
        (vote) => !vote.equals(userId),
      )
    }
    if (existingVotes.downVotes.includes(userId)) {
      existingVotes.downVotes = existingVotes.downVotes.filter(
        (vote) => !vote.equals(userId),
      )
    }
    await existingVotes.save()
    req.body.data = existingVotes
    req.body.status = StatusCodes.OK
  }
  next()
}

const getVotesByObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type } = req.body.data
  let existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    existingVotes = await VoteModel.create({
      objectId: { id: objectId, collection: type },
      upVotes: [],
      downVotes: [],
    })
  }
  req.body.data = existingVotes
  req.body.status = StatusCodes.OK
  next()
}

const isUserVoted = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, userId } = req.body.data
  const existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    req.body.err = new RecordNotFoundException({
      recordType: 'Vote',
      recordId: `${type}: ${objectId}, User: ${userId}`,
    })
    next(req.body.err)
  } else {
    const voteDoc = await existingVotes.populate(['upVotes', 'downVotes'])
    const upVoted = voteDoc.upVotes.some((id) => id.equals(userId))
    const downVoted = voteDoc.downVotes.some((id) => id.equals(userId))
    req.body.data = { upVoted, downVoted }
    req.body.status = StatusCodes.OK
  }
  next()
}

const VoteService = {
  upVote,
  downVote,
  removeVote,
  getVotesByObjectId,
  isUserVoted,
}
export default VoteService
