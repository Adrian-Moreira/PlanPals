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

describe('Comment->createComment', () => {
  let commentMock: sinon.SinonMock
  let commentsMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newComment = {
    createdBy: targetUser._id,
    title: 'test',
    content: 'test',
    _id: '671d119e14be184dbc5c0d90',
  }

  const existingComments = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    comments: [],
    _id: '671ceb4a117001732cd0fc8a',
  }

  beforeEach(() => {
    commentMock = sinon.mock(CommentModel)
    commentsMock = sinon.mock(CommentsModel)
    req = {
      body: {
        out: {
          targetUser,
          commentsDocument: existingComments,
          title: 'test',
          content: 'test',
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    commentMock.restore()
    commentsMock.restore()
  })

  it('should create new comment under destination', async () => {
    commentMock.expects('create').resolves(newComment)

    commentsMock.expects('findOneAndUpdate').resolves({
      ...existingComments,
      comments: [newComment._id],
    })

    await CommentService.createCommentDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentsMock.verify()
    commentMock.verify()
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.title).toEqual('test')
    expect(req.body.result.content).toEqual('test')
  })
})
