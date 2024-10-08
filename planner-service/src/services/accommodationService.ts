import { AccommodationModel } from '../models/Accommodation';
import { PlannerModel } from '../models/Planner';

// Get all accommodations for a specific destination
export async function getAccommodationsByDestinationId(destinationId: string): Promise<any> {
  const accommodations = await AccommodationModel.find({ destination: destinationId });
  return accommodations;
}

// Create a new accommodation for a specific destination
export async function createAccommodation(destinationId: string, accommodationData: any): Promise<any> {
  const newAccommodation = new AccommodationModel({
    ...accommodationData,
    destination: destinationId
  });
  await newAccommodation.save();
  return newAccommodation;
}

// Get a specific accommodation by ID
export async function getAccommodationById(destinationId: string, accommodationId: string): Promise<any> {
  const accommodation = await AccommodationModel.findOne({ _id: accommodationId, destination: destinationId });
  if (!accommodation) {
    throw new Error('Accommodation not found');
  }
  return accommodation;
}

// Update a specific accommodation by ID
export async function updateAccommodationById(destinationId: string, accommodationId: string, accommodationData: any): Promise<any> {
  const accommodation = await AccommodationModel.findOneAndUpdate(
    { _id: accommodationId, destination: destinationId },
    accommodationData,
    { new: true }
  );
  if (!accommodation) {
    throw new Error('Accommodation not found');
  }
  return accommodation;
}

// Delete a specific accommodation by ID
export async function deleteAccommodationById(destinationId: string, accommodationId: string): Promise<void> {
  const accommodation = await AccommodationModel.findOneAndDelete({ _id: accommodationId, destination: destinationId });
  if (!accommodation) {
    throw new Error('Accommodation not found');
  }
}
