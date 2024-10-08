import mongoose, { Schema, Types } from 'mongoose';
import { z } from 'zod';

// Zod Validation Schema
export const ObjectIdSchema = z.instanceof(Types.ObjectId).refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Mongoose Schema for Planner
const PlannerMongoSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  updatedAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'Comment',
    required: false,
  },
  roUsers: {  // Read-only users
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  rwUsers: {  // Read-write users
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,  // Typo fix from describtion to description
    required: false,
  },
  destinations: {  // Linked destinations
    type: [Schema.Types.ObjectId],
    ref: 'Destination',
    required: true,
  },
  locations: [{  // locations within the planner
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
  }],
  accommodations: [{  // Accommodations for the planner
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
  }],
  transportations: [{  // Transport options for the planner
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
  }],
}, {
  timestamps: true,  // Automatically add createdAt and updatedAt fields
});

export const PlannerSchema = z.object({
  createdBy: ObjectIdSchema,  // Required
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  roUsers: z.array(ObjectIdSchema),  // Read-only users
  rwUsers: z.array(ObjectIdSchema),  // Read-write users
  name: z.string(),
  description: z.string().optional(),
  destinations: z.array(ObjectIdSchema),  // List of destinations
  locations: z.array(z.object({ name: z.string(), votes: z.number() })).optional(),
  accommodations: z.array(z.object({ name: z.string(), votes: z.number() })).optional(),
  transportations: z.array(z.object({ name: z.string(), votes: z.number() })).optional(),
});


// Export the Planner Model for use in controllers/services
export const PlannerModel = mongoose.model('Planner', PlannerMongoSchema);
export type Planner = z.infer<typeof PlannerSchema>;
