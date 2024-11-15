import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema, VotableCollectionSchema } from '../models/Planner'
import z from 'zod'

const VoteRouteSchema = {
  upVote: ReqAttrSchema.extend({
    body: z.object({
      type: VotableCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  downVote: ReqAttrSchema.extend({
    body: z.object({
      type: VotableCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
    }),
  }),
  removeVote: ReqAttrSchema.extend({
    body: z.object({
      objectId: ObjectIdStringSchema,
      type: VotableCollectionSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getVotesByObjectId: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: VotableCollectionSchema,
    }),
  }),

  getVoteCountByObjectId: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: VotableCollectionSchema,
    }),
  }),
  isUserVoted: ReqAttrSchema.extend({
    query: z.object({
      objectId: ObjectIdStringSchema,
      type: VotableCollectionSchema,
    }),
    params: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const VoteValidator = RequestUtils.mkParsers(VoteRouteSchema)
export default VoteValidator
