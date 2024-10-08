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
  const { plannerId, name, location } = req.body
  try {
    const destination = await createDestinationService({
      plannerId,
      name,
      location,
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
  const { destinationId } = req.params
  try {
    const destination = await getDestinationByIdService(destinationId)
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
  const { destinationId } = req.params
  const { name, location } = req.body
  try {
    const updatedDestination = await updateDestinationService({
      destinationId,
      name,
      location,
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
  const { destinationId } = req.params
  try {
    const deletedDestination = await deleteDestinationService(destinationId)
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
  const { plannerId } = req.query
  try {
    const destinations = await getDestinationsByPlannerIdService(
      plannerId as string,
    )
    res.status(StatusCodes.OK).json({ success: true, data: destinations })
  } catch (error) {
    next(error)
  }
}
