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

export function initExpress(app: Express): Express {
  app.use(express.json())
  app.use(cors())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static('public'))
  app.get('/', landingPage)
  app.get('/health', healthChecker)
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
