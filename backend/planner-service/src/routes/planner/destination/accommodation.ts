import express from 'express'
import AccommodationValidator from '../../../controllers/accommodation'
import AccommodationService from '../../../services/accommodation'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import UserService from '../../../services/user'
import { publishDeleteEvent, publishUpdateEvent } from '../../../services/rabbit'

export const accommodationRouter = express.Router({ mergeParams: true })

accommodationRouter.get(
  '/',
  AccommodationValidator.getAccommodationsByDestinationId,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.getAccommodationDocumentsByDestinationId,
)
accommodationRouter.post(
  '/',
  AccommodationValidator.createAccommodation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.createAccommodationDocument,
  publishUpdateEvent,
)
accommodationRouter.get(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.getAccommodationById,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.getAccommodationDocumentById,
)
accommodationRouter.patch(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.updateAccommodation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.updateAccommodationDocument,
  publishUpdateEvent,
)
accommodationRouter.delete(
  '/:accommodationId([0-9a-fA-F]{24})',
  AccommodationValidator.deleteAccommodation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  AccommodationService.verifyAccommodationExists,
  AccommodationService.deleteAccommodationDocument,
  publishDeleteEvent,
)
