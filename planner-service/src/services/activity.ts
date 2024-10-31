import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { Activity, ActivityModel } from '../models/Activity'
import { Types } from 'mongoose'
import { DestinationModel } from '../models/Destination'

/**
 * Verifies that an activity with the given ID exists in the database. If not,
 * throws a RecordNotFoundException with the activity ID and record type of
 * 'activity'.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the activity does not exist.
 */
async function verifyActivityExists(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { activityId } = req.body.out
  const activity = await ActivityModel.findOne({ _id: activityId })
  if (!activity) {
    req.body.err = new RecordNotFoundException({
      recordType: 'activity',
      recordId: activityId,
    })
    next(req.body.err)
  }

  req.body.out = { ...req.body.out, targetActivity: activity }
  next()
}

/**
 * Creates a new activity document in the database and adds it to the destination.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If the activity already exists.
 */
const createActivityDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { targetDestination, name, startDate, duration, location, targetUser } =
    req.body.out

  const createdActivity = await ActivityModel.create({
    createdBy: targetUser._id,
    destinationId: targetDestination._id,
    name,
    startDate,
    duration,
    location,
    done: false,
  }).then(async (activity) => {
    await DestinationModel.findOneAndUpdate(
      { _id: targetDestination._id },
      {
        $push: { activities: activity._id },
      },
      { new: true },
    )
    return activity
  })

  req.body.result = createdActivity
  req.body.status = StatusCodes.CREATED

  next()
}

/**
 * Updates an existing activity document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the activity does not exist.
 * @throws {RecordConflictException} If the activity already exists.
 */
const updateActivityDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { targetActivity, name, startDate, duration, location } = req.body.out

  targetActivity.name = name || targetActivity.name
  targetActivity.startDate = startDate || targetActivity.startDate
  targetActivity.duration = duration || targetActivity.duration
  targetActivity.location = location || targetActivity.location

  const updatedActivity = await ActivityModel.findOneAndUpdate(
    { _id: targetActivity._id },
    targetActivity,
    { new: true },
  )

  req.body.result = updatedActivity
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Deletes an activity document from the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the activity does not exist.
 */
const deleteActivityDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { targetActivity, targetDestination } = req.body.out

  const deletedActivity = await ActivityModel.findByIdAndDelete({
    _id: targetActivity._id,
    destinationId: targetDestination._id,
  }).catch((err) => {
    req.body.err = err
    next(req.body.err)
  })

  if (!deletedActivity) {
    req.body.err = new RecordNotFoundException({
      recordType: 'activity',
      recordId: targetActivity._id,
    })
    next(req.body.err)
  }

  req.body.result = deletedActivity
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves an activity document from the database for a given activity ID.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the activity does not exist.
 */
const getActivityDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { targetActivity } = req.body.out

  req.body.result = targetActivity
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves all activity documents for a given destination ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
const getActivitiyDocumentsByDestinationId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetDestination } = req.body.out

  const resultActivities: Activity[] = targetDestination.activities.map(
    (aid: any) => ActivityModel.findById(aid),
  )

  req.body.result = await Promise.all(resultActivities).then((results) =>
    results.filter((act) => act !== null),
  )
  req.body.status = StatusCodes.OK

  next()
}

const ActivityService = {
  verifyActivityExists,
  createActivityDocument,
  updateActivityDocument,
  deleteActivityDocument,
  getActivityDocumentById,
  getActivitiyDocumentsByDestinationId,
}
export default ActivityService
