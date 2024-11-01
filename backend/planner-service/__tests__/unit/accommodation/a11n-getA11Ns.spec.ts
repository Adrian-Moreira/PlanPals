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

describe('A11N->getA11NsById', () => {
  let a11nMock: sinon.SinonMock
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
    req = {
      body: {
        out: {
          targetDestination: existingD9n,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    a11nMock.restore()
  })

  it('should get existing a11ns from d9n', async () => {
    a11nMock.expects('findById').resolves(existingA11n)

    await AccommodationService.getAccommodationDocumentsByDestinationId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].location).toEqual('test')
    expect(req.body.result[0].startDate).toEqual(existingA11n.startDate)
    expect(req.body.result[0].endDate).toEqual(existingA11n.endDate)
  })
})
