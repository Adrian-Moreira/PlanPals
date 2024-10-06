import express, { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { createPlanner, getPlannersByUserId } from '../controllers/planner'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPlannersByUserId({ createdBy: req.params.userId })
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

plannerRouter.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      createdBy,
      startDate,
      endDate,
      roUsers,
      rwUsers,
      name,
      description,
      destinations,
      transportations,
    } = req.body
    try {
      const result = await createPlanner({
        createdBy,
        startDate,
        endDate,
        roUsers,
        rwUsers,
        name,
        description,
        destinations,
        transportations,
      })
      res.status(StatusCodes.CREATED).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

export default plannerRouter
