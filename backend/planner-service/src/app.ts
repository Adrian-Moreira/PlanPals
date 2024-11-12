#!/usr/bin/env ts-node

import path from 'node:path'
import { inspect } from 'node:util'
import { createServer, Server } from 'node:http'
import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import { Mongoose } from 'mongoose'
import httpProxy from 'http-proxy';
import * as amqp from 'amqplib';

import config from './config'
import { closeMongoConnection, connectToMongoDB } from './config/db'
import router from './routes/routers'
import RequestUtils from './utils/RequestUtils'
import { connectToRabbitMQ } from './services/rabbit'

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
  q: amqp.Channel
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
  const rabbitQ = await connectToRabbitMQ(config.messageQ.connectionString || 'amqp://user:password@localhost:5672')
  MongooseConnection = db

  const app = initExpress(express())
  const server = createServer(app)

  const proxy = httpProxy.createProxyServer({
    target: 'ws://localhost:8000',
    ws: true,
  });

  server.on('upgrade', (req, socket, head) => {
    console.log("Upgrading WS request")
    proxy.ws(req, socket, head);
  });

  PPAPP = { app, server, db, q: rabbitQ }
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
  process.on('SIGINT', async () => (await stopServer)())
  process.on('SIGTERM', async () => (await stopServer)())
}

export default PlanPals
