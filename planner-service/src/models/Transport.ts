import { z } from 'zod'
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
})

export const TransportModel = mongoose.model<Transport>(
  'Transport',
  TransportMongoSchema,
)

TransportMongoSchema.pre('findOneAndDelete', async function (next) {
  const transportId = this.getQuery()['_id']
  const plannerId = this.getQuery()['plannerId']
  const transportObjectId = {
    objectId: { id: transportId, collection: 'Transport' },
  }

  try {
    await PlannerModel.findOneAndUpdate(
      { _id: plannerId },
      { $pull: { transportations: transportId } },
      { new: true },
    )

    await CommentsModel.findOneAndDelete(transportObjectId)
    await VoteModel.findOneAndDelete(transportObjectId)
  } catch (err: any) {
    next(err)
  }

  next()
})

export type Transport = z.infer<typeof TransportSchema>
