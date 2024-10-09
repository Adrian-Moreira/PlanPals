import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createActivityService,
  getActivityByIdService,
  updateActivityService,
  deleteActivityService,
  getActivitiesByDestinationIdService,
} from '../services/activityService'

export const createActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { destinationId, name, description, schedule } = req.body
  try {
    const activity = await createActivityService({
      destinationId,
      name,
      description,
      schedule,
    })
    res.status(StatusCodes.CREATED).json({ success: true, data: activity })
  } catch (error) {
    next(error)
  }
}

export const getActivityById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.params
  try {
    const activity = await getActivityByIdService(activityId)
    res.status(StatusCodes.OK).json({ success: true, data: activity })
  } catch (error) {
    next(error)
  }
}

export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.params
  const { name, description, schedule } = req.body
  try {
    const updatedActivity = await updateActivityService({
      activityId,
      name,
      description,
      schedule,
    })
    res.status(StatusCodes.OK).json({ success: true, data: updatedActivity })
  } catch (error) {
    next(error)
  }
}

export const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { activityId } = req.params
  try {
    const deletedActivity = await deleteActivityService(activityId)
    res.status(StatusCodes.OK).json({ success: true, data: deletedActivity })
  } catch (error) {
    next(error)
  }
}

export const getActivitiesByDestinationId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { destinationId } = req.query
  try {
    const activities = await getActivitiesByDestinationIdService(
      destinationId as string,
    )
    res.status(StatusCodes.OK).json({ success: true, data: activities })
  } catch (error) {
    next(error)
  }
}
