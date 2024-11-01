import { PlannerModel } from '../models/Planner'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { DestinationModel } from '../models/Destination'
import { TransportModel } from '../models/Transport'
import { ActivityModel } from '../models/Activity'
import { AccommodationModel } from '../models/Accommodation'
import { VoteModel } from '../models/Vote'
import { CommentModel } from '../models/Comment'

/**
 * Creates a new planner document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 */
export const createPlannerDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
export const updatePlannerDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetPlanner, name, description, startDate, endDate } = req.body.out

  targetPlanner.name = name || targetPlanner.name
  targetPlanner.description = description || targetPlanner.description
  targetPlanner.startDate = startDate || targetPlanner.startDate
  targetPlanner.endDate = endDate || targetPlanner.endDate

  const savedPlanner = await PlannerModel.findOneAndUpdate({ _id: targetPlanner._id }, targetPlanner, { new: true })

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
export const deletePlannerDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
export const getPlannerDocumentsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetUser, access } = req.body.out

  let resultPlanners

  switch (access) {
    case 'rw':
      resultPlanners = await PlannerModel.find({ rwUsers: targetUser._id })
      break
    case 'ro':
      resultPlanners = await PlannerModel.find({ roUsers: targetUser._id })
      break
    default:
      resultPlanners = await PlannerModel.find({ createdBy: targetUser._id })
      break
  }

  if (!resultPlanners || resultPlanners.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: targetUser._id,
    })
    next(req.body.err)
  }

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
export const getPlannerDocumentByPlannerId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
async function verifyPlannerExists(req: Request, res: Response, next: NextFunction) {
  const { plannerId } = req.body.out

  const targetPlanner = await PlannerModel.findOne({ _id: plannerId })
  if (!targetPlanner) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
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
async function verifyUserCanEditPlanner(req: Request, res: Response, next: NextFunction) {
  let { plannerId, targetUser, targetPlanner } = req.body.out

  if (
    !targetPlanner.rwUsers.includes(targetUser._id) &&
    targetPlanner.createdBy?.toString() !== targetUser._id.toString()
  ) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
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
async function verifyUserCanViewPlanner(req: Request, res: Response, next: NextFunction) {
  const { targetUser, targetPlanner } = req.body.out

  if (
    !targetPlanner.roUsers.includes(targetUser._id) &&
    !targetPlanner.rwUsers.includes(targetUser._id) &&
    targetPlanner.createdBy?.toString() !== targetUser._id.toString()
  ) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: targetPlanner._id,
    })
    next(req.body.err)
  } else {
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
