import express from 'express'
import {
  getAccommodationsByDestinationId,
  createAccommodation,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
} from '../../../controllers/accommodationController'

export const accommodationRouter = express.Router({ mergeParams: true })

accommodationRouter.get('/', getAccommodationsByDestinationId)
accommodationRouter.post('/', createAccommodation)

accommodationRouter.get('/:accommodationId', getAccommodationById)
accommodationRouter.patch('/:accommodationId', updateAccommodation)
accommodationRouter.delete('/:accommodationId', deleteAccommodation)
