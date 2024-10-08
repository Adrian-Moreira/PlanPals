import { Types } from 'mongoose'
import { ObjectIdSchema, PlannerModel, PlannerSchema } from '../models/Planner'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'

export const createPlannerService = async ({
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
  transportations,
}: any): Promise<any> => {
  const newPlanner = {
    createdBy: createdBy ? new Types.ObjectId(createdBy as string) : undefined,
    startDate,
    endDate,
    roUsers: roUsers
      ? roUsers.map((userId: string) => new Types.ObjectId(userId))
      : [],
    rwUsers: rwUsers
      ? rwUsers.map((userId: string) => new Types.ObjectId(userId))
      : [],
    name,
    description,
    destinations: destinations
      ? destinations.map((destId: string) => new Types.ObjectId(destId))
      : [],
    locations: locations || [],
    accommodations: accommodations || [],
    transportations: transportations || [],
  }

  await PlannerSchema.pick({
    createdBy: true,
    startDate: true,
    endDate: true,
    roUsers: true,
    rwUsers: true,
    name: true,
    destinations: true,
    locations: true,
    accommodations: true,
    transportations: true,
    description: true,
  })
    .parseAsync(newPlanner)
    .catch(() => {
      throw new MalformedRequestException({
        requestType: 'createPlanner',
        message: 'Invalid request body',
      })
    })

  return await PlannerModel.create(newPlanner)
}

export async function getPlannerByIdService({
  plannerId,
  userId,
}: any): Promise<any> {
  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getPlannerById',
      message: 'Invalid User ObjectId format',
    })
  })
  const planner = await PlannerModel.findOne({ _id: plannerId }).populate([
    'createdBy',
    'roUsers',
    'rwUsers',
    'destinations',
    'locations',
    'accommodations',
    'transportations',
    'invites',
  ])
  if (!planner)
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })

  if (planner.roUsers.includes(userObjectId)) {
    return await PlannerSchema.omit({
      rwUsers: true,
      createdBy: true,
      invites: true,
    }).parseAsync(planner)
  }
  if (
    planner.rwUsers.includes(userObjectId) ||
    planner.createdBy.equals(userObjectId)
  ) {
    return await PlannerSchema.parseAsync(planner)
  }
  return planner
}

export const getPlannersByUserIdService = async ({
  userId,
}: any): Promise<any> => {
  console.error('userId', userId)
  const id = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  ).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'getPlannersByUserId',
      requestBody: 'Invalid ObjectId format ' + err.message,
    })
  })

  const planners = await PlannerModel.find({ createdBy: id })

  if (!planners || planners.length === 0)
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: 'No planners found for the given user ID ' + userId,
    })

  return planners
}

export async function getPlannersByAccessService({
  userId,
  access,
}: any): Promise<any> {
  const id = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getPlannersByAccess',
      message: 'Invalid ObjectId format',
    })
  })

  if (access == 'ro') {
    return await PlannerModel.find({ roUsers: id }).catch(() => {
      throw new MalformedRequestException({
        requestType: 'getPlannersByAccess',
        requestBody: 'Invalid ObjectId format',
      })
    })
  } else if (access == 'rw') {
    return await PlannerModel.find({ rwUsers: id }).catch(() => {
      throw new MalformedRequestException({
        requestType: 'getPlannersByAccess',
        requestBody: 'Invalid ObjectId format',
      })
    })
  } else {
    throw new MalformedRequestException({
      requestType: 'getPlannersByAccess',
      requestBody: 'Invalid access type',
    })
  }
}

interface PlannerInviteParams {
  plannerId: string
  userId: string
  listOfUserIdWithRole: [{ userId: Types.ObjectId; access: 'ro' | 'rw' }]
}

export async function inviteIntoPlannerService({
  plannerId,
  userId,
  listOfUserIdWithRole,
}: PlannerInviteParams): Promise<any> {
  const plannerObjectId = await ObjectIdSchema.parseAsync(plannerId).catch(
    () => {
      throw new MalformedRequestException({
        requestType: 'inviteIntoPlanner',
        message: 'Invalid Planner ObjectId format',
      })
    },
  )

  const userObjectId = await ObjectIdSchema.parseAsync(userId).catch(() => {
    throw new MalformedRequestException({
      requestType: 'inviteIntoPlanner',
      message: 'Invalid User ObjectId format',
    })
  })

  const planner = await PlannerModel.findById(plannerObjectId)
  if (!planner)
    throw new RecordNotFoundException({
      recordType: 'Planner',
      message: 'Planner not found',
    })

  const isUserRW = planner.rwUsers.includes(userObjectId)

  if (!isUserRW) throw new Error('User is not a RW in the planner')

  listOfUserIdWithRole.forEach(({ userId, access }) => {
    if (access === 'ro') {
      if (planner.roUsers.includes(userId)) {
        throw new RecordConflictException({
          requestType: 'inviteIntoPlanner',
          conflict: 'User is already a RO in the planner',
        })
      }
      planner.roUsers.push(userId)
    } else if (access === 'rw') {
      if (planner.rwUsers.includes(userId)) {
        throw new RecordConflictException({
          requestType: 'inviteIntoPlanner',
          conflict: 'User is already a RW in the planner',
        })
      }
      planner.rwUsers.push(userId)
    }
  })
  return await planner.save()
}
