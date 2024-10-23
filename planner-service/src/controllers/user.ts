import { ObjectIdStringSchema } from '../models/Planner'
import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import z from 'zod'

const UserRouteSchema = {
  createUser: ReqAttrSchema.extend({
    body: z.object({
      userName: z.string(),
      preferredName: z.string(),
    }),
  }),
  updateUser: ReqAttrSchema.extend({
    body: z.object({
      userName: z.string().optional(),
      preferredName: z.string().optional(),
    }),
    params: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  userId: ReqAttrSchema.extend({
    params: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getUserByUserName: ReqAttrSchema.extend({
    query: z.object({
      userName: z.string(),
    }),
  }),
}

const UserValidator = RequestUtils.mkParsers(UserRouteSchema)
export default UserValidator
