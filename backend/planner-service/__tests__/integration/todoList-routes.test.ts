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

let testTodoList: any
let testTodoListForInvite: any

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

    testUser3 = await UserModel.create({
      userName: 'UniqueUser3',
      preferredName: 'Test User 3',
    })

    testTodoList = await TodoListModel.create({
      createdBy: testUser1._id,
      name: 'Test Todo List',
      description: 'This is a test todo list',
      tasks: [],
      roUsers: [testUser2._id],
      rwUsers: [testUser1._id],
    })

    testTodoListForInvite = await TodoListModel.create({
      createdBy: testUser3._id,
      name: 'Test Todo List For Invite',
      description: 'This is a test todo list for invite',
      tasks: [],
      roUsers: [],
      rwUsers: [],
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

  describe('perform GET from /todoList with userId', () => {
    it('should return OK and get todo lists for user', async () => {
      const response = await request(app.app)
        .get(`/todoList?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return OK and get todo lists for user', async () => {
      const response = await request(app.app)
        .get(`/todoList?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/todoList?userId=RandomUser`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /todoList with todoListId', () => {
    it('should return OK and get todo list', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)
        

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTodoList._id.toString())
      expect(response.body.data.name).toBe('Test Todo List')
    })

    it('should return OK and get todo list', async () => {
        console.log(`/todoList/${testTodoList._id.toString()}?userId=${testUser2._id.toString()}`)
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTodoList._id.toString())
      expect(response.body.data.name).toBe('Test Todo List')
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/todoList/${testTodoList._id.toString()}?userId=${testTodoList._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST /todoList', () => {
    it('should return CREATED and create todo list', async () => {
      const response = await request(app.app)
        .post(`/todoList`)
        .send({
          createdBy: testUser1._id,
          name: 'new todo list',
          description: 'This is a test todo list',
          tasks: [],
          roUsers: [testUser2._id],
          rwUsers: [testUser1._id],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('new todo list')
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .post(`/todoList`)
        .send({
          createdBy: testTodoList._id,
          name: 'new todo list',
          description: 'This is a test todo list',
          tasks: [],
          roUsers: [testUser2._id],
          rwUsers: [testUser1._id],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .post(`/todoList`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform PATCH /todoList', () => {    
    it('should return OK and update todo list', async () => {
      const response = await request(app.app)
        .patch(`/todoList/${testTodoList._id.toString()}?userId=${testUser1._id.toString()}`)
        .send({
          name: 'updated name',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('updated name')
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .patch(`/todoList/${testTodoList._id.toString()}?userId=${testUser2._id.toString()}`)
        .send({
          name: 'updated name',
        })
        .expect('Content-Type', /json/)
    .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE /todoList', () => {
    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .delete(`/todoList/${testTodoList._id.toString()}?userId=BAD_USER_ID`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .delete(`/todoList/${testTodoList._id.toString()}?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and delete todo list', async () => {
      const response = await request(app.app)
        .delete(`/todoList/${testTodoList._id.toString()}?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(await TodoListModel.findById(testTodoList._id)).toBeNull()
      expect(await TodoTaskModel.findById(testTodoTask1._id)).toBeNull()
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .delete(`/todoList/${testTodoList._id.toString()}?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .delete(`/todoList/BAD_TODO_LIST_ID?userId=${testUser1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)
    })
  })

  describe('perform invite user by POST to /todoList/:todoListId/invite', () => {
    it('should return OK and invite user to todo list', async () => {
      const response = await request(app.app)
        .post(`/todoList/${testTodoListForInvite._id.toString()}/invite`)
        .send({
          userIds: [testUser2._id],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.rwUsers).toContain(testUser2._id.toString())
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .post(`/todoList/BAD_TODO_LIST_ID/invite`)
        .send({
          userIds: [testUser3._id],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .post(`/todoList/${testTodoList._id.toString()}/invite`)
        .send({
          userIds: ['BAD_USER_ID'],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)
    })
  })
})
