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
import { AccommodationModel } from '../../../src/models/Accommodation'
import AccommodationService from '../../../src/services/accommodation'

describe('A11N->verifyA11N', () => {
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

  beforeEach(() => {
    a11nMock = sinon.mock(AccommodationModel)
    req = {
      body: {
        out: {
          accommodationId: existingA11n._id,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    a11nMock.restore()
  })

  it('should verify existing a11n', async () => {
    a11nMock.expects('findOne').resolves(existingA11n)

    await AccommodationService.verifyAccommodationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.out.targetAccommodation).toBeDefined()
    expect(req.body.out.targetAccommodation._id).toEqual(existingA11n._id)
  })

  it('should not verify non-existing a11n', async () => {
    a11nMock.expects('findOne').resolves(null)

    await AccommodationService.verifyAccommodationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
