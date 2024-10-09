import { z } from 'zod'
import { ObjectIdSchema, PlannerModel } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { ActivityModel } from './Activity'
import { AccommodationModel } from './Accommodation'
import { CommentModel } from './Comment'

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

DestinationMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const destination = await this.model.findOne(query)

    if (destination) {
      await PlannerModel.findByIdAndUpdate(
        { _id: destination.plannerId },
        { $pull: { destinations: destination._id } },
      )
      destination.activities.forEach(async (a: { _id: any }) => {
        await ActivityModel.findOneAndDelete({ _id: a._id })
      })
      destination.accommodations.forEach(async (a: { _id: any }) => {
        await AccommodationModel.findOneAndDelete({ _id: a._id })
      })
      destination.comments.forEach(async (c: { _id: any }) => {
        await CommentModel.findOneAndDelete({ _id: c._id })
      })
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

export const DestinationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime().or(z.date()),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime().or(z.date()),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

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
