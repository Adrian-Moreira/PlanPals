import { Types } from 'mongoose'
import { DestinationModel, DestinationSchema } from '../models/Destination'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { ObjectIdSchema } from '../models/Planner'

export async function createDestinationService({
  plannerId,
  name,
  location,
  description,
}: any) {
  const newDestination = {
    plannerId: plannerId ? new Types.ObjectId(plannerId as string) : undefined,
    name,
    location,
    description,
  }

  await DestinationSchema.pick({})
    .parseAsync(newDestination)
    .catch(() => {
      throw new MalformedRequestException({
        requestType: 'createDestination',
        message: 'Invalid request body',
      })
    })

  const createdDestination = await DestinationModel.create(newDestination)
  return createdDestination
}

// Get All Destinations
export async function getDestinationsService(): Promise<any> {
  const destinations = await DestinationModel.find().lean()
  if (!destinations)
    throw new RecordNotFoundException({ recordType: 'destination' })
  return destinations
}

// Get Destination by ID
export async function getDestinationByIdService(
  destinationId: string,
): Promise<any> {
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getDestinationById',
      message: 'Invalid Destination ObjectId format',
    })
  })

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

// Update Destination
export async function updateDestinationService({
  destinationId,
  name,
  location,
  description,
}: any): Promise<any> {
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId as string),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'updateDestination',
      message: 'Invalid Destination ObjectId format',
    })
  })

  const updatedDestination = await DestinationModel.findByIdAndUpdate(
    destinationObjectId,
    { name, location, description },
    { new: true },
  ).lean()

  if (!updatedDestination)
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })

  return updatedDestination
}

// Delete Destination
export async function deleteDestinationService(
  destinationId: string,
): Promise<any> {
  const destinationObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(destinationId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'deleteDestination',
      message: 'Invalid Destination ObjectId format',
    })
  })

  const deletedDestination = await DestinationModel.findByIdAndDelete(
    destinationObjectId,
  ).lean()
  if (!deletedDestination)
    throw new RecordNotFoundException({
      recordType: 'destination',
      recordId: destinationId,
    })

  return deletedDestination
}

// Get Destinations by Planner ID
export async function getDestinationsByPlannerIdService(
  plannerId: string,
): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getDestinationsByPlannerId',
      message: 'Invalid Planner ObjectId format',
    })
  })

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
