import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const VoteRouteSchema = {
  upVote: ReqAttrSchema.extend({
    body: z.object({
      type: z.string(),
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  downVote: ReqAttrSchema.extend({
    body: z.object({
      type: z.string(),
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  removeVote: ReqAttrSchema.extend({
    body: z.object({
      objectId: ObjectIdStringSchema,
      type: z.string(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getVotesByObjectId: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: z.string(),
    }),
  }),
  isUserVoted: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: z.string(),
    }),
    params: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const VoteValidator = RequestUtils.mkParsers(VoteRouteSchema)
export default VoteValidator
