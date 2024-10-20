import express from 'express'
import LocationValidator from '../../../../controllers/location'

export const locationRouter = express.Router({ mergeParams: true })

locationRouter.get('/', LocationValidator.getLocationsByActivityId)
locationRouter.post('/', LocationValidator.createLocation)

locationRouter.get('/:locationId', LocationValidator.getLocationById)
locationRouter.patch('/:locationId', LocationValidator.updateLocation)
locationRouter.delete('/:locationId', LocationValidator.deleteLocation)
