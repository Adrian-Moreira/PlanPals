import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import TodoTaskService from '../../../src/services/todoTask'
import { TodoTaskModel } from '../../../src/models/TodoTask'
import { StatusCodes } from 'http-status-codes'

describe('TodoTask->getTodoTaskById', () => {
  let todoTaskMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser = {
    _id: '671d24c18132583fe9fb978f',
  }

  const existingTodoTask = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser._id,
    todoListId: '671d24c18132583fe9fb123f',
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
        },
      },
    }
    res = {}
  })

  afterEach(() => {})

  it('should get existing todo task by id', async () => {
    await TodoTaskService.getTodoTaskDocumentById(req as Request, res as Response, next as NextFunction)

    // Verify response
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.name).toEqual('test')
    expect(req.body.result.assignedTo).toEqual(targetUser._id)
    expect(req.body.result.isCompleted).toEqual(false)
    expect(req.body.result.dueDate).toEqual(existingTodoTask.dueDate)
  })
})
