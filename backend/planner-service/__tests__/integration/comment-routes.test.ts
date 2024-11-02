import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import config from '../../src/config'
import PlanPals, { initServer, startServer, stopServer } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../../src/models/User'
import { PlannerModel } from '../../src/models/Planner'
import { DestinationModel } from '../../src/models/Destination'
import { ActivityModel } from '../../src/models/Activity'
import { CommentModel, CommentsModel } from '../../src/models/Comment'

let app: PlanPals

let testUser1: any
let testUser2: any
let testUser3: any
let testUser4: any

let testPlanner: any
let testPlanner2: any

let testDestination1: any
let testDestination2: any

let testActivity1: any
let testActivity2: any

let newComment: any
let newComment2: any
let existingComments: any

describe('Integration Test: Comment API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await PlannerModel.deleteMany({})
    await DestinationModel.deleteMany({})
    await ActivityModel.deleteMany({})
    await CommentsModel.deleteMany({})
    await CommentModel.deleteMany({})

    testUser1 = await UserModel.create({
      userName: 'TUser1',
      preferredName: 'Test User 1',
    })

    testUser2 = await UserModel.create({
      userName: 'TUser2',
      preferredName: 'Test User 2',
    })

    testUser3 = await UserModel.create({
      userName: 'TUser3',
      preferredName: 'Test User 3',
    })

    testUser4 = await UserModel.create({
      userName: 'TUser4',
      preferredName: 'Test User 4',
    })

    testPlanner = await PlannerModel.create({
      createdBy: testUser1._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      roUsers: [testUser2._id],
      rwUsers: [testUser1._id, testUser3._id],
      name: 'Trip to Spain',
      description: 'To Barcelona',
      destinations: [],
      transportations: [],
    })

    testPlanner2 = await PlannerModel.create({
      createdBy: testUser4._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      roUsers: [],
      rwUsers: [testUser4._id],
      name: 'Trip to the Baltics',
      description: 'Tallinn to Ивангород',
      destinations: [],
      transportations: [],
    })

    testDestination1 = await DestinationModel.create({
      name: 'Barcelona',
      createdBy: testUser1._id,
      plannerId: testPlanner._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    })

    testDestination2 = await DestinationModel.create({
      name: 'Tallinn',
      createdBy: testUser4._id,
      plannerId: testPlanner2._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    })

    testActivity1 = await ActivityModel.create({
      name: 'Visiting the largest unfinished Catholic church in the world',
      createdBy: testUser1._id,
      location: 'Sagrada Família',
      destinationId: testDestination1._id,
      startDate: new Date().toISOString(),
      duration: 10800, // 3 hours
      done: false,
    })

    testActivity2 = await ActivityModel.create({
      name: 'Visiting the Hermann Castle',
      createdBy: testUser4._id,
      location: 'Hermann Castle',
      destinationId: testDestination2._id,
      startDate: new Date().toISOString(),
      duration: 7200, // 2 hours
      done: false,
    })

    newComment = await CommentModel.create({
      createdBy: testUser1._id,
      content: 'test',
    })

    existingComments = await CommentsModel.create({
      objectId: { id: testDestination1._id, collection: 'Destination' },
      comments: [newComment._id],
    })

    testPlanner.destinations.push(testDestination1._id)
    testPlanner = await testPlanner.save()

    testPlanner2.destinations.push(testDestination2._id)
    testPlanner2 = await testPlanner2.save()

    testDestination1.activities.push(testActivity1._id)
    testDestination1 = await testDestination1.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /comment for destination with existing comments', () => {
    it('should return OK and get Comments for destination', async () => {
      const response = await request(app.app)
        .get(`/comment`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]._id.toString()).toBe(newComment._id.toString())
    })
  })

  describe('perform GET from /comment for destination with no existing comments', () => {
    it('should return OK and get Comments for destination', async () => {
      const response = await request(app.app)
        .get(`/comment`)
        .query({
          type: 'Destination',
          objectId: testDestination2._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(0)
    })
  })

  describe('perform GET from /comment with commentId', () => {
    it('should return OK and get the Comment', async () => {
      const response = await request(app.app)
        .get(`/comment/${newComment._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id.toString()).toBe(newComment._id.toString())
    })
  })

  describe('perform GET from /comment with invalid commentId', () => {
    it('should return OK and get the Comment', async () => {
      const response = await request(app.app)
        .get(`/comment/${testDestination1._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST to /comment', () => {
    it('should return OK and create the Comment', async () => {
      const response = await request(app.app)
        .post(`/comment`)
        .send({
          objectId: testActivity1._id.toString(),
          type: 'Activity',
          content: 'test',
          createdBy: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBeDefined()
      newComment2 = response.body.data
    })
  })

  describe('perform POST to /comment with invalid objectId', () => {
    it('should return OK and create the Comment', async () => {
      const response = await request(app.app)
        .post(`/comment`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Activity',
          content: 'test',
          createdBy: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST to /comment with invalid object type', () => {
    it('should return OK and create the Comment', async () => {
      const response = await request(app.app)
        .post(`/comment`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Dest',
          content: 'test',
          createdBy: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE to /comment', () => {
    it('should return OK and delete the Comment', async () => {
      const response = await request(app.app)
        .delete(`/comment/${newComment2._id.toString()}`)
        .query({ userId: testUser1._id.toString() })
        .send({
          objectId: testActivity1._id.toString(),
          type: 'Activity',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(await CommentModel.findOne({ _id: newComment2._id })).toBeNull()
      expect(
        await CommentsModel.findOne({
          objectId: {
            id: testActivity1._id.toString(),
            collection: 'Activity',
          },
        }),
      ).toBeNull()
    })
  })

  describe('perform delete to destination', () => {
    it('should return OK and delete the Comment', async () => {
      const reqStr = `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}?userId=${testUser1._id.toString()}`
      const response = await request(app.app).delete(reqStr).expect('Content-Type', /json/).expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(await DestinationModel.findOne({ _id: testDestination1._id })).toBeNull()
      expect(await ActivityModel.findOne({ _id: testActivity1._id })).toBeNull()
      expect(await CommentsModel.findOne({ _id: existingComments._id })).toBeNull()
      expect(await CommentModel.findOne({ _id: newComment._id })).toBeNull()
    })
  })
})
