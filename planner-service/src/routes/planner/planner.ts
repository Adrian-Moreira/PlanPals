import express from 'express'
import { destinationRouter } from './destination/destination'
import { transportationRouter } from './transportation/transportation'
import PlannerValidator from '../../controllers/planner'
import PlannerService from '../../services/planner'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get('/', PlannerValidator.getPlanners)
plannerRouter.post('/', PlannerValidator.createPlanner)

plannerRouter.get(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.getPlannerById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
)
plannerRouter.patch(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.updatePlanner,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
)
plannerRouter.delete(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.deletePlanner,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
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
