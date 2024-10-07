import { z } from 'zod'
import mongoose, { Schema, Types, Document, ObjectId } from 'mongoose'

export const ObjectIdSchema = z.instanceof(Types.ObjectId).refine(async (val) => Types.ObjectId.isValid(val || ''), {
  message: 'Invalid ObjectId',
})

export interface Planner extends Document {
  _id: Types.ObjectId
  createdAt: string
  createdBy: Types.ObjectId
  updatedAt: string
  startDate: string
  endDate: string
  comments: Types.ObjectId[]
  roUsers: Types.ObjectId[]
  rwUsers: Types.ObjectId[]
  name: string
  describtion?: string
  destinations: Types.ObjectId[]
  accommodations: {
    name: string;
    votes: number;
  }[]
  transportations: {
    name: string;
    votes: number;
  }[]
  places: {
    name: string
    votes: number
  }[]
}

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
      type: [{
        name: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          required: true,
        },
      }],
      required: true,
    },

    accommodations: {
      type: [{
        name: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          required: true,
        },
      }],
      required: true,
    },

    places: {
      type: [{
        name: {
          type: String,
          required: true,
        },
        votes: {
          type: Number,
          required: true,
        },
      }],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const PlannerSchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),
  endDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  roUsers: z.array(ObjectIdSchema),
  rwUsers: z.array(ObjectIdSchema),

  places: z.array(z.object({
    name: z.string(),
    votes: z.number(),
  })),

  accommodations: z.array(z.object({
    name: z.string(), 
    votes: z.number(),
  })),

  name: z.string(),
  describtion: z.string().optional(),
  destinations: z.array(ObjectIdSchema),
  transportations: z.array(z.object({
    name: z.string(), 
    votes: z.number(),
  })),
})


export const PlannerModel = mongoose.model<Planner>('Planner', PlannerMongoSchema)