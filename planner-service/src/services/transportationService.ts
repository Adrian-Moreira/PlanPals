import { Types } from 'mongoose'
import { TransportModel, TransportSchema } from '../models/Transport'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ObjectIdSchema } from '../models/Planner'

export async function createTransportationService({
  plannerId,
  type,
  details,
  departureTime,
  arrivalTime,
}: any) {
  const newTransportation = {
    plannerId: plannerId ? new Types.ObjectId(plannerId as string) : undefined,
    type,
    details,
    departureTime,
    arrivalTime,
  }

  await TransportSchema.pick({})
    .parseAsync(newTransportation)
    .catch(() => {
      throw new MalformedRequestException({
        requestType: 'createTransportation',
        message: 'Invalid request body',
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

export async function getTransportationByIdService(
  transportationId: string,
): Promise<any> {
  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getTransportationById',
      message: 'Invalid Transportation ObjectId format',
    })
  })

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

export async function deleteTransportationService(
  transportationId: string,
): Promise<any> {
  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'deleteTransportation',
      message: 'Invalid Transportation ObjectId format',
    })
  })

  const deletedTransportation = await TransportModel.findByIdAndDelete(
    transportationObjectId,
  ).lean()
  if (!deletedTransportation)
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })

  return deletedTransportation
}

export async function getTransportationsByPlannerIdService(
  plannerId: string,
): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getTransportationsByPlannerId',
      message: 'Invalid Planner ObjectId format',
    })
  })

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
