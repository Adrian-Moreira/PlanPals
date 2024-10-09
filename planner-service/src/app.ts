#!/usr/bin/env node

import express, { Express, NextFunction, Request, Response } from 'express'
import { createServer, Server } from 'node:http'
import config from './config'
import { closeMongoConnection, connectToMongoDB } from './config/db'
import { StatusCodes } from 'http-status-codes'
import router from './routes/routers'
import cors from 'cors'

const port: number = config.server.port ? parseInt(config.server.port) : 8080

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR
  if (err.name === 'BSONError') {
    statusCode = StatusCodes.BAD_REQUEST
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

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
    this.app.use(errorHandler)
  }

  public startServer(): void {
    connectToMongoDB(this.dbURI)
    this.server.listen(port, () => {
      console.log(`PP erected on port ${port}`)
    })
  }

  public async stopServer(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      closeMongoConnection()
      if (!this.server) {
        resolve()
        return
      }
      this.server.close((err: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }
}

if (require.main === module) {
  const pp = new PlanPals({})

  process.on('SIGINT', () => pp.stopServer())
  process.on('SIGTERM', () => pp.stopServer())

  pp.startServer()
}

export default PlanPals
