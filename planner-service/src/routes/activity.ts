import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import {
//   createActivity,
//   getActivitiesByDestinationId,
//   getActivityById,
//   updateActivityById,
//   deleteActivityById,
// } from '../controllers/activity';
import  commentRouter  from './comment';
import { voteRouter } from './vote';
//import { locationRouter } from './location'; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export const activityRouter = express.Router({ mergeParams: true });

activityRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    //   const { destinationId } = req.params;
    //   const result = await getActivitiesByDestinationId(destinationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

activityRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    //   const { destinationId } = req.params;
    //   const activityData = req.body;
    //   const result = await createActivity(destinationId, activityData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

activityRouter.get(
  '/:activityId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    //   const { destinationId, activityId } = req.params;
    //   const result = await getActivityById(destinationId, activityId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

activityRouter.put(
  '/:activityId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, activityId } = req.params;
      const activityData = req.body;
    //   const result = await updateActivityById(
    //     destinationId,
    //     activityId,
    //     activityData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

activityRouter.delete(
  '/:activityId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { destinationId, activityId } = req.params;
    //   await deleteActivityById(destinationId, activityId);
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ success: true, message: 'Activity deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);

//activityRouter.use('/:activityId/location', locationRouter);!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
activityRouter.use('/:activityId/vote', voteRouter);
activityRouter.use('/:activityId/comment', commentRouter);