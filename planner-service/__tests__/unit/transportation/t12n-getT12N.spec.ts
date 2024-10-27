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

describe('Transportation->getTransportationById', () => {
  let t12nMock: sinon.SinonMock
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

  beforeEach(() => {
    t12nMock = sinon.mock(TransportModel)
    req = {
      body: {
        out: {
          targetTransportation: existingTransportation,
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get existing activity by id', async () => {
    await TransportationService.getTransportationDocumentById(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.type).toEqual('test')
    expect(req.body.result.details).toEqual('test')
    expect(req.body.result.vehicleId).toEqual('test')
    expect(req.body.result.departureTime).toEqual(
      existingTransportation.departureTime,
    )
    expect(req.body.result.arrivalTime).toEqual(
      existingTransportation.arrivalTime,
    )
  })
})
