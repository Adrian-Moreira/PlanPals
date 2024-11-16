import { NextFunction, Request, Response } from 'express'
import { CommentCollection, CommentModel, CommentsModel } from '../models/Comment'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { StatusCodes } from 'http-status-codes'

/**
 * Retrieves the comments document for the given object id and type.
 * If the comments document does not exist, this endpoint will create a new comments document
 * with an empty array of comments.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
export async function findOrCreateCommentsDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { type, objectId } = req.body.out
  let commentsDocument = await CommentsModel.findOne({
    objectId: { id: objectId, collection: type },
  })
  if (!commentsDocument) {
    commentsDocument = await CommentsModel.create({
      objectId: { id: objectId, collection: type },
      comments: [],
    })
  }
  req.body.out = { ...req.body.out, commentsDocument }
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Creates a new comment document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the comments document does not exist.
 */
const createCommentDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetUser, title, content, commentsDocument } = req.body.out
  const commentDocument = await CommentModel.create({
    createdBy: targetUser._id,
    title,
    content,
  })

  if (!commentsDocument.comments.includes(commentDocument._id)) {
    commentsDocument.comments.push(commentDocument._id)
  }
  await CommentsModel.findOneAndUpdate({ _id: commentsDocument._id }, commentsDocument, { new: true })

  req.body.result = commentDocument
  req.body.addon = [commentsDocument]
  req.body.dataType = CommentCollection
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Deletes a comment document from the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the comments document does not exist.
 * @throws {RecordNotFoundException} If the comment document does not exist.
 * @throws {RecordNotFoundException} If the user does not own the comment.
 */
const removeCommentDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { commentId, targetUser, commentsDocument } = req.body.out

  const targetComment = await CommentModel.findOne({ _id: commentId })

  if (!targetComment) {
    req.body.err = new RecordNotFoundException({
      recordType: 'comment',
      recordId: commentId,
    })
    next(req.body.err)
  }
  if (targetComment?.createdBy.toString() != targetUser._id.toString()) {
    req.body.err = new RecordNotFoundException({
      recordType: 'comment',
      recordId: commentId,
    })
    next(req.body.err)
  }

  req.body.result = await CommentModel.findOneAndDelete({ _id: commentId })
  req.body.status = StatusCodes.OK
  req.body.dataType = CommentCollection
  next()
}

/**
 * Retrieves the comments for an object in the planner with the given objectId and type.
 *
 * If the comments document does not exist, this endpoint will return a 404 error.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @returns {Promise<void>}
 *
 * @throws {RecordNotFoundException} If the comments document does not exist.
 */
const getCommentsByObjectId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { commentsDocument } = req.body.out
  const comments = commentsDocument.comments.map((cid: any) => CommentModel.findById(cid))
  req.body.result = await Promise.all(comments).then((results) => results.filter((comment) => comment !== null))
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves a single comment document by its ID.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the comment document does not exist.
 */
const getCommentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { commentId } = req.body.out
  const comment = await CommentModel.findById(commentId)
  if (!comment) {
    req.body.err = new RecordNotFoundException({
      recordType: 'comment',
      recordId: commentId,
    })
    next(req.body.err)
  }
  req.body.result = comment
  req.body.status = StatusCodes.OK
  next()
}

const CommentService = {
  findOrCreateCommentsDocument,
  createCommentDocument,
  removeCommentDocument,
  getCommentsByObjectId,
  getCommentById,
}

export default CommentService
