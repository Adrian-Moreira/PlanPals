import express from 'express'
import { activityRouter } from './activity'
import { accommodationRouter } from './accommodation'
import DestinationValidator from '../../../controllers/destination'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import UserService from '../../../services/user'
import { publishDeleteEvent, publishUpdateEvent } from '../../../services/rabbit'

export const destinationRouter = express.Router({ mergeParams: true })

destinationRouter.get(
  '/',
  DestinationValidator.getDestinationsByPlannerId,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.getDestinationDocumentsByPlannerId,
)
destinationRouter.post(
  '/',
  DestinationValidator.createDestination,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.createDestinationDocument,
  publishUpdateEvent,
)

destinationRouter.get(
  '/:destinationId([0-9a-fA-F]{24})',
  DestinationValidator.getDestinationById,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.getDestinationDocumentById,
)
destinationRouter.patch(
  '/:destinationId([0-9a-fA-F]{24})',
  DestinationValidator.updateDestination,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.updateDestinationDocument,
  publishUpdateEvent,
)
destinationRouter.delete(
  '/:destinationId([0-9a-fA-F]{24})',
  DestinationValidator.deleteDestination,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.deleteDestinationDocument,
  publishDeleteEvent,
)

destinationRouter.use('/:destinationId([0-9a-fA-F]{24})/accommodation', accommodationRouter)
destinationRouter.use('/:destinationId([0-9a-fA-F]{24})/activity', activityRouter)
