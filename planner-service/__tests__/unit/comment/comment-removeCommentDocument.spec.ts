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
import CommentService from '../../../src/services/comment'
import { CommentModel, CommentsModel } from '../../../src/models/Comment'
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe('Comment->removeComment', () => {
  let commentMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d24c18132583fe9fb979f',
  }

  const existingComment = {
    createdBy: targetUser._id,
    content: 'test',
    _id: '671d119e14be184dbc5c0d90',
  }

  const existingComments = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    comments: [existingComment._id],
    _id: '671ceb4a117001732cd0fc8a',
  }

  beforeEach(() => {
    commentMock = sinon.mock(CommentModel)
    req = {
      body: {
        out: {
          targetUser,
          commentId: existingComment._id,
          commentsDocument: existingComments,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    commentMock.restore()
  })

  it('should create new comment under destination', async () => {
    commentMock.expects('findOne').resolves(existingComment)
    commentMock.expects('findOneAndDelete').resolves(existingComment)

    await CommentService.removeCommentDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.content).toEqual('test')
  })

  it('should not find comment', async () => {
    commentMock.expects('findOne').resolves(null)
    commentMock.expects('findOneAndDelete').resolves(null)

    await CommentService.removeCommentDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })

  it('should not find comment for invalid user', async () => {
    req.body.out.targetUser = targetUser2

    commentMock.expects('findOne').resolves(existingComment)
    commentMock.expects('findOneAndDelete').resolves(null)

    await CommentService.removeCommentDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
