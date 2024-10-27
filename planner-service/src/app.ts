#!/usr/bin/env ts-node

import express, { Express, NextFunction, Request, Response } from 'express'
import { createServer, Server } from 'node:http'
import config from './config'
import { closeMongoConnection, connectToMongoDB } from './config/db'
import router from './routes/routers'
import cors from 'cors'
import RequestUtils from './utils/RequestUtils'

const port: number = config.server.port ? parseInt(config.server.port) : 8080

class PlanPals {
  public app: Express
  server: Server
  dbURI: string

  constructor({ dbURI }: any) {
    this.app = express()
    this.server = createServer(this.app)
    this.dbURI =
      dbURI || config.database.connectionString || 'mongodb://localhost:27017'
    this.initRoutes()
  }

  private initRoutes(): void {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(router)
    this.app.use(RequestUtils.mkErrorResponse)
  }

  public async startServer(overridePort: number | null): Promise<void> {
    await connectToMongoDB(this.dbURI)
    this.server.listen(overridePort || port, () => {
      console.log(`PP erected on port ${port}`)
    })
  }

  public async stopServer(): Promise<void> {
    await closeMongoConnection()
    this.server.close()
  }
}

if (require.main === module) {
  const pp = new PlanPals({})

  process.on('SIGINT', () => pp.stopServer())
  process.on('SIGTERM', () => pp.stopServer())

  pp.startServer(port)
}

export default PlanPals
