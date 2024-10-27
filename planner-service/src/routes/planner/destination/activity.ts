import express from 'express'
import ActivityValidator from '../../../controllers/activity'
import PlannerService from '../../../services/planner'
import DestinationService from '../../../services/destination'
import ActivityService from '../../../services/activity'
import UserService from '../../../services/user'
export const activityRouter = express.Router({ mergeParams: true })

activityRouter.get(
  '/',
  ActivityValidator.getActivitiesByDestinationId,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.getActivitiyDocumentsByDestinationId,
)
activityRouter.post(
  '/',
  ActivityValidator.createActivity,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.createActivityDocument,
)
activityRouter.get(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.getActivityById,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanViewPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.getActivityDocumentById,
)
activityRouter.patch(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.updateActivity,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.updateActivityDocument,
)
activityRouter.delete(
  '/:activityId([0-9a-fA-F]{24})',
  ActivityValidator.deleteActivity,
  UserService.verifyUserExists,
  PlannerService.verifyPlannerExists,
  PlannerService.verifyUserCanEditPlanner,
  DestinationService.verifyDestinationExists,
  ActivityService.verifyActivityExists,
  ActivityService.deleteActivityDocument,
)
