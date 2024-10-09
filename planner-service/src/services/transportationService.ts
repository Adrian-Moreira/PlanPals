import { Types } from 'mongoose'
import { TransportModel, TransportSchema } from '../models/Transport'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ObjectIdSchema, PlannerModel } from '../models/Planner'

export const createTransportationService = async ({
  plannerId,
  createdBy,
  type,
  details,
  departureTime,
  arrivalTime,
  vehicleId,
}: any): Promise<any> => {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  ).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'createTransportation',
      requestBody: 'Invalid Planner ObjectId format ' + err.message,
    })
  })

  const newTransportation = {
    plannerId: plannerObjectId,
    createdBy,
    type,
    details,
    departureTime,
    arrivalTime,
    vehicleId,
  }

  await TransportSchema.pick({
    plannerId: true,
    createdBy: true,
    type: true,
    details: true,
    departureTime: true,
    arrivalTime: true,
    vehicleId: true,
  })
    .parseAsync(newTransportation)
    .catch((err) => {
      throw new MalformedRequestException({
        requestType: 'createTransportation',
        message:
          'Invalid request body for creating a new transportation ' +
          err.message,
      })
    })

  const createdTransportation = await TransportModel.create(newTransportation)
  return createdTransportation
}

export async function getTransportationsService(): Promise<any> {
  const transportations = await TransportModel.find().lean()
  if (!transportations)
    throw new RecordNotFoundException({ recordType: 'transportation' })
  return transportations
}

export async function getTransportationByIdService({
  plannerId,
  transportationId,
  userId,
}: any): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId as string),
  )

  const planner = await PlannerModel.findById(plannerObjectId).lean()
  if (!planner) throw new RecordNotFoundException({ recordType: 'planner' })
  if (
    !planner.roUsers.includes(userObjectId) ||
    !planner.rwUsers.includes(userObjectId) ||
    !planner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  const transportation = await TransportModel.findById(
    transportationObjectId,
  ).lean()
  if (!transportation)
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })

  return transportation
}

export async function updateTransportationService({
  transportationId,
  type,
  details,
  departureTime,
  arrivalTime,
}: any): Promise<any> {
  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId as string),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'updateTransportation',
      message: 'Invalid Transportation ObjectId format',
    })
  })

  const updatedTransportation = await TransportModel.findByIdAndUpdate(
    transportationObjectId,
    { type, details, departureTime, arrivalTime },
    { new: true },
  ).lean()

  if (!updatedTransportation)
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })

  return updatedTransportation
}

export async function deleteTransportationService({
  plannerId,
  transportationId,
  userId,
}: any): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId as string),
  )

  const planner = await PlannerModel.findById(plannerObjectId).lean()
  if (!planner) throw new RecordNotFoundException({ recordType: 'planner' })
  if (
    !planner.rwUsers.includes(userObjectId) ||
    !planner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  const deletedTransportation = await TransportModel.findByIdAndDelete(
    transportationObjectId,
  ).lean()

  await PlannerModel.findOneAndUpdate(
    { _id: plannerObjectId },
    {
      transportations: planner.transportations?.splice(
        planner.transportations.indexOf(transportationObjectId),
      ),
    },
  )
  if (!deletedTransportation) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  return deletedTransportation
}

export async function getTransportationsByPlannerIdService({
  plannerId,
  userId,
}: any): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const planner = await PlannerModel.findById(plannerObjectId).lean()
  if (!planner) throw new RecordNotFoundException({ recordType: 'planner' })
  if (
    !planner.roUsers.includes(userObjectId) ||
    !planner.rwUsers.includes(userObjectId) ||
    !planner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      message: 'No transportations found for the given planner ID',
    })
  }

  const transportations = await TransportModel.find({
    plannerId: plannerObjectId,
  }).lean()
  if (!transportations || transportations.length === 0)
    throw new RecordNotFoundException({
      recordType: 'transportation',
      message: 'No transportations found for the given planner ID',
    })

  return transportations
}
