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

describe('A11N->updateA11N', () => {
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
          targetUser,
          targetAccommodation: existingA11n,
          name: 'test1',
          location: 'test1',
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    a11nMock.restore()
  })

  it('should update existing a11n', async () => {
    a11nMock.expects('findOneAndUpdate').resolves({
      createdBy: targetUser._id,
      destinationId: existingA11n._id,
      name: 'test1',
      location: 'test1',
      startDate: existingA11n.startDate,
      endDate: existingA11n.endDate,
    })

    await AccommodationService.updateAccommodationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    a11nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test1')
    expect(req.body.result.location).toEqual('test1')
    expect(req.body.result.startDate).toEqual(existingA11n.startDate)
    expect(req.body.result.endDate).toEqual(existingA11n.endDate)
  })
})
