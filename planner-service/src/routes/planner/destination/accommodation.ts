import express from 'express'
import AccommodationValidator from '../../../controllers/accommodation'
import AccommodationService from '../../../services/accommodation'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'

export const accommodationRouter = express.Router({ mergeParams: true })

accommodationRouter.get(
  '/',
  AccommodationValidator.getAccommodationsByDestinationId,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.getAccommodationDocumentsByDestinationId,
)
accommodationRouter.post(
  '/',
  AccommodationValidator.createAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.createAccommodationDocument,
)
accommodationRouter.get(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.getAccommodationById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.getAccommodationDocumentById,
)
accommodationRouter.patch(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.updateAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.updateAccommodationDocument,
)
accommodationRouter.delete(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.deleteAccommodation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.deleteAccommodationDocument,
)
