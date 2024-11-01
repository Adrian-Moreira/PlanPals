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
import { DestinationModel } from '../../../src/models/Destination'

describe('Destination->getDestinationsById', () => {
  let d9nMock: sinon.SinonMock
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

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [existingD9n._id],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    d9nMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    d9nMock.restore()
  })

  it('should get existing d9ns from planner', async () => {
    d9nMock.expects('findById').withArgs(existingD9n._id).resolves(existingD9n)

    await DestinationService.getDestinationDocumentsByPlannerId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    d9nMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].startDate).toEqual(existingD9n.startDate)
    expect(req.body.result[0].endDate).toEqual(existingD9n.endDate)
  })
})
