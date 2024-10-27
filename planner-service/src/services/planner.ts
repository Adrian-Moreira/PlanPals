import { PlannerModel } from '../models/Planner'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { concatLog, debugLogger, logWriter } from '../utils/Logger'

/**
 * Creates a new planner document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 */
export const createPlannerDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const logger = debugLogger('createPlannerDocument')

  const {
    targetUser,
    name,
    description,
    startDate,
    endDate,
    roUsers,
    rwUsers,
    destinations,
    transportations,
    invites,
  } = req.body.out

  req.body.logs = concatLog(req.body.logs, logger('Creating planner document'))

  const planner = await PlannerModel.create({
    createdBy: targetUser._id,
    name,
    description,
    startDate,
    endDate,
    roUsers,
    rwUsers,
    destinations,
    transportations,
    invites,
  })

  req.body.logs = concatLog(
    req.body.logs,
    logger('Created planner document' + planner._id),
  )

  req.body.result = planner
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Updates an existing planner document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the planner does not exist.
 */
export const updatePlannerDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetPlanner, name, description, startDate, endDate } = req.body.out

  const savedPlanner = await PlannerModel.findOneAndUpdate(
    { _id: targetPlanner._id },
    {
      name,
      description,
      startDate,
      endDate,
    },
    { new: true },
  )

  req.body.result = savedPlanner
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Deletes a planner document given a planner ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
export const deletePlannerDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetPlanner } = req.body.out
  const planner = await PlannerModel.findOneAndDelete({
    _id: targetPlanner._id,
  })
  req.body.result = planner
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves all planner documents for a given user ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
export const getPlannerDocumentsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const logger = debugLogger('getPlannerDocumentsByUserId')

  const { targetUser, access } = req.body.out

  req.body.logs = concatLog(
    req.body.logs,
    logger('Retrieving planner documents for user' + targetUser._id),
  )

  let resultPlanners

  if (access) {
    switch (access) {
      case 'rw':
        resultPlanners = await PlannerModel.find({ rwUsers: targetUser._id })
        break
      case 'ro':
        resultPlanners = await PlannerModel.find({ roUsers: targetUser._id })
        break
    }
  } else {
    resultPlanners = await PlannerModel.find({ createdBy: targetUser._id })
  }

  if (!resultPlanners || resultPlanners.length === 0) {
    req.body.logs = concatLog(
      req.body.logs,
      logger('No planner documents found for user' + targetUser._id),
    )

    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: targetUser._id,
    })
    next(req.body.err)
  }

  req.body.logs = concatLog(
    req.body.logs,
    logger('Retrieved planner documents for user' + targetUser._id),
  )

  req.body.result = resultPlanners
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves a planner document by planner ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
export const getPlannerDocumentByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetPlanner } = req.body.out
  req.body.result = targetPlanner
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Verify that a planner with the given ID exists in the database. If not, throw
 * a RecordNotFoundException with the planner ID and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyPlannerExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = debugLogger('verifyPlannerExists')
  const { plannerId } = req.body.out

  req.body.logs = concatLog(
    req.body.logs,
    logger(`Verifying planner exists. plannerId: ${plannerId}`),
  )

  const targetPlanner = await PlannerModel.findOne({ _id: plannerId })
  if (!targetPlanner) {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`Planner does not exist. plannerId: ${plannerId}`),
    )
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`Planner exists. plannerId: ${plannerId}`),
    )
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

/**
 * Verify that the user can edit the planner. If the user is not allowed to
 * edit the planner, a RecordNotFoundException is thrown with the planner ID
 * and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyUserCanEditPlanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = debugLogger('verifyUserCanEditPlanner')

  let { plannerId, targetUser, targetPlanner } = req.body.out

  req.body.logs = concatLog(
    req.body.logs,
    logger(`Verifying user can edit planner. plannerId: ${plannerId}`),
  )

  if (
    !targetPlanner.rwUsers.includes(targetUser._id) &&
    targetPlanner.createdBy?.toString() !== targetUser._id.toString()
  ) {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`User cannot edit planner. plannerId: ${plannerId}`),
    )
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`User can edit planner. plannerId: ${plannerId}`),
    )
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

/**
 * Verify that the user can view the planner. If the user is not allowed to
 * view the planner, a RecordNotFoundException is thrown with the planner ID
 * and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyUserCanViewPlanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = debugLogger('verifyUserCanViewPlanner')
  const { targetUser, targetPlanner } = req.body.out

  if (!targetUser) {
    logWriter(req.body.logs)
  }

  req.body.logs = concatLog(
    req.body.logs,
    logger(`Verifying user can view planner. plannerId: ${targetPlanner._id}`),
  )

  if (
    !targetPlanner.roUsers.includes(targetUser._id) &&
    !targetPlanner.rwUsers.includes(targetUser._id) &&
    targetPlanner.createdBy?.toString() !== targetUser._id.toString()
  ) {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`User cannot view planner. plannerId: ${targetPlanner._id}`),
    )
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: targetPlanner._id,
    })
    next(req.body.err)
  } else {
    req.body.logs = concatLog(
      req.body.logs,
      logger(`User can view planner. plannerId: ${targetPlanner._id}`),
    )
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

const PlannerService = {
  verifyPlannerExists,
  verifyUserCanEditPlanner,
  verifyUserCanViewPlanner,
  createPlannerDocument,
  updatePlannerDocument,
  deletePlannerDocument,
  getPlannerDocumentsByUserId,
  getPlannerDocumentByPlannerId,
}

export default PlannerService
