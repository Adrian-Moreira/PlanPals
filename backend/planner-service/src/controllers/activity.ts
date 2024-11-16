import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import z from 'zod'
import { ObjectIdStringSchema } from '../models/Planner'

const ActivityRouteSchema = {
  createActivity: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      name: z.string().min(1),
      location: z.string().optional(),
      startDate: z.string().datetime().or(z.date()),
      duration: z.number(),
    }),
  }),
  getActivityById: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
      activityId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getActivitiesByDestinationId: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateActivity: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
      activityId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      startDate: z.string().datetime().or(z.date()).optional(),
      duration: z.number().optional(),
      location: z.string().optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  deleteActivity: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
      activityId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const ActivityValidator = RequestUtils.mkParsers(ActivityRouteSchema)
export default ActivityValidator
