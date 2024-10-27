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
import DestinationService from '../../../src/services/destination'
import { DestinationModel } from '../../../src/models/Destination'

describe('Destination->verifyDestination', () => {
  let destinationMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingDestination = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    location: 'test',
    destinationId: '671ceaae117001732cd0fc83',
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: [existingDestination._id],
    transportations: [],
    roUsers: [],
    rwUsers: [targetUser._id],
  }

  beforeEach(() => {
    destinationMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          destinationId: existingDestination._id,
          targetPlanner: existingPlanner,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    destinationMock.restore()
  })

  it('should verify existing destination', async () => {
    destinationMock.expects('findOne').resolves(existingDestination)

    await DestinationService.verifyDestinationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    destinationMock.verify()
    expect(req.body.out.targetDestination).toBeDefined()
    expect(req.body.out.targetDestination._id).toEqual(existingDestination._id)
  })

  it('should not verify non-existing destination', async () => {
    destinationMock.expects('findOne').resolves(null)

    await DestinationService.verifyDestinationExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    destinationMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
