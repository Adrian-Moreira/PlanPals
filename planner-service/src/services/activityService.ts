import { ActivityModel } from '../models/Activity'

export async function createActivityService({
  destinationId,
  name,
  description,
}: any): Promise<any> {
  const activity = await ActivityModel.create({
    destinationId,
    name,
    description,
  })
  return activity
}

export async function getActivityByIdService(activityId: string): Promise<any> {
  const activityDocument = await ActivityModel.findOne({ _id: activityId })
  return activityDocument
}

export async function getActivitiesByDestinationIdService(
  destinationId: string,
): Promise<any> {
  const activities = await ActivityModel.find({ destinationId })
  return activities
}

export async function deleteActivityService(activityId: string): Promise<any> {
  const activityDocument = await ActivityModel.findOneAndDelete({
    _id: activityId,
  })
  return activityDocument
}

export async function updateActivityService({
  activityId,
  name,
  description,
  activityData,
}: any): Promise<any> {
  const activityDocument = await ActivityModel.findOneAndUpdate(
    { _id: activityId },
    activityData,
    { new: true },
  )
  return activityDocument
}
