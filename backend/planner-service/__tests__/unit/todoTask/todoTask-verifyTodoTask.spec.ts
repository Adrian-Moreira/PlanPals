import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import TodoTaskService from '../../../src/services/todoTask'

describe('TodoTask->verifyTodoTask', () => {
  let todoTaskMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTodoTask = {
    _id: '671d24c18132583fe9fb1231',
    createdBy: targetUser._id,
    todoListId: '671d24c18132583fe9fb123f',
    name: 'test',
    assignedTo: targetUser._id,
    dueDate: new Date(),
    isCompleted: false,
  }

  const existingTodoList = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser._id],
    tasks: [existingTodoTask._id],
  }

  beforeEach(() => {
    todoTaskMock = sinon.mock(TodoTaskModel)
    req = {
      body: {
        out: {
          targetTodoTaskId: existingTodoTask._id,
          targetTodoList: existingTodoList,
        },
      },
    }
    res = {}
  })

  afterEach(() => {
    todoTaskMock.restore()
  })

  it('should handle existing todo task', async () => {
    todoTaskMock.expects('findOne').resolves(existingTodoTask)

    await TodoTaskService.verifyTodoTaskExists(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoTaskMock.verify()
    expect(req.body.out.targetTodoTask).toBeDefined()
    expect(req.body.out.targetTodoTask._id).toEqual(existingTodoTask._id)
  })

  it('should handle non-existing todo task', async () => {
    todoTaskMock.expects('findOne').resolves(null)

    await TodoTaskService.verifyTodoTaskExists(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoTaskMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
