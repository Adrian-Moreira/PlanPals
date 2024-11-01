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

describe('Destination->updateDestination', () => {
  let destinationMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingD9n = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    title: 'test',
    activities: [],
    accommodations: [],
    plannerId: '671d24c18132583fe9fb123f',
  }

  beforeEach(() => {
    destinationMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          targetDestination: existingD9n,
          name: 'test1',
          startDate: new Date(),
          endDate: new Date(),
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    destinationMock.restore()
  })

  it('should update existing destination', async () => {
    destinationMock.expects('findOneAndUpdate').resolves({
      createdBy: targetUser._id,
      destinationId: existingD9n._id,
      name: 'test1',
      startDate: new Date(),
      endDate: new Date(),
    })

    await DestinationService.updateDestinationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    destinationMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test1')
  })
})
