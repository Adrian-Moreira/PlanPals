import { parseArgs } from "jsr:@std/cli/parse-args";
import { difference } from "@std/datetime";
import * as amqp from "npm:amqplib";
import { connectToRabbitMQ, initRabbitChannel } from "./network/rabbit.ts";
import { processFlags, processLoglevel } from "./utils/args.ts";
import { startListening } from "./network/websocket.ts";
import { PrintInfo } from "./utils/info.ts";
import { broadcastPendingMessages } from "./network/broadcast.ts";
import {
  cleanUpClients,
  clientSockets,
  clientSubsByTopic,
} from "./data/clients.ts";
import { queues } from "./data/queue.ts";

interface ServinsArgs {
  updateInt: number;
  cleanUpInt: number;
}

export async function StartServing(
  port: number = 8000,
  args: ServinsArgs = { updateInt: 1000, cleanUpInt: 120000 },
) {
  const ac = new AbortController();
  const rabbitChannel = await connectToRabbitMQ(
    Deno.env.get("RABBITMQ_CONNECTIONSTRING") ??
      "amqp://user:password@localhost:5672",
  );
  await initRabbitChannel(rabbitChannel);

  const wsServer = startListening({ port, ac });

  const _broadcastTicker = setInterval(
    broadcastPendingMessages,
    args.updateInt,
  );
  const _cleanUpClientsTicker = setInterval(
    cleanUpClients,
    args.cleanUpInt,
  );
  return { ac, rabbitChannel, wsServer, startDate: new Date() };
}

export interface ServerAttrArgs {
  rabbitChannel: amqp.Channel;
  wsServer: Deno.HttpServer;
  startDate: Date;
}

export async function StopServing(args: ServerAttrArgs) {
  await args.rabbitChannel.close();
  await args.wsServer.shutdown();
  console.error("Server closed.");
}

function setUpSignalListeners(port: number, args: ServerAttrArgs) {
  Deno.addSignalListener("SIGINT", async () => {
    console.error("\nReceived SIGINT, stopping...");
    await StopServing(args);
    Deno.exit();
  });
  if (Deno.build.os === "linux" || Deno.build.os === "darwin") {
    Deno.addSignalListener("SIGTERM", async () => {
      console.error("\nReceived SIGTERM, stopping...");
      await StopServing(args);
      Deno.exit();
    });

    Deno.addSignalListener("SIGHUP", async () => {
      console.error("\nReceived SIGHUP, restarting...");
      await StopServing(args);
      queues.forEach((q) => q.pending.length = 0);
      clientSockets.clear();
      clientSubsByTopic.clear();
      setTimeout(async () => {
        const newAttr = await StartServing(port);
        args.rabbitChannel = newAttr.rabbitChannel;
        args.wsServer = newAttr.wsServer;
        PrintInfo();
      }, 1000);
    });

    Deno.addSignalListener("SIGUSR1", () => {
      const upTime = difference(args.startDate, new Date());
      console.error(
        `Started at: ${args.startDate}; Uptime: ${upTime.seconds} secs`,
      );
      PrintInfo();
    });
  }
}

if (import.meta.main) {
  const { logLevel, port } = processFlags(parseArgs(Deno.args, {
    string: ["log-level", "port"],
    default: {
      "log-level": "3",
      "port": "8000",
    },
  }));
  processLoglevel({ logLevel });
  const serverAttrs = await StartServing(port);
  setUpSignalListeners(port, serverAttrs);
}
