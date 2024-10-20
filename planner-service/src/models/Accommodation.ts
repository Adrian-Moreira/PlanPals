import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'
import { DestinationModel } from './Destination'

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

AccommodationMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const accommodation = await this.model.findOne(query)

    if (accommodation) {
      await DestinationModel.findByIdAndUpdate(
        { _id: accommodation.destinationId },
        { $pull: { accommodations: accommodation._id } },
      )
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

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

export const AccommodationModel = mongoose.model<Accommodation>(
  'Accommodation',
  AccommodationMongoSchema,
)
export type Accommodation = z.infer<typeof AccommodationSchema>
