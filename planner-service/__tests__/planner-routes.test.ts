import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import PlanPals from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel, UserSchema } from '../src/models/User'
import { PlannerModel, PlannerSchema } from '../src/models/Planner'

let app: PlanPals
let testUser: any
let testUser2: any
let testPlanner: any

describe('Planner API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL
    app = new PlanPals({ dbURI: mongoURI })
    app.startServer()
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
    testUser = await UserSchema.parseAsync(testUser.toObject())
    testUser2 = await UserSchema.parseAsync(testUser2.toObject())
    testPlanner = await PlannerSchema.parseAsync(testPlanner.toObject())
  })

  afterAll(() => {
    app.stopServer()
  })

  describe('perform GET from /planner', () => {
    it('should return OK', async () => {
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

    it('should return OK', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser2._id.toString()}&access=ro`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get(`/planner?userId=${testUser2._id.toString()}&access=rw`)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(0)
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
  })
})
