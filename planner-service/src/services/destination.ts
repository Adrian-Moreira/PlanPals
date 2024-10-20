import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { Destination, DestinationModel } from '../models/Destination'
import { Types } from 'mongoose'

/**
 * Verify that a destination with the given ID exists in the database. If not, throw
 * a RecordNotFoundException with the destination ID and record type of 'destination'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
function verifyDestinationExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body.err) {
    next(req.body.err)
  }
  const { destinationId, targetPlanner } = req.body.out
  const targetDestination = DestinationModel.findOne({ _id: destinationId })
  if (!targetDestination) {
    req.body.err = new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })
    next(req.body.err)
  }
  if (!targetPlanner.destinations.includes(destinationId)) {
    targetPlanner.destinations.push(destinationId)
    targetPlanner.save()
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
  if (req.body.err) {
    next(req.body.err)
  }

  const { createdBy, startDate, endDate, name, targetPlanner } = req.body.out

  await DestinationModel.create({
    name,
    startDate,
    endDate,
    createdBy,
    plannerId: targetPlanner._id,
    accommodation: [],
    activities: [],
  })
    .then(async (destination) => {
      targetPlanner.destinations.push(destination._id)
      await targetPlanner.save()

      req.body.result = destination
      req.body.status = StatusCodes.CREATED
    })
    .catch(() => {
      req.body.err = new RecordConflictException({
        requestType: 'createDestination',
        conflict: 'Destination already exists',
      })
      next(req.body.err)
    })

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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination, name, startDate, endDate } = req.body.out

  targetDestination.name ||= name
  targetDestination.startDate ||= startDate
  targetDestination.endDate ||= endDate
  targetDestination.save()

  req.body.result = targetDestination as Destination
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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination, targetPlanner } = req.body.out

  targetPlanner.destinations = targetPlanner.destinations.filter(
    (did: Types.ObjectId) => did.equals(targetDestination._id),
  )
  targetPlanner.save()

  DestinationModel.findOneAndDelete({ _id: targetDestination._id })
    .then(() => {
      req.body.result = targetDestination as Destination
      req.body.status = StatusCodes.OK
    })
    .catch(() => {
      req.body.err = new RecordNotFoundException({
        recordType: 'destination',
        recordId: targetDestination._id,
      })
      next(req.body.err)
    })

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
  if (req.body.err) {
    next(req.body.err)
  }
  const { targetDestination } = req.body.out
  req.body.result = targetDestination as Destination
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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetPlanner } = req.body.out

  const resultDestinations: Destination[] = await targetPlanner.destinations.map((did: Types.ObjectId) =>
    DestinationModel.findOne({ _id: did }),
  )

  if (resultDestinations.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'destination',
      recordId: targetPlanner._id,
    })
    next(req.body.err)
  }
  req.body.result = resultDestinations as Destination[]
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
