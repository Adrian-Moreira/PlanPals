import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createTransportationService,
  getTransportationByIdService,
  updateTransportationService,
  deleteTransportationService,
  getTransportationsByPlannerIdService,
} from '../services/transportationService';

export const createTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, type, details } = req.body;
  try {
    const transportation = await createTransportationService({
      plannerId,
      type,
      details,
    });
    res.status(StatusCodes.CREATED).json({ success: true, data: transportation });
  } catch (error) {
    next(error);
  }
};

export const getTransportationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { transportationId } = req.params;
  try {
    const transportation = await getTransportationByIdService(transportationId);
    res.status(StatusCodes.OK).json({ success: true, data: transportation });
  } catch (error) {
    next(error);
  }
};

export const updateTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { transportationId } = req.params;
  const { type, details } = req.body;
  try {
    const updatedTransportation = await updateTransportationService({
      transportationId,
      type,
      details,
    });
    res.status(StatusCodes.OK).json({ success: true, data: updatedTransportation });
  } catch (error) {
    next(error);
  }
};

export const deleteTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { transportationId } = req.params;
  try {
    const deletedTransportation = await deleteTransportationService(transportationId);
    res.status(StatusCodes.OK).json({ success: true, data: deletedTransportation });
  } catch (error) {
    next(error);
  }
};

export const getTransportationsByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.query;
  try {
    const transportations = await getTransportationsByPlannerIdService(plannerId as string);
    res.status(StatusCodes.OK).json({ success: true, data: transportations });
  } catch (error) {
    next(error);
  }
};
