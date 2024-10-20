import express from 'express'
import CommentValidator from '../controllers/comment'

export const commentRouter = express.Router({ mergeParams: true })

commentRouter.get('/', CommentValidator.getCommentsByObjectId)
commentRouter.post('/', CommentValidator.newComment)

commentRouter.get('/:commentId', CommentValidator.getCommentById)
commentRouter.delete('/:commentId', CommentValidator.removeComment)
