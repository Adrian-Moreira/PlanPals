import express from 'express'
import { activityRouter } from './activity'
import { accommodationRouter } from './accommodation'
import DestinationValidator from '../../../controllers/destination'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import UserService from '../../../services/user'

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
)
destinationRouter.delete(
  '/:destinationId([0-9a-fA-F]{24})',
  DestinationValidator.deleteDestination,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.deleteDestinationDocument,
)

destinationRouter.use(
  '/:destinationId([0-9a-fA-F]{24})/accommodation',
  accommodationRouter,
)
destinationRouter.use(
  '/:destinationId([0-9a-fA-F]{24})/activity',
  activityRouter,
)
