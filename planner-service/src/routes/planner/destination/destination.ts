import express from 'express'
import { activityRouter } from './activity'
import { accommodationRouter } from './accommodation'
import DestinationValidator from '../../../controllers/destination'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import RequestUtils from '../../../utils/RequestUtils'
import { Destination } from '../../../models/Destination'

export const destinationRouter = express.Router({ mergeParams: true })

destinationRouter.get(
  '/',
  DestinationValidator.getDestinationsByPlannerId,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.getDestinationDocumentsByPlannerId,
  RequestUtils.mkSuccessResponse<Destination[]>,
  RequestUtils.mkErrorResponse
)
destinationRouter.post(
  '/',
  DestinationValidator.createDestination,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.createDestinationDocument,
  RequestUtils.mkSuccessResponse<Destination>,
  RequestUtils.mkErrorResponse
)

destinationRouter.get(
  '/:destinationId',
  DestinationValidator.getDestinationById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.getDestinationDocumentById,
  RequestUtils.mkSuccessResponse<Destination>,
  RequestUtils.mkErrorResponse
)
destinationRouter.patch(
  '/:destinationId',
  DestinationValidator.updateDestination,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.updateDestinationDocument,
  RequestUtils.mkSuccessResponse<Destination>,
  RequestUtils.mkErrorResponse
)
destinationRouter.delete(
  '/:destinationId',
  DestinationValidator.deleteDestination,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  DestinationService.deleteDestinationDocument,
  RequestUtils.mkSuccessResponse<Destination>,
  RequestUtils.mkErrorResponse
)

destinationRouter.use('/:destinationId/accommodation', accommodationRouter)
destinationRouter.use('/:destinationId/activity', activityRouter)
