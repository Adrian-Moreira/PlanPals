import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema, ValidCollectionSchema } from '../models/Planner'
import z from 'zod'

const CommentRouteSchema = {
  newComment: ReqAttrSchema.extend({
    body: z.object({
      type: ValidCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
      content: z.string().min(1, 'Content is required'),
    }),
  }),
  removeComment: ReqAttrSchema.extend({
    body: z.object({
      type: ValidCollectionSchema,
      objectId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
    params: z.object({
      commentId: ObjectIdStringSchema,
    }),
  }),
  getCommentsByObjectId: ReqAttrSchema.extend({
    query: z.object({
      type: ValidCollectionSchema,
      objectId: ObjectIdStringSchema,
    }),
  }),
  getCommentById: ReqAttrSchema.extend({
    params: z.object({
      commentId: ObjectIdStringSchema,
    }),
  }),
}

const CommentValidator = RequestUtils.mkParsers(CommentRouteSchema)
export default CommentValidator
