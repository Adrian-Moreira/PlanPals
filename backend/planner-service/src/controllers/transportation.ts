import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const TransportationRouteSchema = {
  createTransportation: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      type: z.string(),
      details: z.string().optional(),
      departureTime: z.string().datetime().or(z.date()),
      arrivalTime: z.string().datetime().or(z.date()),
      vehicleId: z.string().optional(),
    }),
  }),
  getTransportationById: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      transportationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getTransportationsByPlannerId: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateTransportation: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      transportationId: ObjectIdStringSchema,
    }),
    body: z.object({
      type: z.string().optional(),
      details: z.string().optional(),
      departureTime: z.string().datetime().or(z.date()).optional(),
      arrivalTime: z.string().datetime().or(z.date()).optional(),
      vehicleId: z.string().optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  deleteTransportation: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
      transportationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const TransportationValidator = RequestUtils.mkParsers(
  TransportationRouteSchema,
)
export default TransportationValidator
