import { clientSockets, clientSubsByTopic } from "../data/clients.ts";
import { queues } from "../data/queue.ts";

export const PrintInfo = () => {
  console.error("\nInfo: ", new Date().toLocaleString());

  console.error("\nQueue Status:");
  queues.forEach((q) => {
    console.error(`\n${q.name} Queue:`);
    if (q.pending.length === 0) {
      console.error("  No pending items");
    } else {
      console.error(`  Pending Items (${q.pending.length}):`);
      q.pending.forEach((item, index) => {
        console.error(`    ${index + 1}.`);
        console.error(`       Data: ${item.object}`);
      });
    }
  });

  console.error("\nClient Subscriptions by Topic:");
  clientSubsByTopic.forEach((clients, topic) => {
    console.error(`  ${topic.toString()}:`);
    clients.forEach((clientId) => {
      console.error(`    - ${clientId}`);
    });
  });

  console.error("\nConnected Client Sockets:");
  clientSockets.forEach((socket, clientId) => {
    console.error(
      `  ${clientId}: ${
        socket.readyState === WebSocket.OPEN ? "Connected" : "Disconnected"
      }`,
    );
  });
};
