import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { DestinationModel } from './Destination'
import { LocationModel } from './Location'
import { CommentModel } from './Comment'

const AccommodationMongoSchema = new Schema<Accommodation>(
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

    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

AccommodationMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const accommodation = await this.model.findOne(query)

    if (accommodation) {
      await DestinationModel.findByIdAndUpdate(
        { _id: accommodation.destinationId },
        { $pull: { accommodations: accommodation._id } },
      )
      if (accommodation.location)
        await LocationModel.findOneAndDelete({ _id: accommodation.location })
      accommodation.comments.forEach(async (c: { _id: any }) => {
        await CommentModel.findOneAndDelete({ _id: c._id })
      })
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

export const AccommodationSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  location: ObjectIdSchema,
})

export const AccommodationModel = mongoose.model<Accommodation>(
  'Accommodation',
  AccommodationMongoSchema,
)
export type Accommodation = z.infer<typeof AccommodationSchema>
