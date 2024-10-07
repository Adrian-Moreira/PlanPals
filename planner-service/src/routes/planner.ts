import express, { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { createPlanner, getPlannersByUserId } from '../controllers/plannerController'
import { destinationRouter } from './destination'
import { transportationRouter } from './transportation'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPlannersByUserId({ createdBy: req.body.createdBy })
      console.log(result, 'LOOGGGGGGGGGGGED')
      res.status(StatusCodes.OK).json({ success: true, ...result })
    } catch (error) {
      next(error)
    }
  },
)

plannerRouter.post(
  '/',
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
      console.log(result, 'createddddddddddddd')
    } catch (error) {
      next(error)
    }
  },
)

plannerRouter.use('/:plannerId/transportation', transportationRouter)
plannerRouter.use('/:plannerId/destination', destinationRouter)

export default plannerRouter
