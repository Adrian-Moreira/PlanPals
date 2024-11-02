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

describe('Planner->getPlannersById', () => {
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser1 = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d23c18132583fe9fb978f',
  }

  const targetUser3 = {
    _id: '681d23c18132583fe9fb978f',
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser1._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [],
    transportations: [],
    roUsers: [targetUser2._id],
    rwUsers: [targetUser1._id],
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

  it('should get existing planners for user', async () => {
    req.body.out.targetUser = targetUser1

    plannerMock
      .expects('find')
      .withArgs({ createdBy: targetUser1._id })
      .resolves([existingPlanner])

    await PlannerService.getPlannerDocumentsByUserId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].description).toEqual('test')
    expect(req.body.result[0].rwUsers).toEqual([targetUser1._id])
  })

  it('should get ro get existing planners for user', async () => {
    req.body.out.targetUser = targetUser2
    req.body.out.access = 'ro'

    plannerMock
      .expects('find')
      .withArgs({ roUsers: targetUser2._id })
      .resolves([existingPlanner])

    await PlannerService.getPlannerDocumentsByUserId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].description).toEqual('test')
    expect(req.body.result[0].rwUsers).toEqual([targetUser1._id])
  })

  it('should not rw get existing planners for user', async () => {
    req.body.out.targetUser = targetUser2
    req.body.out.access = 'rw'

    plannerMock
      .expects('find')
      .withArgs({ rwUsers: targetUser2._id })
      .resolves(null)

    await PlannerService.getPlannerDocumentsByUserId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.err).toBeDefined()
  })

  it('should not get existing planners for user', async () => {
    req.body.out.targetUser = targetUser3

    plannerMock.expects('find').resolves(null)

    await PlannerService.getPlannerDocumentsByUserId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
