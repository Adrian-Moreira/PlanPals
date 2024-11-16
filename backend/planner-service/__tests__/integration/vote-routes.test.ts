import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import request from 'supertest'
import config from '../../src/config'
import PlanPals, { initServer, startServer, stopServer } from '../../src/app'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../../src/models/User'
import { PlannerModel } from '../../src/models/Planner'
import { DestinationModel } from '../../src/models/Destination'
import { ActivityModel } from '../../src/models/Activity'
import { VoteModel } from '../../src/models/Vote'

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

let newVote: any
let existingVotes: any

describe('Integration Test: Vote API', () => {
  beforeAll(async () => {
    config.database.connectionString = process.env.MONGO_URL
    app = await initServer().then((app) => startServer(app))

    await UserModel.deleteMany({})
    await PlannerModel.deleteMany({})
    await DestinationModel.deleteMany({})
    await ActivityModel.deleteMany({})
    await VoteModel.deleteMany({})

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

    existingVotes = await VoteModel.create({
      objectId: { id: testDestination1._id, collection: 'Destination' },
      upVotes: [testUser1._id],
      downVotes: [testUser2._id],
    })

    testPlanner.destinations.push(testDestination1._id)
    testPlanner = await testPlanner.save()

    testPlanner2.destinations.push(testDestination2._id)
    testPlanner2 = await testPlanner2.save()

    testDestination1.activities.push(testActivity1._id)
    testDestination1 = await testDestination1.save()
  })

  afterAll(async () => await stopServer(app))

  describe('perform GET from /vote for destination with existing votes', () => {
    it('should return OK and get Votes for destination', async () => {
      const response = await request(app.app)
        .get(`/vote`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVotes).toHaveLength(existingVotes.upVotes.length)
      expect(response.body.data.downVotes).toHaveLength(existingVotes.downVotes.length)
    })
  })

  describe('perform GET from /vote for destination with no existing votes', () => {
    it('should return OK and get Votes for destination', async () => {
      const response = await request(app.app)
        .get(`/vote`)
        .query({
          type: 'Destination',
          objectId: testDestination2._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVotes).toHaveLength(0)
      expect(response.body.data.downVotes).toHaveLength(0)
    })
  })

  describe('perform GET from /vote for users', () => {
    it('should return OK and get Votes for user', async () => {
      const response = await request(app.app)
        .get(`/vote/${testUser1._id.toString()}`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVoted).toBe(true)
      expect(response.body.data.downVoted).toBe(false)
    })

    it('should return OK and get Votes for user', async () => {
      const response = await request(app.app)
        .get(`/vote/${testUser2._id.toString()}`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVoted).toBe(false)
      expect(response.body.data.downVoted).toBe(true)
    })

    it('should return OK and get Votes for user', async () => {
      const response = await request(app.app)
        .get(`/vote/${testUser3._id.toString()}`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVoted).toBe(false)
      expect(response.body.data.downVoted).toBe(false)
    })
  })

  describe('perform POST to /vote', () => {
    it('should return OK and create the upVote', async () => {
      const response = await request(app.app)
        .post(`/vote/up`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Destination',
          createdBy: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVotes).toContain(testUser1._id.toString())
    })

    it('should return OK and change the upVote to downVote', async () => {
      const response = await request(app.app)
        .post(`/vote/down`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Destination',
          createdBy: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVotes).not.toContain(testUser1._id.toString())
      expect(response.body.data.downVotes).toContain(testUser1._id.toString())
    })
  })

  describe('perform DELETE to /vote', () => {
    it('should return OK and remove the vote for the user', async () => {
      const response = await request(app.app)
        .delete(`/vote`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Destination',
        })
        .query({
          userId: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVotes).not.toContain(testUser1._id.toString())
      expect(response.body.data.downVotes).not.toContain(testUser1._id.toString())
    })
  })

  it('should return OK and remove the vote for the user', async () => {
    const response = await request(app.app)
      .delete(`/vote`)
      .send({
        objectId: testDestination1._id.toString(),
        type: 'Destination',
      })
      .query({
        userId: testUser4._id.toString(),
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data.upVotes).not.toContain(testUser4._id.toString())
    expect(response.body.data.downVotes).not.toContain(testUser4._id.toString())
  })

  describe('perform GET from /vote with invalid input', () => {
    it('should return BAD_REQUEST', async () => {
      const response = await request(app.app)
        .get(`/vote`)
        .query({
          type: 'Invalid',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body.success).toBe(false)
    })

    it('should return NOT_FOUND', async () => {
      const response = await request(app.app)
        .get(`/vote`)
        .query({
          type: 'Destination',
          objectId: testUser1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.NOT_FOUND)

      expect(response.body.success).toBe(false)
    })
  })

  describe('perform GET from /vote/count - Get Vote Counts', () => {
    it('should return OK and the correct count of upvotes and downvotes for an existing object', async () => {
      // Explicitly add an upvote to ensure it's counted
      await request(app.app)
        .post(`/vote/up`)
        .send({
          objectId: testDestination1._id.toString(),
          type: 'Destination',
          createdBy: testUser1._id.toString(),
        })
        .expect(StatusCodes.OK)

      const response = await request(app.app)
        .get(`/vote/count`)
        .query({
          type: 'Destination',
          objectId: testDestination1._id.toString(),
        })
        .expect('Content-Type', /json/)
        .expect(StatusCodes.OK)

      console.log('Response body:', response.body)

      expect(response.body.success).toBe(true)
      expect(response.body.data.upVoteCount).toBe(1) // Expecting 1 upvote
      expect(response.body.data.downVoteCount).toBe(1) // Expecting 1 downvote from setup
    })
  })

  it('should correctly count multiple upvotes and downvotes', async () => {
    await request(app.app)
      .post(`/vote/up`)
      .send({
        objectId: testDestination1._id.toString(),
        type: 'Destination',
        createdBy: testUser3._id.toString(),
      })
      .expect(StatusCodes.OK)

    await request(app.app)
      .post(`/vote/down`)
      .send({
        objectId: testDestination1._id.toString(),
        type: 'Destination',
        createdBy: testUser4._id.toString(),
      })
      .expect(StatusCodes.OK)

    const response = await request(app.app)
      .get(`/vote/count`)
      .query({
        type: 'Destination',
        objectId: testDestination1._id.toString(),
      })
      .expect('Content-Type', /json/)
      .expect(StatusCodes.OK)

    expect(response.body.success).toBe(true)
    expect(response.body.data.upVoteCount).toBe(2) // Expecting 2 upvotes (testUser1 and testUser3)
    expect(response.body.data.downVoteCount).toBe(2) // Expecting 2 downvotes (testUser2 and testUser4)
  })
})
