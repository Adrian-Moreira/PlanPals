import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const CommentMongoSchema = new Schema<Comment>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },

    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    updatedAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },

    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const CommentSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  title: z.string(),
  content: z.string(),
})

export const CommentModel = mongoose.model<Comment>('Comment', CommentMongoSchema)
export type Comment = z.infer<typeof CommentSchema>
