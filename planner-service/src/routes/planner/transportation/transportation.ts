import express from 'express'
import TransportationValidator from '../../../controllers/transportation'

export const transportationRouter = express.Router({ mergeParams: true })

transportationRouter.get(
  '/',
  TransportationValidator.getTransportationsByPlannerId,
)

transportationRouter.post('/', TransportationValidator.createTransportation)

transportationRouter.get(
  '/:transportationId',
  TransportationValidator.getTransportationById,
)

transportationRouter.patch(
  '/:transportationId',
  TransportationValidator.updateTransportation,
)

transportationRouter.delete(
  '/:transportationId',
  TransportationValidator.deleteTransportation,
)
