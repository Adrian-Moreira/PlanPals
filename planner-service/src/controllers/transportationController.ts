import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createTransportationService,
  getTransportationByIdService,
  updateTransportationService,
  deleteTransportationService,
  getTransportationsByPlannerIdService,
} from '../services/transportationService'

export const createTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.params
  const { createdBy, type, details, departureTime, arrivalTime, vehicleId } = req.body
  try {
    const transportation = await createTransportationService({
      plannerId,
      createdBy,
      type,
      details,
      departureTime,
      arrivalTime,
      vehicleId,
    })
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: transportation })
  } catch (error) {
    next(error)
  }
}

export const getTransportationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, transportationId } = req.params
  const { userId } = req.query
  try {
    const transportation = await getTransportationByIdService({
      plannerId,
      transportationId,
      userId,
    })
    res.status(StatusCodes.OK).json({ success: true, data: transportation })
  } catch (error) {
    next(error)
  }
}

export const updateTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, transportationId } = req.params
  const { type, details, departureTime, arrivalTime, vehicleId } = req.body
  const { userId } = req.query
  try {
    const updatedTransportation = await updateTransportationService({
      userId,
      plannerId,
      transportationId,
      type,
      details,
      departureTime,
      arrivalTime,
      vehicleId,
    })
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: updatedTransportation })
  } catch (error) {
    next(error)
  }
}

export const deleteTransportation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId, transportationId } = req.params
  const { userId } = req.query
  try {
    const deletedTransportation = await deleteTransportationService({
      plannerId,
      transportationId,
      userId,
    })
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: deletedTransportation })
  } catch (error) {
    next(error)
  }
}

export const getTransportationsByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.params
  const { userId } = req.query
  try {
    const transportations = await getTransportationsByPlannerIdService({
      plannerId,
      userId,
    })
    res.status(StatusCodes.OK).json({ success: true, data: transportations })
  } catch (error) {
    next(error)
  }
}
