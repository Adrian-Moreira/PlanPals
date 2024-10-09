import { z } from 'zod'
import { ObjectIdSchema } from './Planner'
import mongoose, { Schema } from 'mongoose'

const ActivityMongoSchema = new Schema<Activity>(
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

    comments: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Comment',
    },

    name: {
      type: String,
      required: true,
    },

    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },

    duration: {
      type: Number,
      required: true,
    },

    done: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
)

export const ActivitySchema = z.object({
  _id: ObjectIdSchema,

  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),

  startDate: z.string().datetime(),

  comments: z.array(ObjectIdSchema),

  name: z.string(),
  location: ObjectIdSchema.optional(),
  duration: z.number().optional(),
  done: z.boolean(),
})

export const ActivityModel = mongoose.model<Activity>('Activity', ActivityMongoSchema)
export type Activity = z.infer<typeof ActivitySchema>
