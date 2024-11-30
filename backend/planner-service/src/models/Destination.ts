import { z } from 'zod'
import { ObjectIdSchema, PlannerModel } from './Planner'
import mongoose, { Schema, Types } from 'mongoose'
import { ActivityModel } from './Activity'
import { AccommodationModel } from './Accommodation'
import { VoteModel } from './Vote'
import { CommentsModel } from './Comment'

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
    lat: {
      type: Number,
    },
    lon: {
      type: Number,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
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

  lat: z.number().optional(),
  lon: z.number().optional(),
  country: z.string().optional(),
  state: z.string().optional(),

  plannerId: ObjectIdSchema,
})

DestinationMongoSchema.pre('findOneAndDelete', async function (next) {
  const destinationId = this.getQuery()['_id']
  const plannerId = this.getQuery()['plannerId']
  const destinationObjectId = {
    objectId: { id: destinationId, collection: 'Destination' },
  }

  try {
    await CommentsModel.findOneAndDelete(destinationObjectId)
    await VoteModel.findOneAndDelete(destinationObjectId)

    const destination = await DestinationModel.findOne({
      _id: destinationId,
    })

    await PlannerModel.findOneAndUpdate({ _id: plannerId }, { $pull: { destinations: destinationId } }, { new: true })
    await Promise.all(
      destination!.activities.map(async (id: Types.ObjectId) => await ActivityModel.findOneAndDelete({ _id: id })),
    )

    await Promise.all(
      destination!.accommodations.map(
        async (id: Types.ObjectId) => await AccommodationModel.findOneAndDelete({ _id: id }),
      ),
    )
  } catch (err: any) {
    console.error(err)
  }

  next()
})
export const DestinationCollection = 'Destination'
export const DestinationModel = mongoose.model<Destination>(DestinationCollection, DestinationMongoSchema)

export type Destination = z.infer<typeof DestinationSchema>
