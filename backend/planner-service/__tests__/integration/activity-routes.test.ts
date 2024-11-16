import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import config from '../../src/config'
import PlanPals, { initServer, startServer, stopServer } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../../src/models/User'
import { PlannerModel } from '../../src/models/Planner'
import { DestinationModel } from '../../src/models/Destination'
import { ActivityModel } from '../../src/models/Activity'

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

describe('Integration Test: Activity API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await PlannerModel.deleteMany({})
    await DestinationModel.deleteMany({})
    await ActivityModel.deleteMany({})

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
      plannerId: testPlanner._id,
      startDate: new Date().toISOString(),
      duration: 10800, // 3 hours
      done: false,
    })

    testActivity2 = await ActivityModel.create({
      name: 'Visiting the Hermann Castle',
      createdBy: testUser4._id,
      location: 'Hermann Castle',
      destinationId: testDestination2._id,
      plannerId: testPlanner2._id,
      startDate: new Date().toISOString(),
      duration: 7200, // 2 hours
      done: false,
    })

    testPlanner.destinations.push(testDestination1._id)
    testPlanner = await testPlanner.save()

    testPlanner2.destinations.push(testDestination2._id)
    testPlanner2 = await testPlanner2.save()

    testDestination1.activities.push(testActivity1._id)
    testDestination1 = await testDestination1.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /Activity with destinationId', () => {
    it('should return OK and get Activitys for destination', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity`)
        .query({ userId: testUser1._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity`)
        .query({ userId: testUser4._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /destination with plannerId and destinationId and ActivityId', () => {
    it('should return OK and get destinations for planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser1._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testActivity1._id.toString())
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testUser1._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid destination', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/destination/${testUser1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid Activity', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testDestination1._id.toString()}`,
        )
        .query({ userId: testUser1._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform PATCH to /destination with plannerId and destinationId and ActivityId', () => {
    it('should return OK and update destination', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testPlanner2._id.toString()}/destination/${testDestination2._id.toString()}/activity/${testActivity2._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .send({
          name: 'Ивангород',
          location: 'Ивангород',
          duration: 12000,
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Ивангород')
      expect(response.body.data.location).toBe('Ивангород')
      expect(response.body.data.duration).toBe(12000)
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .send({
          name: 'Ивангород',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST to /activity with plannerId and destinationId', () => {
    it('should return CREATED and create Activity', async () => {
      const response = await request(app.app)
        .post(`/planner/${testPlanner2._id.toString()}/destination/${testDestination2._id.toString()}/activity`)
        .send({
          createdBy: testUser4._id.toString(),
          startDate: new Date().toISOString(),
          duration: 1 * 3600,
          name: 'Ivangrod',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe('Ivangrod')
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .post(`/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity`)
        .send({
          createdBy: testUser4._id.toString(),
          startDate: new Date().toISOString(),
          duration: 1 * 3600,
          name: 'Ivangrod',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .post(`/planner/${testUser1._id.toString()}/destination/${testDestination1._id.toString()}/activity`)
        .send({
          createdBy: testUser4._id.toString(),
          startDate: new Date().toISOString(),
          duration: 1 * 3600,
          name: 'Ivangrod',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE to /activity with plannerId and destinationId and ActivityId', () => {
    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .delete(
          `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser4._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .delete(
          `/planner/${testUser1._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`,
        )
        .query({ userId: testUser1._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and delete activity', async () => {
      const reqStr = `/planner/${testPlanner._id.toString()}/destination/${testDestination1._id.toString()}/activity/${testActivity1._id.toString()}`
      const response = await request(app.app)
        .delete(reqStr)
        .query({ userId: testUser1._id.toString() })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testActivity1._id.toString())
    })
  })
})
