import sinon from 'sinon'
import { describe, expect, it, jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import CommentService from '../../../src/services/comment'
import { CommentModel, CommentsModel } from '../../../src/models/Comment'
import { Types } from 'mongoose'
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe('getCommentDocument', () => {
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
    title: 'test',
    content: 'test',
    _id: new Types.ObjectId('671d119e14be184dbc5c0d90'),
  }

  beforeEach(() => {
    commentMock = sinon.mock(CommentModel)
    commentsMock = sinon.mock(CommentsModel)
    req = {
      body: {
        out: {
          commentId: existingComment._id,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    commentMock.restore()
    commentsMock.restore()
  })

  it('should get comment', async () => {
    commentMock.expects('findById').resolves(existingComment)

    await CommentService.getCommentById(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.result).toBeDefined()
    expect(req.body.result.title).toEqual('test')
    expect(req.body.result.content).toEqual('test')
    expect(req.body.status).toEqual(StatusCodes.OK)
  })

  it('should not find comment and return err', async () => {
    commentMock.expects('findById').resolves(null)

    await CommentService.getCommentById(
      req as Request,
      res as Response,
      next as NextFunction,
    )

    commentMock.verify()
    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
