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

let testPlanner: any

let testTransportation1: any
let testTransportation2: any
let testTransportation3: any

describe('T11n API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL
    app = new PlanPals({ dbURI: mongoURI })
    app.startServer()

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

    testPlanner = await PlannerModel.create({
      createdBy: testUser1._id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      roUsers: [testUser2._id],
      rwUsers: [testUser1._id],
      name: 'Trip to Spain',
      description: 'To Barcelona',
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

  afterAll(() => {
    app.stopServer()
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
  })
})
