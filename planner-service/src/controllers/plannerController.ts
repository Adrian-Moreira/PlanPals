import { Request, Response } from 'express';
import { PlannerService } from '../services/PlannerService';
import { MalformedRequestException } from '../exceptions/MalformedRequestException';
import { CommentController } from './commentController';
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
    //console.log(result, 'createddddddddddddd Controller');
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

// // Update Planner
// export const updatePlanner = async (req: Request, res: Response, next: Function) => {
//   try {
//       const plannerId = req.params.id;
//       const updateData = req.body;
//       const updatedPlanner = await plannerService.updatePlanner(plannerId, updateData);
//       res.status(StatusCodes.OK).json({ success: true, data: updatedPlanner });
//   } catch (error) {
//       next(error);
//   }
// };

const commentController = new CommentController();
// New method: get comments for a specific planner
export async function getCommentsByPlanner(req: Request, res: Response) {
  return res.status(200).json({ success: true, data: commentController.getCommentsByPlanner(req, res) });
}

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
