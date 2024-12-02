import { ShoppingListModel, ShoppingListCollection, ItemModel } from '../models/ShoppingList';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { Types } from 'mongoose';

export const createShoppingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, description, createdBy, rwUsers, items } = req.body.out;
  
    try {
      const uniqueRwUsers = Array.from(new Set([createdBy, ...(rwUsers || [])]));
  
      const shoppingList = await ShoppingListModel.create({
        name,
        description,
        createdBy,
        rwUsers: uniqueRwUsers,
        items,
      });
  
      req.body.result = shoppingList;
      req.body.dataType = ShoppingListCollection;
      req.body.status = StatusCodes.CREATED;
      next();
    } catch (error) {
      next(error);
    }
  };

export const addItemToShoppingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shoppingListId } = req.params;
    const { name, location, addedBy } = req.body.out;
  
    const itemId = new Types.ObjectId(); // Generate a new ObjectId for the item
  
    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: shoppingListId },
      { $push: { items: { _id: itemId, name, location, addedBy } } },
      { new: true }
    );
  
    if (!updatedShoppingList) {
      req.body.err = new RecordNotFoundException({
        recordType: 'shoppingList',
        recordId: shoppingListId,
      });
      return next(req.body.err);
    }
  
    req.body.result = updatedShoppingList;
    req.body.status = StatusCodes.OK;
    next();
  };
  

  export const updateShoppingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shoppingListId } = req.params;
    const { name, description } = req.body.out;
  
    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: shoppingListId },
      { name, description },
      { new: true }
    );
  
    if (!updatedShoppingList) {
      req.body.err = new RecordNotFoundException({
        recordType: 'shoppingList',
        recordId: shoppingListId,
      });
      return next(req.body.err);
    }
  
    req.body.result = updatedShoppingList;
    req.body.status = StatusCodes.OK;
    next();
  };
  
  

  export const deleteShoppingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shoppingListId } = req.params;
  
    const deletedShoppingList = await ShoppingListModel.findOneAndDelete({ _id: shoppingListId });
  
    if (!deletedShoppingList) {
      req.body.err = new RecordNotFoundException({
        recordType: 'shoppingList',
        recordId: shoppingListId,
      });
      return next(req.body.err);
    }
  
    req.body = {
      ...req.body, // Ensure `req.body` is initialized
      result: deletedShoppingList,
      status: StatusCodes.OK,
    };
    next();
  };
  
  export const getShoppingListsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId } = req.body.out;
  
    const shoppingLists = await ShoppingListModel.find({
      $or: [{ createdBy: userId }, { rwUsers: userId }],
    });
  
    if (!shoppingLists || shoppingLists.length === 0) {
      req.body.err = new RecordNotFoundException({ recordType: 'shoppingList', recordId: userId });
      return next(req.body.err);
    }
  
    req.body.result = shoppingLists;
    req.body.status = StatusCodes.OK;
    next();
  };

  export const getShoppingListById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shoppingListId } = req.params;
  
    const shoppingList = await ShoppingListModel.findById(shoppingListId);
  
    if (!shoppingList) {
      req.body.err = new RecordNotFoundException({ recordType: 'shoppingList', recordId: shoppingListId });
      return next(req.body.err);
    }
  
    req.body.result = shoppingList;
    req.body.status = StatusCodes.OK;
    next();
  };
  
  export const inviteUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shoppingListId } = req.params;
    const { userIds } = req.body;
  
    const updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
      { _id: shoppingListId },
      { $addToSet: { rwUsers: { $each: userIds } } },
      { new: true }
    );
  
    if (!updatedShoppingList) {
      req.body.err = new RecordNotFoundException({ recordType: 'shoppingList', recordId: shoppingListId });
      return next(req.body.err);
    }
  
    req.body.result = updatedShoppingList;
    req.body.status = StatusCodes.OK;
    next();
  };

  const ShoppingListService = {
    createShoppingList,
    addItemToShoppingList,
    updateShoppingList,    
    deleteShoppingList, 
    getShoppingListsByUser,
    getShoppingListById,
    inviteUsers,          
  };

export default ShoppingListService;
