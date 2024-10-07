// accommodationController.ts
import { AccommodationModel } from '../models/Accommodation';

/**
 * Creates a new accommodation
 * @param {string} destinationId - The ID of the destination to which the accommodation belongs
 * @param {object} accommodationData - The data of the accommodation to be created
 * @returns {Promise<Accommodation>} - The newly created accommodation
 */
export const createAccommodation = async (destinationId: string, accommodationData: any) => {
  try {
    // Create a new accommodation with the given destination ID and data
    const accommodation = new AccommodationModel({ accommodationData, destinationId });
    // Save the accommodation to the database
    await accommodation.save();
    // Return the newly created accommodation
    return accommodation;
  } catch (error) {
    // If there's an error, rethrow it
    throw error;
  }
};

export const getAccommodationsByDestinationId = async (destinationId: string) => {
  try {
    const accommodations = await AccommodationModel.find({ destinationId });
    return accommodations;
  } catch (error) {
    throw error;
  }
};

export const getAccommodationById = async (destinationId: string, accommodationId: string) => {
  try {
    const accommodation = await AccommodationModel.findOne({ destinationId, _id: accommodationId });
    return accommodation;
  } catch (error) {
    throw error;
  }
};

export const updateAccommodationById = async (destinationId: string, accommodationId: string, accommodationData: any) => {
  try {
    const accommodation = await AccommodationModel.findByIdAndUpdate(accommodationId, accommodationData, { new: true });
    return accommodation;
  } catch (error) {
    throw error;
  }
};

export const deleteAccommodationById = async (destinationId: string, accommodationId: string) => {
  try {
    await AccommodationModel.findByIdAndDelete(accommodationId);
  } catch (error) {
    throw error;
  }
};