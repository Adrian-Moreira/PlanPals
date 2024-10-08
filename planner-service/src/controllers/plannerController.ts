import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import {
  createPlannerService,
  getPlannerByIdService,
  getPlannersByAccessService,
  getPlannersByUserIdService,
  inviteIntoPlannerService,
} from '../services/plannerService'

export const getPlanners = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { userId, access } = req.params
  try {
    if (!userId || !access) {
      return await getPlannersByUserId(req, res, next)
    }
    if (access == 'ro' || access == 'rw') {
      return await getPlannersByAccess(req, res, next)
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

async function getPlannersByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const { createdBy } = req.query
    const result = await getPlannersByUserIdService(createdBy as string)
    res.status(StatusCodes.OK).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

async function getPlannersByAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  try {
    const { userId, access } = req.query
    const result = await getPlannersByAccessService({
      userId,
      access,
    })
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
): Promise<any> => {}

export const deletePlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {}

export const inviteIntoPlanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { plannerId } = req.params as { plannerId: string }
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
