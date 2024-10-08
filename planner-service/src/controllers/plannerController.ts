import { Request, Response } from 'express';
import { PlannerService } from '../services/PlannerService';
import { MalformedRequestException } from '../exceptions/MalformedRequestException';
import { StatusCodes } from 'http-status-codes';  // Make sure to import this

// Initialize the PlannerService
const plannerService = new PlannerService();


export async function createPlanner(req: Request, res: Response) {
  try {
    const plannerData = req.body;
    //console.log('plannerData', plannerData);
    if (!plannerData) {
      //console.log('Invalid request body ENTEREDDDDD ');
      throw new MalformedRequestException({ requestType: 'createPlanner', message: 'Invalid request body' });
    }

    const result = await plannerService.createPlanner(plannerData);

    // Ensure to return 201 for a successful creation
    console.log(result, 'createddddddddddddd Controller');
    //console.log(res.status(StatusCodes.CREATED).json({ success: true, ...result }), 'status created Controller');
    //return res.status(StatusCodes.CREATED).send(result)
    return res.status(StatusCodes.CREATED).json({ success: true, data: result });
  } catch (error: any) {
    // Use JSON.stringify with Object.getOwnPropertyNames to avoid circular references in logging
    if (error instanceof MalformedRequestException) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
}




// Controller function to get planners by user ID
export async function getPlannersByUserId(req: Request, res: Response) {
  try {
    const { createdBy } = req.query;

 // Assuming the userId comes from route params
    const result = await plannerService.getPlannersByUserId(createdBy as string);
    return res.status(StatusCodes.OK).json({success: true, data: result});
  } catch (error: any) {
    //res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}

// // Join a travel plan
// export async function joinPlanner(planId: string, userId: string, role: 'ro' | 'rw') {
//   try {
//     const planner = await PlannerModel.findById(new Types.ObjectId(planId));
//     if (!planner) throw new RecordNotFoundException({ recordType: 'planner', message: 'Planner not found' });

//     const userObjectId = new Types.ObjectId(userId);

//     // Check if the user is already in the planner
//     const isUserInPlanner = planner.roUsers.includes(userObjectId) || planner.rwUsers.includes(userObjectId);
//     if (isUserInPlanner) throw new Error('User is already part of the planner');

//     // Add user to the appropriate role list (roUsers or rwUsers)
//     if (role === 'ro') {
//       planner.roUsers.push(userObjectId);
//     } else if (role === 'rw') {
//       planner.rwUsers.push(userObjectId);
//     }

//     // Save the updated planner
//     await planner.save();
//     return { data: planner };
//   } catch (error: any) {
//     throw new Error(`Failed to join planner: ${error.message}`);
//   }
// }

// Controller function to join a planner

export async function joinPlanner(req: Request, res: Response) {
  try {
    const { planId, userId } = req.params;  // Assuming planId and userId come from route params
    const { role } = req.body;  // Assuming role is sent in the request body ('ro' or 'rw')
    
    if (!role || (role !== 'ro' && role !== 'rw')) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid role specified' });
    }

    const result = await plannerService.joinPlanner(planId, userId,'ro'); // Pass 'ro' or 'rw' as the role needed
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
