import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z, { number } from 'zod'

const TransportationRouteSchema = {
  createTransportation: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      type: z.string().min(1),
      details: z.string().optional(),
      departureTime: z.string().datetime().or(z.date()),
      arrivalTime: z.string().datetime().or(z.date()),
      vehicleId: z.string().optional(),

      from: z.array(z.number()).length(2).optional(),
      to: z.array(z.number()).length(2).optional(),
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
      type: z.string().min(1).optional(),
      details: z.string().optional(),
      departureTime: z.string().datetime().or(z.date()).optional(),
      arrivalTime: z.string().datetime().or(z.date()).optional(),
      vehicleId: z.string().optional(),

      from: z.array(z.number()).length(2).optional(),
      to: z.array(z.number()).length(2).optional(),
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

const TransportationValidator = RequestUtils.mkParsers(TransportationRouteSchema)
export default TransportationValidator
