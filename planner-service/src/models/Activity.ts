import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { DestinationModel } from './Destination'
import { CommentModel } from './Comment'
import { LocationModel } from './Location'

const ActivityMongoSchema = new Schema<Activity>(
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

    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },

    name: {
      type: String,
      required: true,
    },

    locations: {
      type: [Schema.Types.ObjectId],
      ref: 'Location',
    },

    duration: {
      type: Number,
      required: true,
    },

    done: {
      type: Boolean,
      required: true,
    },

    destinationId: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
  },
  { _id: true, timestamps: true },
)

ActivityMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const activity = await this.model.findOne(query)

    if (activity) {
      await DestinationModel.findByIdAndUpdate(
        { _id: activity.destinationId },
        { $pull: { activities: activity._id } },
      )
      activity.locations.forEach(async (l: { _id: any }) => {
        await LocationModel.findOneAndDelete({ _id: l._id })
      })
      activity.comments.forEach(async (c: { _id: any }) => {
        await CommentModel.findOneAndDelete({ _id: c._id })
      })
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

export const ActivitySchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  locations: z.array(ObjectIdSchema).optional(),
  duration: z.number().optional(),
  done: z.boolean(),

  destinationId: ObjectIdSchema,
})

export const ActivityModel = mongoose.model<Activity>(
  'Activity',
  ActivityMongoSchema,
)
export type Activity = z.infer<typeof ActivitySchema>
