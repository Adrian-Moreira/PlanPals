import { z } from 'zod'
import { ObjectIdSchema, PlannerModel } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { ActivityModel } from './Activity'
import { AccommodationModel } from './Accommodation'

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
    name: {
      type: String,
      required: true,
    },
    activities: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Activity',
    },
    accommodations: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Accommodation',
    },
    plannerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Planner',
    },
  },
  { _id: true, timestamps: true },
)

export const DestinationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime().or(z.date()),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime().or(z.date()),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  name: z.string(),
  activities: z.array(ObjectIdSchema),
  accommodations: z.array(ObjectIdSchema),

  plannerId: ObjectIdSchema,
})

export const DestinationModel = mongoose.model<Destination>(
  'Destination',
  DestinationMongoSchema,
)
export type Destination = z.infer<typeof DestinationSchema>
