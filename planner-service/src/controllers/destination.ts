import z from 'zod'
import { ObjectIdStringSchema } from '../models/Planner'
import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'

const DestinationRouteSchema = {
  createDestination: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      startDate: z.string().datetime().or(z.date()),
      endDate: z.string().datetime().or(z.date()),
      name: z.string(),
    }),
  }),
  getDestinationById: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getDestinationsByPlannerId: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateDestination: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().optional(),
      startDate: z.string().datetime().or(z.date()).optional(),
      endDate: z.string().datetime().or(z.date()).optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  deleteDestination: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      destinationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const DestinationValidator = RequestUtils.mkParsers(DestinationRouteSchema)
export default DestinationValidator