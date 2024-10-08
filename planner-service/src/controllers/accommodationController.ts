// import { AccommodationModel } from '../models/Accommodation';
// import { PlannerModel } from '../models/Planner';

// export class AccommodationService {
    
//     // Add a new accommodation to the planner
//     public async addAccommodation(planId: string, accommodationData: any): Promise<any> {
//         const planner = await PlannerModel.findById(planId);
//         if (!planner) {
//             throw new Error('Planner not found');
//         }

//         const newAccommodation = new AccommodationModel(accommodationData);
//         planner.accommodations.push(newAccommodation._id);
//         await newAccommodation.save();
//         await planner.save();

//         return newAccommodation;
//     }

//     // Edit an existing accommodation
//     public async editAccommodation(accommodationId: string, accommodationData: any): Promise<any> {
//         const accommodation = await AccommodationModel.findById(accommodationId);
//         if (!accommodation) {
//             throw new Error('Accommodation not found');
//         }

//         Object.assign(accommodation, accommodationData);  // Update accommodation fields
//         return await accommodation.save();
//     }

//     // Delete an accommodation
//     public async deleteAccommodation(accommodationId: string): Promise<void> {
//         const accommodation = await AccommodationModel.findById(accommodationId);
//         if (!accommodation) {
//             throw new Error('Accommodation not found');
//         }
//       await AccommodationModel.deleteOne({ _id: accommodationId });
//     }

//     // Get accommodation details by ID
//     public async getAccommodationDetails(accommodationId: string): Promise<any> {
//         const accommodation = await AccommodationModel.findById(accommodationId);
//         if (!accommodation) {
//             throw new Error('Accommodation not found');
//         }

//         return accommodation;
//     }
// }
import { Request, Response } from 'express';
import { 
  getAccommodationsByDestinationId,
  createAccommodation,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodationById
} from '../services/accommodationService';
import { StatusCodes } from 'http-status-codes';  // Importing StatusCodes for better readability

// Controller to get accommodations by destination
export async function getAccommodationsByDestinationController(req: Request, res: Response) {
  try {
    const { destinationId } = req.params;  // Get the destinationId from route params
    const accommodations = await getAccommodationsByDestinationId(destinationId);  // Call the service function
    return res.status(StatusCodes.OK).json({ success: true, data: accommodations });  // Respond with 200 OK
  } catch (error: any) {
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });  // 500 Internal Server Error
  }
}

// Controller to add a new accommodation to a destination
export async function createAccommodationController(req: Request, res: Response) {
  try {
    const { destinationId } = req.params;  // Get the destinationId from route params
    const accommodationData = req.body;  // Get the accommodation data from the request body

    const newAccommodation = await createAccommodation(destinationId, accommodationData);  // Call the service function
    return res.status(StatusCodes.CREATED).json({ success: true, data: newAccommodation });  // Respond with 201 Created
  } catch (error: any) {
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });  // 500 Internal Server Error
  }
}

// Controller to get accommodation details by ID
export async function getAccommodationByIdController(req: Request, res: Response) {
  try {
    const { destinationId, accommodationId } = req.params;  // Get destinationId and accommodationId from route params
    const accommodation = await getAccommodationById(destinationId, accommodationId);  // Call the service function
    return res.status(StatusCodes.OK).json({ success: true, data: accommodation });  // Respond with 200 OK
  } catch (error: any) {
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });  // 500 Internal Server Error
  }
}

// Controller to edit an accommodation by ID
export async function updateAccommodationController(req: Request, res: Response) {
  try {
    const { destinationId, accommodationId } = req.params;  // Get destinationId and accommodationId from route params
    const accommodationData = req.body;  // Get updated accommodation data from the request body

    const updatedAccommodation = await updateAccommodationById(destinationId, accommodationId, accommodationData);  // Call the service function
    return res.status(StatusCodes.OK).json({ success: true, data: updatedAccommodation });  // Respond with 200 OK
  } catch (error: any) {
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });  // 500 Internal Server Error
  }
}

// Controller to delete an accommodation by ID
export async function deleteAccommodationController(req: Request, res: Response) {
  try {
    const { destinationId, accommodationId } = req.params;  // Get destinationId and accommodationId from route params

    await deleteAccommodationById(destinationId, accommodationId);  // Call the service function to delete the accommodation
    return res.status(StatusCodes.NO_CONTENT).send();  // Respond with 204 No Content
  } catch (error: any) {
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });  // 500 Internal Server Error
  }
}
