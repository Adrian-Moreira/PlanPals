import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const LocationRouteSchema = {
  createLocation: ReqAttrSchema.extend({
    params: z.object({
      activityId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      name: z.string(),
      address: z.string().optional(),
    }),
  }),
  getLocationById: ReqAttrSchema.extend({
    params: z.object({
      activityId: ObjectIdStringSchema,
      locationId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getLocationsByActivityId: ReqAttrSchema.extend({
    params: z.object({
      activityId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateLocation: ReqAttrSchema.extend({
    params: z.object({
      activityId: ObjectIdStringSchema,
      locationId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
  deleteLocation: ReqAttrSchema.extend({
    params: z.object({
      activityId: ObjectIdStringSchema,
      locationId: ObjectIdStringSchema,
    }),
  }),
}

const LocationValidator = RequestUtils.mkParsers(LocationRouteSchema)
export default LocationValidator
