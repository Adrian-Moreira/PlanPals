import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../../../src/models/TodoList'
import TodoListService from '../../../src/services/todoList'

describe('TodoList->updateTodoList', () => {
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

  const updatedTodoList = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test1',
    description: 'test1',
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
          ...updatedTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoListMock.restore()
  })

  it('should update existing todo list', async () => {
    todoListMock.expects('findOneAndUpdate').resolves(updatedTodoList)

    await TodoListService.updateTodoListDocument(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toEqual(updatedTodoList)
    expect(req.body.result.name).toEqual('test1')
    expect(req.body.result.description).toEqual('test1')
  })

  it('should handle error if todo list update fails', async () => {
    todoListMock.expects('findOneAndUpdate').rejects()

    try {
      await TodoListService.updateTodoListDocument(req as Request, res as Response, next as NextFunction)
    } catch (error) {
      expect(error).toBeDefined()
      expect(next).toHaveBeenCalledWith(error)
    }

    todoListMock.verify()
  })
})
