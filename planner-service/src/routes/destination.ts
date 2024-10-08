import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { activityRouter } from "./activity";
import { accommodationRouter } from "./accommodation";

// import {
//   createDestination,
//   getDestinationsByPlannerId,
//   getDestinationById,
//   updateDestinationById,
//   deleteDestinationById,
// } from '../controllers/destination';

export const destinationRouter = express.Router({ mergeParams: true });

destinationRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId } = req.params;
    //   const result = await getDestinationsByPlannerId(plannerId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

destinationRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId } = req.params;
      const destinationData = req.body;
    //   const result = await createDestination(plannerId, destinationData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

destinationRouter.get(
  '/:destinationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, destinationId } = req.params;
    //   const result = await getDestinationById(plannerId, destinationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

destinationRouter.put(
  '/:destinationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, destinationId } = req.params;
      const destinationData = req.body;
    //   const result = await updateDestinationById(
    //     plannerId,
    //     destinationId,
    //     destinationData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

destinationRouter.delete(
  '/:destinationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, destinationId } = req.params;
    //   await deleteDestinationById(plannerId, destinationId);
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ success: true, message: 'Destination deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);


destinationRouter.use('/:destinationId/accommodation', accommodationRouter)
destinationRouter.use('/:destinationId/activity', activityRouter)