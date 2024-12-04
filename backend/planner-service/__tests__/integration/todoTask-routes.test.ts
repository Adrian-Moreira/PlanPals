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
let testUser3: any
let testUser4: any

let testTodoList: any
let testTodoList2: any

let testTodoTask1: any

describe('Integration Test: TodoTask API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await TodoListModel.deleteMany({})
    await TodoTaskModel.deleteMany({})

    testUser1 = await UserModel.create({
      userName: 'testUser1',
      preferredName: 'Test User 1',
    })

    testUser2 = await UserModel.create({
      userName: 'testUser2',
      preferredName: 'Test User 2',
    })

    testUser3 = await UserModel.create({
      userName: 'testUser3',
      preferredName: 'Test User 3',
    })

    testUser4 = await UserModel.create({
      userName: 'testUser4',
      preferredName: 'Test User 4',
    })

    testTodoList = await TodoListModel.create({
      createdBy: testUser1._id,
      name: 'Test Todo List',
      description: 'This is a test todo list',
      tasks: [],
      roUsers: [testUser2._id],
      rwUsers: [testUser1._id, testUser3._id],
    })

    testTodoList2 = await TodoListModel.create({
      createdBy: testUser4._id,
      name: 'Test Todo List 2',
      description: 'This is a test todo list 2',
      tasks: [],
      roUsers: [],
      rwUsers: [testUser4._id],
    })

    testTodoTask1 = await TodoTaskModel.create({
      createdBy: testUser1._id,
      name: 'Test Todo Task 1',
      todoListId: testTodoList._id,
      dueDate: new Date().toISOString(),
      isCompleted: false,
    })

    testTodoList.tasks.push(testTodoTask1._id)
    testTodoList = await testTodoList.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /todoTask with todoListId', () => {
    it('should return OK and get todo tasks for todo list', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return OK and get todo tasks for todo list', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return OK and get todo tasks for todo list', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=${testUser3._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=${testUser4._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=abc`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testUser4._id.toString()}/task?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task?userId=${testUser4._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /todoTask with todoTaskId', () => {
    it('should return OK and get todo task', async () => {
      const response = await request(app.app)
        .get(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTodoTask1._id.toString())
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .get(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo list', async () => {
      const response = await request(app.app)
        .get(
          `/todoList/${testUser1._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo task', async () => {
      const response = await request(app.app)
        .get(
          `/todoList/${testTodoList._id.toString()}/task/${testUser1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo task', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}/task/${testUser1._id.toString()}?userId=}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform PATCH to /task with todoTaskId and todoListId', () => {
    it('should return OK and update todo task', async () => {
      const response = await request(app.app)
        .patch(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .send({
          name: 'updated name',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTodoTask1._id.toString())
      expect(response.body.data.name).toBe('updated name')
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .patch(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .send({
          name: 'updated name',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo list', async () => {
      const response = await request(app.app)
        .patch(
          `/todoList/${testUser1._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .send({
          name: 'updated name',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST to /task with todoListId and todoTaskId', () => {
    it('should return CREATED and create todo task', async () => {
      const response = await request(app.app)
        .post(`/todoList/${testTodoList._id.toString()}/task`)
        .send({
          createdBy: testUser1._id.toString(),
          name: 'new task',
          dueDate: new Date().toISOString(),
          isCompleted: false,
          todoListId: testTodoList._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('new task')
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .post(`/todoList/${testTodoList2._id.toString()}/task`)
        .send({
          createdBy: testUser1._id.toString(),
          name: 'new task',
          dueDate: new Date().toISOString(),
          isCompleted: false,
          todoListId: testTodoList2._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo list', async () => {
      const response = await request(app.app)
        .post(`/todoList/${testUser1._id.toString()}/task`)
        .send({
          createdBy: testUser1._id.toString(),
          name: 'new task',
          dueDate: new Date().toISOString(),
          isCompleted: false,
          todoListId: testTodoList2._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE to /task with todoTaskId and todoListId', () => {
    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .delete(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid todo list', async () => {
      const response = await request(app.app)
        .delete(
          `/todoList/${testUser1._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and delete todo task', async () => {
      const response = await request(app.app)
        .delete(
          `/todoList/${testTodoList._id.toString()}/task/${testTodoTask1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTodoTask1._id.toString())
      expect(await TodoListModel.findOne({ _id: testTodoList._id })).not.toContain(testTodoTask1._id)
    })
  })
})
