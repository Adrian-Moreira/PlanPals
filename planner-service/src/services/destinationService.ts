import { Types } from 'mongoose'
import { DestinationModel, DestinationSchema } from '../models/Destination'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ObjectIdSchema, PlannerModel } from '../models/Planner'

export async function createDestinationService({
  plannerId,
  createdBy,
  startDate,
  endDate,
  name,
}: any) {
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
      recordType: 'destination',
      recordId: 'No destination found for the given planner ID ' + plannerId,
    })
  }
  const newDestination = {
    plannerId: plannerObjectId,
    createdBy: userObjectId,
    startDate,
    endDate,
    name,
    comments: [],
    activities: [],
    accommodations: [],
  }

  await DestinationSchema.pick({
    plannerId: true,
    createdBy: true,
    name: true,
    startDate: true,
    endDate: true,
  })
    .parseAsync(newDestination)
    .catch((err) => {
      throw new MalformedRequestException({
        requestType: 'createDestination',
        requestBody: 'Invalid Destination format ' + err.message,
      })
    })

  const createdDestination = await DestinationModel.create(newDestination)
  return createdDestination
}

export async function getDestinationByIdService({
  plannerId,
  destinationId,
  userId,
}: any): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )
  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId as string),
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
      recordType: 'destination',
      recordId: 'No destination found for the given planner ID ' + plannerId,
    })
  }

  const destination = await DestinationModel.findById(
    destinationObjectId,
  ).lean()
  if (!destination)
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })

  return destination
}

export async function updateDestinationService({
  userId,
  plannerId,
  destinationId,
  startDate,
  endDate,
  name,
}: any): Promise<any> {
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId as string),
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
      recordType: 'destination',
      recordId: 'No destination found for the given planner ID ' + plannerId,
    })
  }

  const targetDestination = await DestinationModel.findOne({
    _id: destinationObjectId,
    plannerId: plannerObjectId,
  })
  if (!targetDestination) {
    throw new RecordNotFoundException({
      recordType: 'transportation',
      recordId: destinationId,
    })
  }

  const updatedDestination = await DestinationModel.findByIdAndUpdate(
    destinationObjectId,
    {
      startDate: startDate ? startDate : targetDestination.startDate,
      endDate: endDate ? endDate : targetDestination.endDate,
      name: name ? name : targetDestination.name,
    },
    { new: true },
  ).lean()

  if (!updatedDestination)
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })

  return updatedDestination
}

export async function deleteDestinationService({
  plannerId,
  destinationId,
  userId,
}: any): Promise<any> {
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId as string),
  )

  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
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
      recordType: 'destination',
      recordId: 'No destination found for the given planner ID ' + plannerId,
    })
  }

  const deletedDestination = await DestinationModel.findOneAndDelete({
    _id: destinationObjectId,
    plannerId: plannerObjectId,
  }).lean()
  if (!deletedDestination)
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })

  return deletedDestination
}

export async function getDestinationsByPlannerIdService({
  plannerId,
  userId,
}: any): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const targetPlanner = await PlannerModel.findOne({ _id: plannerObjectId })
  if (!targetPlanner) {
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
  }
  if (
    !targetPlanner.roUsers.includes(userObjectId) &&
    !targetPlanner.rwUsers.includes(userObjectId) &&
    !targetPlanner.createdBy.equals(userObjectId)
  ) {
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: 'No destination found for the given planner ID ' + plannerId,
    })
  }

  const destinations = await DestinationModel.find({
    plannerId: plannerObjectId,
  }).lean()
  if (!destinations || destinations.length === 0)
    throw new RecordNotFoundException({
      recordType: 'destination',
      message: 'No destinations found for the given planner ID',
    })

  return destinations
}
