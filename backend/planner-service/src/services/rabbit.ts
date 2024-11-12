import { NextFunction, Request, Response } from 'express'
import { PPAPP } from '../app';
import * as amqp from 'amqplib';

const queues = {
  updateQ: 'updateQ',
  deleteQ: 'deleteQ',
}

let rabbitQ

export const connectToRabbitMQ = async (str: string) => {
  const connection = await amqp.connect(str);
  rabbitQ = await connection.createChannel();

  await rabbitQ.assertQueue(queues.updateQ, {
    durable: false
  });

  await rabbitQ.assertQueue(queues.deleteQ, {
    durable: false
  });

  return rabbitQ
}

export const publishUpdateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  PPAPP.q.sendToQueue(
    queues.updateQ,
    Buffer.from(JSON.stringify(req.body.result))
  );
  console.log("Published Update Event")
  next()
}

export const publishDeleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  PPAPP.q.sendToQueue(
    queues.deleteQ,
    Buffer.from(JSON.stringify(req.body.result))
  );
  console.log("Published Delete Event")
  next()
}
