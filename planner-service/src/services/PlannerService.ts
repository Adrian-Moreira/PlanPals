import { PlannerModel, PlannerSchema } from '../models/Planner';  // Import the Mongoose model and Zod schema
import { ZodError } from 'zod';
import { Types } from 'mongoose';


export class PlannerService {
    
    // Create a new travel plan
    public async createTravelPlan(planData: any): Promise<any> {
        try {
            // Validate the incoming data using Zod
            const validatedData = PlannerSchema.parse(planData);

            // Create a new plan using the Mongoose model
            const newPlan = new PlannerModel(validatedData);
            return await newPlan.save();  // Save the new planner to the database
        } catch (error:any) {
           
            if (error instanceof ZodError) {
                // Handle validation errors
                throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
            } else {
                throw new Error(`Failed to create travel plan: ${error.message}`);
            }
        
    }
}

    // Get a planner by ID
    public async getPlannerById(planId: string): Promise<any> {
        try {
            const planner = await PlannerModel.findById(planId).populate('createdBy').populate('comments');
            if (!planner) {
                throw new Error('Planner not found');
            }
            return planner;
        } catch (error: any) {
            throw new Error(`Failed to retrieve planner: ${error.message}`);
        }
    }


       // Invite a user
       public async inviteUser(planId: string, userId: string): Promise<void> {
        try {
            const planner = await PlannerModel.findById(planId);
            if (!planner) {
                throw new Error('Planner not found');
            }
            if (planner.roUsers.includes(new Types.ObjectId(userId)) || planner.rwUsers.includes(new Types.ObjectId(userId))) {
                throw new Error('User is already a member of this planner');
            }
            planner.roUsers.push(new Types.ObjectId(userId));
            await planner.save();
        } catch (error) {
            throw error;
        }
    }
       
       // Join a travel plan
       public async joinTravelPlan(planId: string, userId: string): Promise<void> {
        try {
            const planner = await PlannerModel.findById(planId);
            if (!planner) {
                throw new Error('Planner not found');
            }
            if (planner.roUsers.includes(new Types.ObjectId(userId)) || planner.rwUsers.includes(new Types.ObjectId(userId))) {
                throw new Error('User is already a member of this planner');
            }
            planner.rwUsers.push(new Types.ObjectId(userId));
            await planner.save();
        } catch (error) {
            throw error;
        }
    }
}