import { clientSockets, clientSubsByTopic } from "../data/clients.ts";
import { queues } from "../data/queue.ts";

/**
 * Prints out information about the state of the server, including:
 * - The current time
 * - The number of pending items in each queue
 * - The data of each pending item in each queue
 * - The client subscriptions by topic
 * - The connected client sockets
 *
 * This function is intended to be used for debugging purposes.
 *
 * @returns void
 */
export const PrintInfo = () => {
    console.error("\nInfo: ", new Date().toLocaleString());

    console.error("\nQueue Status:");
    queues.forEach((q) => {
        console.error(`\n${q.name} Queue:`);
        if (q.pending.length === 0) {
            console.error("  No pending items");
            return;
        }
        console.error(`  Pending Items (${q.pending.length}):`);
        q.pending.forEach((item, index) => {
            console.error(`    ${index + 1}.`);
            console.error(`       Data: ${item.object}`);
        });
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
        const isConnected = socket.readyState === WebSocket.OPEN
            ? "Connected"
            : "Disconnected";
        console.error(`  ${clientId}: ${isConnected}`);
    });
};
