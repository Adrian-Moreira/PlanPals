import * as amqp from "npm:amqplib";
import { IQueue, PPObject, queues } from "../data/queue.ts";

let rabbitChannel: amqp.Channel;

const mkQueueConsumer =
  (ch: amqp.Channel) => (queue: IQueue) => (msg: amqp.ConsumeMessage) => {
    console.debug("Received Message!");
    if (msg) {
      const ppObject = JSON.parse(msg.content.toString()) as PPObject;
      console.log(`From Queue: ${queue.name} => `, ppObject);
      queue.pending.push({ object: ppObject });
      ch.ack(msg);
    }
  };

const initQueue = async (
  q: IQueue,
  ch: amqp.Channel,
  consumer: (msg: amqp.ConsumeMessage) => void,
) => {
  console.debug("Initializing queue", q);
  await ch.assertQueue(q.name, {
    durable: false,
  });
  ch.consume(q.name, consumer);
};

const initQueues = async (qs: IQueue[], ch: amqp.Channel) => {
  const mkConsumer = mkQueueConsumer(ch);
  await Promise.all(qs.map(async (q) => {
    await initQueue(q, ch, mkConsumer(q));
  }));
};

export const connectToRabbitMQ = async (str: string): amqp.Channel => {
  const connection = await amqp.connect(str);
  rabbitChannel = await connection.createChannel();
  return rabbitChannel;
};

export const initRabbitChannel = async (
  ch: amqp.Channel,
): Promise<amqp.Channel> => {
  if (ch) rabbitChannel = ch;
  try {
    await initQueues(queues, rabbitChannel);
  } catch {
    console.error("Failed while initilizing queues");
    Deno.exit(1);
  }
  return rabbitChannel;
};
