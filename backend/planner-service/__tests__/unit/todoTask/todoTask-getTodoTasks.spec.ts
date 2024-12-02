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

  const existingTodoTask1 = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    todoListId: '681d24c18132583fe9fb123f',
    name: 'test',
    assignedTo: targetUser._id,
    dueDate: new Date(),
    isCompleted: false,
  }

  const existingTodoTask2 = {
    _id: '671d24c18132583fe9fb1230',
    createdBy: targetUser._id,
    todoListId: '681d24c18132583fe9fb123f',
    name: 'test',
    assignedTo: targetUser._id,
    dueDate: new Date(),
    isCompleted: false,
  }

  const existingTodoList = {
    _id: '681d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [existingTodoTask1._id, existingTodoTask2._id],
  }

  beforeEach(() => {
    todoTaskMock = sinon.mock(TodoTaskModel)
    todoListMock = sinon.mock(TodoTaskModel)
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
    todoTaskMock.restore()
    todoListMock.restore()
  })

  it('should get all todo tasks for a todo list', async () => {
    todoTaskMock
      .expects('find')
      .withArgs({ todoListId: existingTodoList._id })
      .resolves([existingTodoTask1, existingTodoTask2])
    todoListMock.expects('findById').withArgs(existingTodoList._id).resolves(existingTodoList)

    await TodoTaskService.getTodoTaskDocumentsByTodoListId(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoTaskMock.verify()
    todoListMock.verify()

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.length).toEqual(2)
  })
})
