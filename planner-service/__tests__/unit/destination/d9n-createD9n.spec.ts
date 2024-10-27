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

describe('Destination->createDestination', () => {
  let d9nMock: sinon.SinonMock
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newDestination = {
    _id: '671ceaae117001732cd0fc83',
    name: 'test',
    location: 'test',
    startDate: new Date(),
    endDate: new Date(),
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
    d9nMock = sinon.mock(DestinationModel)
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetUser,
          targetPlanner: existingPlanner,
          ...newDestination,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    d9nMock.restore()
    plannerMock.restore()
  })

  it('should create new destination under planner', async () => {
    d9nMock.expects('create').resolves({
      createdBy: targetUser._id,
      plannerId: existingPlanner._id,
      name: 'test',
      location: 'test',
      startDate: newDestination.startDate,
      endDate: newDestination.endDate,
      activities: [],
      accommodations: [],
      _id: newDestination._id,
    })

    plannerMock
      .expects('findOneAndUpdate')
      .resolves({ ...existingPlanner, destinations: [newDestination._id] })

    await DestinationService.createDestinationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    d9nMock.verify()
    plannerMock.verify()
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.location).toEqual('test')
    expect(req.body.result.startDate).toEqual(newDestination.startDate)
    expect(req.body.result.endDate).toEqual(newDestination.endDate)
  })
})
