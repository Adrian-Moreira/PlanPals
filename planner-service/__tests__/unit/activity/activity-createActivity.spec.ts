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
import { ActivityModel } from '../../../src/models/Activity'
import ActivityService from '../../../src/services/activity'

describe('Activity->createActivity', () => {
  let activityMock: sinon.SinonMock
  let d9nMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newActivity = {
    name: 'test',
    location: 'test',
    startDate: new Date(),
    endDate: new Date(),
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
    activityMock = sinon.mock(ActivityModel)
    d9nMock = sinon.mock(DestinationModel)
    req = {
      body: {
        out: {
          targetUser,
          targetDestination: existingD9n,
          ...newActivity,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    activityMock.restore()
    d9nMock.restore()
  })

  it('should create new comment under destination', async () => {
    activityMock.expects('create').resolves({
      createdBy: targetUser._id,
      destinationId: existingD9n._id,
      name: 'test',
      location: 'test',
      startDate: newActivity.startDate,
      endDate: newActivity.endDate,
    })

    d9nMock.expects('findOneAndUpdate').resolves(existingD9n)

    await ActivityService.createActivityDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    activityMock.verify()
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.location).toEqual('test')
    expect(req.body.result.startDate).toEqual(newActivity.startDate)
    expect(req.body.result.endDate).toEqual(newActivity.endDate)
  })
})
