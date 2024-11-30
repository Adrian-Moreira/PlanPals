import express from 'express';
import ShoppingListValidator from '../../controllers/shoppingList';
import ShoppingListService from '../../services/shoppingList';

const shoppingListRouter = express.Router();

shoppingListRouter.post(
  '/',
  ShoppingListValidator.createShoppingList,
  ShoppingListService.createShoppingList,
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
);

shoppingListRouter.post(
  '/:shoppingListId([0-9a-fA-F]{24})/item',
  ShoppingListValidator.addItem,
  ShoppingListService.addItemToShoppingList,
);
shoppingListRouter.post(
    '/:shoppingListId([0-9a-fA-F]{24})/invite',
    ShoppingListValidator.inviteUsers,
    ShoppingListService.inviteUsers,
  );

shoppingListRouter.delete(
  '/:shoppingListId([0-9a-fA-F]{24})',
  ShoppingListValidator.deleteShoppingList,
  ShoppingListService.deleteShoppingList,
);

export default shoppingListRouter;
