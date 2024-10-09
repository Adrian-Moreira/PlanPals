import express from 'express'
import {
  createDestination,
  getDestinationsByPlannerId,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from '../../../controllers/destinationController'

export const destinationRouter = express.Router({ mergeParams: true })

destinationRouter.get('/', getDestinationsByPlannerId)
destinationRouter.post('/', createDestination)

destinationRouter.get('/:destinationId', getDestinationById)
destinationRouter.patch('/:destinationId', updateDestination)
destinationRouter.delete('/:destinationId', deleteDestination)
