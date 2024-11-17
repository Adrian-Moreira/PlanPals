import { parseArgs } from "jsr:@std/cli/parse-args";
import * as amqp from "npm:amqplib";
import { connectToRabbitMQ, initRabbitChannel } from "./network/rabbit.ts";
import { processFlags, processLoglevel } from "./utils/args.ts";
import { startListening } from "./network/websocket.ts";
import { broadcastPendingMessages } from "./network/broadcast.ts";
import {
    cleanUpClients,
    clientSockets,
    clientSubsByTopic,
} from "./data/clients.ts";
import { queues } from "./data/queue.ts";

import { setUpSignalListeners } from "./utils/signalListeners.ts";
export interface ServinsArgs {
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

if (import.meta.main) {
    const { logLevel, port } = processFlags(parseArgs(Deno.args, {
        string: ["log-level", "port"],
        default: {
            "log-level": "3",
            "port": "8000",
        },
    }));
    processLoglevel({ logLevel });
    const start = async () => {
        const serverAttrs = await StartServing(port);
        setUpSignalListeners({
            StartServing,
            StopServing,
            queues,
            clientSockets,
            clientSubsByTopic,
        })(port, serverAttrs);
    };
    const createRetryTicker = () => {
        let attempts = 0;
        const maxAttempts = 5;
        const ticker = setInterval(async () => {
            if (attempts >= maxAttempts) {
                console.error("Max retry attempts reached. Exiting...");
                clearInterval(ticker);
                Deno.exit(1);
            }
            attempts++;
            await startWithRetry(ticker)();
        }, 5000);
        return ticker;
    };
    const startWithRetry = (ticker: number) => async () => {
        try {
            await start();
            clearInterval(ticker);
        } catch (e) {
            console.error("Failed to start server:", e);
        }
    };
    await startWithRetry(createRetryTicker())();
}
