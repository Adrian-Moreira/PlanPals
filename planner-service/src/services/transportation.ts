import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Transport, TransportModel } from '../models/Transport'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { Types } from 'mongoose'

/**
 * Verify that a transportation with the given ID exists in the database and belongs to the given planner.
 * If not, throw a RecordNotFoundException with the transportation ID and record type of 'transportation'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyTransportationExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body.err) {
    next(req.body.err)
  }
  const { targetPlanner, transportationId } = req.body.out
  const targetTransportation = await TransportModel.findOne({
    _id: transportationId,
    plannerId: targetPlanner._id,
  })

  if (!targetTransportation) {
    req.body.err = new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
    next(req.body.err)
  }

  req.body.out = { ...req.body.out, targetTransportation }
  next()
}

/**
 * Creates a new transportation document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If a transportation with the same details already exists.
 */
const createTransportationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  const {
    plannerId,
    createdBy,
    type,
    details,
    departureTime,
    arrivalTime,
    vehicleId,
    targetPlanner,
  } = req.body.out

  const createdTransportation = await TransportModel.create({
    plannerId,
    createdBy,
    type,
    details,
    departureTime,
    arrivalTime,
    vehicleId,
  })
    .then(async (transportation) => {
      targetPlanner.transportations.push(transportation._id)
      await targetPlanner.save()

      return transportation
    })
    .catch((err) => {
      req.body.err = new RecordConflictException({
        requestType: 'createTransportation',
        conflict: 'Transportation already exists ' + JSON.stringify(err),
      })
    })
  req.body.result = createdTransportation
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Updates an existing transportation document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the transportation does not exist.
 */
const updateTransportationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  let {
    type,
    details,
    departureTime,
    arrivalTime,
    vehicleId,
    targetTransportation,
  } = req.body.out

  targetTransportation.type ||= type
  targetTransportation.details ||= details
  targetTransportation.departureTime ||= departureTime
  targetTransportation.arrivalTime ||= arrivalTime
  targetTransportation.vehicleId ||= vehicleId
  const updatedTransportation = await targetTransportation.save()

  req.body.result = updatedTransportation
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Deletes an existing transportation document in the database.
 *
 * @param req - The incoming request from the client.
 * @param res - The response to the client.
 * @param next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the transportation does not exist.
 */
const deleteTransportationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetPlanner, targetTransportation } = req.body.out

  targetPlanner.transportations = targetPlanner.transportations.filter(
    (tid: Types.ObjectId) => tid.equals(targetTransportation._id),
  )
  await targetPlanner.save()

  const deletedTransportation = await TransportModel.findOneAndDelete({
    _id: targetTransportation._id,
  })

  if (!deletedTransportation) {
    req.body.err = new RecordNotFoundException({
      recordType: 'transportation',
      recordId: targetTransportation._id,
    })
    next(req.body.err)
  }

  req.body.result = deletedTransportation
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieve a single transportation document for a given planner ID and
 * transportation ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
const getTransportationDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetTransportation } = req.body.out

  req.body.result = targetTransportation
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieve all transportation documents for a given planner ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
const getTransportationDocumentsByPlannerId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }
  const { targetPlanner } = req.body.out
  const resultTransportations: Transport[] =
    await targetPlanner.transportations.map(async (tid: Types.ObjectId) => {
      return await TransportModel.findById(tid)
    })

  if (resultTransportations.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'transportation',
      recordId: targetPlanner._id,
    })
    next(req.body.err)
  }

  req.body.result = resultTransportations
  req.body.status = StatusCodes.OK
  next()
}

const TransportationService = {
  verifyTransportationExists,
  createTransportationDocument,
  updateTransportationDocument,
  deleteTransportationDocument,
  getTransportationDocumentById,
  getTransportationDocumentsByPlannerId,
}
export default TransportationService
