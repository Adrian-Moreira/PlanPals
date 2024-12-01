import { z } from 'zod';
import mongoose, { Schema } from 'mongoose';
import { CommentsModel } from './Comment';
import { VoteModel } from './Vote';

export const TodoTaskCollection = 'TodoTask';

const TodoTaskMongoSchema = new Schema<TodoTask>(
  {
    todoListId: { type: Schema.Types.ObjectId, required: true, ref: 'TodoList' },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    name: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    dueDate: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
  },
  { _id: true, timestamps: true },
);

export const ObjectIdStringSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export const TodoTaskSchema = z.object({
  _id: z.string(),
  todoListId: ObjectIdStringSchema,
  createdBy: ObjectIdStringSchema,
  assignedTo: ObjectIdStringSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  name: z.string(),
  description: z.string(),
  dueDate: z.string(),
  isCompleted: z.boolean(),
});

TodoTaskMongoSchema.pre('findOneAndDelete', async function (next) {
  const todoTaskId = this.getQuery()['_id']
  const todoTaskObjectId = {
    objectId: { id: todoTaskId, collection: 'TodoTask' },
  }

  try {
      await CommentsModel.findOneAndDelete(todoTaskObjectId)
      await VoteModel.findOneAndDelete(todoTaskObjectId)
  } catch (error) {
      console.error(error)
  }
  next()
  }
)

export const TodoTaskModel = mongoose.model(TodoTaskCollection, TodoTaskMongoSchema);
export type TodoTask = z.infer<typeof TodoTaskSchema>;
