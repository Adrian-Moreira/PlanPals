import { Topic } from "../data/topic.ts";
import {
    handleSubscribeAction as subHandler,
    handleUnsubscribeAction as unsubHandler,
    SubscriptionMessage,
} from "./subscription.ts";

/**
 * Handles an incoming message event from a WebSocket connection. The message
 * is expected to be a SubscriptionMessage object. The action from the message
 * is used to determine which handler to call. If the action is "subscribe",
 * the message is passed to the subHandler, which will subscribe the client to
 * the given topics. If the action is "unsubscribe", the message is passed to
 * the unsubHandler, which will unsubscribe the client from the given topics.
 * If the action is unknown, a log message is printed indicating that the
 * action is unknown.
 *
 * @param ws The WebSocket connection the event is happening on.
 * @param msg The SubscriptionMessage to handle.
 */
const performMessageAction = (ws: WebSocket, msg: SubscriptionMessage) => {
    switch (msg.action) {
        case "subscribe":
            return subHandler(msg.topics.map((t) => new Topic(t)), ws);
        case "unsubscribe":
            return unsubHandler(msg.topics.map((t) => new Topic(t)), ws);
        default:
            return console.log("Unknown action from incoming event:", ws);
    }
};

/**
 * Handles incoming message events on a WebSocket connection.
 *
 * @param this The WebSocket connection the event is happening on.
 * @param event The incoming MessageEvent.
 *
 * @remarks
 * This will parse the incoming message as a SubscriptionMessage, and then
 * dispatch the appropriate handler based on the action in the message.
 */
function messageHandler(this: WebSocket, event: MessageEvent) {
    try {
        console.info("\nReceived event data: ", Deno.inspect(event.data));
        const msg = JSON.parse(event.data) as SubscriptionMessage;
        console.info("\nReceived event data object: ", Deno.inspect(msg));
        performMessageAction(this, msg);
    } catch {
        console.error("\n*****Incomming message is bad*****\n");
    }
}

/**
 * A WebSocket connection has been established.
 *
 * @remarks
 * This callback is established by the WebSocket library itself, and is called
 * when a client has successfully established a connection to this server.
 */
const openHandler = () => {
    console.info("A client connected");
};

/**
 * Handles incoming requests to the WebSocket server.
 *
 * @param req The incoming request object.
 *
 * @returns A Response object that can be sent back to the client.
 *
 * @remarks
 * This will check if the incoming request is a WebSocket upgrade request,
 * and if not, return a 501 response. If it is, it will establish a WebSocket
 * connection and add event listeners for open and message events.
 */
const requestHandler = (req: Request) => {
    if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", openHandler);
    socket.addEventListener("message", messageHandler);
    return response;
};

/**
 * A callback function that is called when the WebSocket server has started
 * listening. It is given an object with a single property, 'port', which is the
 * port number the server is listening on.
 *
 * @param {Object} options - An object with a single property, 'port', which is
 * the port number the server is listening on.
 */
const onListen = ({ port }: { port: number }) => {
    console.error(`Server started at ${port}`);
};

export interface WebSocketListenerArgs {
    port: number;
    ac: AbortController;
}

/**
 * Starts a WebSocket server listening on the given port.
 *
 * @param {WebSocketListenerArgs} args - An object with a single property, 'port',
 * which is the port number the server should listen on, and another property, 'ac',
 * which is an AbortController object that can be used to stop the server.
 *
 * @returns {Deno.HttpServer} A Deno.HttpServer object that represents the
 * WebSocket server. This object will emit events for open and message events.
 */
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
