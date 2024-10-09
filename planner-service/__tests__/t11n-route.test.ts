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
        })

    afterAll(() => {
        app.stopServer()
    })
})