import express from 'express'
import { activityRouter } from './activity/activity'
import { accommodationRouter } from './accommodation'
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

destinationRouter.use('/:destinationId/accommodation', accommodationRouter)
destinationRouter.use('/:destinationId/activity', activityRouter)
