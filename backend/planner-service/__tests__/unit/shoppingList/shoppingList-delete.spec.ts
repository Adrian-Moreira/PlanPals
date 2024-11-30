import sinon from 'sinon';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ShoppingListModel } from '../../../src/models/ShoppingList';
import ShoppingListService from '../../../src/services/shoppingList';

describe('ShoppingList->deleteShoppingList', () => {
  let shoppingListMock: sinon.SinonMock;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction> = jest.fn();

  const existingShoppingList = {
    _id: '671d24c18132583fe9fb123f',
    name: 'Groceries',
    description: 'Weekly grocery shopping list',
    createdBy: '671d24c18132583fe9fb978f',
  };

  beforeEach(() => {
    shoppingListMock = sinon.mock(ShoppingListModel);

    req = {
      params: {
        shoppingListId: existingShoppingList._id,
      },
    };
    res = {};
  });

  afterEach(() => {
    shoppingListMock.restore();
  });

  it('should delete the shopping list', async () => {
    shoppingListMock
      .expects('findOneAndDelete')
      .withArgs({ _id: existingShoppingList._id })
      .resolves(existingShoppingList);

    req.body = {}; // Initialize req.body
    await ShoppingListService.deleteShoppingList(req as Request, res as Response, next as NextFunction);

    shoppingListMock.verify();
    expect(req.body.status).toEqual(StatusCodes.OK);
    expect(req.body.result).toBeDefined();
    expect(req.body.result.name).toEqual('Groceries');
  });
});
