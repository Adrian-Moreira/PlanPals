import { number, z } from 'zod'
import mongoose, { Schema } from 'mongoose'
import { ObjectIdSchema, PlannerModel } from './Planner'
import { CommentsModel } from './Comment'
import { VoteModel } from './Vote'

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
    from: {
      type: [Number, Number],
    },
    to: {
      type: [Number, Number],
    },
  },
  {
    _id: true,
    timestamps: true,
  },
)

export const TransportSchema = z.object({
  _id: ObjectIdSchema,

  plannerId: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),

  details: z.string().optional(),

  type: z.string(),
  vehicleId: z.string().optional(),

  from: z.array(z.number()).length(2).optional(),
  to: z.array(z.number()).length(2).optional(),
})

TransportMongoSchema.pre('findOneAndDelete', async function (next) {
  const transportId = this.getQuery()['_id']
  const plannerId = this.getQuery()['plannerId']
  const transportObjectId = {
    objectId: { id: transportId, collection: 'Transport' },
  }

  try {
    await CommentsModel.findOneAndDelete(transportObjectId)
    await VoteModel.findOneAndDelete(transportObjectId)

    await PlannerModel.findOneAndUpdate({ _id: plannerId }, { $pull: { transportations: transportId } }, { new: true })
  } catch (err: any) {
    console.error(err)
  }

  next()
})
export const TransportCollection = 'Transport'
export const TransportModel = mongoose.model<Transport>(TransportCollection, TransportMongoSchema)

export type Transport = z.infer<typeof TransportSchema>
