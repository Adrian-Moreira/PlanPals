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
import { StatusCodes } from 'http-status-codes'
import { PlannerModel } from '../../../src/models/Planner'
import PlannerService from '../../../src/services/planner'

describe('Planner->createPlanner', () => {
  let plannerMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newPlanner = {
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    startDate: new Date(),
    endDate: new Date(),
    roUsers: [],
    rwUsers: [targetUser._id],
    destinations: [],
    transportations: [],
    _id: '671ceaae117001732cd0fc83',
  }

  beforeEach(() => {
    plannerMock = sinon.mock(PlannerModel)

    req = {
      body: {
        out: {
          targetUser,
          ...newPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    plannerMock.restore()
  })

  it('should create new planner', async () => {
    plannerMock.expects('create').resolves(newPlanner)

    await PlannerService.createPlannerDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.createdBy).toEqual(targetUser._id)
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
    expect(req.body.result.startDate).toEqual(newPlanner.startDate)
    expect(req.body.result.endDate).toEqual(newPlanner.endDate)
    expect(req.body.result.roUsers).toEqual([])
    expect(req.body.result.rwUsers).toEqual([targetUser._id])
    expect(req.body.result.destinations).toEqual([])
    expect(req.body.result.transportations).toEqual([])
  })
})
