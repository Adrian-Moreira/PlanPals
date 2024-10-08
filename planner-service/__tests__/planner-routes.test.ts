import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import PlanPals from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { User, UserModel } from '../src/models/User'
import { PlannerModel } from '../src/models/Planner'

describe('Planner API', () => {
  let app: PlanPals
  let testUser: User

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL
    app = new PlanPals({ dbURI: mongoURI })
    app.startServer()

    testUser = await UserModel.create({
      userName: 'JJoe',
      preferredName: 'Jake Doe',
    })
  })

  afterAll(() => {
    app.stopServer()
  })

  it('should return OK', async () => {
    const response = await request(app.app)
      .get(`/planner?createdBy=${testUser._id}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveLength(0)
  })

  it('should return OK', async () => {
    const response = await request(app.app)
      .post('/planner')
      .send({
        createdBy: testUser._id,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        roUsers: [],
        rwUsers: [testUser._id],
        name: 'Planner 1',
        description: 'Planner 1 description',
        destinations: [],
        transportations: [],
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toBeDefined()
    console.log(response.body.data)
  })

  it('should return OK', async () => {
    const response = await request(app.app)
      .get(`/planner?createdBy=${testUser._id}`)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveLength(1)
  })
})
