import sinon from 'sinon';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ShoppingListModel } from '../../../src/models/ShoppingList';
import ShoppingListService from '../../../src/services/shoppingList';

describe('ShoppingList->addItemToShoppingList', () => {
  let shoppingListMock: sinon.SinonMock;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction> = jest.fn();

  const existingShoppingList = {
    _id: '671d24c18132583fe9fb123f',
    name: 'Groceries',
    items: [],
    createdBy: '671d24c18132583fe9fb978f',
  };

  const newItem = {
    name: 'Milk',
    location: 'Walmart',
    addedBy: '671d24c18132583fe9fb978f',
  };

  beforeEach(() => {
    shoppingListMock = sinon.mock(ShoppingListModel);

    req = {
      params: {
        shoppingListId: existingShoppingList._id,
      },
      body: {
        out: newItem,
      },
    };
    res = {};
  });

  afterEach(() => {
    shoppingListMock.restore();
  });

  it('should add an item to the shopping list', async () => {
    shoppingListMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingShoppingList._id },
        { $push: { items: sinon.match({ ...newItem }) } },
        { new: true }
      )
      .resolves({ ...existingShoppingList, items: [newItem] });

    await ShoppingListService.addItemToShoppingList(req as Request, res as Response, next as NextFunction);

    shoppingListMock.verify();
    expect(req.body.status).toEqual(StatusCodes.OK);
    expect(req.body.result).toBeDefined();
    expect(req.body.result.items).toContainEqual(expect.objectContaining(newItem));
  });
});
