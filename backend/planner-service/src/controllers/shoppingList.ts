import RequestUtils, { ReqAttrSchema } from '../utils/RequestUtils';
import { ObjectIdStringSchema, ItemSchema } from '../models/ShoppingList';
import z from 'zod';

const ShoppingListRouteSchema = {
  createShoppingList: ReqAttrSchema.extend({
    body: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      createdBy: ObjectIdStringSchema,
      rwUsers: z.array(ObjectIdStringSchema).optional(), 
      items: z.array(ItemSchema).optional(),
    }),
  }),
  addItem: ReqAttrSchema.extend({
    params: z.object({
      shoppingListId: ObjectIdStringSchema,
    }),
    body: ItemSchema,
  }),
  inviteUsers: ReqAttrSchema.extend({
    params: z.object({
      shoppingListId: ObjectIdStringSchema,
    }),
    body: z.object({
      userIds: z.array(ObjectIdStringSchema),
    }),
  }),
  updateShoppingList: ReqAttrSchema.extend({
    params: z.object({
      shoppingListId: ObjectIdStringSchema,
    }),
    body: z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    }),
  }),
  deleteShoppingList: ReqAttrSchema.extend({
    params: z.object({
      shoppingListId: ObjectIdStringSchema,
    }),
  }),
  getShoppingLists: ReqAttrSchema.extend({
    query: z.object({
      userId: ObjectIdStringSchema,
    }),
  }),
  getShoppingListById: ReqAttrSchema.extend({
    params: z.object({
      shoppingListId: ObjectIdStringSchema,
    }),
  }),
};

const ShoppingListValidator = RequestUtils.mkParsers(ShoppingListRouteSchema);
export default ShoppingListValidator;
