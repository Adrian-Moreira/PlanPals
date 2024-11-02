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

describe('Activity->updateActivity', () => {
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

  beforeEach(() => {
    activityMock = sinon.mock(ActivityModel)
    req = {
      body: {
        out: {
          targetActivity: existingActivity,
          name: 'test1',
          location: 'test1',
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    activityMock.restore()
  })

  it('should update existing activity', async () => {
    activityMock.expects('findOneAndUpdate').resolves({
      createdBy: targetUser._id,
      destinationId: existingActivity._id,
      name: 'test1',
      location: 'test1',
      startDate: existingActivity.startDate,
      endDate: existingActivity.endDate,
    })

    await ActivityService.updateActivityDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    activityMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test1')
    expect(req.body.result.location).toEqual('test1')
    expect(req.body.result.startDate).toEqual(existingActivity.startDate)
    expect(req.body.result.endDate).toEqual(existingActivity.endDate)
  })
})
