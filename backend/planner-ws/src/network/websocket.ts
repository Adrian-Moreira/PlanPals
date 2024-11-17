import { Topic } from "../data/topic.ts";
import {
	handleSubscribeAction as subHandler,
	handleUnsubscribeAction as unsubHandler,
	SubscriptionMessage,
} from "./subscription.ts";

const messageHandler = (cliSock: WebSocket) => (event: MessageEvent) => {
	console.info("Received event data: " + event.data);
	const msg = JSON.parse(event.data) as SubscriptionMessage;
	switch (msg.action) {
		case "subscribe":
			return subHandler(msg.topics.map((t) => new Topic(t)), cliSock);
		case "unsubscribe":
			return unsubHandler(msg.topics.map((t) => new Topic(t)), cliSock);
		default:
			return console.log("Unknown action from incoming event: " + event);
	}
};

const openHandler = () => {
	console.info("A client connected");
};

const requestHandler = (req: Request) => {
	if (req.headers.get("upgrade") != "websocket") {
		return new Response(null, { status: 501 });
	}
	const { socket, response } = Deno.upgradeWebSocket(req);
	socket.addEventListener("open", openHandler);
	socket.addEventListener("message", messageHandler(socket));
	return response;
};

const onListen = ({ port }: { port: number }) => {
	console.error(`Server started at ${port}`);
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
		handler: requestHandler,
		onListen: onListen,
	});
	return server;
};
