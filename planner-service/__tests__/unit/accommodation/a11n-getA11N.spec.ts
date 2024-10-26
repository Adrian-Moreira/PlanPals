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
import AccommodationService from '../../../src/services/accommodation'

describe('A11N->getA11NById', () => {
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
    req = {
      body: {
        out: {
          targetAccommodation: existingA11n,
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get existing a11ns from d9n', async () => {
    await AccommodationService.getAccommodationDocumentById(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.location).toEqual('test')
    expect(req.body.result.startDate).toEqual(existingA11n.startDate)
    expect(req.body.result.endDate).toEqual(existingA11n.endDate)
  })
})
