import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const TransportMongoSchema = new Schema<Transport>(
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

    modeOfTransport: {
      type: String,
      required: true,
    },

    vehicleID: {
      type: String,
    },
  },
  { timestamps: true }
)

export const TransportSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  modeOfTransport: z.string(),
  vehicleID: z.string().optional(),
})

export const TransportModel = mongoose.model<Transport>('Transport', TransportMongoSchema)
export type Transport = z.infer<typeof TransportSchema>
