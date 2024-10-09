import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'
import { ObjectIdSchema } from './Planner'

const CommentMongoSchema = new Schema<Comment>(
  {
    plannerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Planner',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

export const CommentSchema = z.object({
  _id: ObjectIdSchema,
  plannerId: ObjectIdSchema,
  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  votes: z.number().min(0).optional(),
})

export const CommentModel = mongoose.model<Comment>(
  'Comment',
  CommentMongoSchema,
)

export type Comment = z.infer<typeof CommentSchema>
