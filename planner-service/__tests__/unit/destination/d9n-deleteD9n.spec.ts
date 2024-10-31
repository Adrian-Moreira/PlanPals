import sinon from 'sinon';
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DestinationModel } from '../../../src/models/Destination';
import { ActivityModel } from '../../../src/models/Activity';
import { AccommodationModel } from '../../../src/models/Accommodation';
import { VoteModel } from '../../../src/models/Vote';
import { CommentModel } from '../../../src/models/Comment';
import DestinationService from '../../../src/services/destination';

jest.setTimeout(10000);

describe('Destination->deleteDestination with Cascade Deletion', () => {
  let d9nMock: sinon.SinonMock;
  let activityMock: sinon.SinonMock;
  let accommodationMock: sinon.SinonMock;
  let voteMock: sinon.SinonMock;
  let commentMock: sinon.SinonMock;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction> = jest.fn();

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  };

  const existingDestination = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    startDate: new Date(),
    endDate: new Date(),
    name: 'testDestination',
    plannerId: '671d24c18132583fe9fb123f',
  };

  beforeEach(() => {
    d9nMock = sinon.mock(DestinationModel);
    activityMock = sinon.mock(ActivityModel);
    accommodationMock = sinon.mock(AccommodationModel);
    voteMock = sinon.mock(VoteModel);
    commentMock = sinon.mock(CommentModel);

    req = {
      body: {
        out: {
          targetDestination: existingDestination,
        },
      },
    };
    res = {};
  });

  afterEach(() => {
    d9nMock.restore();
    activityMock.restore();
    accommodationMock.restore();
    voteMock.restore();
    commentMock.restore();
    jest.clearAllMocks();
  });

  it('should cascade delete all related data when a destination is deleted', async () => {
    // Mock deleting the destination
    d9nMock.expects('findOneAndDelete').withArgs({ _id: existingDestination._id }).resolves(existingDestination);

    // Mock deleting associated Activities, Accommodations, Votes, and Comments
    activityMock.expects('deleteMany').withArgs({ destinationId: existingDestination._id }).resolves();
    accommodationMock.expects('deleteMany').withArgs({ destinationId: existingDestination._id }).resolves();
    voteMock.expects('deleteMany').withArgs({ destinationId: existingDestination._id }).resolves();
    commentMock.expects('deleteMany').withArgs({ destinationId: existingDestination._id }).resolves();

    await DestinationService.deleteDestinationDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    );

    // Verify all mocks
    console.log("Verifying mocks for cascade deletions...");

    d9nMock.verify();
    activityMock.verify();
    accommodationMock.verify();
    voteMock.verify();
    commentMock.verify();

    // Check response status and result
    expect(req.body.status).toEqual(StatusCodes.OK);
    expect(req.body.result).toBeDefined();
    expect(req.body.result.name).toEqual('testDestination');
  });

});
