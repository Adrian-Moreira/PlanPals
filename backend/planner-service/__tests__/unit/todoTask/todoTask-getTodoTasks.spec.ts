import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import TodoTaskService from '../../../src/services/todoTask'

describe('TodoTask->getTodoTasksByTodoListId', () => {
  let todoTaskMock: sinon.SinonMock
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTodoTask = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    todoList: '681d24c18132583fe9fb123f',
    name: 'test',
    assignedTo: targetUser._id,
    isCompleted: false,
    dueDate: new Date(),
  }

  const existingTodoList = {
    _id: '681d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [existingTodoTask._id],
  }

  beforeEach(() => {
    todoTaskMock = sinon.mock(TodoTaskModel)
    todoListMock = sinon.mock(TodoTaskModel)
    req = {
      body: {
        out: {
          todoList: existingTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoTaskMock.restore()
    todoListMock.restore()
  })

  it('should get all todo tasks for a todo list', async () => {
    todoListMock.expects('findById').resolves(existingTodoTask)

    await TodoTaskService.getTodoTaskDocumentsByTodoListId(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoTaskMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.length).toEqual(1)
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].assignedTo).toEqual(targetUser._id)
    expect(req.body.result[0].isCompleted).toEqual(false)
    expect(req.body.result[0].dueDate).toEqual(existingTodoTask.dueDate)
  })
})
