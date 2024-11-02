import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const PlannerRouteSchema = {
  getPlanners: ReqAttrSchema.extend({
    query: z.object({
      userId: ObjectIdStringSchema,
      access: z
        .string()
        .refine((val) => ['ro', 'rw'].includes(val))
        .optional(),
    }),
  }),
  getPlannerById: ReqAttrSchema.extend({
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  createPlanner: ReqAttrSchema.extend({
    body: z.object({
      createdBy: ObjectIdStringSchema,
      name: z.string(),
      description: z.string().optional(),
      startDate: z.string().datetime().or(z.date()),
      endDate: z.string().datetime().or(z.date()),
      roUsers: z.array(ObjectIdStringSchema).optional(),
      rwUsers: z.array(ObjectIdStringSchema).optional(),
      destinations: z.array(ObjectIdStringSchema).optional(),
      transportations: z.array(ObjectIdStringSchema).optional(),
      invites: z.array(ObjectIdStringSchema).optional(),
    }),
  }),
  updatePlanner: ReqAttrSchema.extend({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      startDate: z.string().datetime().or(z.date()).optional(),
      endDate: z.string().datetime().or(z.date()).optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
  }),
  deletePlanner: ReqAttrSchema.extend({
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
  }),
  inviteIntoPlanner: ReqAttrSchema.extend({
    body: z.object({
      userId: ObjectIdStringSchema,
      listOfUserIdWithRole: z.array(
        z.object({
          userId: ObjectIdStringSchema,
          role: z.string(),
        }),
      ),
    }),
    query: z.object({}),
    params: z.object({
      plannerId: ObjectIdStringSchema,
    }),
  }),
}

const PlannerValidator = RequestUtils.mkParsers(PlannerRouteSchema)
export default PlannerValidator
