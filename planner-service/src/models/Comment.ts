import { z } from 'zod';
import mongoose, { Schema, Document } from 'mongoose';
import { ObjectIdSchema } from './Planner'; // Adjust this import according to your structure

// Define the interface for TypeScript
export interface IComment extends Document {
  plannerId: mongoose.Types.ObjectId;
  createdAt: string;
  createdBy: mongoose.Types.ObjectId;
  updatedAt: string;
  title: string;
  content: string;
  itemId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  votes: number;
}

// Mongoose schema for Comment
const CommentMongoSchema = new Schema<IComment>(
  {
    plannerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Planner',
    },
    createdAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    updatedAt: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Item', // Replace 'Item' with your actual model, e.g., 'Planner'
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // Defaults to null for top-level comments
    },
    votes: {
      type: Number,
      default: 0, // Default to 0 votes
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Zod schema for validation
export const CommentSchema = z.object({
  _id: ObjectIdSchema.optional(), // Optional since it will be created automatically
  plannerId: ObjectIdSchema,
  createdAt: z.string().datetime(),
  createdBy: ObjectIdSchema,
  updatedAt: z.string().datetime(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  itemId: ObjectIdSchema,
  parentId: ObjectIdSchema.nullable().optional(), // Optional for nested comments, can be null
  votes: z.number().min(0).optional(),
});

// Export the Mongoose model
export const CommentModel = mongoose.model<IComment>('Comment', CommentMongoSchema);

// Export the TypeScript type inferred from Zod schema
export type Comment = z.infer<typeof CommentSchema>;
