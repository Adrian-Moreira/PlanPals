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

describe('Planner->updatePlanner', () => {
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  const updatedPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test1',
    description: 'test1',
    destinations: [],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetPlanner: existingPlanner,
          ...updatedPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    plannerMock.restore()
  })

  it('should update existing planner', async () => {
    plannerMock.expects('findOneAndUpdate').resolves(updatedPlanner)

    await PlannerService.updatePlannerDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test1')
    expect(req.body.result.description).toEqual('test1')
  })
})
