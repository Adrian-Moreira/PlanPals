import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'
import { ObjectIdSchema } from './Planner'

const VoteMongoSchema = new Schema<Vote>(
  {
    objectId: {
      id: { type: Schema.Types.ObjectId, required: true },
      collection: { type: String, required: true },
    },
    upVotes: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'User',
    },
    downVotes: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'User',
    },
  },
  {
    _id: false,
    timestamps: false,
  },
)

export const VoteSchema = z.object({
  objectId: z.object({ id: ObjectIdSchema, collection: z.string() }),
  upVotes: z.array(ObjectIdSchema),
  downVotes: z.array(ObjectIdSchema),
})

export const VoteModel = mongoose.model<Vote>('Vote', VoteMongoSchema)
export type Vote = z.infer<typeof VoteSchema>
