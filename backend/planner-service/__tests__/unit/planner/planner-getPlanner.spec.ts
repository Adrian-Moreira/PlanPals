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

describe('Planner->getPlannerById', () => {
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

  beforeEach(() => {
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get existing planner by id', async () => {
    await PlannerService.getPlannerDocumentByPlannerId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
    expect(req.body.result.startDate).toEqual(existingPlanner.startDate)
    expect(req.body.result.endDate).toEqual(existingPlanner.endDate)
  })
})
