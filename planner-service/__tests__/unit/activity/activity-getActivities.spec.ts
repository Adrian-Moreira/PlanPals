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
import { ActivityModel } from '../../../src/models/Activity'
import ActivityService from '../../../src/services/activity'

describe('Activity->getActivitiesById', () => {
  let activityMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingActivity = {
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
    activities: [existingActivity._id],
    accommodations: [],
    plannerId: '671d24c18132583fe9fb123f',
  }

  beforeEach(() => {
    activityMock = sinon.mock(ActivityModel)
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
    activityMock.restore()
  })

  it('should get existing activities from d9n', async () => {
    activityMock.expects('findById').resolves(existingActivity)

    await ActivityService.getActivitiyDocumentsByDestinationId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    activityMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].location).toEqual('test')
    expect(req.body.result[0].startDate).toEqual(existingActivity.startDate)
    expect(req.body.result[0].endDate).toEqual(existingActivity.endDate)
  })
})
