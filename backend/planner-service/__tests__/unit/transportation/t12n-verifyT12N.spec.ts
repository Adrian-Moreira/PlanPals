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
import TransportationService from '../../../src/services/transportation'
import { TransportModel } from '../../../src/models/Transport'

describe('Transportation->verifyT12N', () => {
  let t12nMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTransportation = {
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
    transportations: [existingTransportation._id],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    t12nMock = sinon.mock(TransportModel)
    req = {
      body: {
        out: {
          transportationId: existingTransportation._id,
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    t12nMock.restore()
  })

  it('should verify existing activity', async () => {
    t12nMock.expects('findOne').resolves(existingTransportation)

    await TransportationService.verifyTransportationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    t12nMock.verify()
    expect(req.body.out.targetTransportation).toBeDefined()
    expect(req.body.out.targetTransportation._id).toEqual(
      existingTransportation._id,
    )
  })

  it('should not verify non-existing activity', async () => {
    t12nMock.expects('findOne').resolves(null)

    await TransportationService.verifyTransportationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    t12nMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
