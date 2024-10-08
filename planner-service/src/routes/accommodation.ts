import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  getAccommodationsByDestinationId,
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById
} from '../services/accommodationService';

export const accommodationRouter = express.Router({ mergeParams: true });

// Route to get all accommodations for a destination
accommodationRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      const result = await getAccommodationsByDestinationId(destinationId);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// Route to create a new accommodation
accommodationRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      const accommodationData = req.body;
      const result = await createAccommodation(destinationId, accommodationData);
      res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// Route to get a specific accommodation by ID
accommodationRouter.get(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
      const result = await getAccommodationById(destinationId, accommodationId);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// Route to update an accommodation by ID
accommodationRouter.put(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
      const accommodationData = req.body;
      const result = await updateAccommodationById(destinationId, accommodationId, accommodationData);
      res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

// Route to delete an accommodation by ID
accommodationRouter.delete(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
      await deleteAccommodationById(destinationId, accommodationId);
      res.status(StatusCodes.OK).json({ success: true, message: 'Accommodation deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);
