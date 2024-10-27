import sinon from 'sinon'
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import CommentService from '../../../src/services/comment'
import { CommentModel, CommentsModel } from '../../../src/models/Comment'

describe('Comment->findOrCreateComments', () => {
  let commentMock: sinon.SinonMock
  let commentsMock: sinon.SinonMock
  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingComment = {
    createdBy: targetUser._id,
    title: 'test',
    content: 'test',
    _id: '671d119e14be184dbc5c0d90',
  }

  const existingComments = {
    objectId: { id: '671ceaae117001732cd0fc83', collection: 'Destination' },
    comments: [existingComment._id],
  }

  beforeEach(() => {
    commentMock = sinon.mock(CommentModel)
    commentsMock = sinon.mock(CommentsModel)
    req = {
      body: {
        out: {
          objectId: existingComments.objectId.id,
          type: existingComments.objectId.collection,
        },
      },
    }
    res = {}
  })

  it('should return existing comments document', async () => {
    commentsMock
      .expects('findOne')
      .withArgs({ objectId: existingComments.objectId })
      .resolves(existingComments)

    await CommentService.findOrCreateCommentsDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentsMock.verify()
    commentMock.verify()
    expect(req.body.out.commentsDocument).toEqual(existingComments)
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should return existing comments document', async () => {
    commentsMock
      .expects('findOne')
      .withArgs({ objectId: existingComments.objectId })
      .resolves(null)

    commentsMock.expects('create').resolves({
      ...existingComments,
      comments: [],
    })

    await CommentService.findOrCreateCommentsDocument(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentsMock.verify()
    commentMock.verify()
    expect(req.body.out.commentsDocument).toBeDefined()
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  afterEach(() => {
    commentMock.restore()
    commentsMock.restore()
  })
})
