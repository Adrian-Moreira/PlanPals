import express from 'express'
import TransportationValidator from '../../../controllers/transportation'
import PlannerService from '../../../services/planner'
import TransportationService from '../../../services/transportation'
import UserService from '../../../services/user'

export const transportationRouter = express.Router({ mergeParams: true })

transportationRouter.get(
  '/',
  TransportationValidator.getTransportationsByPlannerId,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  TransportationService.getTransportationDocumentsByPlannerId,
)

transportationRouter.post(
  '/',
  TransportationValidator.createTransportation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.createTransportationDocument,
)

transportationRouter.get(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.getTransportationById,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.getTransportationDocumentById,
)

transportationRouter.patch(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.updateTransportation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.updateTransportationDocument,
)

transportationRouter.delete(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.deleteTransportation,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.deleteTransportationDocument,
)
