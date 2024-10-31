import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'
import { ObjectIdSchema } from './Planner'

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

export type Comment = z.infer<typeof CommentSchema>

export type Comments = z.infer<typeof CommentsSchema>
