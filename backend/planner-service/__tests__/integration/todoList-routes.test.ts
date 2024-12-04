import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import config from '../../src/config'
import PlanPals, { initServer, startServer, stopServer } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../../src/models/User'
import { TodoListModel } from '../../src/models/TodoList'
import { TodoTaskModel } from '../../src/models/TodoTask'

let app: PlanPals

let testUser1: any
let testUser2: any

let testTodoList: any

let testTodoTask1: any

describe('Integration Test: TodoList API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await TodoListModel.deleteMany({})

    testUser1 = await UserModel.create({
      userName: 'UniqueUser',
      preferredName: 'Test User',
    })

    testUser2 = await UserModel.create({
      userName: 'UniqueUser2',
      preferredName: 'Test User 2',
    })

    testTodoList = await TodoListModel.create({
      createdBy: testUser1._id,
      name: 'Test Todo List',
      description: 'This is a test todo list',
      tasks: [],
      roUsers: [testUser2._id],
      rwUsers: [testUser1._id],
    })

    testTodoTask1 = await TodoTaskModel.create({
      createdBy: testUser1._id,
      name: 'Test Todo Task 1',
      todoListId: testTodoList._id,
      dueDate: new Date().toISOString(),
      completed: false,
    })

    testTodoList.tasks.push(testTodoTask1._id)
    testTodoList = await testTodoList.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /todoList with userId', () => {
    it('should return OK and get todo lists for user', async () => {
      const response = await request(app.app)
        .get(`/todoList?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })
  })
})
