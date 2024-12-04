import { ObjectIdStringSchema } from '../models/TodoList'
import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import z from 'zod'

const TodoListRouteSchema = {
  getTodoLists: ReqAttrSchema.extend({
    query: z.object({
      userId: ObjectIdStringSchema,
      access: z
        .string()
        .refine((val) => ['ro', 'rw'].includes(val))
        .optional(),
    }),
  }),
  getTodoListById: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  createTodoList: ReqAttrSchema.extend({
    body: z.object({
      createdBy: ObjectIdStringSchema,
      name: z.string().min(1),
      description: z.string().optional(),
      rwUsers: z.array(ObjectIdStringSchema).optional(),
      roUsers: z.array(ObjectIdStringSchema).optional(),
      tasks: z.array(ObjectIdStringSchema).optional(),
    }),
  }),
  updateTodoList: ReqAttrSchema.extend({
    body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      rwUsers: z.array(ObjectIdStringSchema).optional(),
      roUsers: z.array(ObjectIdStringSchema).optional(),
      tasks: z.array(ObjectIdStringSchema).optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
  }),
  deleteTodoList: ReqAttrSchema.extend({
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
  }),
  inviteUsers: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
    body: z.object({
      userIds: z.array(ObjectIdStringSchema),
    }),
  }),
}

const TodoListValidator = RequestUtils.mkParsers(TodoListRouteSchema)
export default TodoListValidator