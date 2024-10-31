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
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe.skip('A11N->deleteA11N', () => {
  let a11nMock: sinon.SinonMock
  let d9nMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingA11n = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    location: 'test',
    destinationId: '671ceaae117001732cd0fc83',
  }

  const existingD9n = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    title: 'test',
    activities: [],
    accommodations: [existingA11n._id],
    plannerId: '671d24c18132583fe9fb123f',
  }

  beforeEach(() => {
    a11nMock = sinon.mock(AccommodationModel)
    d9nMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          targetAccommodation: existingA11n,
          targetDestination: existingD9n,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    a11nMock.restore()
    d9nMock.restore()
  })

  it('should delete existing a11n', async () => {
    a11nMock.expects('findOneAndDelete').resolves(existingA11n)
    d9nMock.expects('findOneAndUpdate').resolves(existingD9n)

    await AccommodationService.deleteAccommodationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.location).toEqual('test')
    expect(req.body.result.startDate).toEqual(existingA11n.startDate)
    expect(req.body.result.endDate).toEqual(existingA11n.endDate)
  })

  it('should not delete non-existing a11n', async () => {
    a11nMock.expects('findOneAndDelete').resolves(null)
    d9nMock.expects('findOneAndUpdate').resolves(existingD9n)

    await AccommodationService.deleteAccommodationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
