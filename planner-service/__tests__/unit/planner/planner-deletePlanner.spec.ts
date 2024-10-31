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
import { PlannerModel } from '../../../src/models/Planner'
import { DestinationModel } from '../../../src/models/Destination'
import { TransportModel } from '../../../src/models/Transport';
import { ActivityModel } from '../../../src/models/Activity'
import { AccommodationModel } from '../../../src/models/Accommodation'
import { VoteModel } from '../../../src/models/Vote'
import { CommentModel } from '../../../src/models/Comment'
import PlannerService from '../../../src/services/planner'

describe('Planner->deletePlanner with Cascade Deletion', () => {
  let plannerMock: sinon.SinonMock
  let destinationMock: sinon.SinonMock
  let activityMock: sinon.SinonMock
  let transportMock: sinon.SinonMock;
  let accommodationMock: sinon.SinonMock
  let voteMock: sinon.SinonMock
  let commentMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingPlanner = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'test',
    description: 'test',
    destinations: ['671d24c18132583fe9fb4567'],
    transportations: ['671d24c18132583fe9fb4568'],
    roUsers: [],
    rwUsers: [targetUser._id],
  }



  beforeEach(() => {
    plannerMock = sinon.mock(PlannerModel)
    destinationMock = sinon.mock(DestinationModel)
    transportMock = sinon.mock(TransportModel)
    activityMock = sinon.mock(ActivityModel)
    accommodationMock = sinon.mock(AccommodationModel)
    voteMock = sinon.mock(VoteModel)
    commentMock = sinon.mock(CommentModel)

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
    plannerMock.restore()
    destinationMock.restore()
    transportMock.restore();
    activityMock.restore()
    accommodationMock.restore()
    voteMock.restore()
    commentMock.restore()
  })

  it('should cascade delete all related data and set result in response', async () => {
    plannerMock.expects('findOneAndDelete').withArgs({ _id: existingPlanner._id }).resolves(existingPlanner)
    destinationMock.expects('deleteMany').withArgs({ plannerId: existingPlanner._id }).resolves()
    transportMock.expects('deleteMany').withArgs({ plannerId: existingPlanner._id }).resolves();
    activityMock.expects('deleteMany').withArgs({ destinationId: { $in: existingPlanner.destinations } }).resolves()
    accommodationMock.expects('deleteMany').withArgs({ destinationId: { $in: existingPlanner.destinations } }).resolves()
    voteMock.expects('deleteMany').withArgs({ $or: [{ plannerId: existingPlanner._id }, { destinationId: { $in: existingPlanner.destinations } }] }).resolves()
    commentMock.expects('deleteMany').withArgs({ $or: [{ plannerId: existingPlanner._id }, { destinationId: { $in: existingPlanner.destinations } }] }).resolves()

    await PlannerService.deletePlannerDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )
  
    // Verify all mocks
    plannerMock.verify()
    destinationMock.verify()
    activityMock.verify()
    accommodationMock.verify()
    voteMock.verify()
    commentMock.verify()
  
    // Check response status and result
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
  })

  it('should handle error if planner deletion fails', async () => {
    // Simulate error on planner deletion
    const error = new Error('Deletion failed')
    plannerMock.expects('findOneAndDelete').withArgs({ _id: existingPlanner._id }).rejects(error)

    try {
      await PlannerService.deletePlannerDocument(
        req as Request,
        res as Response,
        next as NextFunction,
      )
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    plannerMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should handle error if destination deletion fails', async () => {
    // Mock successful planner deletion
    plannerMock.expects('findOneAndDelete').withArgs({ _id: existingPlanner._id }).resolves(existingPlanner)

    // Simulate error on destination deletion
    const error = new Error('Destination deletion failed')
    destinationMock.expects('deleteMany').withArgs({ plannerId: existingPlanner._id }).rejects(error)

    try {
      await PlannerService.deletePlannerDocument(
        req as Request,
        res as Response,
        next as NextFunction,
      )
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    plannerMock.verify()
    destinationMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should handle error if activity or accommodation deletion fails', async () => {
    // Mock successful planner and destination deletion
    plannerMock.expects('findOneAndDelete').withArgs({ _id: existingPlanner._id }).resolves(existingPlanner)
    destinationMock.expects('deleteMany').withArgs({ plannerId: existingPlanner._id }).resolves()

    // Simulate error on activity deletion
    const error = new Error('Activity deletion failed')
    activityMock.expects('deleteMany').withArgs({ destinationId: { $in: existingPlanner.destinations } }).rejects(error)

    try {
      await PlannerService.deletePlannerDocument(
        req as Request,
        res as Response,
        next as NextFunction,
      )
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    plannerMock.verify()
    destinationMock.verify()
    activityMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should handle error if vote or comment deletion fails', async () => {
    // Mock successful planner, destination, and activity deletion
    plannerMock.expects('findOneAndDelete').withArgs({ _id: existingPlanner._id }).resolves(existingPlanner)
    destinationMock.expects('deleteMany').withArgs({ plannerId: existingPlanner._id }).resolves()
    activityMock.expects('deleteMany').withArgs({ destinationId: { $in: existingPlanner.destinations } }).resolves()
    accommodationMock.expects('deleteMany').withArgs({ destinationId: { $in: existingPlanner.destinations } }).resolves()

    // Simulate error on vote deletion
    const error = new Error('Vote deletion failed')
    voteMock.expects('deleteMany').withArgs({
      $or: [
        { plannerId: existingPlanner._id },
        { destinationId: { $in: existingPlanner.destinations } },
      ],
    }).rejects(error)

    try {
      await PlannerService.deletePlannerDocument(
        req as Request,
        res as Response,
        next as NextFunction,
      )
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    plannerMock.verify()
    destinationMock.verify()
    activityMock.verify()
    accommodationMock.verify()
    voteMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })
  
})