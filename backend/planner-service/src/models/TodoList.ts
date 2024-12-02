import { z } from 'zod'
import mongoose, { Schema, Types } from 'mongoose'
import { TodoTaskModel } from './TodoTask'
import { CommentsModel } from './Comment'
import { VoteModel } from './Vote'

export const ObjectIdSchema = z.instanceof(Types.ObjectId).refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
})

export const ObjectIdStringSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .transform((val) => new Types.ObjectId(val))

const TodoListMongoSchema = new Schema<TodoList>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    tasks: { type: [Schema.Types.ObjectId], required: true, ref: 'TodoTask' },
    roUsers: { type: [Schema.Types.ObjectId], required: true, ref: 'User' },
    rwUsers: { type: [Schema.Types.ObjectId], required: true, ref: 'User' },
  },
  { _id: true, timestamps: true },
)

export const TodoListSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string().min(1),
  description: z.string(),
  tasks: z.array(ObjectIdSchema),
  createdBy: ObjectIdSchema,
  rwUsers: z.array(ObjectIdSchema),
  roUsers: z.array(ObjectIdSchema),
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
})

TodoListMongoSchema.pre('findOneAndDelete', async function (next) {
  const todoListId = this.getQuery()['_id']
  const todoListObjectId = {
    objectId: { id: todoListId, collection: 'TodoList' },
  }

  try {
    await CommentsModel.findOneAndDelete(todoListObjectId)
    await VoteModel.findOneAndDelete(todoListObjectId)

    const todoList = await TodoListModel.findOne({
      _id: todoListId,
    })

    await Promise.all(
      todoList!.tasks!.map((id: Types.ObjectId) => {
        TodoTaskModel.findOneAndDelete({ _id: id })
      }),
    )
  } catch (error: any) {
    console.error(error)
  }
  next()
})

export const TodoListCollection = 'TodoList'
export const TodoListModel = mongoose.model(TodoListCollection, TodoListMongoSchema)
export type TodoList = z.infer<typeof TodoListSchema>
