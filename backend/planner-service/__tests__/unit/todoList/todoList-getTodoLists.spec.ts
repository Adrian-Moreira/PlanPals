import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../../models/TodoList'
import TodoListService from '../../services/todoList'

describe('TodoList->getTodoLists', () => {
  let todoListMock: sinon.SinonMock

  let req: Partial<Request>
  let res: Partial<Response>
  let next: Partial<NextFunction> = jest.fn()

  const targetUser1 = {
    _id: '671d24c18132583fe9fb978f',
  }

  const targetUser2 = {
    _id: '671d23c18132583fe9fb978f',
  }

  const targetUser3 = {
    _id: '681d23c18132583fe9fb978f',
  }

  const existingTodoList = {
    _id: '671d24c18132583fe9fb123f',
    createdBy: targetUser1._id,
    name: 'test',
    description: 'test',
    roUsers: [targetUser2._id],
    rwUsers: [targetUser1._id],
    tasks: [],
  }

  beforeEach(() => {
    todoListMock = sinon.mock(TodoListModel)
    req = {
      body: {
        out: {},
      },
    }
  })

  afterEach(() => {
    todoListMock.restore()
  })

  it('should get existing todoLists for a user', async () => {
    req.body.out.targetUser = targetUser1

    todoListMock.expects('find').withArgs({ rwUsers: targetUser1._id }).resolves([existingTodoList])

    await TodoListService.getTodoListDocumentsByUserId(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()
    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.length).toEqual(1)
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].description).toEqual('test')
    expect(req.body.result[0].rwUsers).toEqual([targetUser1._id])
    expect(req.body.result[0].roUsers).toEqual([targetUser2._id])
  })

  it('should get r-o existing todoLists for r-o user', async () => {
    req.body.out.targetUser = targetUser2
    req.body.out.access = 'ro'

    todoListMock.expects('find').withArgs({ roUsers: targetUser2._id }).resolves([existingTodoList])

    await TodoListService.getTodoListDocumentsByUserId(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()

    expect(req.body.status).toEqual(StatusCodes.OK)
    expect(req.body.result).toBeDefined()
    expect(req.body.result.length).toEqual(1)
    expect(req.body.result[0].name).toEqual('test')
    expect(req.body.result[0].description).toEqual('test')
    expect(req.body.result[0].rwUsers).toEqual([targetUser1._id])
    expect(req.body.result[0].roUsers).toEqual([targetUser2._id])
  })

  it('should not get r-w existing todoLists for r-o user', async () => {
    req.body.out.targetUser = targetUser2
    req.body.out.access = 'rw'

    todoListMock.expects('find').withArgs({ roUsers: targetUser2._id }).resolves(null)

    await TodoListService.getTodoListDocumentsByUserId(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()
    expect(req.body.err).toBeDefined()
  })

  it('should not get existing todoLists for user not in todoList', async () => {
    req.body.out.targetUser = targetUser3

    todoListMock.expects('find').resolves(null)

    await TodoListService.getTodoListDocumentsByUserId(req as Request, res as Response, next as NextFunction)

    todoListMock.verify()
    expect(req.body.err).toBeDefined()
  })
})
