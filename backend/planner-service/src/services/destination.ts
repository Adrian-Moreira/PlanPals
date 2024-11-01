import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { DestinationModel } from '../models/Destination'
import { Types } from 'mongoose'
import { PlannerModel } from '../models/Planner'

/**
 * Verify that a destination with the given ID exists in the database. If not, throw
 * a RecordNotFoundException with the destination ID and record type of 'destination'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyDestinationExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { destinationId, targetPlanner } = req.body.out
  const targetDestination = await DestinationModel.findOne({
    _id: destinationId,
  })
  if (!targetDestination) {
    req.body.err = new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })
    next(req.body.err)
  }
  if (!targetPlanner.destinations.includes(destinationId)) {
    targetPlanner.destinations.push(destinationId)
    await targetPlanner.save()
  }
  req.body.out = { ...req.body.out, targetDestination }
  next()
}

/**
 * Creates a new destination document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If a destination with the same details already exists.
 */
const createDestinationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetUser, startDate, endDate, name, targetPlanner } = req.body.out

  const newDestination = await DestinationModel.create({
    name,
    startDate,
    endDate,
    createdBy: targetUser._id,
    plannerId: targetPlanner._id,
    accommodation: [],
    activities: [],
  })

  targetPlanner.destinations.push(newDestination._id)

  await PlannerModel.findOneAndUpdate(
    { _id: targetPlanner._id },
    { destinations: targetPlanner.destinations },
    { new: true },
  )

  req.body.result = newDestination
  req.body.status = StatusCodes.CREATED

  next()
}

/**
 * Updates an existing destination document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the destination does not exist.
 */
const updateDestinationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetDestination, name, startDate, endDate } = req.body.out

  const savedDestination = await DestinationModel.findOneAndUpdate(
    { _id: targetDestination._id },
    {
      name,
      startDate,
      endDate,
    },
    { new: true },
  )

  req.body.result = savedDestination
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Deletes an existing destination document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the destination does not exist.
 */
const deleteDestinationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetDestination, targetPlanner } = req.body.out

  targetPlanner.destinations = targetPlanner.destinations.filter(
    (did: any) => did.toString() != targetDestination._id.toString(),
  )

  await PlannerModel.findOneAndUpdate(
    { _id: targetPlanner._id },
    { destinations: targetPlanner.destinations },
    { new: true },
  )

  const deletedDestination = await DestinationModel.findOneAndDelete({
    _id: targetDestination._id,
  })

  req.body.result = deletedDestination
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves an existing destination document from the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the destination does not exist.
 */
const getDestinationDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetDestination } = req.body.out
  req.body.result = targetDestination
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves all destination documents for a given planner ID.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
const getDestinationDocumentsByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetPlanner } = req.body.out

  const resultDestinations = targetPlanner.destinations.map((did: any) => {
    return DestinationModel.findById(did)
  })

  req.body.result = await Promise.all(resultDestinations).then((results) =>
    results.filter((dest) => dest !== null),
  )
  req.body.status = StatusCodes.OK
  next()
}

const DestinationService = {
  verifyDestinationExists,
  createDestinationDocument,
  updateDestinationDocument,
  deleteDestinationDocument,
  getDestinationDocumentById,
  getDestinationDocumentsByPlannerId,
}
export default DestinationService
