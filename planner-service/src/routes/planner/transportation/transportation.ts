import express from 'express'
import {
  createTransportation,
  getTransportationsByPlannerId,
  getTransportationById,
  updateTransportation,
  deleteTransportation,
} from '../../../controllers/transportationController'

export const transportationRouter = express.Router({ mergeParams: true })

transportationRouter.get('/', getTransportationsByPlannerId)
transportationRouter.post('/', createTransportation)

transportationRouter.get('/:transportationId', getTransportationById)
transportationRouter.patch('/:transportationId', updateTransportation)
transportationRouter.delete('/:transportationId', deleteTransportation)
