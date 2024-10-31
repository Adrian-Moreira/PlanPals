import { z } from 'zod'
import { ObjectIdSchema, PlannerModel } from './Planner'
import mongoose, { Schema, Types } from 'mongoose'
import { ActivityModel } from './Activity'
import { AccommodationModel } from './Accommodation'
import { VoteModel } from './Vote'
import { CommentModel, CommentsModel } from './Comment'

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

DestinationMongoSchema.pre('findOneAndDelete', async function (next) {
  const destinationId = this.getQuery()['_id']
  const plannerId = this.getQuery()['plannerId']
  const destinationObjectId = {
    objectId: { id: destinationId, collection: 'Destination' },
  }

  try {
    const destination = await DestinationModel.findOne({
      _id: destinationId,
    })

    await PlannerModel.findOneAndUpdate(
      { _id: plannerId },
      { $pull: { destinations: destinationId } },
      { new: true },
    )

    await Promise.all(
      destination!.activities.map((id: Types.ObjectId) =>
        ActivityModel.findOneAndDelete({ _id: id }),
      ),
    )

    await Promise.all(
      destination!.accommodations.map((id: Types.ObjectId) =>
        AccommodationModel.findOneAndDelete({ _id: id }),
      ),
    )

    await CommentsModel.findOneAndDelete(destinationObjectId)
    await VoteModel.findOneAndDelete(destinationObjectId)
  } catch (err: any) {
    next(err)
  }

  next()
})

export type Destination = z.infer<typeof DestinationSchema>
