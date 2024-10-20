import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { Types } from 'mongoose'
import { Accommodation, AccommodationModel } from '../models/Accommodation'

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
async function verifyAccommodationExists(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (req.body.err) {
    next(req.body.err)
  }

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
const createAccommodationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination, createdBy, name, location, startDate, endDate } =
    req.body.out

  await AccommodationModel.create({
    createdBy,
    destinationId: targetDestination._id,
    name,
    location,
    startDate,
    endDate,
  })
    .then((accommodation) => {
      targetDestination.accommodation.push(accommodation._id)
      targetDestination.save()

      req.body.result = accommodation
      req.body.status = StatusCodes.CREATED
    })
    .catch(() => {
      req.body.err = new RecordConflictException({
        requestType: 'create',
        conflict: 'Accommodation already exists',
      })
      next(req.body.err)
    })

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
const updateAccommodationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }
  const { targetAccommodation, name, location, startDate, endDate } =
    req.body.out

  targetAccommodation.name ||= name
  targetAccommodation.location ||= location
  targetAccommodation.startDate ||= startDate
  targetAccommodation.endDate ||= endDate
  targetAccommodation.save()

  req.body.result = targetAccommodation
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
const deleteAccommodationDocument = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetAccommodation, targetDestination } = req.body.out

  targetDestination.accommodation = targetDestination.accommodation.filter(
    (aid: Types.ObjectId) => !aid.equals(targetAccommodation._id),
  )
  targetDestination.save()

  const deletedAccommodation = await AccommodationModel.findOneAndDelete({
    _id: targetAccommodation._id,
  })

  if (!deletedAccommodation) {
    req.body.err = new RecordNotFoundException({
      recordType: 'accommodation',
      recordId: targetAccommodation._id,
    })
    next(req.body.err)
  }

  req.body.result = deletedAccommodation
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
const getAccommodationDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (req.body.err) {
    next(req.body.err)
  }

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
  if (req.body.err) {
    next(req.body.err)
  }

  const { targetDestination } = req.body.out

  const resultAccommodations: Accommodation[] = await targetDestination.accommodation.map(
    (aid: Types.ObjectId) => AccommodationModel.findOne({ _id: aid }),
  )

  req.body.result = resultAccommodations
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
