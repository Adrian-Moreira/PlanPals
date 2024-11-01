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
import { PlannerModel } from '../../../src/models/Planner'
import TransportationService from '../../../src/services/transportation'

describe('Transportation->createTransportation', () => {
  let t12nMock: sinon.SinonMock
  let plannerMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newTransportation = {
    _id: '671ceaae117001732cd0fc83',
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
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    t12nMock = sinon.mock(TransportModel)
    plannerMock = sinon.mock(PlannerModel)
    req = {
      body: {
        out: {
          targetUser,
          targetPlanner: existingPlanner,
          ...newTransportation,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    t12nMock.restore()
    plannerMock.restore()
  })

  it('should create new transportation under planner', async () => {
    plannerMock.expects('findOneAndUpdate').resolves(existingPlanner)

    t12nMock.expects('create').resolves({
      createdBy: targetUser._id,
      plannerId: existingPlanner._id,
      name: 'test',
      type: 'test',
      details: 'test',
      vehicleId: 'test',
      departureTime: newTransportation.departureTime,
      arrivalTime: newTransportation.arrivalTime,
    })

    await TransportationService.createTransportationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    plannerMock.verify()
    t12nMock.verify()

    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.type).toEqual('test')
    expect(req.body.result.details).toEqual('test')
    expect(req.body.result.vehicleId).toEqual('test')
    expect(req.body.result.departureTime).toEqual(
      newTransportation.departureTime,
    )
    expect(req.body.result.arrivalTime).toEqual(newTransportation.arrivalTime)
  })
})
