import express from 'express'
import AccommodationValidator from '../../../controllers/accommodation'

export const accommodationRouter = express.Router({ mergeParams: true })

accommodationRouter.get(
  '/',
  AccommodationValidator.getAccommodationsByDestinationId,
)
accommodationRouter.post('/', AccommodationValidator.createAccommodation)

accommodationRouter.get(
  '/:accommodationId',
  AccommodationValidator.getAccommodationById,
)
accommodationRouter.patch(
  '/:accommodationId',
  AccommodationValidator.updateAccommodation,
)
accommodationRouter.delete(
  '/:accommodationId',
  AccommodationValidator.deleteAccommodation,
)
