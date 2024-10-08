import mongoose, { Schema, Types } from 'mongoose'
import { z } from 'zod'

export const ObjectIdSchema = z
  .instanceof(Types.ObjectId)
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })

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
    locations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    accommodations: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }],
    transportations: [{ type: Schema.Types.ObjectId, ref: 'Transportation' }],
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
  locations: z.array(ObjectIdSchema).optional(),
  accommodations: z.array(ObjectIdSchema).optional(),
  transportations: z.array(ObjectIdSchema).optional(),
  invites: z.array(ObjectIdSchema).optional(),
})

export const PlannerModel = mongoose.model('Planner', PlannerMongoSchema)
export type Planner = z.infer<typeof PlannerSchema>
