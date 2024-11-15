import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Transport, TransportCollection, TransportModel } from '../models/Transport'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { PlannerModel } from '../models/Planner'

/**
 * Verify that a transportation with the given ID exists in the database and belongs to the given planner.
 * If not, throw a RecordNotFoundException with the transportation ID and record type of 'transportation'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
async function verifyTransportationExists(req: Request, res: Response, next: NextFunction) {
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
const createTransportationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { plannerId, targetUser, type, details, departureTime, arrivalTime, vehicleId, targetPlanner } = req.body.out

  const createdTransportation = await TransportModel.create({
    plannerId,
    createdBy: targetUser._id,
    type,
    details,
    departureTime,
    arrivalTime,
    vehicleId,
  })
  targetPlanner.transportations.push(createdTransportation._id)

  await PlannerModel.findOneAndUpdate(
    { _id: targetPlanner._id },
    { transportations: targetPlanner.transportations },
    { new: true },
  )

  req.body.result = createdTransportation
  req.body.dataType = TransportCollection
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
const updateTransportationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let { type, details, departureTime, arrivalTime, vehicleId, targetTransportation } = req.body.out

  targetTransportation.type = type || targetTransportation.type
  targetTransportation.details = details || targetTransportation.details
  targetTransportation.departureTime = departureTime || targetTransportation.departureTime
  targetTransportation.arrivalTime = arrivalTime || targetTransportation.arrivalTime
  targetTransportation.vehicleId = vehicleId || targetTransportation.vehicleId

  const updatedTransportation = await TransportModel.findOneAndUpdate(
    { _id: targetTransportation._id },
    targetTransportation,
    { new: true },
  )

  req.body.result = updatedTransportation
  req.body.dataType = TransportCollection
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
const deleteTransportationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetPlanner, targetTransportation } = req.body.out

  const deletedTransportation = await TransportModel.findOneAndDelete({
    _id: targetTransportation._id,
    plannerId: targetPlanner._id,
  })

  req.body.result = deletedTransportation
  req.body.dataType = TransportCollection
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
const getTransportationDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  const { targetPlanner } = req.body.out
  const resultTransportations: Transport[] = await targetPlanner.transportations.map((tid: any) =>
    TransportModel.findById(tid),
  )

  req.body.result = await Promise.all(resultTransportations).then((results) =>
    results.filter((transportation) => transportation !== null),
  )
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
