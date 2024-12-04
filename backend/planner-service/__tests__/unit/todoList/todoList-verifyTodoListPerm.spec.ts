import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../../../src/models/TodoList'
import TodoListService from '../../../src/services/todoList'
import { RecordNotFoundException } from '../../../src/exceptions/RecordNotFoundException'

describe('TodoList->verifyTodoListPerm', () => {
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser1 = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d24c18132583fe9fb678f',
  }

  const existingTodoList1 = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser1._id,
    name: 'test',
    description: 'test',
    roUsers: [],
    rwUsers: [targetUser1._id],
    tasks: [],
  }
  const existingTodoList2 = {
    _id: '671d24c18132583fe9fb233f',
    createdBy: targetUser2._id,
    name: 'test',
    description: 'test',
    roUsers: [targetUser1._id],
    rwUsers: [targetUser2._id],
    tasks: [],
  }

  beforeEach(() => {
    todoListMock = sinon.mock(TodoListModel)
    req = {
      body: {
        out: {},
      },
    }
    res = {}
  })

  afterEach(() => {
    todoListMock.restore()
  })

  it('should verify existing todoList', async () => {
    req.body.out.todoListId = existingTodoList1._id

    todoListMock.expects('findOne').resolves(existingTodoList1)

    await TodoListService.verifyTodoListExists(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()
    expect(req.body.out.todoList).toBeDefined()
    expect(req.body.out.todoList._id).toEqual(existingTodoList1._id)
  })

  it('should not verify non-existing todoList', async () => {
    todoListMock.expects('findOne').resolves(null)

    await TodoListService.verifyTodoListExists(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()
    expect(req.body.err).toBeDefined()
  })

  it('should verify todoList for read-write user', async () => {
    req.body.out.targetTodoList = existingTodoList2
    req.body.out.targetUser = targetUser2

    todoListMock.expects('findOne').resolves(existingTodoList2)

    await TodoListService.verifyUserCanEditTodoList(req as Request, res as Response, next as NextFunction)

    expect(req.body.out.targetTodoList).toBeDefined()
    expect(req.body.out.targetTodoList._id).toEqual(existingTodoList2._id)
  })

  it('should not verify todoList for read-only user', async () => {
    req.body.out.targetTodoList = existingTodoList2
    req.body.out.targetUser = targetUser1

    await TodoListService.verifyUserCanEditTodoList(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()

    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })

  it('should verify todoList for user with read permission', async () => {
    req.body.out.targetTodoList = existingTodoList2
    req.body.out.targetUser = targetUser1

    await TodoListService.verifyUserCanViewTodoList(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()

    expect(req.body.out.targetTodoList).toBeDefined()
    expect(req.body.out.targetTodoList._id).toEqual(existingTodoList2._id)
  })

  it('should not verify todoList for user without read permission', async () => {
    req.body.out.targetTodoList = existingTodoList1
    req.body.out.targetUser = targetUser2

    await TodoListService.verifyUserCanViewTodoList(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()

    expect(req.body.err).toBeInstanceOf(RecordNotFoundException)
  })
})
