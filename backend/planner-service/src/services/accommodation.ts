import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { Types } from 'mongoose'
import { AccommodationCollection, AccommodationModel } from '../models/Accommodation'
import { DestinationModel } from '../models/Destination'

/**
 * Verifies that an accommodation with the given ID exists in the database. If not,
 * throws a RecordNotFoundException with the accommodation ID and record type of
 * 'accommodation'.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the accommodation does not exist.
 */
async function verifyAccommodationExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { accommodationId } = req.body.out
  const targetAccommodation = await AccommodationModel.findOne({
    _id: accommodationId,
  })

  if (!targetAccommodation) {
    req.body.err = new RecordNotFoundException({
      recordType: 'accommodation',
      recordId: accommodationId,
    })
    next(req.body.err)
  }

  req.body.out = { ...req.body.out, targetAccommodation }

  next()
}

/**
 * Creates a new accommodation document in the database and adds it to the destination.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordConflictException} If the accommodation already exists.
 */
const createAccommodationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetDestination, targetUser, name, location, startDate, endDate } = req.body.out

  const createdAccommodation = await AccommodationModel.create({
    createdBy: targetUser._id,
    destinationId: targetDestination._id,
    plannerId: targetDestination.plannerId,
    name,
    location,
    startDate,
    endDate,
  }).then(async (acc) => {
    await DestinationModel.findOneAndUpdate(
      { _id: targetDestination._id },
      {
        $push: { accommodations: acc._id },
      },
      { new: true },
    )
    return acc
  })

  req.body.result = createdAccommodation
  req.body.dataType = AccommodationCollection
  req.body.status = StatusCodes.CREATED

  next()
}

/**
 * Updates an existing accommodation document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the accommodation does not exist.
 */
const updateAccommodationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAccommodation, name, location, startDate, endDate } = req.body.out

  targetAccommodation.name = name || targetAccommodation.name
  targetAccommodation.location = location || targetAccommodation.location
  targetAccommodation.startDate = startDate || targetAccommodation.startDate
  targetAccommodation.endDate = endDate || targetAccommodation.endDate

  const updatedAccommodation = await AccommodationModel.findOneAndUpdate(
    { _id: targetAccommodation._id },
    targetAccommodation,
    { new: true },
  )

  req.body.result = updatedAccommodation
  req.body.dataType = AccommodationCollection
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Deletes an accommodation document from the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the accommodation does not exist.
 */
const deleteAccommodationDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAccommodation, targetDestination } = req.body.out

  const deletedAccommodation = await AccommodationModel.findOneAndDelete({
    _id: targetAccommodation._id,
    destinationId: targetDestination._id,
  })

  if (!deletedAccommodation) {
    req.body.err = new RecordNotFoundException({
      recordType: 'accommodation',
      recordId: targetAccommodation._id,
    })
    next(req.body.err)
  }

  req.body.result = deletedAccommodation
  req.body.dataType = AccommodationCollection
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves an accommodation document from the database for a given accommodation ID.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the accommodation does not exist.
 */
const getAccommodationDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetAccommodation } = req.body.out
  req.body.result = targetAccommodation
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves all accommodation documents for a given destination ID.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the middleware chain
 *     has been exhausted.
 */
const getAccommodationDocumentsByDestinationId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { targetDestination } = req.body.out

  const resultAccommodations = targetDestination.accommodations.map((aid: any) => {
    return AccommodationModel.findById(aid)
  })

  req.body.result = await Promise.all(resultAccommodations).then((results) => results.filter((acc) => acc !== null))
  req.body.status = StatusCodes.OK

  next()
}

const AccommodationService = {
  verifyAccommodationExists,
  createAccommodationDocument,
  updateAccommodationDocument,
  deleteAccommodationDocument,
  getAccommodationDocumentById,
  getAccommodationDocumentsByDestinationId,
}

export default AccommodationService
