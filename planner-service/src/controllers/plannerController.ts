import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createPlannerService,
  deletePlannerService,
  getPlannerByIdService,
  getPlannersByAccessService,
  getPlannersByUserIdService,
  inviteIntoPlannerService,
  updatePlannerService,
} from '../services/plannerService'

export const getPlanners = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId, access } = req.query
  try {
    if (!access) {
      const result = await getPlannersByUserIdService({ userId })
      res.status(StatusCodes.OK).json({ success: true, data: result })
    } else {
      const result = await getPlannersByAccessService({
        userId,
        access,
      })
      res.status(StatusCodes.OK).json({ success: true, data: result })
    }
  } catch (error) {
    next(error)
  }
}

export const getPlannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { plannerId } = req.params
  const { userId } = req.query
  try {
    const result = await getPlannerByIdService({ plannerId, userId })
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const createPlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const result = await createPlannerService(req.body)
    return res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const updatePlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { plannerId } = req.params
    const { userId } = req.query
    const result = await updatePlannerService({ plannerId, userId, ...req.body })
    return res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const deletePlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { plannerId } = req.params
    const { userId } = req.query
    const result = await deletePlannerService({ plannerId, userId })
    return res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const inviteIntoPlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { plannerId } = req.params
    const { userId, listOfUserIdWithRole } = req.body

    const result = await inviteIntoPlannerService({
      plannerId,
      userId,
      listOfUserIdWithRole,
    })
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
