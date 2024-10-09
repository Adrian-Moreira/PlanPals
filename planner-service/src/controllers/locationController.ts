import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createLocationService,
  getLocationByIdService,
  updateLocationService,
  deleteLocationService,
  getLocationsByActivityIdService,
} from '../services/locationService'

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId, name, coordinates, description } = req.body
  try {
    const location = await createLocationService({
      activityId,
      name,
      coordinates,
      description,
    })
    res.status(StatusCodes.CREATED).json({ success: true, data: location })
  } catch (error) {
    next(error)
  }
}

export const getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { locationId } = req.params
  try {
    const location = await getLocationByIdService(locationId)
    res.status(StatusCodes.OK).json({ success: true, data: location })
  } catch (error) {
    next(error)
  }
}

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { locationId } = req.params
  const { name, coordinates, description } = req.body
  try {
    const updatedLocation = await updateLocationService({
      locationId,
      name,
      coordinates,
      description,
    })
    res.status(StatusCodes.OK).json({ success: true, data: updatedLocation })
  } catch (error) {
    next(error)
  }
}

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { locationId } = req.params
  try {
    const deletedLocation = await deleteLocationService(locationId)
    res.status(StatusCodes.OK).json({ success: true, data: deletedLocation })
  } catch (error) {
    next(error)
  }
}

export const getLocationsByActivityId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.query
  try {
    const locations = await getLocationsByActivityIdService(
      activityId as string,
    )
    res.status(StatusCodes.OK).json({ success: true, data: locations })
  } catch (error) {
    next(error)
  }
}
