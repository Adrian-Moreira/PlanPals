import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import { TodoListModel } from '../../../src/models/TodoList'
import TodoTaskService from '../../../src/services/todoTask'

describe('TodoTask->createTodoTask', () => {
  let todoTaskMock: sinon.SinonMock
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newTodoTask = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    todoListId: '671ceaae117001732cd0fc83',
    name: 'test',
    assignedTo: targetUser._id,
    isCompleted: false,
    dueDate: new Date(),
  }

  const existingTodoList = {
    _id: '671ceaae117001732cd0fc83',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [],
  }

  beforeEach(() => {
    todoTaskMock = sinon.mock(TodoTaskModel)
    todoListMock = sinon.mock(TodoListModel)
    req = {
      body: {
        out: {
          targetUser,
          targetTodoList: existingTodoList,
          ...newTodoTask,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoTaskMock.restore()
    todoListMock.restore()
  })

  it('should create new todo task under existing todo list', async () => {
    todoListMock.expects('findOneAndUpdate').resolves(existingTodoList)

    todoTaskMock.expects('create').resolves({
      createdBy: targetUser._id,
      todoListId: existingTodoList._id,
      name: 'test',
      assignedTo: targetUser._id,
      isCompleted: false,
      dueDate: newTodoTask.dueDate,
    })

    await TodoTaskService.createTodoTaskDocument(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoListMock.verify()
    todoTaskMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.CREATED)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.createdBy).toEqual(targetUser._id)
    expect(req.body.result.todoListId).toEqual(existingTodoList._id)
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.assignedTo).toEqual(targetUser._id)
    expect(req.body.result.isCompleted).toEqual(false)
    expect(req.body.result.dueDate).toEqual(newTodoTask.dueDate)
  })
})
