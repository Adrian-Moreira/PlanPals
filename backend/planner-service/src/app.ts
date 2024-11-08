#!/usr/bin/env ts-node

import path from 'node:path'
import { inspect } from 'node:util'
import { createServer, Server } from 'node:http'
import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { Mongoose } from 'mongoose'

import config from './config'
import { closeMongoConnection, connectToMongoDB } from './config/db'
import router from './routes/routers'
import RequestUtils from './utils/RequestUtils'

const port: number = config.server.port ? parseInt(config.server.port) : 8080
export let MongooseConnection: Mongoose
export let PPAPP: PlanPals

const healthChecker = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('OK')
}

const landingPage = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).sendFile(path.join(__dirname, 'public', 'index.html'))
}

type PlanPals = {
  app: Express
  server: Server
  db: Mongoose
}

import { writeFileSync } from 'fs'
import { performance, PerformanceObserver } from 'perf_hooks'
import * as prof from 'v8-profiler-next'

// Setup performance metrics observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries()
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`)
  })
})
obs.observe({ entryTypes: ['measure'], buffered: true })

// Middleware to measure route execution time
const measureRouteTime = (req: Request, res: Response, next: NextFunction) => {
  const routeName = `${req.method} ${req.path}`
  performance.mark(`${routeName}-start`)

  res.on('finish', () => {
    performance.mark(`${routeName}-halt`)
    performance.measure(routeName, `${routeName}-start`, `${routeName}-halt`)
  })

  next()
}

export function initExpress(app: Express): Express {
  app.use(express.json())
  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static('public'))
  // app.use(rateLimiter)
  app.use(measureRouteTime)
  app.get('/', landingPage)
  app.get('/health', healthChecker)
  app.get('/profile-pp-start', (req, res) => {
    prof.startProfiling('CPU profile')
    res.send('CPU profiling started')
  })
  app.get('/profile-pp-halt', (req, res) => {
    const profile = prof.stopProfiling('CPU profile')
    writeFileSync('./pp-profile.cpuprofile', JSON.stringify(profile))
    res.send('CPU profile saved to pp-profile.cpuprofile')
  })
  app.use(router)
  app.use(RequestUtils.mkErrorResponse)
  return app
}

export async function initServer(): Promise<PlanPals> {
  const db = await connectToMongoDB(config.database.connectionString || 'mongodb://localhost:27017')

  MongooseConnection = db

  const app = initExpress(express())
  const server = createServer(app)

  PPAPP = { app, server, db }
  return PPAPP
}

export function startServer(pp: PlanPals) {
  pp.server.listen(port, () => {
    console.log(`PP server listening on ${inspect(pp.server!.address())}`)
  })
  return pp
}

export async function stopServer(pp: PlanPals): Promise<void> {
  await closeMongoConnection(pp.db)
    .then(() => pp.server.close())
    .finally(() => console.log('PP server stopped'))
}

export async function main() {
  const pp = await initServer()
  startServer(pp)
  return () => stopServer(pp)
}

if (require.main === module) {
  const stopServer = main()
  process.on('SIGINT', () => stopServer)
  process.on('SIGTERM', () => stopServer)
}

export default PlanPals
