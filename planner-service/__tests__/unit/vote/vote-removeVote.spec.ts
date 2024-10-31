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
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe.skip('Vote->removeVote', () => {
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

  it('should remove upVote for voted user', async () => {
    req.body.out.targetUser = targetUser1
    voteMock.expects('findOne').resolves(existingVotes)
    voteMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingVotes._id },
        {
          objectId: existingVotes.objectId,
          upVotes: [],
          downVotes: existingVotes.downVotes,
          _id: existingVotes._id,
        },
        { new: true },
      )
      .resolves({
        ...existingVotes,
        upVotes: [],
      })

    await VoteService.removeVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.upVotes).toHaveLength(0)
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should remove downVote for voted user', async () => {
    req.body.out.targetUser = targetUser2
    voteMock.expects('findOne').resolves(existingVotes)
    voteMock
      .expects('findOneAndUpdate')
      .withArgs(
        { _id: existingVotes._id },
        {
          objectId: existingVotes.objectId,
          downVotes: [],
          upVotes: existingVotes.upVotes,
          _id: existingVotes._id,
        },
        { new: true },
      )
      .resolves({
        ...existingVotes,
        downVotes: [],
      })

    await VoteService.removeVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.downVotes).toHaveLength(0)
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should not find vote and throw error', async () => {
    req.body.out.targetUser = targetUser1

    voteMock.expects('findOne').resolves(null)

    await VoteService.removeVote(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
