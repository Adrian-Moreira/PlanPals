import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import PlanPals from '../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel, UserSchema } from '../src/models/User'

let app: PlanPals
let testUser: any = {
  userName: 'JDoe',
  preferredName: 'John Doe',
}

let postUser: any = {
  userName: 'FBar',
  preferredName: 'Foo Bar',
}

describe('User API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URL
    app = new PlanPals({ dbURI: mongoURI })
    app.startServer()
    await UserModel.deleteMany({})
    testUser = await UserModel.create(testUser)
    testUser = await UserSchema.parseAsync(testUser.toObject())
  })

  afterAll(() => {
    app.stopServer()
  })

  describe('perform GET from /user', () => {
    it('should return OK and get user', async () => {
      const response = await request(app.app)
        .get('/user/' + testUser._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testUser._id.toString())
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get('/user/search?userName=john')
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })

    it('should return OK and get user', async () => {
      const response = await request(app.app)
        .get('/user/search?userName=' + testUser.userName)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
    })

    it('should return Bad Request', async () => {
      const response = await request(app.app)
        .get('/user/jane')
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .get('/user/6701a389fecd4f214c79183e')
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('POST /user', () => {
    it('should return OK', async () => {
      const response = await request(app.app)
        .post('/user')
        .send(postUser)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CREATED)

      expect(response.body.success).toBe(true)
      postUser = response.body.data
      expect(postUser._id).toBeDefined()
      expect(postUser.userName).toBe(postUser.userName)
      expect(postUser.preferredName).toBe(postUser.preferredName)
    })

    it('should return Conflict', async () => {
      const response = await request(app.app)
        .post('/user')
        .send(postUser)
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT)

      expect(response.body.success).toBe(false)
    })
  })

  describe('PATCH /user', () => {
    it('should return OK', async () => {
      const response = await request(app.app)
        .patch('/user/' + testUser._id.toString())
        .send({
          userName: 'JDoe',
          preferredName: 'Jake Doe',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testUser._id.toString())
      expect(response.body.data.userName).toBe('JDoe')
      expect(response.body.data.preferredName).toBe('Jake Doe')
    })

    it('should return Conflict', async () => {
      const response = await request(app.app)
        .patch('/user/' + testUser._id.toString())
        .send({
          userName: 'FBar',
          preferredName: 'Foo Baz',
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.CONFLICT)

      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /user', () => {
    it('should return OK', async () => {
      const response = await request(app.app)
        .delete('/user/' + testUser._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data._id).toBe(testUser._id.toString())
    })

    it('should return Not Found', async () => {
      const response = await request(app.app)
        .delete('/user/' + testUser._id.toString())
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })
})
