import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { DestinationModel } from './Destination'
import { CommentsModel } from './Comment'
import { VoteModel } from './Vote'

const AccommodationMongoSchema = new Schema<Accommodation>(
  {
    destinationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Destination',
    },
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
    location: {
      type: String,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

export const AccommodationSchema = z.object({
  _id: ObjectIdSchema,

  destinationId: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  name: z.string(),
  location: z.string().optional(),
})

AccommodationMongoSchema.pre('findOneAndDelete', async function (next) {
  const accommodationId = this.getQuery()['_id']
  const destinationId = this.getQuery()['destinationId']
  const accommodationObjectId = {
    objectId: { id: accommodationId, collection: 'Accommodation' },
  }

  try {
    await DestinationModel.findOneAndUpdate(
      { _id: destinationId },
      {
        $pull: {
          accommodations: accommodationId,
        },
      },
      { new: true },
    )

    await CommentsModel.findOneAndDelete(accommodationObjectId)
    await VoteModel.findOneAndDelete(accommodationObjectId)
  } catch (err: any) {
    next(err)
  }

  next()
})

export const AccommodationModel = mongoose.model<Accommodation>('Accommodation', AccommodationMongoSchema)

export type Accommodation = z.infer<typeof AccommodationSchema>
