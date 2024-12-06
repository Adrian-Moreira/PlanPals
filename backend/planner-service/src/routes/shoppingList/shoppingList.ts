import express from 'express';
import ShoppingListValidator from '../../controllers/shoppingList';
import ShoppingListService from '../../services/shoppingList';
import { publishDeleteEvent, publishUpdateEvent } from '../../services/rabbit'

const shoppingListRouter = express.Router();

shoppingListRouter.post(
  '/',
  ShoppingListValidator.createShoppingList,
  ShoppingListService.createShoppingList,
  publishUpdateEvent
);

shoppingListRouter.get(
    '/',
    ShoppingListValidator.getShoppingLists,
    ShoppingListService.getShoppingListsByUser,
  );
  
  shoppingListRouter.get(
    '/:shoppingListId([0-9a-fA-F]{24})',
    ShoppingListValidator.getShoppingListById,
    ShoppingListService.getShoppingListById,
  );

shoppingListRouter.patch(
  '/:shoppingListId([0-9a-fA-F]{24})',
  ShoppingListValidator.updateShoppingList,
  ShoppingListService.updateShoppingList,
  publishUpdateEvent
);

shoppingListRouter.post(
  '/:shoppingListId([0-9a-fA-F]{24})/item',
  ShoppingListValidator.addItem,
  ShoppingListService.addItemToShoppingList,
  publishUpdateEvent
);
shoppingListRouter.post(
    '/:shoppingListId([0-9a-fA-F]{24})/invite',
    ShoppingListValidator.inviteUsers,
    ShoppingListService.inviteUsers,
    publishUpdateEvent
  );

shoppingListRouter.delete(
  '/:shoppingListId([0-9a-fA-F]{24})',
  ShoppingListValidator.deleteShoppingList,
  ShoppingListService.deleteShoppingList,
  publishDeleteEvent
);

export default shoppingListRouter;
