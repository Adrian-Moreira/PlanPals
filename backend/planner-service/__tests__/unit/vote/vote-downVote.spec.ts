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

describe('Vote->DownVote', () => {
  let voteMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const existingVotes = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    upVotes: [],
    downVotes: [],
    _id: '671d119e14be184dbc5c0d90',
  }

  const existingVotesWithUpVote = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    upVotes: ['671d24c18132583fe9fb978f'],
    downVotes: [],
    _id: '671d119e14be184dbc5c0d90',
  }

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  beforeEach(() => {
    voteMock = sinon.mock(VoteModel)
    req = {
      body: {
        out: {
          objectId: existingVotes.objectId,
          type: 'Destination',
          targetUser: targetUser,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    voteMock.restore()
  })

  it('should push to downVotes array when user has not voted before', async () => {
    voteMock.expects('findOne').resolves(existingVotes)
    voteMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingVotes._id },
        {
          ...existingVotes,
          downVotes: [targetUser._id],
        },
        { new: true },
      )
      .resolves({
        ...existingVotes,
        downVotes: [targetUser._id],
      })

    await VoteService.downVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.downVotes).toContain('671d24c18132583fe9fb978f')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should create then push to downVotes array when user has not voted before', async () => {
    voteMock.expects('findOne').resolves(null)
    voteMock.expects('create').resolves(existingVotes)
    voteMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingVotes._id },
        {
          ...existingVotes,
          downVotes: [targetUser._id],
        },
        { new: true },
      )
      .resolves({
        ...existingVotes,
        downVotes: [targetUser._id],
      })

    await VoteService.downVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.downVotes).toContain('671d24c18132583fe9fb978f')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should push to downVotes array and remove from upVotes array when user has not voted before', async () => {
    voteMock.expects('findOne').resolves(existingVotesWithUpVote)
    voteMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingVotesWithUpVote._id },
        {
          ...existingVotesWithUpVote,
          upVotes: [],
          downVotes: [targetUser._id],
        },
        { new: true },
      )
      .resolves({
        ...existingVotesWithUpVote,
        upVotes: [],
        downVotes: [targetUser._id],
      })

    await VoteService.downVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.downVotes).toContain('671d24c18132583fe9fb978f')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })
})
