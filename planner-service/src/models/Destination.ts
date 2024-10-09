import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const DestinationMongoSchema = new Schema<Destination>(
  {
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

    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },

    name: {
      type: String,
      required: true,
    },

    activities: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Activity',
    },

    accommodation: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Accommodation',
    },
  },
  { _id: true, timestamps: true }
)

export const DestinationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  activities: z.array(ObjectIdSchema),
  accommodation:ObjectIdSchema,
})

export const DestinationModel = mongoose.model<Destination>('Destination', DestinationMongoSchema)
export type Destination = z.infer<typeof DestinationSchema>
