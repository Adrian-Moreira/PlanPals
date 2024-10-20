import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const AccommodationRouteSchema = {
  createAccommodation: ReqAttrSchema.extend({
    params: z.object({
      destinationId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string(),
      location: z.object({
        name: z.string(),
        address: z.string().optional(),
      }),
      startDate: z.string().datetime().or(z.date()),
      endDate: z.string().datetime().or(z.date()),
      createdBy: ObjectIdStringSchema,
    }),
  }),
  getAccommodationById: ReqAttrSchema.extend({
    params: z.object({
      destinationId: ObjectIdStringSchema,
      accommodationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getAccommodationsByDestinationId: ReqAttrSchema.extend({
    params: z.object({
      destinationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateAccommodation: ReqAttrSchema.extend({
    params: z.object({
      destinationId: ObjectIdStringSchema,
      accommodationId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().optional(),
      location: z
        .object({
          name: z.string().optional(),
          address: z.string().optional(),
        })
        .optional(),
      startDate: z.string().datetime().or(z.date()).optional(),
      endDate: z.string().datetime().or(z.date()).optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  deleteAccommodation: ReqAttrSchema.extend({
    params: z.object({
      destinationId: ObjectIdStringSchema,
      accommodationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const AccommodationValidator = RequestUtils.mkParsers(AccommodationRouteSchema)
export default AccommodationValidator
