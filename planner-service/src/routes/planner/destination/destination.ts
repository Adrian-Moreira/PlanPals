import express from 'express'
import { activityRouter } from './activity/activity'
import { accommodationRouter } from './accommodation'
import DestinationValidator from '../../../controllers/destination'

export const destinationRouter = express.Router({ mergeParams: true })

destinationRouter.get('/', DestinationValidator.getDestinationsByPlannerId)
destinationRouter.post('/', DestinationValidator.createDestination)

destinationRouter.get(
  '/:destinationId',
  DestinationValidator.getDestinationById,
)
destinationRouter.patch(
  '/:destinationId',
  DestinationValidator.updateDestination,
)
destinationRouter.delete(
  '/:destinationId',
  DestinationValidator.deleteDestination,
)

destinationRouter.use('/:destinationId/accommodation', accommodationRouter)
destinationRouter.use('/:destinationId/activity', activityRouter)
