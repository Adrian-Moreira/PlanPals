import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import PlanPals from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../src/models/User'
import { PlannerModel } from '../src/models/Planner'
import { TransportModel } from '../src/models/Transport'

let app: PlanPals

let testUser1: any
let testUser2: any
let testUser3: any
let testUser4: any

let testPlanner: any
let testPlanner2: any

let testTransportation1: any

describe('Planner API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL
    app = new PlanPals({ dbURI: mongoURI })
    await app.startServer()

    await UserModel.deleteMany({})
    await PlannerModel.deleteMany({})
    await TransportModel.deleteMany({})

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

    testTransportation1 = await TransportModel.create({
      type: 'Train',
      details: 'From Madrid To Barcelona',
      plannerId: testPlanner._id,
      createdBy: testUser1._id,
      arrivalTime: new Date().toISOString(),
      departureTime: new Date().toISOString(),
      vehicleId: 'AC1234',
    })

    testPlanner.transportations.push(testTransportation1._id)
    testPlanner = await testPlanner.save()
  })

  afterAll(async () => {
    await app.stopServer()
  })

  describe('perform GET from /transportation with plannerId', () => {
    it('should return OK and get transportations for planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return OK and get transportations for planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation?userId=${testUser2._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return OK and get transportations for planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation?userId=${testUser3._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get(`/planner/${testPlanner._id.toString()}/transportation?userId=abc`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testUser4._id.toString()}/transportation?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /transportation with plannerId and transportId', () => {
    it('should return OK and get transportations for planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTransportation1._id.toString())
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testUser1._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid transport', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation/${testUser1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid transport', async () => {
      const response = await request(app.app)
        .get(
          `/planner/${testPlanner._id.toString()}/transportation/${testUser1._id.toString()}?userId=}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform PATCH to /transportation with plannerId and transportId', () => {
    it('should return OK and update transportation', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .send({
          arrivalTime: new Date().toISOString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTransportation1._id.toString())
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .send({
          arrivalTime: new Date().toISOString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testUser1._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .send({
          arrivalTime: new Date().toISOString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .patch(
          `/planner/${testPlanner2._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .send({
          arrivalTime: new Date().toISOString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform POST to /transportation with plannerId and transportId', () => {
    it('should return CREATED and create transportation', async () => {
      const response = await request(app.app)
        .post(`/planner/${testPlanner._id.toString()}/transportation`)
        .send({
          createdBy: testUser1._id.toString(),
          type: 'FlixBus',
          arrivalTime: new Date().toISOString(),
          departureTime: new Date().toISOString(),
          vehicleId: 'FX2468',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      expect(response.body.data.type).toBe('FlixBus')
    })

    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .post(`/planner/${testPlanner2._id.toString()}/transportation`)
        .send({
          createdBy: testUser1._id.toString(),
          type: 'RegioJet',
          arrivalTime: new Date().toISOString(),
          departureTime: new Date().toISOString(),
          vehicleId: 'RJ369',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .post(`/planner/${testUser1._id.toString()}/transportation`)
        .send({
          createdBy: testUser1._id.toString(),
          type: 'RegioJet',
          arrivalTime: new Date().toISOString(),
          departureTime: new Date().toISOString(),
          vehicleId: 'RJ369',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform DELETE to /transportation with plannerId and transportId', () => {
    it('should return Not Found with invalid user', async () => {
      const response = await request(app.app)
        .delete(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser4._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return Not Found with invalid planner', async () => {
      const response = await request(app.app)
        .delete(
          `/planner/${testUser1._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and delete transportation', async () => {
      const response = await request(app.app)
        .delete(
          `/planner/${testPlanner._id.toString()}/transportation/${testTransportation1._id.toString()}?userId=${testUser1._id.toString()}`,
        )
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testTransportation1._id.toString())
      expect(
        await PlannerModel.findOne({ _id: testPlanner._id }),
      ).not.toContain(testTransportation1._id)
    })
  })
})
