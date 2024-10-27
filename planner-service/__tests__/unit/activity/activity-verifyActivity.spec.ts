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
import ActivityService from '../../../src/services/activity'
import { ActivityModel } from '../../../src/models/Activity'

describe('Activity->verifyActivity', () => {
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
          activityId: existingActivity._id,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    activityMock.restore()
  })

  it('should verify existing activity', async () => {
    activityMock.expects('findOne').resolves(existingActivity)

    await ActivityService.verifyActivityExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    activityMock.verify()
    expect(req.body.out.targetActivity).toBeDefined()
    expect(req.body.out.targetActivity._id).toEqual(existingActivity._id)
  })

  it('should not verify non-existing activity', async () => {
    activityMock.expects('findOne').resolves(null)

    await ActivityService.verifyActivityExists(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    activityMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
