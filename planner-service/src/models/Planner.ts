import mongoose, { Schema, Types } from 'mongoose'
import { z } from 'zod'

export const ObjectIdSchema = z
  .instanceof(Types.ObjectId)
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })

const PlannerMongoSchema = new Schema<Planner>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      auto: true,
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
    locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    accommodations: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }],
    transportations: [{ type: Schema.Types.ObjectId, ref: 'Transportation' }],
    invites: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
)

export const PlannerSchema = z.object({
  _id: ObjectIdSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  roUsers: z.array(ObjectIdSchema),
  rwUsers: z.array(ObjectIdSchema),
  name: z.string(),
  description: z.string().optional(),
  destinations: z.array(ObjectIdSchema).optional(),
  locations: z.array(ObjectIdSchema).optional(),
  accommodations: z.array(ObjectIdSchema).optional(),
  transportations: z.array(ObjectIdSchema).optional(),
  invites: z.array(ObjectIdSchema).optional(),
})

export const PlannerModel = mongoose.model('Planner', PlannerMongoSchema)
export type Planner = z.infer<typeof PlannerSchema>
