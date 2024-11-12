import { parseArgs } from "jsr:@std/cli/parse-args";
import * as amqp from "npm:amqplib";

const clientSockets: Set<WebSocket> = new Set();

let updatesQueue: string[] = [];
let deletesQueue: string[] = [];

const queues = {
  updateQ: "updateQ",
  deleteQ: "deleteQ",
};

const startBroadcasting = () => {
  updatesQueue.forEach((update) => {
    publishMessage(update);
  });
  updatesQueue = [];

  deletesQueue.forEach((update) => {
    publishMessage(update);
  });
  deletesQueue = [];
};

const publishMessage = (str: string) => {
  clientSockets.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(str);
  });
};

const cleanUpClients = () => {
  console.debug("Before CleanUp" + Deno.inspect(clientSockets));
  clientSockets.forEach((socket) => {
    if (socket.readyState !== WebSocket.OPEN) clientSockets.delete(socket);
  });
  console.debug("After CleanUp" + Deno.inspect(clientSockets));
};

export async function StartServing(
  port: number = 8000,
  updateInt: number = 2500,
  cleanUpInt: number = 120000,
) {
  const ac = new AbortController();

  const amqpConn = await amqp.connect("amqp://user:password@localhost:5672");

  const rabbitChannel = await amqpConn.createChannel();

  await rabbitChannel.assertQueue(queues.deleteQ, {
    durable: false,
  });

  await rabbitChannel.assertQueue(queues.updateQ, {
    durable: false,
  });

  rabbitChannel.consume(queues.updateQ, (msg: amqp.ConsumeMessage) => {
    if (msg) {
      console.log("Update: ", JSON.parse(msg.content.toString()))
      updatesQueue.push(msg.content.toString());
      rabbitChannel.ack(msg);
    }
  });

  rabbitChannel.consume(queues.deleteQ, (msg: amqp.ConsumeMessage) => {
    if (msg) {
      console.log("Delete: ", JSON.parse(msg.content.toString()))
      deletesQueue.push(msg.content.toString());
      rabbitChannel.ack(msg);
    }
  });

  Deno.serve({
    port: port,
    signal: ac.signal,
    handler: (req) => {
      if (req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 501 });
      }

      const { socket, response } = Deno.upgradeWebSocket(req);

      clientSockets.add(socket);

      socket.addEventListener("open", () => {
        console.log("a client connected!");
      });

      socket.addEventListener("message", (event) => {
        console.log(event.data);
        if (event.data === "ping") {
          socket.send("pong");
        }
      });

      return response;
    },
    onListen({ port }) {
      console.log(`Server started at ${port}`);
    },
  });
  const _startBroadcastingTicker = setInterval(startBroadcasting, updateInt);
  const _cleanUpClientsTicker = setInterval(cleanUpClients, cleanUpInt);
  return { ac, rabbitChannel };
}

const processFlags = (flags: {
  [x: string]: unknown;
  port: string;
  "log-level": string;
  _: Array<string | number>;
}) => {
  let logLevel, portNum;
  try {
    logLevel = parseInt(flags["log-level"]);
    if (logLevel > 3 || logLevel < 0) {
      console.error("Log level must be between 0 - 3");
      Deno.exit(1);
    }
  } catch (e) {
    console.error("Error: " + e);
    Deno.exit(1);
  }

  try {
    portNum = parseInt(flags["port"]);
    if (portNum <= 1000 || portNum > 65535) {
      console.error("Invalid port number");
      Deno.exit(1);
    }
  } catch (e) {
    console.error("Error: " + e);
    Deno.exit(1);
  }
  return { logLevel: logLevel ?? 3, port: portNum ?? 8000 };
};

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["log-level", "port"],
    default: {
      "log-level": "3",
      "port": "8000",
    },
  });

  const { logLevel, port } = processFlags(flags);

  if (logLevel === 3) {
    console.log = () => { };
    console.debug = () => { };
    console.info = () => { };
  }

  if (logLevel === 2) {
    console.debug = () => { };
    console.info = () => { };
  }

  if (logLevel === 1) {
    console.debug = () => { };
  }

  await StartServing(port);
}
