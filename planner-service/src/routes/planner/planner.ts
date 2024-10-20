import express from 'express'
import { destinationRouter } from './destination/destination'
import { transportationRouter } from './transportation/transportation'
import PlannerValidator from '../../controllers/planner'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get('/', PlannerValidator.getPlanners)
plannerRouter.post('/', PlannerValidator.createPlanner)

plannerRouter.get(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.getPlannerById,
)
plannerRouter.patch(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.updatePlanner,
)
plannerRouter.delete(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.deletePlanner,
)

plannerRouter.post(
  '/:plannerId([0-9a-fA-F]{24})/invite',
  PlannerValidator.inviteIntoPlanner,
)

plannerRouter.use(
  '/:plannerId([0-9a-fA-F]{24})/transportation',
  transportationRouter,
)
plannerRouter.use('/:plannerId([0-9a-fA-F]{24})/destination', destinationRouter)

export default plannerRouter
