import express from 'express'
import {
  createLocation,
  getLocationsByActivityId,
  getLocationById,
  updateLocation,
  deleteLocation,
} from '../../../../controllers/locationController'

export const locationRouter = express.Router({ mergeParams: true })

locationRouter.get('/', getLocationsByActivityId)
locationRouter.post('/', createLocation)

locationRouter.get('/:locationId', getLocationById)
locationRouter.put('/:locationId', updateLocation)
locationRouter.delete('/:locationId', deleteLocation)
