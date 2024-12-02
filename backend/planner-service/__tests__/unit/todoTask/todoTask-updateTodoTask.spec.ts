import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import TodoTaskService from '../../../src/services/todoTask'

describe('TodoTask->updateTodoTask', () => {
  let todoTaskMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const newTodoTask = {
    _id: '671d24c18132583fe9fb122f',
    name: 'test1',
    assignedTo: targetUser._id,
    dueDate: new Date(),
    isCompleted: true,
  }

  const existingTodoTask = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    todoListId: '671d24c18132583fe9fb1231',
    name: 'test',
    assignedTo: targetUser._id,
    dueDate: new Date(),
    isCompleted: false,
  }

  beforeEach(() => {
    todoTaskMock = sinon.mock(TodoTaskModel)

    req = {
      body: {
        out: {
          targetTodoTask: existingTodoTask,
          ...newTodoTask,
        },
      },
    }

    res = {}
  })

  afterEach(() => {
    todoTaskMock.restore()
  })

  it('should update existing todo task', async () => {
    todoTaskMock.expects('findOneAndUpdate').resolves({
      createdBy: targetUser._id,
      ...newTodoTask,
    })

    await TodoTaskService.updateTodoTaskDocument(req as Request, res as Response, next as NextFunction)

    // Verify mocks
    todoTaskMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test1')
    expect(req.body.result.assignedTo).toEqual(targetUser._id)
    expect(req.body.result.isCompleted).toEqual(true)
    expect(req.body.result.dueDate).toEqual(newTodoTask.dueDate)
  })
})
