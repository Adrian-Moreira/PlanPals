import express from 'express'
import {
  createActivity,
  getActivitiesByDestinationId,
  getActivityById,
  updateActivity,
  deleteActivity,
} from '../../../../controllers/activityController'
import { commentRouter } from './comment'
import { voteRouter } from './vote'
import { locationRouter } from './location'
export const activityRouter = express.Router({ mergeParams: true })

activityRouter.get('/', getActivitiesByDestinationId)
activityRouter.post('/', createActivity)

activityRouter.get('/:activityId', getActivityById)
activityRouter.patch('/:activityId', updateActivity)
activityRouter.delete('/:activityId', deleteActivity)

activityRouter.use('/:activityId/location', locationRouter)
activityRouter.use('/:activityId/vote', voteRouter)
activityRouter.use('/:activityId/comment', commentRouter)
