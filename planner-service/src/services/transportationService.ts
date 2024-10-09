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
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(createdBy as string),
  )

  const targetPlanner = await PlannerModel.findOne({ _id: plannerObjectId })
  if (!targetPlanner) {
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
  }
  if (
    !targetPlanner.rwUsers.includes(userObjectId) &&
    !targetPlanner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: createdBy,
    })
  }

  const newTransportation = {
    plannerId: plannerObjectId,
    createdBy: userObjectId,
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
    !planner.roUsers.includes(userObjectId) &&
    !planner.rwUsers.includes(userObjectId) &&
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
  userId,
  plannerId,
  transportationId,
  type,
  details,
  departureTime,
  arrivalTime,
  vehicleId,
}: any): Promise<any> {
  const transportationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(transportationId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const targetPlanner = await PlannerModel.findOne({ _id: plannerObjectId })
  if (!targetPlanner) {
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
  }
  if (
    !targetPlanner.rwUsers.includes(userObjectId) &&
    !targetPlanner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  const targetT11n = await TransportModel.findOne({
    _id: transportationObjectId,
    plannerId: plannerObjectId,
  })
  if (!targetT11n) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  const updatedTransportation = await TransportModel.findByIdAndUpdate(
    transportationObjectId,
    {
      type: type || targetT11n.type,
      details: details || targetT11n.details,
      vehicleId: vehicleId || targetT11n.vehicleId,
      departureTime: departureTime || targetT11n.departureTime,
      arrivalTime: arrivalTime || targetT11n.arrivalTime,
    },
    { new: true },
  ).lean()

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

  const planner = await PlannerModel.findOne({ _id: plannerObjectId }).lean()
  if (!planner) throw new RecordNotFoundException({ recordType: 'planner' })
  if (
    !planner.rwUsers.includes(userObjectId) &&
    !planner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  const deletedTransportation = await TransportModel.findOneAndDelete({
    _id: transportationObjectId,
    plannerId: plannerObjectId,
  }).lean()

  if (!deletedTransportation) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: transportationId,
    })
  }

  return deletedTransportation
}

export const getTransportationsByPlannerIdService = async ({
  plannerId,
  userId,
}: any): Promise<any> => {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const planner = await PlannerModel.findOne({ _id: plannerObjectId })
  if (!planner) throw new RecordNotFoundException({ recordType: 'planner' })
  if (
    !planner.rwUsers.includes(userObjectId) &&
    !planner.roUsers.includes(userObjectId) &&
    !planner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId:
        'No transportations found for the given planner ID ' +
        plannerId +
        ' and user ID ' +
        userId,
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
