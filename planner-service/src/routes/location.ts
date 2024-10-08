import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

// import {
//   createLocation,
//   getLocationsByActivityId,
//   getLocationById,
//   updateLocationById,
//   deleteLocationById,
// } from '../controllers/location';

export const locationRouter = express.Router({ mergeParams: true });

locationRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
    //   const result = await getLocationsByActivityId(activityId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

locationRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId } = req.params;
      const locationData = req.body;
    //   const result = await createLocation(activityId, locationData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

locationRouter.get(
  '/:locationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, locationId } = req.params;
    //   const result = await getLocationById(activityId, locationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

locationRouter.put(
  '/:locationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, locationId } = req.params;
      const locationData = req.body;
    //   const result = await updateLocationById(
    //     activityId,
    //     locationId,
    //     locationData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

locationRouter.delete(
  '/:locationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activityId, locationId } = req.params;
    //   await deleteLocationById(activityId, locationId);
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ success: true, message: 'Location deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);