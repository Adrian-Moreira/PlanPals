import express from 'express'
import { destinationRouter } from './destination/destination'
import { transportationRouter } from './transportation/transportation'
import PlannerValidator from '../../controllers/planner'
import PlannerService from '../../services/planner'
import UserService from '../../services/user'

const plannerRouter = express.Router({ mergeParams: true })

plannerRouter.get(
  '/',
  PlannerValidator.getPlanners,
  UserService.verifyUserExists,
  PlannerService.getPlannerDocumentsByUserId,
)
plannerRouter.post(
  '/',
  PlannerValidator.createPlanner,
  UserService.verifyUserExists,
  PlannerService.createPlannerDocument,
)
plannerRouter.get(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.getPlannerById,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  PlannerService.getPlannerDocumentByPlannerId,
)
plannerRouter.patch(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.updatePlanner,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  PlannerService.updatePlannerDocument,
)
plannerRouter.delete(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.deletePlanner,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  PlannerService.deletePlannerDocument,
)
plannerRouter.post(
  '/:plannerId([0-9a-fA-F]{24})/invite',
  PlannerValidator.inviteIntoPlanner,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
)

plannerRouter.use(
  '/:plannerId([0-9a-fA-F]{24})/transportation',
  transportationRouter,
)
plannerRouter.use('/:plannerId([0-9a-fA-F]{24})/destination', destinationRouter)

export default plannerRouter
