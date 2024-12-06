import express from 'express'
import { destinationRouter } from './destination/destination'
import { transportationRouter } from './transportation/transportation'
import PlannerValidator from '../../controllers/planner'
import PlannerService from '../../services/planner'
import UserService from '../../services/user'
import { publishDeleteEvent, publishUpdateEvent } from '../../services/rabbit'

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
  publishUpdateEvent
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
  publishUpdateEvent
)
plannerRouter.delete(
  '/:plannerId([0-9a-fA-F]{24})',
  PlannerValidator.deletePlanner,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  PlannerService.deletePlannerDocument,
  publishDeleteEvent
)
plannerRouter.post(
  '/:plannerId([0-9a-fA-F]{24})/invite',
  PlannerValidator.inviteUsers,
  PlannerService.inviteUsers,
  publishUpdateEvent
)

plannerRouter.use('/:plannerId([0-9a-fA-F]{24})/transportation', transportationRouter)
plannerRouter.use('/:plannerId([0-9a-fA-F]{24})/destination', destinationRouter)

export default plannerRouter
