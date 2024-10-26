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
import VoteService from '../../../src/services/vote'
import { VoteModel } from '../../../src/models/Vote'

describe('Vote->getVotesByObjectId', () => {
  let voteMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser1 = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d24c18132583fe9fb979f',
  }

  const existingVotes = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    upVotes: [targetUser1._id],
    downVotes: [targetUser2._id],
    _id: '671d119e14be184dbc5c0d90',
  }

  const newEmptyVotes = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    upVotes: [],
    downVotes: [],
    _id: '671d119e14be184dbc5c0d90',
  }

  beforeEach(() => {
    voteMock = sinon.mock(VoteModel)
    req = {
      body: {
        out: {
          objectId: existingVotes.objectId,
          type: 'Destination',
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    voteMock.restore()
  })

  it('should find existing votes', async () => {
    voteMock.expects('findOne').resolves(existingVotes)

    await VoteService.getVotesByObjectId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.upVotes).toContain('671d24c18132583fe9fb978f')
    expect(req.body.result.downVotes).toContain('671d24c18132583fe9fb979f')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should create new votes', async () => {
    req.body.out = {
      objectId: newEmptyVotes.objectId.id,
      type: newEmptyVotes.objectId.collection,
      upVotes: newEmptyVotes.upVotes,
      downVotes: newEmptyVotes.downVotes,
    }
    voteMock.expects('findOne').resolves(null)
    voteMock
      .expects('create')
      .withArgs({
        objectId: newEmptyVotes.objectId,
        upVotes: newEmptyVotes.upVotes,
        downVotes: newEmptyVotes.downVotes,
      })
      .resolves(newEmptyVotes)

    await VoteService.getVotesByObjectId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.upVotes).toHaveLength(0)
    expect(req.body.result.downVotes).toHaveLength(0)
    expect(req.body.status).toEqual(StatusCodes.OK)
  })
})
