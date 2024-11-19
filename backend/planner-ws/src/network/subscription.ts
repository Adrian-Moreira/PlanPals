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

/**
 * Handle the client's request to subscribe to new topics
 * @param {Topic[]} newTopics Topics the client wants to subscribe to
 * @param {WebSocket} clientSocket The client's WebSocket connection
 * @returns {void}
 */
export const handleSubscribeAction = (
    newTopics: Topic[],
    clientSocket: WebSocket,
): void => {
    console.info("\nHandleSubscribeAction");
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

/**
 * Handle the client's request to unsubscribe from topics
 * @param {Topic[]} topics Topics the client wants to unsubscribe from
 * @param {WebSocket} clientSocket The client's WebSocket connection
 * @returns {void}
 */
export const handleUnsubscribeAction = (
    topics: Topic[],
    clientSocket: WebSocket,
): void => {
    const clientUUID = getOrCreateClient(clientSocket);
    const subscribedTopics = getClientExistingSub(clientUUID);
    const unsubFromTopics = subscribedTopics.filter((subedTopic) =>
        topics.some((unsubbing) => unsubbing.toString() === subedTopic)
    );
    unsubFromTopics.forEach((topic) => {
        clientSubsByTopic.get(topic)?.delete(clientUUID);
    });
};
