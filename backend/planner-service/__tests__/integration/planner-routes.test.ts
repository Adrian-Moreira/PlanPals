import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import config from '../../src/config'
import PlanPals, { initServer, startServer, stopServer } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel, UserSchema } from '../../src/models/User'
import { PlannerModel, PlannerSchema } from '../../src/models/Planner'
import { DestinationModel } from '../../src/models/Destination'
import { TransportModel } from '../../src/models/Transport'

let app: PlanPals
let testUser: any
let testUser2: any
let testPlanner: any

let userToBeInvited: any
let testDestination1: any
let testTransportation1: any

describe('Integration Test: Planner API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await PlannerModel.deleteMany({})
    testUser = await UserModel.create({
      userName: 'JJoe',
      preferredName: 'Jake Joe',
    })
    testUser2 = await UserModel.create({
      userName: 'JPoe',
      preferredName: 'John Poe',
    })
    userToBeInvited = await UserModel.create({
      userName: 'JCoe',
      preferredName: 'John Coe',
    })
    testPlanner = await PlannerModel.create({
      createdBy: testUser._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      roUsers: [testUser2._id],
      rwUsers: [testUser._id],
      name: 'Trip to Spain',
      description: 'To Barcelona',
      destinations: [],
      transportations: [],
    })
    testDestination1 = await DestinationModel.create({
      name: 'Barcelona',
      createdBy: testUser._id,
      plannerId: testPlanner._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    })
    testTransportation1 = await TransportModel.create({
      type: 'Train',
      details: 'From Madrid To Barcelona',
      plannerId: testPlanner._id,
      createdBy: testUser._id,
      arrivalTime: new Date().toISOString(),
      departureTime: new Date().toISOString(),
      vehicleId: 'AC1234',
    })
    testPlanner.destinations.push(testDestination1._id)
    testPlanner.transportations.push(testTransportation1._id)
    testPlanner = await testPlanner.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /planner with userId', () => {
    it('should return OK and get planners for user', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and get planners for user with access rw', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser._id.toString()}&access=rw`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].name).toBe('Trip to Spain')
    })

    it('should return OK and get planners for user with access ro', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser2._id.toString()}&access=ro`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].name).toBe('Trip to Spain')
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser2._id.toString()}&access=rw`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=YourMum&access=rw`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=YourMum&access=ro`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=YourMum&access=MyMum`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser._id.toString()}&access=ro`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=JaneDoe`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /planner with plannerId', () => {
    it('should return OK and get planner', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}` + `?userId=${testUser._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data._id).toBe(testPlanner._id.toString())
    })

    it('should return OK and get planner', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}` + `?userId=${testUser2._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data._id).toBe(testPlanner._id.toString())
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}` + `?userId=${testPlanner._id.toString()}`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST /planner', () => {
    it('should return OK and create planner', async () => {
      const response = await request(app.app)
        .post('/planner')
        .send({
          createdBy: testUser2._id,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          roUsers: [testUser._id],
          rwUsers: [testUser2._id],
          name: 'Trip to Europe',
          description: 'To Poland',
          destinations: [],
          transportations: [],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .post('/planner')
        .send({
          createdBy: testPlanner._id,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          roUsers: [testUser._id],
          rwUsers: [testUser2._id],
          name: 'Trip to Europe',
          description: 'To Poland',
          destinations: [],
          transportations: [],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .post('/planner')
        .send({})
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform PATCH /planner', () => {
    it('should return OK and update planner', async () => {
      const response = await request(app.app)
        .patch('/planner/' + testPlanner._id.toString() + '?userId=' + testUser._id.toString())
        .send({
          name: 'Trip to England',
          description: '揸兜國',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.name).toBe('Trip to England')
      expect(response.body.data.description).toBe('揸兜國')
      expect(response.body.data.startDate).toBe(testPlanner.startDate.toString())
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .patch('/planner/' + testPlanner._id.toString() + '?userId=' + testUser2._id.toString())
        .send({
          name: 'Trip to Slovakia',
          description: 'From Kittsee to Kosice',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe.skip('perform POST /planner/:plannerId/invite', () => {
    it('should return OK and invite user', async () => {
      const response = await request(app.app)
        .post('/planner/' + testPlanner._id.toString() + '/invite')
        .send({
          userId: testUser._id.toString(),
          listOfUserIdWithRole: [{ _id: userToBeInvited._id.toString(), access: 'rw' }],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(response.body.data.rwUsers).toContain(userToBeInvited._id.toString())
    })

    it('should return Conflict', async () => {
      const response = await request(app.app)
        .post('/planner/' + testPlanner._id.toString() + '/invite')
        .send({
          userId: testUser._id.toString(),
          listOfUserIdWithRole: [{ _id: userToBeInvited._id.toString(), access: 'rw' }],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT)

      expect(response.body.success).toBe(false)
    })

    it('should return Conflict', async () => {
      const response = await request(app.app)
        .post('/planner/' + testPlanner._id.toString() + '/invite')
        .send({
          userId: testUser._id.toString(),
          listOfUserIdWithRole: [{ _id: testUser._id.toString(), access: 'rw' }],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT)

      expect(response.body.success).toBe(false)
    })

    it('should return Conflict', async () => {
      const response = await request(app.app)
        .post('/planner/' + testPlanner._id.toString() + '/invite')
        .send({
          userId: testUser._id.toString(),
          listOfUserIdWithRole: [{ _id: testUser2._id.toString(), access: 'rw' }],
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE /planner', () => {
    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .delete('/planner/' + testPlanner._id.toString() + '?userId=' + 'testUser._id.toString()')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .delete('/planner/' + testPlanner._id.toString() + '?userId=' + testUser2._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and delete planner', async () => {
      const response = await request(app.app)
        .delete('/planner/' + testPlanner._id.toString() + '?userId=' + testUser._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(await PlannerModel.findById(testPlanner._id)).toBeNull()
      expect(await DestinationModel.findById(testDestination1._id)).toBeNull()
      expect(await TransportModel.findById(testTransportation1._id)).toBeNull()
    })

    it('should return Not Found', async () => {
      await request(app.app)
        .delete('/planner/' + testPlanner._id.toString() + '?userId=' + testUser._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)
    })

    it('should return Not Found', async () => {
      await request(app.app)
        .delete('/planner/' + 'testPlanner._id.toString()' + '?userId=' + testUser._id.toString())
        .expect(StatusCodes.NOT_FOUND)
    })
  })
})
