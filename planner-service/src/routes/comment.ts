import express from 'express'
import CommentValidator from '../controllers/comment'
import CommentService from '../services/comment'
import RequestUtils from '../utils/RequestUtils'

export const commentRouter = express.Router({ mergeParams: true })

commentRouter.get(
  '/',
  CommentValidator.getCommentsByObjectId,
  CommentService.findOrCreateCommentsDocument,
  CommentService.getCommentsByObjectId,
  RequestUtils.mkSuccessResponse<Comment[]>,
  RequestUtils.mkErrorResponse,
)
commentRouter.post(
  '/',
  CommentValidator.newComment,
  CommentService.findOrCreateCommentsDocument,
  CommentService.createCommentDocument,
  RequestUtils.mkSuccessResponse<Comment>,
  RequestUtils.mkErrorResponse,
)
commentRouter.get(
  '/:commentId',
  CommentValidator.getCommentById,
  CommentService.getCommentById,
  RequestUtils.mkSuccessResponse<Comment>,
  RequestUtils.mkErrorResponse,
)
commentRouter.delete(
  '/:commentId',
  CommentValidator.removeComment,
  CommentService.findOrCreateCommentsDocument,
  CommentService.removeCommentDocument,
  RequestUtils.mkSuccessResponse<Comment>,
  RequestUtils.mkErrorResponse,
)
