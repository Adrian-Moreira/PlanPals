import { z } from 'zod';
import mongoose, { Schema } from 'mongoose';
import { CommentsModel } from './Comment';
import { VoteModel } from './Vote';
import { ObjectIdSchema, TodoListModel } from './TodoList';

const TodoTaskMongoSchema = new Schema<TodoTask>(
  {
    todoListId: { type: Schema.Types.ObjectId, required: true, ref: 'TodoList' },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      required: true, 
      ref: 'User' 
    },
    name: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
  },
  { _id: true, timestamps: true },
);

export const TodoTaskSchema = z.object({
  _id: ObjectIdSchema,
  todoListId: ObjectIdSchema,
  createdBy: ObjectIdSchema,
  assignedTo: ObjectIdSchema,
  createdAt: z.string().datetime().or(z.date()),
  updatedAt: z.string().datetime().or(z.date()),
  name: z.string(),
  dueDate: z.string().datetime(),
  isCompleted: z.boolean(),
});

TodoTaskMongoSchema.pre('findOneAndDelete', async function (next) {
  const todoTaskId = this.getQuery()['_id']
  const todoListId = this.getQuery()['todoListId']
  const todoTaskObjectId = {
    objectId: { id: todoTaskId, collection: 'TodoTask' },
  }

  try {
      await CommentsModel.findOneAndDelete(todoTaskObjectId)
      await VoteModel.findOneAndDelete(todoTaskObjectId)

      await TodoListModel.findOneAndUpdate({ _id: todoListId }, { $pull: { tasks: todoTaskId } }, { new: true })
  } catch (error : any) {
      console.error(error)
  }
  next()
  }
)

export const TodoTaskCollection = 'TodoTask';
export const TodoTaskModel = mongoose.model<TodoTask>(TodoTaskCollection, TodoTaskMongoSchema);
export type TodoTask = z.infer<typeof TodoTaskSchema>;
