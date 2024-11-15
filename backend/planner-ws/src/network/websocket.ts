import { Topic } from "../data/topic.ts";
import {
  handleSubscribeAction,
  handleUnsubscribeAction,
  SubscriptionMessage,
} from "./subscription.ts";

const messageHandler = (clientSocket: WebSocket) => (event: MessageEvent) => {
  console.info("Received event data: " + event.data);
  const msg = JSON.parse(event.data) as SubscriptionMessage;
  switch (msg.action) {
    case "subscribe":
      handleSubscribeAction(
        msg.topics.map((t) => new Topic(t)),
        clientSocket,
      );
      break;
    case "unsubscribe":
      handleUnsubscribeAction(
        msg.topics.map((t) => new Topic(t)),
        clientSocket,
      );
      break;
    default:
      console.log("Unknown action from incoming event: " + event);
      break;
  }
};

export interface WebSocketListenerArgs {
  port: number;
  ac: AbortController;
}

export const startListening = (
  { port, ac }: WebSocketListenerArgs,
): Deno.HttpServer => {
  const server = Deno.serve({
    port: port,
    signal: ac.signal,
    handler: (req) => {
      if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
      }

      const { socket, response } = Deno.upgradeWebSocket(req);

      socket.addEventListener("open", () => {
        console.info("A client connected");
      });

      socket.addEventListener("message", messageHandler(socket));

      return response;
    },
    onListen({ port }) {
      console.error(`Server started at ${port}`);
    },
  });
  return server;
};
