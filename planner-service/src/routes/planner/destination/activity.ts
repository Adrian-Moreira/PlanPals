import express from 'express'
import ActivityValidator from '../../../controllers/activity'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import ActivityService from '../../../services/activity'
export const activityRouter = express.Router({ mergeParams: true })

activityRouter.get(
  '/',
  ActivityValidator.getActivitiesByDestinationId,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.getActivitiyDocumentsByDestinationId,
)
activityRouter.post(
  '/',
  ActivityValidator.createActivity,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.createActivityDocument,
)
activityRouter.get(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.getActivityById,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.getActivityDocumentById,
)
activityRouter.patch(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.updateActivity,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.updateActivityDocument,
)
activityRouter.delete(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.deleteActivity,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.deleteActivityDocument,
)
