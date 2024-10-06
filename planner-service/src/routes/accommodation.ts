// import {
//   createAccommodation,
//   getAccommodationsByDestinationId,
//   getAccommodationById,
//   updateAccommodationById,
//   deleteAccommodationById,
// } from '../controllers/accommodation';

import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const accommodationRouter = express.Router({ mergeParams: true });

accommodationRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
    //   const result = await getAccommodationsByDestinationId(destinationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

accommodationRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId } = req.params;
      const accommodationData = req.body;
    //   const result = await createAccommodation(destinationId, accommodationData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

accommodationRouter.get(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
    //   const result = await getAccommodationById(destinationId, accommodationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

accommodationRouter.put(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
      const accommodationData = req.body;
    //   const result = await updateAccommodationById(
    //     destinationId,
    //     accommodationId,
    //     accommodationData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

accommodationRouter.delete(
  '/:accommodationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, accommodationId } = req.params;
    //   await deleteAccommodationById(destinationId, accommodationId);
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ success: true, message: 'Accommodation deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);