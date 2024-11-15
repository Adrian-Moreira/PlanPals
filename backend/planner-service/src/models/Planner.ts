import mongoose, { Schema, Types } from 'mongoose'
import { z } from 'zod'
import { TransportCollection, TransportModel } from './Transport'
import { VoteCollection, VoteModel } from './Vote'
import { CommentCollection, CommentsModel } from './Comment'
import { DestinationCollection, DestinationModel } from './Destination'
import { ActivityCollection } from './Activity'
import { AccommodationCollection } from './Accommodation'
import { UserCollection } from './User'

export const PlannerCollection = 'Planner'

export const ValidCollections = [
  AccommodationCollection,
  ActivityCollection,
  CommentCollection,
  DestinationCollection,
  PlannerCollection,
  TransportCollection,
  UserCollection,
  VoteCollection,
]
export const VotableCollections = [
  AccommodationCollection,
  ActivityCollection,
  CommentCollection,
  DestinationCollection,
  TransportCollection,
]
export const CommentableCollections = [
  AccommodationCollection,
  ActivityCollection,
  DestinationCollection,
  TransportCollection,
]

export const ValidCollectionSchema = z.string().refine((val) => ValidCollections.includes(val))
export const VotableCollectionSchema = z.string().refine((val) => VotableCollections.includes(val))
export const CommentableCollectionSchema = z.string().refine((val) => CommentableCollections.includes(val))
// .transform((val: string) => mongoose.models[val!])

export const ObjectIdSchema = z.instanceof(Types.ObjectId).refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
})

export const ObjectIdStringSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .transform((val) => new Types.ObjectId(val))

const PlannerMongoSchema = new Schema<Planner>(
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
    roUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    rwUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    destinations: [{ type: Schema.Types.ObjectId, ref: 'Destination' }],
    transportations: [{ type: Schema.Types.ObjectId, ref: 'Transport' }],
    invites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    _id: true,
    timestamps: true,
  },
)

export const PlannerSchema = z.object({
  _id: ObjectIdSchema,
  plannerId: ObjectIdSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  createdBy: ObjectIdSchema,
  startDate: z.string().datetime().or(z.date()),
  endDate: z.string().datetime().or(z.date()),
  roUsers: z.array(ObjectIdSchema),
  rwUsers: z.array(ObjectIdSchema),
  name: z.string(),
  description: z.string().optional(),
  destinations: z.array(ObjectIdSchema).optional(),
  transportations: z.array(ObjectIdSchema).optional(),
  invites: z.array(ObjectIdSchema).optional(),
})

PlannerMongoSchema.pre('findOneAndDelete', async function (next) {
  const plannerId = this.getQuery()['_id']
  const plannerObjectId = {
    objectId: { id: plannerId, collection: 'Planner' },
  }

  try {
    await CommentsModel.findOneAndDelete(plannerObjectId)
    await VoteModel.findOneAndDelete(plannerObjectId)

    const planner = await PlannerModel.findOne({
      _id: plannerId,
    })

    await Promise.all(
      planner!.destinations!.map((id: Types.ObjectId) => DestinationModel.findOneAndDelete({ _id: id })),
    )

    await Promise.all(
      planner!.transportations!.map((id: Types.ObjectId) => TransportModel.findOneAndDelete({ _id: id })),
    )
  } catch (err: any) {
    next(err)
  }
  next()
})
export const PlannerModel = mongoose.model(PlannerCollection, PlannerMongoSchema)
export type Planner = z.infer<typeof PlannerSchema>
