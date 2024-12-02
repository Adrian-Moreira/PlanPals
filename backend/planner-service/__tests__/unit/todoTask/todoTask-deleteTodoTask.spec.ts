import sinon from 'sinon'
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes' 
import { TodoTaskModel } from '../../../src/models/TodoTask'
import TodoTaskService from '../../../src/services/todoTask'
import { TodoListModel } from '../../../src/models/TodoList'

describe('TodoTask->deleteTodoTask', () => {
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
        tasks: [existingTodoTask._id,],
    }

    beforeEach(() => {
        todoTaskMock = sinon.mock(TodoTaskModel)
        todoListMock = sinon.mock(TodoListModel)

        req = {
            body: {
                out: {
                    targetTodoTask: existingTodoTask,
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

    it('should delete existing todo task', async () => {
        todoTaskMock.expects('findOneAndDelete').resolves(existingTodoTask)
        todoListMock.expects('findOneAndUpdate').resolves(existingTodoList)

        await TodoTaskService.deleteTodoTaskDocument(req as Request, res as Response, next as NextFunction)

        // Verify mocks
        todoTaskMock.verify()
        todoListMock.verify()

        // Verify response
        expect(req.body.status).toEqual(StatusCodes.OK)
        expect(req.body.result).toBeDefined()
        expect(req.body.result.name).toEqual('test')
        expect(req.body.result.assignedTo).toEqual(targetUser._id)
        expect(req.body.result.isCompleted).toEqual(false)
    })

    it('should handle error if todo task deletion fails', async () => {
        todoTaskMock.expects('findOneAndDelete').rejects()

        try {
            await TodoTaskService.deleteTodoTaskDocument(req as Request, res as Response, next as NextFunction)
        } catch (error) {
            expect(error).toBeDefined()
            expect(next).toHaveBeenCalledWith(error)
        }

        // Verify mocks
        todoTaskMock.verify()
    })
})