import mongoose, { Schema, Types } from 'mongoose';
import { z } from 'zod';
import { UserCollection } from './User';

export const ShoppingListCollection = 'ShoppingList';
export const ItemCollection = 'Item';

// Schema for individual items in the shopping list
const ItemMongoSchema = new Schema<Item>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, required: true, ref: UserCollection },
  },
  { _id: true, timestamps: true },
);

const ShoppingListMongoSchema = new Schema<ShoppingList>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: UserCollection,
    },
    rwUsers: {
        type: [Schema.Types.ObjectId],
        ref: UserCollection,
        default: [],
      },
    name: { type: String, required: true },
    description: { type: String },
    items: [ItemMongoSchema], // Array of items in the shopping list
  },
  { _id: true, timestamps: true },
);
export const ObjectIdStringSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  })
  .transform((val) => new Types.ObjectId(val))

// Validation schemas using Zod
export const ObjectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid ObjectId' })
  .transform((val) => new Types.ObjectId(val));

export const ItemSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1),
  location: z.string(),
  addedBy: ObjectIdSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const ShoppingListSchema = z.object({
  _id: ObjectIdSchema.optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: ObjectIdSchema,
  rwUsers: z.array(ObjectIdStringSchema).optional(),
  items: z.array(ItemSchema).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const ItemModel = mongoose.model(ItemCollection, ItemMongoSchema);
export const ShoppingListModel = mongoose.model(ShoppingListCollection, ShoppingListMongoSchema);

export type ShoppingList = z.infer<typeof ShoppingListSchema>;
export type Item = z.infer<typeof ItemSchema>;
