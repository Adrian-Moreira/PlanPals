import express from 'express'
import CommentValidator from '../controllers/comment'
import CommentService from '../services/comment'
import UserService from '../services/user'
import RequestUtils from '../utils/RequestUtils'

export const commentRouter = express.Router({ mergeParams: true })

commentRouter.get(
  '/',
  CommentValidator.getCommentsByObjectId,
  RequestUtils.verifyObjectExistInCollection,
  CommentService.findOrCreateCommentsDocument,
  CommentService.getCommentsByObjectId,
)
commentRouter.post(
  '/',
  CommentValidator.newComment,
  UserService.verifyUserExists,
  RequestUtils.verifyObjectExistInCollection,
  CommentService.findOrCreateCommentsDocument,
  CommentService.createCommentDocument,
)
commentRouter.get(
  '/:commentId([0-9a-fA-F]{24})',
  CommentValidator.getCommentById,
  CommentService.getCommentById,
)
commentRouter.delete(
  '/:commentId([0-9a-fA-F]{24})',
  CommentValidator.removeComment,
  UserService.verifyUserExists,
  RequestUtils.verifyObjectExistInCollection,
  CommentService.findOrCreateCommentsDocument,
  CommentService.removeCommentDocument,
)
