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

describe('Transportation->updateTransportation', () => {
  let t12nMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newTransportation = {
    _id: '671ceaae117001732cd0fc83',
    type: 'test1',
    details: 'test1',
    vehicleId: 'test1',
    departureTime: new Date(),
    arrivalTime: new Date(),
  }

  const existingTransportation = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    destinationId: '671ceaae117001732cd0fc83',
    type: 'test',
    details: 'test',
    vehicleId: 'test',
    departureTime: new Date(),
    arrivalTime: new Date(),
  }

  beforeEach(() => {
    t12nMock = sinon.mock(TransportModel)
    req = {
      body: {
        out: {
          targetTransportation: existingTransportation,
          ...newTransportation,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    t12nMock.restore()
  })

  it('should update existing t12n', async () => {
    t12nMock.expects('findOneAndUpdate').resolves({
      createdBy: targetUser._id,
      ...newTransportation,
    })

    await TransportationService.updateTransportationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    t12nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.type).toEqual('test1')
    expect(req.body.result.details).toEqual('test1')
    expect(req.body.result.vehicleId).toEqual('test1')
    expect(req.body.result.departureTime).toEqual(
      newTransportation.departureTime,
    )
    expect(req.body.result.arrivalTime).toEqual(newTransportation.arrivalTime)
  })
})
