import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import TodoTaskService from '../../../src/services/todoTask'

describe('TodoList->createTodoList', () => {
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newTodoList = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [],
  }

  beforeEach(() => {
    todoListMock = sinon.mock(TodoTaskModel)
    req = {
      body: {
        out: {
          targetUser,
          ...newTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoListMock.restore()
  })

  it('should create todo list', async () => {
    todoListMock.expects('create').resolves({
      createdBy: targetUser._id,
      name: 'test',
      description: 'test',
      roUsers: [],
      rwUsers: [targetUser._id],
      tasks: [],
    })
    await TodoTaskService.createTodoTaskDocument(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoListMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.createdBy).toEqual(targetUser._id)
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
    expect(req.body.result.roUsers).toEqual([])
    expect(req.body.result.rwUsers).toEqual([targetUser._id])
    expect(req.body.result.tasks).toEqual([])
  })
})
