import { Types } from 'mongoose'
import { ObjectIdSchema, PlannerModel, PlannerSchema } from '../models/Planner'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { RecordConflictException } from '../exceptions/RecordConflictException'
import { UserModel } from '../models/User'
import { NextFunction, Request, Response } from 'express'
import assert from 'assert'

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
  }).parseAsync(newPlanner)

  return await PlannerModel.create(newPlanner)
}

export const getPlannerByIdService = async ({
  plannerId,
  userId,
}: any): Promise<any> => {
  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId as string),
  )

  const plannerObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(plannerId as string),
  )

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
  )

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
  )

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
  )
  const userObjectId = await ObjectIdSchema.parseAsync(
    new Types.ObjectId(userId),
  )

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
    const toBeAdded = await ObjectIdSchema.parseAsync(new Types.ObjectId(_id))

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
  )

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
  )

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

/**
 * Verify that a planner with the given ID exists in the database. If not, throw
 * a RecordNotFoundException with the planner ID and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
function verifyPlannerExists(req: Request, res: Response, next: NextFunction) {
  if (req.body.err) {
    next(req.body.err)
  }
  const { plannerId } = req.body.out
  const targetPlanner = PlannerModel.findOne({ _id: plannerId })
  if (!targetPlanner) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

/**
 * Verify that the user can edit the planner. If the user is not allowed to
 * edit the planner, a RecordNotFoundException is thrown with the planner ID
 * and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
function verifyUserCanEditPlanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body.err) {
    next(req.body.err)
  }
  let { plannerId, createdBy, userId, targetPlanner } = req.body.out
  userId ||= createdBy // Assuming either userId or createdBy is provided
  assert(userId || createdBy, 'User ID is required')
  if (
    !targetPlanner.rwUsers.includes(userId) &&
    !targetPlanner.createdBy?.equals(userId)
  ) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

/**
 * Verify that the user can view the planner. If the user is not allowed to
 * view the planner, a RecordNotFoundException is thrown with the planner ID
 * and record type of 'planner'.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
function verifyUserCanViewPlanner(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body.err) {
    next(req.body.err)
  }
  let { plannerId, createdBy, userId, targetPlanner } = req.body.out
  userId ||= createdBy // Assuming either userId or createdBy is provided
  assert(userId || createdBy, 'User ID is required')
  if (
    !targetPlanner.roUsers.includes(userId) &&
    !targetPlanner.rwUsers.includes(userId) &&
    !targetPlanner.createdBy?.equals(userId)
  ) {
    req.body.err = new RecordNotFoundException({
      recordType: 'planner',
      recordId: plannerId,
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, targetPlanner }
  }
  next()
}

const PlannerService = {
  verifyPlannerExists,
  verifyUserCanEditPlanner,
  verifyUserCanViewPlanner,
}

export default PlannerService
