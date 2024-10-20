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
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    objectId: {
      id: { type: Schema.Types.ObjectId, required: true },
      collection: { type: String, required: true },
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

export const CommentSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  createdBy: ObjectIdSchema,
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  objectId: z.object({ id: ObjectIdSchema, collection: z.string() }),
})

export const CommentModel = mongoose.model<Comment>(
  'Comment',
  CommentMongoSchema,
)

export type Comment = z.infer<typeof CommentSchema>
