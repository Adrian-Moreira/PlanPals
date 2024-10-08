import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { LocationModel } from '../models/Location'

export async function getLocationsService(): Promise<any> {
  const locations = await LocationModel.find().lean()
  if (!locations) throw new RecordNotFoundException({ recordType: 'location' })
  return locations
}

export async function getLocationByIdService({
  locationId,
}: any): Promise<any> {
  const location = await LocationModel.findOne({ _id: locationId }).lean()
  if (!location)
    throw new RecordNotFoundException({
      recordType: 'location',
      recordId: locationId,
    })
  return location
}

export async function createLocationService({
  name,
  address,
  plannerId,
}: any): Promise<any> {
  const location = await LocationModel.create({ name, address, plannerId })
  return location
}

export async function updateLocationService({
  locationId,
  name,
  address,
}: any): Promise<any> {
  const updatedLocation = await LocationModel.findOneAndUpdate(
    { _id: locationId },
    { name, address },
    { new: true },
  )
  return updatedLocation
}

export async function deleteLocationService({ locationId }: any): Promise<any> {
  const deletedLocation = await LocationModel.findOneAndDelete({
    _id: locationId,
  })
  return deletedLocation
}

export async function getLocationsByActivityIdService({
  activityId,
}: any): Promise<any> {}
