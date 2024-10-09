import { Types } from 'mongoose'
import { ObjectIdSchema, PlannerModel, PlannerSchema } from '../models/Planner'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { UserModel } from '../models/User'

export const createPlannerService = async ({
  createdBy,
  startDate,
  endDate,
  roUsers,
  rwUsers,
  name,
  description,
  destinations,
  transportations,
  invites,
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
    transportations: transportations
      ? transportations.map((transId: string) => new Types.ObjectId(transId))
      : [],
    invites: invites
      ? invites.map((invId: string) => new Types.ObjectId(invId))
      : [],
  }

  if (!newPlanner.createdBy || !newPlanner.name) {
    throw new MalformedRequestException({
      requestType: 'createPlanner',
      requestBody: 'Invalid request body ' + JSON.stringify(newPlanner),
    })
  }

  if (!(await UserModel.exists({ _id: newPlanner.createdBy }))) {
    throw new RecordNotFoundException({
      recordType: 'user',
      recordId: 'No user found with ID ' + newPlanner.createdBy,
    })
  }

  await PlannerSchema.pick({
    createdBy: true,
    startDate: true,
    endDate: true,
    roUsers: true,
    rwUsers: true,
    name: true,
    destinations: true,
    transportations: true,
    description: true,
    invites: true,
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

export const getPlannerByIdService = async ({
  plannerId,
  userId,
}: any): Promise<any> => {
  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  ).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'getPlannerById',
      message: 'Invalid User ObjectId format ' + err.message,
    })
  })

  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  ).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'getPlannerById',
      message: 'Invalid User ObjectId format ' + err.message,
    })
  })
  const planner = await PlannerModel.findOne({ _id: plannerObjectId })
  if (!planner)
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })

  if (
    planner.roUsers.includes(userId) ||
    planner.rwUsers.includes(userId) ||
    planner.createdBy.equals(userObjectId)
  ) {
    return planner.populate([
      'createdBy',
      'roUsers',
      'rwUsers',
      'destinations',
      'transportations',
      'invites',
    ])
  } else {
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
  }
}

export const getPlannersByUserIdService = async ({
  userId,
}: any): Promise<any> => {
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

export const getPlannersByAccessService = async ({
  userId,
  access,
}: any): Promise<any> => {
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
  listOfUserIdWithRole: [{ _id: string; access: 'ro' | 'rw' }]
}

export const inviteIntoPlannerService = async ({
  plannerId,
  userId,
  listOfUserIdWithRole,
}: PlannerInviteParams): Promise<any> => {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'inviteIntoPlanner',
      message: 'Invalid Planner ObjectId format',
    })
  })

  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'inviteIntoPlanner',
      message: 'Invalid User ObjectId format',
    })
  })

  const planner = await PlannerModel.findById(plannerObjectId)
  if (!planner) {
    throw new RecordNotFoundException({
      recordType: 'Planner',
      message: 'Planner not found',
    })
  }

  if (!planner.rwUsers.includes(userObjectId))
    throw new Error('User is not a RW in the planner')

  for (const { _id, access } of listOfUserIdWithRole) {
    const toBeAdded = await ObjectIdSchema.parseAsync(
      new Types.ObjectId(_id),
    ).catch(() => {
      throw new MalformedRequestException({
        requestType: 'inviteIntoPlanner',
        message: 'Invalid User ObjectId format',
      })
    })

    if (
      toBeAdded.equals(userObjectId) ||
      planner.rwUsers.includes(toBeAdded) ||
      planner.roUsers.includes(toBeAdded)
    ) {
      throw new RecordConflictException({
        requestType: 'inviteIntoPlanner',
        conflict: 'User is already invited in the planner',
      })
    }

    if (access === 'ro') {
      planner.roUsers.push(toBeAdded)
    } else if (access === 'rw') {
      planner.rwUsers.push(toBeAdded)
    }

    return await planner.save()
  }
}

export const updatePlannerService = async ({
  plannerId,
  userId,
  startDate,
  endDate,
  name,
  description,
}: any): Promise<any> => {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  ).catch(() => {
    throw new MalformedRequestException({
      requestType: 'updatePlanner',
      message: 'Invalid Planner ObjectId format',
    })
  })

  const targetPlanner = await PlannerModel.findById(plannerObjectId)
  if (!targetPlanner)
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })

  if (
    targetPlanner.rwUsers.includes(userId) ||
    targetPlanner.createdBy.equals(new Types.ObjectId(userId as string))
  ) {
    return await PlannerModel.findByIdAndUpdate(
      plannerObjectId,
      {
        startDate: startDate || targetPlanner.startDate,
        endDate: endDate || targetPlanner.endDate,
        name: name || targetPlanner.name,
        description: description || targetPlanner.description,
      },
      { new: true },
    ).catch((err) => {
      throw new MalformedRequestException({
        requestType: 'updatePlanner',
        requestBody: 'Invalid Planner ObjectId format ' + err.message,
      })
    })
  } else {
    throw new RecordNotFoundException({
      recordType: 'Planner',
      recordId: plannerId,
    })
  }
}

export const deletePlannerService = async ({
  plannerId,
  userId,
}: any): Promise<any> => {
  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  ).catch((err) => {
    throw new MalformedRequestException({
      requestType: 'deletePlanner',
      message: 'Invalid Planner ObjectId format ' + err.message,
    })
  })

  const targetPlanner = await PlannerModel.findById(plannerObjectId)
  if (!targetPlanner)
    throw new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })

  if (targetPlanner.createdBy.equals(new Types.ObjectId(userId as string))) {
    return await PlannerModel.findByIdAndDelete(plannerObjectId).then(
      (deletePlanner) => {
        if (!deletePlanner) {
          throw new RecordNotFoundException({
            recordType: 'Planner',
            recordId: plannerId,
          })
        }

        return deletePlanner
      },
    )
  } else {
    throw new RecordNotFoundException({
      recordType: 'Planner',
      recordId: plannerId,
    })
  }
}

