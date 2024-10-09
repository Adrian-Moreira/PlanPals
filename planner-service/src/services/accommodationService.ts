import { AccommodationModel } from '../models/Accommodation'

export async function createAccommodationService({
  destinationId,
  name,
  address,
  details,
}: {
  destinationId: string
  name: string
  address: string
  details: string
}): Promise<any> {
  const newAccommodation = await AccommodationModel.create({
    destinationId,
    name,
    address,
    details,
  })

  return newAccommodation
}

export async function updateAccommodationService({
  accommodationId,
  name,
  address,
  details,
}: {
  accommodationId: string
  name: string
  address: string
  details: string
}): Promise<any> {
  const updatedAccommodation = await AccommodationModel.findByIdAndUpdate(
    accommodationId,
    { name, address, details },
    { new: true },
  )
  return updatedAccommodation
}

export async function getAccommodationByIdService(
  accommodationId: string,
): Promise<any> {
  const accommodation = await AccommodationModel.findById(accommodationId)
  return accommodation
}

export async function deleteAccommodationService(
  accommodationId: string,
): Promise<any> {
  const deletedAccommodation = await AccommodationModel.findByIdAndDelete(
    accommodationId,
  )
  return deletedAccommodation
}

// Or use getA11nsByD9nIdService ?
export async function getAccommodationsByDestinationIdService(
  destinationId: string,
): Promise<any> {
  const accommodations = await AccommodationModel.find({ destinationId })
  return accommodations
}
