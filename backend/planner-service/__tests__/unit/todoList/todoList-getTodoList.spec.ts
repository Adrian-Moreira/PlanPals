import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../../../src/models/TodoList'
import TodoListService from '../../../src/services/todoList'

describe('TodoList->getTodoListById', () => {
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTodoList = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [],
  }

  beforeEach(() => {
    todoListMock = sinon.mock(TodoListModel)
    req = {
      body: {
        out: {
          targetTodoList: existingTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get todo list by id', async () => {
    await TodoListService.getTodoListDocumentById(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoListMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
  })
})
