import express from 'express'
import ActivityValidator from '../../../../controllers/activity'
import { locationRouter } from './location'
export const activityRouter = express.Router({ mergeParams: true })

activityRouter.get('/', ActivityValidator.getActivitiesByDestinationId)
activityRouter.post('/', ActivityValidator.createActivity)

activityRouter.get('/:activityId', ActivityValidator.getActivityById)
activityRouter.patch('/:activityId', ActivityValidator.updateActivity)
activityRouter.delete('/:activityId', ActivityValidator.deleteActivity)

activityRouter.use('/:activityId/location', locationRouter)
