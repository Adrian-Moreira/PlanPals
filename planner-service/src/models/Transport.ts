import { z } from 'zod'
import { ObjectIdSchema, PlannerModel } from './Planner'
import mongoose, { Schema } from 'mongoose'

const TransportMongoSchema = new Schema<Transport>(
  {
    plannerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Planner',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    vehicleId: {
      type: String,
    },
    departureTime: {
      type: String,
      required: true,
    },
    arrivalTime: {
      type: String,
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },
  },
  { _id: true, timestamps: true },
)

TransportMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const transport = await this.model.findOne(query)

    if (transport) {
      console.error(transport._id)
      await PlannerModel.findByIdAndUpdate(
        { _id: transport.plannerId },
        { $pull: { transportations: transport._id } },
      )

      console.error(await PlannerModel.findOne({ _id: transport.plannerId }))
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

export const TransportSchema = z.object({
  _id: ObjectIdSchema,

  plannerId: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  details: z.string().optional(),

  type: z.string(),
  vehicleId: z.string().optional(),
})

export const TransportModel = mongoose.model<Transport>(
  'Transport',
  TransportMongoSchema,
)
export type Transport = z.infer<typeof TransportSchema>
