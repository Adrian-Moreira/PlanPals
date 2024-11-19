import * as uuid from "jsr:@std/uuid";
import { PrintInfo } from "../utils/info.ts";
import { Topic } from "./topic.ts";

export const clientSubsByTopic: Map<string, Set<string>> = new Map();
export const clientSockets: Map<string, WebSocket> = new Map();

/**
 * Gets a UUID for a given WebSocket connection. If the connection is new,
 * generates a new UUID and adds the connection to the clientSockets map.
 *
 * @param clientSocket The WebSocket connection to get a UUID for.
 *
 * @returns The UUID of the connection.
 */
export const getOrCreateClient = (clientSocket: WebSocket): string => {
    const existingClient = clientSockets.entries().find(([_uuid, ws]) =>
        ws == clientSocket
    );

    let clientUUID;
    if (existingClient) clientUUID = existingClient[0];
    else {
        clientUUID = uuid.v1.generate();
        clientSockets.set(clientUUID, clientSocket);
    }
    return clientUUID;
};

/**
 * Returns an array of topic strings that the client with the given UUID is
 * currently subscribed to.
 *
 * @param clientUUID The UUID of the client to get subscriptions for.
 *
 * @returns An array of topic strings that the client is subscribed to.
 */
export const getClientExistingSub = (
    clientUUID: string,
): string[] => {
    return clientSubsByTopic.entries().filter(([_topicStr, clientUUIDs]) =>
        clientUUIDs.has(clientUUID)
    ).map((v) => v[0]).toArray();
};

/**
 * Takes an array of Topic objects and creates new entries in the
 * clientSubsByTopic map for any topics that do not already exist.
 *
 * @param topics The array of topics to create new subscriptions for.
 *
 * @returns void
 */
export const mkNewTopic = (topics: Topic[]) => {
    const newTopics = topics.filter((t) =>
        !clientSubsByTopic.entries().some(([topicStr, _s]) =>
            topicStr === t.toString()
        )
    );
    newTopics.forEach((newTopic) => {
        clientSubsByTopic.set(newTopic.toString(), new Set());
    });
};

/**
 * Periodically called to clean up stale client UUIDs from the clientSubsByTopic and
 * clientSockets maps.
 *
 * This function goes through each of the clientSockets, and if the socket is not
 * currently open, it removes the client UUID from the clientSockets map and adds
 * it to a Set of stale client UUIDs. It then goes through each of the topics in
 * clientSubsByTopic, and if the topic has any of the stale client UUIDs, it
 * removes them. If, after removing stale client UUIDs, a topic has no more
 * clients subscribed to it, it removes the topic from the clientSubsByTopic map.
 *
 * @returns void
 */
export const cleanUpClients = () => {
    console.debug("Before CleanUp");
    PrintInfo();

    const staleClients: Set<string> = new Set();
    clientSockets.forEach((socket, clientUUID) => {
        if (socket.readyState !== WebSocket.OPEN) {
            clientSockets.delete(clientUUID);
            staleClients.add(clientUUID);
        }
    });
    clientSubsByTopic.forEach((clientUUIDs, topic) => {
        staleClients.forEach((staleUUID) => {
            clientUUIDs.delete(staleUUID);
        });
        if (clientUUIDs.size === 0) {
            clientSubsByTopic.delete(topic);
        }
    });

    console.debug("After CleanUp");
    PrintInfo();
};
