import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const VoteMongoSchema = new Schema<Vote>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const VoteSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  location: ObjectIdSchema.optional(),
})

export const VoteModel = mongoose.model<Vote>(
  'Vote',
  VoteMongoSchema,
)
export type Vote = z.infer<typeof VoteSchema>
