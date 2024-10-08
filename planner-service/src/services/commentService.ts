import { CommentModel } from '../models/Comment'

export async function createCommentService({
  activityId,
  userId,
  comment,
}: any): Promise<any> {
  const commentDocument = await CommentModel.create({
    activityId,
    userId,
    title: comment.title,
    content: comment.content,
  })
  return commentDocument
}

export async function updateCommentService({
  commentId,
  comment,
}: any): Promise<any> {
  const commentDocument = await CommentModel.findOneAndUpdate(
    { _id: commentId },
    comment,
  )
  return commentDocument
}

export async function getCommentByIdService(commentId: string): Promise<any> {
  const commentDocument = await CommentModel.findOne({ _id: commentId })
  return commentDocument
}

export async function deleteCommentService(commentId: string): Promise<any> {
  const commentDocument = await CommentModel.findOneAndDelete({
    _id: commentId,
  })
  return commentDocument
}

export async function getCommentsByActivityIdService(
  activityId: string,
): Promise<any> {
  const comments = await CommentModel.find({ activityId })
  return comments
}
