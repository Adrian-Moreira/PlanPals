import express from 'express'
import CommentValidator from '../controllers/comment'
import CommentService from '../services/comment'
import UserService from '../services/user'
import RequestUtils from '../utils/RequestUtils'
import { publishDeleteEvent, publishUpdateEvent } from '../services/rabbit'
import PlannerService from '../services/planner'

export const commentRouter = express.Router({ mergeParams: true })

commentRouter.get(
  '/',
  CommentValidator.getCommentsByObjectId,
  RequestUtils.verifyObjectExistInCollection,
  PlannerService.verifyPlannerExists,
  CommentService.findOrCreateCommentsDocument,
  CommentService.getCommentsByObjectId,
)
commentRouter.post(
  '/',
  CommentValidator.newComment,
  UserService.verifyUserExists,
  RequestUtils.verifyObjectExistInCollection,
  PlannerService.verifyPlannerExists,
  CommentService.findOrCreateCommentsDocument,
  CommentService.createCommentDocument,
  publishUpdateEvent,
)
commentRouter.get('/:commentId([0-9a-fA-F]{24})', CommentValidator.getCommentById, CommentService.getCommentById)
commentRouter.delete(
  '/:commentId([0-9a-fA-F]{24})',
  CommentValidator.removeComment,
  UserService.verifyUserExists,
  RequestUtils.verifyObjectExistInCollection,
  PlannerService.verifyPlannerExists,
  CommentService.findOrCreateCommentsDocument,
  CommentService.removeCommentDocument,
  publishDeleteEvent,
)
