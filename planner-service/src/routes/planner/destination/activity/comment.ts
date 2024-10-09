import express from 'express'
import {
  createComment,
  getCommentsByActivityId,
  getCommentById,
  updateComment,
  deleteComment,
} from '../../../../controllers/commentController'

export const commentRouter = express.Router({ mergeParams: true })

commentRouter.get('/', getCommentsByActivityId)
commentRouter.post('/', createComment)

commentRouter.get('/:commentId', getCommentById)
commentRouter.patch('/:commentId', updateComment)
commentRouter.delete('/:commentId', deleteComment)
