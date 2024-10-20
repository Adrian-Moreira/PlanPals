import express from 'express'
import AccommodationValidator from '../../../controllers/accommodation'
import AccommodationService from '../../../services/accommodation'
import PlannerService from '../../../services/planner'
import RequestUtils from '../../../utils/RequestUtils'
import { Accommodation } from '../../../models/Accommodation'
import DestinationService from '../../../services/destination'

export const accommodationRouter = express.Router({ mergeParams: true })

accommodationRouter.get(
  '/',
  AccommodationValidator.getAccommodationsByDestinationId,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.getAccommodationDocumentsByDestinationId,
  RequestUtils.mkSuccessResponse<Accommodation[]>,
  RequestUtils.mkErrorResponse,
)
accommodationRouter.post(
  '/',
  AccommodationValidator.createAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.createAccommodationDocument,
  RequestUtils.mkSuccessResponse<Accommodation>,
  RequestUtils.mkErrorResponse,
)
accommodationRouter.get(
  '/:accommodationId',
  AccommodationValidator.getAccommodationById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.getAccommodationDocumentById,
  RequestUtils.mkSuccessResponse<Accommodation>,
  RequestUtils.mkErrorResponse,
)
accommodationRouter.patch(
  '/:accommodationId',
  AccommodationValidator.updateAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.updateAccommodationDocument,
  RequestUtils.mkSuccessResponse<Accommodation>,
  RequestUtils.mkErrorResponse,
)
accommodationRouter.delete(
  '/:accommodationId',
  AccommodationValidator.deleteAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.deleteAccommodationDocument,
  RequestUtils.mkSuccessResponse<Accommodation>,
  RequestUtils.mkErrorResponse,
)
