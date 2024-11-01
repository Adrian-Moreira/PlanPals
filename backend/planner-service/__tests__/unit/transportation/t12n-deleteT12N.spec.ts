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
import { TransportModel } from '../../../src/models/Transport'
import TransportationService from '../../../src/services/transportation'
import { PlannerModel } from '../../../src/models/Planner'

describe('Transportation->deleteTransportation', () => {
  let t12nMock: sinon.SinonMock
  let plannerMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTransportation = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    type: 'test',
    details: 'test',
    vehicleId: 'test',
    departureTime: new Date(),
    arrivalTime: new Date(),
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [],
    transportations: [existingTransportation._id],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    t12nMock = sinon.mock(TransportModel)
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetTransportation: existingTransportation,
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    t12nMock.restore()
    plannerMock.restore()
  })

  it('should delete existing activity', async () => {
    t12nMock.expects('findOneAndDelete').resolves(existingTransportation)

    plannerMock.expects('findOneAndUpdate').resolves(existingPlanner)

    await TransportationService.deleteTransportationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    t12nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.type).toEqual('test')
    expect(req.body.result.details).toEqual('test')
    expect(req.body.result.vehicleId).toEqual('test')
  })
})
