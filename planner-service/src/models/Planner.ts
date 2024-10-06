import { z } from 'zod'
import mongoose, { Schema, Types } from 'mongoose'

export const ObjectIdSchema = z.instanceof(Types.ObjectId).refine(async (val) => Types.ObjectId.isValid(val || ''), {
  message: 'Invalid ObjectId',
})

const PlannerMongoSchema = new Schema<Planner>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
    },

    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    updatedAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },

    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
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
      required: true,
      ref: 'User',
    },

    rwUsers: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'User',
    },

    name: {
      type: String,
      required: true,
    },

    describtion: {
      type: String,
    },

    destinations: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Destination',
    },

    transportations: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Transport',
    },
  },
  {
    timestamps: true,
  }
)


export const PlannerSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy:  ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  roUsers: z.array(ObjectIdSchema),
  rwUsers: z.array(ObjectIdSchema),

  name: z.string(),
  describtion: z.string().optional(),
  destinations: z.array(ObjectIdSchema),
  transportations: z.array(ObjectIdSchema),
})

export const PlannerModel = mongoose.model<Planner>('Planner', PlannerMongoSchema)
export type Planner = z.infer<typeof PlannerSchema>
