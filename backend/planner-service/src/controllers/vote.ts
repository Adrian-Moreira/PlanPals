import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema, ValidCollectionSchema } from '../models/Planner'
import z from 'zod'

const VoteRouteSchema = {
  upVote: ReqAttrSchema.extend({
    body: z.object({
      type: ValidCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  downVote: ReqAttrSchema.extend({
    body: z.object({
      type: ValidCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  removeVote: ReqAttrSchema.extend({
    body: z.object({
      objectId: ObjectIdStringSchema,
      type: ValidCollectionSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getVotesByObjectId: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: ValidCollectionSchema,
    }),
  }),
  isUserVoted: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: ValidCollectionSchema,
    }),
    params: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const VoteValidator = RequestUtils.mkParsers(VoteRouteSchema)
export default VoteValidator
