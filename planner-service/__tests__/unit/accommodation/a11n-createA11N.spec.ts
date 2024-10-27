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
import { AccommodationModel } from '../../../src/models/Accommodation'
import AccommodationService from '../../../src/services/accommodation'
import { DestinationModel } from '../../../src/models/Destination'

describe('A11N->createA11N', () => {
  let a11nMock: sinon.SinonMock
  let d9bMock: sinon.SinonMock
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
    a11nMock = sinon.mock(AccommodationModel)
    d9bMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          targetUser,
          targetDestination: existingD9n,
          name: 'test',
          location: 'test',
          startDate: existingD9n.startDate,
          endDate: existingD9n.endDate,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    a11nMock.restore()
    d9bMock.restore()
  })

  it('should create new comment under destination', async () => {
    a11nMock.expects('create').resolves({
      createdBy: targetUser._id,
      destinationId: existingD9n._id,
      name: 'test',
      location: 'test',
      startDate: existingD9n.startDate,
      endDate: existingD9n.endDate,
    })

    d9bMock.expects('findOneAndUpdate').resolves(existingD9n)

    await AccommodationService.createAccommodationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.location).toEqual('test')
    expect(req.body.result.startDate).toEqual(existingD9n.startDate)
    expect(req.body.result.endDate).toEqual(existingD9n.endDate)
  })
})
