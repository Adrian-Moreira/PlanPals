import { difference } from "@std/datetime/difference";
import * as amqp from "npm:amqplib";
import { PrintInfo } from "./info.ts";
import { ServerAttrArgs, ServinsArgs } from "../main.ts";
import { IQueue } from "../data/queue.ts";

export interface ListenerProps {
    StartServing: (port?: number, args?: ServinsArgs) => Promise<{
        ac: AbortController;
        rabbitChannel: amqp.Channel;
        wsServer: Deno.HttpServer<Deno.Addr>;
    }>;
    StopServing: (args: ServerAttrArgs) => Promise<void>;
    queues: IQueue[];
    clientSockets: Map<string, WebSocket>;
    clientSubsByTopic: Map<string, Set<string>>;
}

const retryFunc = (
    args: ServerAttrArgs,
    port: number,
    StartServing: (port?: number, args?: ServinsArgs) => Promise<{
        ac: AbortController;
        rabbitChannel: amqp.Channel;
        wsServer: Deno.HttpServer<Deno.Addr>;
    }>,
) =>
async () => {
    const newAttr = await StartServing(port);
    args.rabbitChannel = newAttr.rabbitChannel;
    args.wsServer = newAttr.wsServer;
    PrintInfo();
};

export const setUpSignalListeners = (
    { StartServing, StopServing, queues, clientSockets, clientSubsByTopic }:
        ListenerProps,
) =>
(port: number, args: ServerAttrArgs) => {
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
            setTimeout(retryFunc(args, port, StartServing), 1000);
        });

        Deno.addSignalListener("SIGUSR1", () => {
            const upTime = difference(args.startDate, new Date());
            console.error(
                `Started at: ${args.startDate}`,
                `Uptime: ${upTime.seconds} secs`,
            );
            PrintInfo();
        });
    }
};
