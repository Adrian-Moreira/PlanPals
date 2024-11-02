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
import { Types } from 'mongoose'

describe('Comment->getCommentDocuments', () => {
  let commentMock: sinon.SinonMock
  let commentsMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: new Types.ObjectId('671d24c18132583fe9fb978f'),
  }

  const existingComment = {
    createdBy: targetUser._id,
    content: 'test',
    _id: new Types.ObjectId('671d119e14be184dbc5c0d90'),
  }

  const existingComments = {
    objectId: {
      id: new Types.ObjectId('671ceaae117001732cd0fc83'),
      collection: 'Destination',
    },
    comments: [existingComment._id.toString()],
    _id: new Types.ObjectId('671ceb4a117001732cd0fc8a'),
  }

  beforeEach(() => {
    commentMock = sinon.mock(CommentModel)
    commentsMock = sinon.mock(CommentsModel)
    req = {
      body: {
        out: {
          commentsDocument: existingComments,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    commentMock.restore()
    commentsMock.restore()
  })

  it('should get comments', async () => {
    commentMock.expects('findById').resolves(existingComment)

    await CommentService.getCommentsByObjectId(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.result).toBeDefined()
    expect(req.body.result[0].content).toEqual('test')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })
})
