import sinon from 'sinon';
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ShoppingListModel } from '../../../src/models/ShoppingList';
import ShoppingListService from '../../../src/services/shoppingList';

describe('ShoppingList->createShoppingList', () => {
  let shoppingListMock: sinon.SinonMock;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction> = jest.fn();

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  };

  const newShoppingList = {
    createdBy: targetUser._id,
    name: 'Groceries',
    description: 'Weekly grocery shopping list',
    items: [],
    _id: '671ceaae117001732cd0fc83',
  };

  beforeEach(() => {
    shoppingListMock = sinon.mock(ShoppingListModel);

    req = {
      body: {
        out: {
          targetUser,
          ...newShoppingList,
        },
      },
    };
    res = {};
  });

  afterEach(() => {
    shoppingListMock.restore();
  });

  it('should create a new shopping list', async () => {
    shoppingListMock.expects('create').resolves(newShoppingList);

    await ShoppingListService.createShoppingList(
      req as Request,
      res as Response,
      next as NextFunction,
    );

    shoppingListMock.verify();
    expect(req.body.status).toEqual(StatusCodes.CREATED);
    expect(req.body.result).toBeDefined();
    expect(req.body.result.createdBy).toEqual(targetUser._id);
    expect(req.body.result.name).toEqual('Groceries');
    expect(req.body.result.description).toEqual('Weekly grocery shopping list');
  });
});
