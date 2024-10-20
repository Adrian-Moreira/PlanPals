import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'

import { ObjectIdSchema } from './Planner'
import { CommentModel } from './Comment'

const LocationMongoSchema = new Schema<Location>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },

    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

LocationMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const location = await this.model.findOne(query)

    if (location) {
      location.comments.forEach(async (c: { _id: any }) => {
        await CommentModel.findOneAndDelete({ _id: c._id })
      })
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})


export const LocationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  address: z.string().optional(),
})

export const ReadOnlyLocationSchema = LocationSchema.pick({
  name: true,
  address: true,
})

export const ImmutableLocationSchema = LocationSchema.omit({
  name: true,
  address: true,
  updatedAt: true,
})

export const LocationModel = mongoose.model<Location>(
  'Location',
  LocationMongoSchema,
)
export type Location = z.infer<typeof LocationSchema>
