import { NextFunction, Request, Response } from 'express'
import { PPAPP } from '../app'
import * as amqp from 'amqplib'

const queues = {
  updateQ: 'update',
  deleteQ: 'delete',
}

let rabbitQ

export const connectToRabbitMQ = async (str: string) => {
  const connection = await amqp.connect(str)
  rabbitQ = await connection.createChannel()

  await rabbitQ.assertQueue(queues.updateQ, {
    durable: false,
  })

  await rabbitQ.assertQueue(queues.deleteQ, {
    durable: false,
  })

  return rabbitQ
}

interface EventMessageArgs {
  data: any
  type: string
  userIds?: string[]
  plannerId?: string
  addon?: any[]
}

const mkEventMessage = (args: EventMessageArgs): string => {
  return JSON.stringify(args)
}

export const publishUpdateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  PPAPP.q.sendToQueue(
    queues.updateQ,
    Buffer.from(
      mkEventMessage({
        addon: req.body.addon,
        data: req.body.result,
        type: req.body.dataType,
        userIds: req.body.userIds,
        plannerId: req.body.plannerId,
      }),
    ),
  )
  console.log('Published Update Event')
  next()
}

export const publishDeleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  PPAPP.q.sendToQueue(
    queues.deleteQ,
    Buffer.from(
      mkEventMessage({
        addon: req.body.addon,
        data: req.body.result,
        type: req.body.dataType,
        userIds: req.body.userIds,
        plannerId: req.body.plannerId,
      }),
    ),
  )
  console.log('Published Delete Event')
  next()
}
