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
import { DestinationModel } from '../../../src/models/Destination'
import DestinationService from '../../../src/services/destination'
import { PlannerModel } from '../../../src/models/Planner'

describe('Destination->deleteDestination', () => {
  let d9nMock: sinon.SinonMock
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingDestination = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    activities: [],
    accommodations: [],
    plannerId: '671d24c18132583fe9fb123f',
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [existingDestination._id],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    d9nMock = sinon.mock(DestinationModel)
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetDestination: existingDestination,
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    d9nMock.restore()
    plannerMock.restore()
  })

  it('should delete existing destination', async () => {
    d9nMock.expects('findOneAndDelete').resolves(existingDestination)
    plannerMock
      .expects('findOneAndUpdate')
      .resolves({ ...existingPlanner, destinations: [] })

    await DestinationService.deleteDestinationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    d9nMock.verify()
    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.startDate).toEqual(existingDestination.startDate)
    expect(req.body.result.endDate).toEqual(existingDestination.endDate)
  })
})
