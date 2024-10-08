import { Types } from 'mongoose'
import { ObjectIdSchema, PlannerModel, PlannerSchema } from '../models/Planner'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'

export async function createPlannerService({
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
}: any) {
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

  const createdPlanner = await PlannerModel.create(newPlanner)

  return createdPlanner
}

export async function getPlannersService(): Promise<any> {
  const planners = await PlannerModel.find().lean()
  if (!planners) throw new RecordNotFoundException({ recordType: 'planner' })
  return planners
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

export async function getPlannersByUserIdService(userId: string): Promise<any> {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ObjectId for userId')
    }

    const planners = await PlannerModel.find({
      createdBy: new Types.ObjectId(userId),
    }).populate('createdBy')
    return planners
  } catch (error: any) {
    if (
      error.name === 'BSONError' ||
      error.message.includes('Invalid ObjectId')
    ) {
      throw new Error(`Invalid userId: ${error.message}`)
    }
    throw new Error(`Failed to retrieve planners: ${error.message}`)
  }
}

export async function getPlannersByAccessService({
  userId,
  access,
}: any): Promise<any> {
  const id = await ObjectIdSchema.parseAsync(userId).catch(() => {
    throw new MalformedRequestException({
      requestType: 'getPlannersByAccess',
      message: 'Invalid ObjectId format',
    })
  })
  const planners = PlannerModel.find({ rwUsers: userId })
    .then((planners) => {
      console.log('Planners with RW access:', planners)
    })
    .catch(() => {
      throw new RecordNotFoundException({
        recordType: '[Planner]',
        message: 'Planner not found',
      })
    })
  return planners
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
