import { Types } from 'mongoose';
import { ObjectIdSchema, PlannerSchema, PlannerModel } from '../models/Planner';
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException';
import { MalformedRequestException } from '../exceptions/MalformedRequestException';
import { ZodError } from 'zod';  // Import ZodError for validation handling

export interface PlannerParams {
  plannerId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  startDate?: string;
  endDate?: string;

  comments?: string[];

  roUsers?: string[];
  rwUsers?: string[];

  name?: string;
  description?: string;
  destinations?: string[];
  transportations?: string[];
  accommodations?: string[];
}

// Create a new travel planner
// Create a new travel planner
export async function createPlanner({
  createdBy,
  startDate,
  endDate,
  roUsers,
  rwUsers,
  name,
  description,
  destinations,
  transportations,
  accommodations,
}: PlannerParams) {
  try {
    // Validate input using Zod schema
    
     // Validate the ObjectId for the createdBy field
     const isValidObjectId = ObjectIdSchema.parseAsync(new Types.ObjectId(createdBy));
         

    // Create the planner in the database
    const planner = await PlannerModel.create({
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate,
      endDate,
      comments: [],
      roUsers: roUsers || [],
      rwUsers: rwUsers || [],
      name,
      description,
      destinations: destinations || [],
      transportations: transportations || [],
      accommodations: accommodations || [],
    });

    return { data: planner };
  } catch (error: any) {
    // Handle validation errors (Zod)
      throw new MalformedRequestException({
        requestType: 'createPlanner',
        message: `Validation failed: ${ error.message }`,
      });
    

  }
}

// Get planners by user ID
export async function getPlannersByUserId({ createdBy }: PlannerParams) {
  try {
    // Validate the ObjectId for the createdBy field
    const isValidObjectId = ObjectIdSchema.parseAsync(new Types.ObjectId(createdBy));
    

    // Fetch planners from the database
    const planners = await PlannerModel.find({ createdBy });

    // Return an empty array if no planners are found
    if (!planners || !planners.length) {
      return { data: [] };
    }

    return { data: planners };
  } catch (error) {
    // Handle specific known error types
    if (error instanceof RecordNotFoundException) {
      throw error;  // Re-throw custom exceptions to preserve context
    }

    if (error instanceof MalformedRequestException) {
      throw error;  // Re-throw custom validation exceptions
    }

    // Handle any other errors
    throw new Error(`Failed to retrieve planners: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
