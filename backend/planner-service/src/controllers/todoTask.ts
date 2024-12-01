import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils'
import { ObjectIdStringSchema } from '../models/TodoTask'
import z from 'zod'

const TodoTaskRouteSchema = {
  createTodoTask: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
    body: z.object({
      createdBy: ObjectIdStringSchema,
      name: z.string().min(1),
      assignedTo: z.string().optional(),
      dueDate: z.string().datetime().or(z.date()),
      isCompleted: z.boolean().optional(),
    }),
  }),
  getTodoTaskById: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
      todoTaskId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getTodoTasksByTodoListId: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  updateTodoTask: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
      todoTaskId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      assignedTo: z.string().optional(),
      dueDate: z.string().datetime().or(z.date()).optional(),
      isCompleted: z.boolean().optional(),
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  deleteTodoTask: ReqAttrSchema.extend({
    params: z.object({
      todoListId: ObjectIdStringSchema,
      todoTaskId: ObjectIdStringSchema,
    }),
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
}

const TodoTaskValidator = RequestUtils.mkParsers(TodoTaskRouteSchema)
export default TodoTaskValidator
