import {
	clientSubsByTopic,
	getClientExistingSub,
	getOrCreateClient,
	mkNewTopic,
} from "../data/clients.ts";
import { MessageTopic, Topic } from "../data/topic.ts";

type SubscriptionActionType = "subscribe" | "unsubscribe";
export interface SubscriptionMessage {
	action: SubscriptionActionType;
	topics: MessageTopic[];
}

export const handleSubscribeAction = (
	newTopics: Topic[],
	clientSocket: WebSocket,
) => {
	console.info("HandleSubscribeAction");
	mkNewTopic(newTopics);

	const clientUUID = getOrCreateClient(clientSocket);
	console.info("  Subscribing client: ", clientUUID);

	const subscribedTopics = getClientExistingSub(clientUUID);
	console.info("  Client current subscription: ", subscribedTopics);

	const newSubscriptions = newTopics.filter((newTopic) =>
		!subscribedTopics.some((subedTopic) =>
			newTopic.toString() === subedTopic
		)
	);
	if (newSubscriptions.length > 0) {
		console.info("  Making subscription for client: ", newSubscriptions);
	}

	newSubscriptions.forEach((newTopic) => {
		clientSubsByTopic.get(newTopic.toString())?.add(clientUUID);
	});
};

export const handleUnsubscribeAction = (
	topics: Topic[],
	clientSocket: WebSocket,
) => {
	const clientUUID = getOrCreateClient(clientSocket);
	const subscribedTopics = getClientExistingSub(clientUUID);
	const unsubFromTopics = subscribedTopics.filter((subedTopic) =>
		topics.some((unsubbing) => unsubbing.toString() === subedTopic)
	);
	unsubFromTopics.forEach((topic) => {
		clientSubsByTopic.get(topic)?.delete(clientUUID);
	});
};
