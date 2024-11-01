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

describe('Vote->isUserVoted', () => {
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
          targetUser: targetUser1,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    voteMock.restore()
  })

  it('should get vote for user', async () => {
    voteMock.expects('findOne').resolves(existingVotes)

    await VoteService.isUserVoted(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.result.upVoted).toBe(true)
    expect(req.body.result.downVoted).toBe(false)
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should not find vote and return false', async () => {
    voteMock.expects('findOne').resolves(null)

    await VoteService.isUserVoted(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    voteMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
