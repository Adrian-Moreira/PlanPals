import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { Activity, ActivityModel } from '../models/Activity'
import { Types } from 'mongoose'

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
  if (req.body.err) {
    next(req.body.err)
  }

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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination, name, startDate, duration, location, createdBy } =
    req.body.out

  await ActivityModel.create({
    createdBy,
    destinationId: targetDestination._id,
    name,
    startDate,
    duration,
    location,
  })
    .then((activity) => {
      targetDestination.activities.push(activity._id)
      targetDestination.save()

      req.body.result = activity
      req.body.status = StatusCodes.CREATED
    })
    .catch(() => {
      req.body.err = new RecordConflictException({
        requestType: 'createActivity',
        conflict: 'activity',
      })
      next(req.body.err)
    })

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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetActivity, name, startDate, duration, location } = req.body.out

  targetActivity.name ||= name
  targetActivity.startDate ||= startDate
  targetActivity.duration ||= duration
  targetActivity.location ||= location
  targetActivity.save()

  req.body.result = targetActivity
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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetActivity, targetDestination } = req.body.out
  await ActivityModel.deleteOne({ _id: targetActivity._id })
    .then((a) => {
      targetDestination.activities = targetDestination.activities.filter(
        (aid: Types.ObjectId) => aid.equals(targetActivity._id),
      )
      targetDestination.save()

      req.body.result = a
      req.body.status = StatusCodes.OK
    })
    .catch(() => {
      req.body.err = new RecordNotFoundException({
        recordType: 'activity',
        recordId: targetActivity._id,
      })
      next(req.body.err)
    })
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
  if (req.body.err) {
    next(req.body.err)
  }

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
) => {
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination } = req.body.out

  const resultActivities: Activity[] = await targetDestination.activities.map(
    (aid: Types.ObjectId) => ActivityModel.findOne({ _id: aid }),
  )

  if (resultActivities.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'activity',
      recordId: targetDestination._id,
    })
    next(req.body.err)
  }

  req.body.result = resultActivities
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
