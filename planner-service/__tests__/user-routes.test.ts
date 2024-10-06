import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import PlanPals from '../src/app'
import { StatusCodes } from 'http-status-codes'

describe('User API', () => {
  let app: PlanPals
  let testUserId: string
  let testUserName: string = 'Jane Doe'

  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017'
    app = new PlanPals({ dbURI: mongoURI })
    app.startServer()
  })

  afterAll(async () => {
    await app.stopServer()
  })

  it('should return Created', async () => {
    const response = await request(app.app)
      .post('/api/user/create')
      .send({ userName: testUserName })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.CREATED)

    expect(response.body.success).toBe(true)
    expect(response.body.data.userName).toBe(testUserName)
    expect(response.body.data._id).toBeDefined()
    expect(response.body.data.createdAt).toBeDefined()
    expect(response.body.data.updatedAt).toBeDefined()

    testUserId = response.body.data._id
  })

  it('should return OK', async () => {
    const response = await request(app.app)
      .get('/api/user/' + testUserId)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data.userName).toBe(testUserName)
    expect(response.body.data._id).toBe(testUserId)
  })

  it('should return OK', async () => {
    testUserName = 'John Doe'
    const response = await request(app.app)
      .patch('/api/user/' + testUserId)
      .send({ userName: testUserName })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data.userName).toBe(testUserName)
    expect(response.body.data._id).toBe(testUserId)
  })

  it('should return OK', async () => {
    const response = await request(app.app)
      .get('/api/user/search')
      .send({ userName: 'john' })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveLength(1)
  })

  // it('should return OK', async () => {
  //   const response = await request(app.app)
  //     .get('/api/user/search?userName=john')
  //     .expect('Content-Type', /json/)
  //     .expect(StatusCodes.OK)
  //   expect(response.body.success).toBe(true)
  //   expect(response.body.data).toHaveLength(1)
  // })

  it('should return OK', async () => {
    const response = await request(app.app)
      .delete('/api/user/' + testUserId)
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)
    expect(response.body.success).toBe(true)
    expect(response.body.data.userName).toBe(testUserName)
    expect(response.body.data._id).toBe(testUserId)
  })

  it('should return Bad Request', async () => {
    const response = await request(app.app)
      .get('/api/user/jane')
      .expect(StatusCodes.BAD_REQUEST)
    console.log(response.body)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBeDefined()
  })

  it('should return Not Found', async () => {
    const response = await request(app.app)
      .get('/api/user/6701a389fecd4f214c79183e')
      .expect(StatusCodes.NOT_FOUND)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBeDefined()
  })
})
