import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { DestinationModel } from './Destination'
import { CommentsModel } from './Comment'
import { VoteModel } from './Vote'

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

    name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
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

export const ActivitySchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),

  name: z.string(),
  location: z.string().optional(),
  duration: z.number().optional(),
  done: z.boolean(),

  destinationId: ObjectIdSchema,
})

ActivityMongoSchema.pre('findOneAndDelete', async function (next) {
  const activityId = this.getQuery()['_id']
  const destinationId = this.getQuery()['destinationId']
  const activityObjectId = {
    objectId: { id: activityId, collection: 'Activity' },
  }

  try {
    await DestinationModel.findOneAndUpdate(
      { _id: destinationId },
      {
        $pull: {
          activities: activityId,
        },
      },
      { new: true },
    )

    await CommentsModel.findOneAndDelete(activityObjectId)
    await VoteModel.findOneAndDelete(activityObjectId)
  } catch (err: any) {
    next(err)
  }

  next()
})

export const ActivityModel = mongoose.model<Activity>(
  'Activity',
  ActivityMongoSchema,
)

export type Activity = z.infer<typeof ActivitySchema>
