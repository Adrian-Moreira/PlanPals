import { clientSockets, clientSubsByTopic } from "../data/clients.ts";
import { PPObject, QueueItem, queues } from "../data/queue.ts";
import { mkTopic, Topic } from "../data/topic.ts";

export type MessageActionType = "update" | "delete";

interface PublishUpdateArgs {
    topic: Topic;
    action: MessageActionType | string;
    message: PPObject;
}

/**
 * Sends a message to a client via its WebSocket connection, if the connection is open.
 *
 * @param socket - The WebSocket connection to send the message on.
 * @param args - The message to send. The message must be a JSON.stringify-able object
 * with a `topic` property, an `action` property that is either "update" or "delete",
 * and a `message` property that is a PPObject.
 *
 * @returns void
 */
const sendUpdateToClient = (args: PublishUpdateArgs) => {
    const jsonData = JSON.stringify(args);
    return (socket: WebSocket) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(jsonData);
        }
    };
};

/**
 * Returns true if the given topicObject is a valid topic for the given qItem.
 * A valid topic is one that matches any of the following:
 * - The topic is a "planners" topic and the qItem is a Planner with a
 *   matching userId.
 * - The topic is a "planner" topic and the qItem has a matching plannerId.
 * - The topic is an "inbox" topic and the qItem has a matching userId.
 *
 * @param topicObject - The topic to check.
 * @param qItem - The QueueItem to check the topic against.
 * @returns true if the topic is valid, false otherwise.
 */
const isValidTopic = (topicObject: Topic, qItem: QueueItem) => {
    const userIdMatch = qItem.object.userIds?.some((uid) =>
        uid === topicObject.id
    );
    const plannerIdMatch = qItem.object.plannerId === topicObject.id;

    const plannersTopic = topicObject.type === "planners" && userIdMatch &&
        qItem.object.type === "Planner";
    const plannerTopic = topicObject.type === "planner" && plannerIdMatch;
    const inboxTopic = topicObject.type === "inbox" && userIdMatch;

    return plannersTopic || plannerTopic || inboxTopic;
};

/**
 * Publishes a message to all WebSocket clients that are subscribed to a topic
 * that matches the given qItem. The message is sent with the given qName as
 * the action, and the PPObject from the qItem as the message.
 *
 * @param qItem - The QueueItem to publish.
 * @param qName - The name of the queue that the message is being published from.
 * @returns void
 */
export const publishMessage = (
    qItem: QueueItem,
    qName: string,
) => {
    clientSubsByTopic.forEach((clientUUIDs, topic) => {
        const topicObject = mkTopic(topic);
        if (!topicObject) return;
        if (!isValidTopic(topicObject, qItem)) return;

        const sendTo = sendUpdateToClient({
            topic: topicObject,
            action: qName,
            message: qItem.object,
        });

        clientUUIDs.forEach((uuid) => sendTo(clientSockets.get(uuid)!));
    });
};

/**
 * Publishes all pending messages in the queues to their respective subscribers.
 *
 * Goes through each queue, and if the queue has any pending messages, it will
 * publish each of the messages to all WebSocket clients that are subscribed to
 * topics that match the message. The message is sent with the name of the queue
 * as the action, and the PPObject from the queue item as the message.
 *
 * After publishing all of the messages, it clears the pending array for each
 * queue.
 *
 * @returns void
 */
export const broadcastPendingMessages = () => {
    queues.forEach((q) => {
        if (!(q.pending.length > 0)) return;
        console.info(
            "PublishingMessage",
            `to Queue: [${q.name}]\n${Deno.inspect(q.pending)}`,
        );
        q.pending.forEach((update) => publishMessage(update, q.name));
        q.pending.length = 0;
    });
};
