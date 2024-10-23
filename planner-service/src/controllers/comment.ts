import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/Planner'
import z from 'zod'

const CommentRouteSchema = {
  newComment: ReqAttrSchema.extend({
    body: z.object({
      type: z.string(),
      objectId: ObjectIdStringSchema,
      createdBy: ObjectIdStringSchema,
      title: z.string().min(1, 'Title is required'),
      content: z.string().min(1, 'Content is required'),
    }),
  }),
  removeComment: ReqAttrSchema.extend({
    body: z.object({
      type: z.string(),
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
      type: z.string(),
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
