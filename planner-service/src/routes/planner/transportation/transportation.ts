import express from 'express'
import TransportationValidator from '../../../controllers/transportation'
import PlannerService from '../../../services/planner'
import TransportationService from '../../../services/transportation'
import RequestUtils from '../../../utils/RequestUtils'
import { Transport } from '../../../models/Transport'

export const transportationRouter = express.Router({ mergeParams: true })

transportationRouter.get(
  '/',
  TransportationValidator.getTransportationsByPlannerId,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  TransportationService.getTransportationDocumentsByPlannerId,
  RequestUtils.mkSuccessResponse<Transport[]>,
  RequestUtils.mkErrorResponse,
)

transportationRouter.post(
  '/',
  TransportationValidator.createTransportation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.createTransportationDocument,
  RequestUtils.mkSuccessResponse<Transport>,
  RequestUtils.mkErrorResponse,
)

transportationRouter.get(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.getTransportationById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.getTransportationDocumentById,
  RequestUtils.mkSuccessResponse<Transport>,
  RequestUtils.mkErrorResponse,
)

transportationRouter.patch(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.updateTransportation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.updateTransportationDocument,
  RequestUtils.mkSuccessResponse<Transport>,
  RequestUtils.mkErrorResponse,
)

transportationRouter.delete(
  '/:transportationId([0-9a-fA-F]{24})',
  TransportationValidator.deleteTransportation,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  TransportationService.verifyTransportationExists,
  TransportationService.deleteTransportationDocument,
  RequestUtils.mkSuccessResponse<Transport>,
  RequestUtils.mkErrorResponse,
)
