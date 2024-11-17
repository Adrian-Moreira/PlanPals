import { clientSockets, clientSubsByTopic } from "../data/clients.ts";
import { PPObject, QueueItem, queues } from "../data/queue.ts";
import { mkTopic, Topic } from "../data/topic.ts";

export type MessageActionType = "update" | "delete";

interface PublishUpdateArgs {
	topic: Topic;
	action: MessageActionType | string;
	message: PPObject;
}

const sendUpdateToClient =
	(args: PublishUpdateArgs) => (socket?: WebSocket) => {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(args));
		}
	};

export const publishMessage = (
	qItem: QueueItem,
	qName: string,
) => {
	clientSubsByTopic.forEach((clients, topic) => {
		const topicObject = mkTopic(topic);
		if (!topicObject) return;

		const userIdMatch = qItem.object.userIds?.some((uid) =>
			uid === topicObject.id
		);
		const plannerIdMatch = qItem.object.plannerId === topicObject.id;

		const plannersTopic = topicObject.type === "planners" && userIdMatch &&
			qItem.object.type === "Planner";
		const plannerTopic = topicObject.type === "planner" && plannerIdMatch;
		const inboxTopic = topicObject.type === "inbox" && userIdMatch;

		const validTopic = plannersTopic || plannerTopic || inboxTopic;

		if (!validTopic) return;

		const send = sendUpdateToClient({
			topic: topicObject,
			action: qName,
			message: qItem.object,
		});
		clients.values().map(([uuid]) => clientSockets.get(uuid)).forEach(send);
	});
};

export const broadcastPendingMessages = () => {
	queues.forEach((q) => {
		if (!(q.pending.length > 0)) return;

		console.info("PublishingMessage: ", q.name, Deno.inspect(q.pending));
		q.pending.forEach((update) => {
			publishMessage(update, q.name);
		});
		q.pending.length = 0;
	});
};
