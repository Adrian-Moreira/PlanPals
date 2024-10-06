import { Types } from 'mongoose'
import { ObjectIdSchema } from '../models/Planner'
import { PlannerSchema, PlannerModel } from '../models/Planner'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'

export interface PlannerParams {
  plannerId?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string

  startDate?: string
  endDate?: string

  comments?: string[]

  roUsers?: string[]
  rwUsers?: string[]

  name?: string
  description?: string
  destinations?: string[]
  transportations?: string[]
}

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
}: PlannerParams) {
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
  })

  return { data: planner }
}

export async function getPlannersByUserId({ createdBy }: PlannerParams) {
  try {
    ObjectIdSchema.parseAsync(new Types.ObjectId(createdBy)).catch(() => {
      throw new MalformedRequestException({
        requestType: 'getPlannersByUserId',
      })
    })
    const planners = await PlannerModel.find({ createdBy })
    return { data: planners }
  } catch (error) {
    throw new RecordNotFoundException({
      recordType: 'Planner',
      recordId: createdBy,
    })
  }
}
