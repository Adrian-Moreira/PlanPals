import mongoose, { Schema, Types } from 'mongoose'
import { z } from 'zod'

export const ValidCollections = [
  'Accommodation',
  'Activity',
  'Comment',
  'Destination',
  'Planner',
  'Transport',
  'User',
  'Vote',
]

export const ValidCollectionSchema = z
  .string()
  .refine((val) => ValidCollections.includes(val))
// .transform((val: string) => mongoose.models[val!])
import { TransportModel } from './Transport'
import { ActivityModel } from './Activity'
import { AccommodationModel } from './Accommodation'
import { VoteModel } from './Vote'
import { CommentModel, CommentsModel } from './Comment'
import { DestinationModel } from './Destination'
import { Document } from 'mongoose'

export const ObjectIdSchema = z
  .instanceof(Types.ObjectId)
  .refine((val) => Types.ObjectId.isValid(val), {
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

export const PlannerModel = mongoose.model('Planner', PlannerMongoSchema)

PlannerMongoSchema.pre('findOneAndDelete', async function (next) {
  const plannerId = this.getQuery()['_id']
  const plannerObjectId = {
    objectId: { id: plannerId, collection: 'Planner' },
  }

  try {
    const planner = await PlannerModel.findOne({
      _id: plannerId,
    })

    await Promise.all(
      planner!.destinations!.map((id: Types.ObjectId) =>
        DestinationModel.findOneAndDelete({ _id: id }),
      ),
    )

    await Promise.all(
      planner!.transportations!.map((id: Types.ObjectId) =>
        TransportModel.findOneAndDelete({ _id: id }),
      ),
    )

    await CommentsModel.findOneAndDelete(plannerObjectId)
    await VoteModel.findOneAndDelete(plannerObjectId)
  } catch (err: any) {
    next(err)
  }
  next()
})

export type Planner = z.infer<typeof PlannerSchema>
