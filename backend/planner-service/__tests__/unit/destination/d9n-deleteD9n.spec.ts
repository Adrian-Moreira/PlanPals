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

describe('Destination->deleteDestination with Cascade Deletion', () => {
  let d9nMock: sinon.SinonMock
  let activityMock: sinon.SinonMock
  let accommodationMock: sinon.SinonMock
  let voteMock: sinon.SinonMock
  let commentMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingDestination = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'testDestination',
    plannerId: '671d24c18132583fe9fb123f',
  }

  beforeEach(() => {
    d9nMock = sinon.mock(DestinationModel)

    req = {
      body: {
        out: {
          targetDestination: existingDestination,
          targetPlanner: { _id: '671d24c18132583fe9fb123f' },
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    d9nMock.restore()
  })

  it('should cascade delete all related data when a destination is deleted', async () => {
    // Mock deleting the destination
    d9nMock
      .expects('findOneAndDelete')
      .withArgs({
        _id: existingDestination._id,
        plannerId: existingDestination.plannerId,
      })
      .resolves(existingDestination)

    await DestinationService.deleteDestinationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    d9nMock.verify()

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('testDestination')
  })
})
