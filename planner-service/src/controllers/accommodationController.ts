import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createAccommodationService,
  getAccommodationByIdService,
  updateAccommodationService,
  deleteAccommodationService,
  getAccommodationsByDestinationIdService,
} from '../services/accommodationService';

export const createAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { destinationId, name, address, details } = req.body;
  try {
    const accommodation = await createAccommodationService({
      destinationId,
      name,
      address,
      details,
    });
    res.status(StatusCodes.CREATED).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

export const getAccommodationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { accommodationId } = req.params;
  try {
    const accommodation = await getAccommodationByIdService(accommodationId);
    res.status(StatusCodes.OK).json({ success: true, data: accommodation });
  } catch (error) {
    next(error);
  }
};

export const updateAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { accommodationId } = req.params;
  const { name, address, details } = req.body;
  try {
    const updatedAccommodation = await updateAccommodationService({
      accommodationId,
      name,
      address,
      details,
    });
    res.status(StatusCodes.OK).json({ success: true, data: updatedAccommodation });
  } catch (error) {
    next(error);
  }
};

export const deleteAccommodation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { accommodationId } = req.params;
  try {
    const deletedAccommodation = await deleteAccommodationService(accommodationId);
    res.status(StatusCodes.OK).json({ success: true, data: deletedAccommodation });
  } catch (error) {
    next(error);
  }
};

export const getAccommodationsByDestinationId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { destinationId } = req.query;
  try {
    const accommodations = await getAccommodationsByDestinationIdService(
      destinationId as string,
    );
    res.status(StatusCodes.OK).json({ success: true, data: accommodations });
  } catch (error) {
    next(error);
  }
};
