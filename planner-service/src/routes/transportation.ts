import express, { Request, Response, NextFunction } from "express"; // import { NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import {
//   createTransportation,
//   getTransportationsByPlannerId,
//   getTransportationById,
//   updateTransportationById,
//   deleteTransportationById,
// } from '../controllers/transportation';

export const transportationRouter = express.Router({ mergeParams: true });

transportationRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId } = req.params;
    //   const result = await getTransportationsByPlannerId(plannerId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

transportationRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId } = req.params;
    //   const transportationData = req.body;
    //   const result = await createTransportation(plannerId, transportationData);
    //   res.status(StatusCodes.CREATED).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

transportationRouter.get(
  '/:transportationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, transportationId } = req.params;
    //   const result = await getTransportationById(plannerId, transportationId);
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

transportationRouter.put(
  '/:transportationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, transportationId } = req.params;
      const transportationData = req.body;
    //   const result = await updateTransportationById(
    //     plannerId,
    //     transportationId,
    //     transportationData,
    //   );
    //   res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
);

transportationRouter.delete(
  '/:transportationId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { plannerId, transportationId } = req.params;
    //   await deleteTransportationById(plannerId, transportationId);
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ success: true, message: 'Transportation deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
);