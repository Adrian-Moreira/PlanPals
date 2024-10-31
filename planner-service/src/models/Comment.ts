import { z } from 'zod'
import mongoose, { Schema, Types } from 'mongoose'
import { ObjectIdSchema } from './Planner'
import { VoteModel } from './Vote'

const CommentMongoSchema = new Schema<Comment>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

const CommentsMongoSchema = new Schema<Comments>(
  {
    objectId: {
      id: { type: Schema.Types.ObjectId, required: true },
      collection: { type: String, required: true },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },
  },
  {
    _id: true,
    timestamps: false,
  },
)

export const CommentSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  createdBy: ObjectIdSchema,
  content: z.string().min(1, 'Content is required'),
})

export const CommentsSchema = z.object({
  objectId: z.object({ id: ObjectIdSchema, collection: z.string() }),
  comments: z.array(ObjectIdSchema),
})

export const CommentModel = mongoose.model<Comment>(
  'Comment',
  CommentMongoSchema,
)

export const CommentsModel = mongoose.model<Comments>(
  'Comments',
  CommentsMongoSchema,
)

CommentsMongoSchema.pre('findOneAndDelete', async function (next) {
  const commentsId = this.getQuery()['objectId']

  try {
    const comments = await CommentsModel.findOne({
      _id: commentsId.id,
    })

    await Promise.all(
      comments!.comments.map(async (commentId: Types.ObjectId) => {
        await CommentModel.findOneAndDelete({ _id: commentId })
      }),
    )
  } catch (err: any) {
    next(err)
  }

  next()
})

CommentMongoSchema.pre('findOneAndDelete', async function (next) {
  const commentId = this.getQuery()['_id']
  const commentObjectId = {
    objectId: { id: commentId, collection: 'Comment' },
  }

  try {
    await CommentsModel.findOneAndDelete(commentObjectId)
    await VoteModel.findOneAndDelete(commentObjectId)
  } catch (err: any) {
    next(err)
  }
})

export type Comment = z.infer<typeof CommentSchema>

export type Comments = z.infer<typeof CommentsSchema>
