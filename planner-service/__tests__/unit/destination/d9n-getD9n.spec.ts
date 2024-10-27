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
import DestinationService from '../../../src/services/destination'

describe('Destination->getDestinationById', () => {
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
    name: 'test',
    activities: [],
    accommodations: [],
    plannerId: '671d24c18132583fe9fb123f',
  }

  beforeEach(() => {
    req = {
      body: {
        out: {
          targetDestination: existingD9n,
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get existing destination by id', async () => {
    await DestinationService.getDestinationDocumentById(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.plannerId).toEqual('671d24c18132583fe9fb123f')
    expect(req.body.result.startDate).toEqual(existingD9n.startDate)
    expect(req.body.result.endDate).toEqual(existingD9n.endDate)
  })
})
