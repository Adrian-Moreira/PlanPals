import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema, CommentableCollectionSchema } from '../models/Planner'
import z from 'zod'

const CommentRouteSchema = {
  newComment: ReqAttrSchema.extend({
    body: z.object({
      type: CommentableCollectionSchema,
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
      content: z.string().min(1, 'Content is required'),
    }),
  }),
  removeComment: ReqAttrSchema.extend({
    body: z.object({
      type: CommentableCollectionSchema,
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
      type: CommentableCollectionSchema,
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
