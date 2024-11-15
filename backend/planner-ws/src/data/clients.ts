import { PrintInfo } from "../utils/info.ts";
import { Topic } from "./topic.ts";
import * as uuid from "jsr:@std/uuid";

export const clientSubsByTopic: Map<string, Set<string>> = new Map();
export const clientSockets: Map<string, WebSocket> = new Map();

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

export const getClientExistingSub = (
  clientUUID: string,
): string[] => {
  return clientSubsByTopic.entries().filter(([_topicStr, clientUUIDs]) => {
    return clientUUIDs.has(clientUUID);
  }).map((v) => v[0]).toArray();
};

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
