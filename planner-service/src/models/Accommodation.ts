import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const AccommodationMongoSchema = new Schema<Accommodation>(
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

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
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

    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
  },
  {
    timestamps: true,
  }
)

export const AccommodationSchema = z.object({
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

export const AccommodationModel = mongoose.model<Accommodation>('Accommodation', AccommodationMongoSchema)
export type Accommodation = z.infer<typeof AccommodationSchema>
