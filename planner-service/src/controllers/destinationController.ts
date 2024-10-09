import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createDestinationService,
  getDestinationByIdService,
  updateDestinationService,
  deleteDestinationService,
  getDestinationsByPlannerIdService,
} from '../services/destinationService'

export const createDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.params
  const { createdBy, startDate, endDate, name } = req.body
  try {
    const destination = await createDestinationService({
      plannerId,
      createdBy,
      startDate,
      endDate,
      name,
    })
    res.status(StatusCodes.CREATED).json({ success: true, data: destination })
  } catch (error) {
    next(error)
  }
}

export const getDestinationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, destinationId } = req.params
  const { userId } = req.query
  try {
    const destination = await getDestinationByIdService({
      plannerId,
      destinationId,
      userId,
    })
    res.status(StatusCodes.OK).json({ success: true, data: destination })
  } catch (error) {
    next(error)
  }
}

export const updateDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, destinationId } = req.params
  const { startDate, endDate, name } = req.body
  const { userId } = req.query
  try {
    const updatedDestination = await updateDestinationService({
      userId,
      plannerId,
      destinationId,
      startDate,
      endDate,
      name,
    })
    res.status(StatusCodes.OK).json({ success: true, data: updatedDestination })
  } catch (error) {
    next(error)
  }
}

export const deleteDestination = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, destinationId } = req.params
  const { userId } = req.query
  try {
    const deletedDestination = await deleteDestinationService({
      plannerId,
      destinationId,
      userId,
    })
    res.status(StatusCodes.OK).json({ success: true, data: deletedDestination })
  } catch (error) {
    next(error)
  }
}

export const getDestinationsByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.params
  const { userId } = req.query
  try {
    const destinations = await getDestinationsByPlannerIdService({
      plannerId,
      userId,
    })
    res.status(StatusCodes.OK).json({ success: true, data: destinations })
  } catch (error) {
    next(error)
  }
}
