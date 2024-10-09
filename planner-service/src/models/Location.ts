import { z } from 'zod'
import mongoose, { Schema } from 'mongoose'

import { ObjectIdSchema} from './Planner'

const LocationMongoSchema = new Schema<Location>(
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

    plannerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Planner',
    },
  },
  {
    timestamps: true,
  }
)

export const LocationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  address: z.string().optional(),

  plannerId: ObjectIdSchema,
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

export const LocationModel = mongoose.model<Location>('Location', LocationMongoSchema)
export type Location = z.infer<typeof LocationSchema>
export type ReadOnlyLocation = z.infer<typeof ReadOnlyLocationSchema>
export type ImmutableLocation = z.infer<typeof ImmutableLocationSchema>
