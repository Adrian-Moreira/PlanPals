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
  const { objectId, type, targetUser } = req.body.out
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
  if (!existingVotes.upVotes.includes(targetUser._id)) {
    existingVotes.upVotes.push(targetUser._id)
  }
  if (existingVotes.downVotes.includes(targetUser._id)) {
    existingVotes.downVotes = existingVotes.downVotes.filter(
      (id) => id != targetUser._id.toString(),
    )
  }
  existingVotes = await VoteModel.findOneAndUpdate(
    { _id: existingVotes._id },
    existingVotes,
    { new: true },
  )

  req.body.result = existingVotes
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
  const { objectId, type, targetUser } = req.body.out
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
  if (!existingVotes.downVotes.includes(targetUser._id)) {
    existingVotes.downVotes.push(targetUser._id)
  }
  if (existingVotes.upVotes.includes(targetUser._id)) {
    existingVotes.upVotes = existingVotes.upVotes.filter(
      (id) => id != targetUser._id.toString(),
    )
  }
  existingVotes = await VoteModel.findOneAndUpdate(
    { _id: existingVotes._id },
    existingVotes,
    { new: true },
  )

  req.body.result = existingVotes
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Removes a vote from an object in the planner with the given objectId and type.
 *
 * If the given user has already downvoted the object, this endpoint will remove
 * the downvote. If the user has upvoted the object, this endpoint will remove the
 * upvote.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
const removeVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, targetUser } = req.body.out
  let existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    const err = new RecordNotFoundException({
      recordType: 'Vote',
      recordId: `${type}: ${objectId}, User: ${targetUser._id}`,
    })
    req.body.err = err
    next(err)
  } else {
    if (existingVotes.upVotes.includes(targetUser._id)) {
      existingVotes.upVotes = existingVotes.upVotes.filter(
        (id) => id != targetUser._id.toString(),
      )
    }
    if (existingVotes.downVotes.includes(targetUser._id)) {
      existingVotes.downVotes = existingVotes.downVotes.filter(
        (id) => id != targetUser._id.toString(),
      )
    }
    existingVotes = await VoteModel.findOneAndUpdate(
      { _id: existingVotes._id },
      existingVotes,
      { new: true },
    )
    req.body.result = existingVotes
    req.body.status = StatusCodes.OK
  }
  next()
}

/**
 * Retrieves the votes for an object in the planner with the given objectId and type.
 *
 * If the vote document does not exist, this endpoint will create a new vote document
 * with an empty array of upvotes and downvotes.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
const getVotesByObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId: oid, type } = req.body.out
  let existingVotes = await VoteModel.findOne({
    objectId: { id: oid, collection: type },
  })
  if (!existingVotes) {
    existingVotes = await VoteModel.create({
      objectId: { id: oid, collection: type },
      upVotes: [],
      downVotes: [],
    })
  }
  existingVotes.upVotes = existingVotes.upVotes.filter((vote) => vote !== null)
  existingVotes.downVotes = existingVotes.downVotes.filter(
    (vote) => vote !== null,
  )
  req.body.result = existingVotes
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Checks if a user has voted on an object in the planner with the given objectId and type.
 *
 * If the vote document does not exist, this endpoint will return a 404 error.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @returns {Promise<void>}
 *
 * @throws {RecordNotFoundException} If the vote document does not exist.
 */
const isUserVoted = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { objectId, type, targetUser } = req.body.out
  const existingVotes = await VoteModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!existingVotes) {
    req.body.err = new RecordNotFoundException({
      recordType: 'Vote',
      recordId: `${type}: ${objectId}, User: ${targetUser}`,
    })
    next(req.body.err)
  } else {
    const voteDoc = existingVotes
    const upVoted = voteDoc.upVotes.some(
      (id) => id == targetUser._id.toString(),
    )
    const downVoted = voteDoc.downVotes.some(
      (id) => id == targetUser._id.toString(),
    )
    req.body.result = { upVoted, downVoted }
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
