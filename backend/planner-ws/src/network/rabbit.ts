import * as amqp from "npm:amqplib";
import { IQueue, PPObject, queues } from "../data/queue.ts";

let rabbitChannel: amqp.Channel;

/**
 * Returns a function that can be used as a consumer for a RabbitMQ channel.
 * Given a queue, it will push any messages it receives into the queue's
 * pending array. The message is expected to be a PPObject.
 *
 * @param {amqp.Channel} ch The RabbitMQ channel.
 *
 * a consumer for the RabbitMQ channel.
 */
const mkQueueConsumer =
	(ch: amqp.Channel) => (queue: IQueue) => (msg: amqp.ConsumeMessage) => {
		console.debug("Received Message!");
		if (!msg) return;
		const ppObject = JSON.parse(msg.content.toString()) as PPObject;
		console.log(`From Queue: ${queue.name} => `, ppObject);
		queue.pending.push({ object: ppObject });
		ch.ack(msg);
	};

/**
 * Initializes a queue on the given RabbitMQ channel with the given consumer.
 *
 * @param {IQueue} q The queue to initialize.
 * @param {amqp.Channel} ch The RabbitMQ channel.
 * @param {(msg: amqp.ConsumeMessage) => void} consumer
 * The function to call when a message is received on the queue.
 */
const initQueue = async (
	q: IQueue,
	ch: amqp.Channel,
	consumer: (msg: amqp.ConsumeMessage) => void,
) => {
	console.debug("Initializing queue", q);
	await ch.assertQueue(q.name, { durable: false });
	ch.consume(q.name, consumer);
};

/**
 * Initializes all of the given queues on the given RabbitMQ channel.
 *
 * @param {IQueue[]} qs The queues to initialize.
 * @param {amqp.Channel} ch The RabbitMQ channel.
 *
 * @returns {Promise<void>} A promise that resolves when all of the queues have
 * been successfully initialized.
 */
const initQueues = async (qs: IQueue[], ch: amqp.Channel): Promise<void> => {
	const mkConsumer = mkQueueConsumer(ch);
	await Promise.all(qs.map((q) => initQueue(q, ch, mkConsumer(q))));
};

/**
 * Connects to a RabbitMQ server using the given connection string, and returns a
 * channel connected to the server.
 *
 * @param {string} str The connection string to use when connecting to the RabbitMQ
 * server.
 *
 * @returns {Promise<amqp.Channel>} A promise that resolves with a connected channel.
 */
export const connectToRabbitMQ = async (str: string): amqp.Channel => {
	const connection = await amqp.connect(str);
	rabbitChannel = await connection.createChannel();
	return rabbitChannel;
};

/**
 * Initializes the given RabbitMQ channel or the global one if not given.
 * Initializes all queues with a consumer that adds messages to the queue's
 * pending array.
 *
 * @param {amqp.Channel} ch The RabbitMQ channel to initialize, or the global one
 * if not given.
 *
 * @returns {Promise<amqp.Channel>} A promise that resolves with the initialized
 * channel.
 */
export const initRabbitChannel = async (
	ch: amqp.Channel,
): Promise<amqp.Channel> => {
	if (ch) rabbitChannel = ch;
	await initQueues(queues, rabbitChannel).catch(() => {
		console.error("Failed while initilizing queues");
		Deno.exit(1);
	});
	return rabbitChannel;
};
