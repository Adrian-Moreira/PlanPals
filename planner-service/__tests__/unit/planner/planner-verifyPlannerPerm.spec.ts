import sinon from 'sinon'
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import PlannerService from '../../../src/services/planner'
import { PlannerModel } from '../../../src/models/Planner'
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe('Planner->verifyPlannerPermission', () => {
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser1 = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d24c18132583fe9fb678f',
  }

  const existingPlanner1 = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser1._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser1._id],
  }
  const existingPlanner2 = {
    _id: '671d24c18132583fe9fb233f',
    createdBy: targetUser2._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [],
    transportations: [],
    roUsers: [targetUser1._id],
    rwUsers: [targetUser2._id],
  }

  beforeEach(() => {
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {},
      },
    }
    res = {}
  })

  afterEach(() => {
    plannerMock.restore()
  })

  it('should verify existing planner', async () => {
    req.body.out.plannerId = existingPlanner1._id

    plannerMock.expects('findOne').resolves(existingPlanner1)

    await PlannerService.verifyPlannerExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.out.targetPlanner).toBeDefined()
    expect(req.body.out.targetPlanner._id).toEqual(existingPlanner1._id)
  })

  it('should not verify non-existing planner', async () => {
    plannerMock.expects('findOne').resolves(null)

    await PlannerService.verifyPlannerExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.err).toBeDefined()
  })

  it('should verify planner for user with write permission', async () => {
    req.body.out.targetPlanner = existingPlanner2
    req.body.out.targetUser = targetUser2

    PlannerService.verifyUserCanEditPlanner(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.out.targetPlanner).toBeDefined()
    expect(req.body.out.targetPlanner._id).toEqual(existingPlanner2._id)
  })

  it('should not verify planner for user without write permission', async () => {
    req.body.out.targetPlanner = existingPlanner2
    req.body.out.targetUser = targetUser1

    PlannerService.verifyUserCanEditPlanner(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })

  it('should verify planner for user with read permission', async () => {
    req.body.out.targetPlanner = existingPlanner2
    req.body.out.targetUser = targetUser1

    PlannerService.verifyUserCanViewPlanner(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.out.targetPlanner).toBeDefined()
    expect(req.body.out.targetPlanner._id).toEqual(existingPlanner2._id)
  })

  it('should not verify planner for user without read permission', async () => {
    req.body.out.targetPlanner = existingPlanner1
    req.body.out.targetUser = targetUser2

    PlannerService.verifyUserCanViewPlanner(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
