import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../../../src/models/TodoList'
import TodoListService from '../../../src/services/todoList'
import { TodoTaskModel } from '../../models/TodoTask'

describe('TodoList->deleteTodoList with Cascade Deletion', () => {
  let todoListMock: sinon.SinonMock
  let todoTaskMock: sinon.SinonMock

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
    tasks: ['671d24c18132583fe9fb4567'],
  }

  beforeEach(() => {
    todoListMock = sinon.mock(TodoListModel)
    todoTaskMock = sinon.mock(TodoTaskModel)

    req = {
      body: {
        out: {
          targetTodoList: existingTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoListMock.restore()
    todoTaskMock.restore()
  })

  it('should delete todoList with cascade deletion', async () => {
    todoListMock
      .expects('findOneAndDelete')
      .withArgs({
        _id: existingTodoList._id,
      })
      .resolves({
        existingTodoList,
      })
    todoTaskMock
      .expects('deleteMany')
      .withArgs({
        todoListId: existingTodoList._id,
      })
      .resolves()

    await TodoListService.deleteTodoListDocument(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoListMock.verify()
    todoTaskMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.description).toEqual('test')
  })

  it('should handle error if todoList deletion fails', async () => {
    const error = new Error('Deletion failed')
    todoListMock
      .expects('findOneAndDelete')
      .withArgs({
        _id: existingTodoList._id,
      })
      .rejects(error)

    try {
      await TodoListService.deleteTodoListDocument(req as Request, res as Response, next as NextFunction)
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    todoListMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })

  it('should handle error if todoTask deletion fails', async () => {
    const error = new Error('Deletion failed')
    todoListMock
      .expects('findOneAndDelete')
      .withArgs({
        _id: existingTodoList._id,
      })
      .resolves({
        existingTodoList,
      })
    todoTaskMock
      .expects('deleteMany')
      .withArgs({
        todoListId: existingTodoList._id,
      })
      .rejects(error)

    try {
      await TodoListService.deleteTodoListDocument(req as Request, res as Response, next as NextFunction)
    } catch (e) {
      // Catch the error to allow the test to continue
    }

    // Verify mocks
    todoListMock.verify()
    todoTaskMock.verify()

    // Check error handling
    expect(next).toHaveBeenCalledWith(error)
  })
})
