import mongoose, { Schema, Types } from 'mongoose'
import { z } from 'zod'
import { DestinationModel } from './Destination'

export const ObjectIdSchema = z
  .instanceof(Types.ObjectId)
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })

export const ObjectIdStringSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }).transform((val) => new Types.ObjectId(val))

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

PlannerMongoSchema.pre('findOneAndDelete', async function (next) {
  try {
    const query = this.getQuery()
    const planner = await this.model.findOne(query)

    if (planner) {
      planner.destinations.forEach(async (destination: { _id: any }) => {
        await DestinationModel.findOneAndDelete({ _id: destination._id })
      })
      planner.transportations.forEach(async (transportation: { _id: any }) => {
        await DestinationModel.findOneAndDelete({ _id: transportation._id })
      })
    }

    next()
  } catch (error) {
    next(error as Error)
  }
})

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
export type Planner = z.infer<typeof PlannerSchema>
