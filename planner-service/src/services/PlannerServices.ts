import { Types } from 'mongoose';
import { PlannerModel, PlannerSchema } from '../models/Planner';
import {  CommentModel, CommentSchema  } from '../models/Comment';
import { MalformedRequestException } from '../exceptions/MalformedRequestException';
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException';

export class PlannerService {
  public async createPlanner(params: any) {
    try {
      const {
        createdBy,
        startDate,
        endDate,
        roUsers,
        rwUsers,
        name,
        description,
        destinations,
        locations,
        accommodations,
        transportations
      } = params;

      // Ensure that IDs are properly validated
      const newPlanner = {
        createdBy: createdBy ? new Types.ObjectId(createdBy.toString()) : undefined,
        startDate,
        endDate,
        roUsers: roUsers ? roUsers.map((userId: string) => new Types.ObjectId(userId)) : [],
        rwUsers: rwUsers ? rwUsers.map((userId: string) => new Types.ObjectId(userId)) : [],
        name,
        description,
        destinations: destinations ? destinations.map((destId: string) => new Types.ObjectId(destId)) : [],
        locations: locations || [],
        accommodations: accommodations || [],
        transportations: transportations || []
      };

      // Use Zod's .pick() to only validate necessary fields
      await PlannerSchema.pick({
        createdBy: true,
        startDate: true,
        endDate: true,
        roUsers: true,
        rwUsers: true,
        name: true,
        destinations: true,
        description: true,
      }).parseAsync(newPlanner);

      const createdPlanner = await PlannerModel.create(newPlanner);
      //console.log(createdPlanner, 'createdPlanner returned from createPlanner service');
      return { data: createdPlanner };
    } catch (error: any) {
      if (error.name === 'BSONError') {
        throw new MalformedRequestException({ requestType: 'createPlanner', message: 'Invalid ObjectId format' });
      }
      throw new Error(`Failed to create planner: ${error.message}`);
    }
  }
  
  

    // Get planners
    public async getPlanners(): Promise<any> {
        try {
          
            const planners = await PlannerModel.find().lean();
            return { success: true, data: planners };
        } catch (error: any) {
            throw new Error(`Failed to retrieve planners: ${error.message}`);
        }
    }


    // Get planners by user ID
    public async getPlannersByUserId(userId: string): Promise<any> {
        try {
            // Validate that the userId is a valid ObjectId
            if (!Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid ObjectId for userId');
            }

            // Fetch planners where the `createdBy` matches the valid ObjectId
            const planners = await PlannerModel.find({ createdBy: new Types.ObjectId(userId) }).populate('createdBy');
            return planners;
        } catch (error: any) {
            if (error.name === 'BSONError' || error.message.includes('Invalid ObjectId')) {
                throw new Error(`Invalid userId: ${error.message}`);
            }
            throw new Error(`Failed to retrieve planners: ${error.message}`);
        }
    }

    public async joinPlanner(planId: string, userId: string, role: 'ro' | 'rw') {
      try {
        // Convert planId and userId to valid ObjectId
        const planObjectId = new Types.ObjectId(planId.toString());
        const userObjectId = new Types.ObjectId(userId.toString());
  
        const planner = await PlannerModel.findById(planObjectId);
        if (!planner) throw new RecordNotFoundException({ recordType: 'planner', message: 'Planner not found' });
  
        // Check if the user is already part of the planner
        const isUserInPlanner = planner.roUsers.includes(userObjectId) || planner.rwUsers.includes(userObjectId);
        if (isUserInPlanner) throw new Error('User is already part of the planner');
  
        // Add user to the appropriate role list (roUsers or rwUsers)
        if (role === 'ro') {
          planner.roUsers.push(userObjectId);
        } else if (role === 'rw') {
          planner.rwUsers.push(userObjectId);
        }
  
        await planner.save();
        return { data: planner };
      } catch (error: any) {
        if (error.name === 'BSONError') {
          throw new MalformedRequestException({ requestType: 'joinPlanner', message: 'Invalid ObjectId format' });
        }
        throw new Error(`Failed to join planner: ${error.message}`);
      }
    }
  }


  // Update planner by ID
export const updatePlanner = async (id: string, updateData: any) => {
  return await PlannerModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Get comments for a planner
export const getPlannerComments = async (plannerId: string) => {
  return await CommentModel.find({ plannerId });
};
