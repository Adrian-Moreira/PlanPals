## Prerequisites
Before starting, ensure you have Deno 2.0 installed on your system. If not, you can download it [here](https://deno.com/).

## To Start:
1. In the `planner-ws` directory, run the following commands:
   ### Step 1: Install Dependencies
   ```bash
   deno install
   ```
   This will install all the required dependencies for the project.

   ### Step 2: Start the Development Server
   #### You'll need rabbitmq running either at `"amqp://user:password@localhost:5672"` or specify connection string by envvar `RABBITMQ_CONNECTIONSTRING`
   The server will retry up to 5 times before giving up.
   ```bash
   deno run dev
   ```
<<<<<<< Updated upstream
=======
   #### Alternatively
   ```bash
   deno run --allow-net --allow-read --allow-env --watch src/main.ts --port ${PORT_NUMBER} --log-level ${LOG_LEVEL}
   ```
>>>>>>> Stashed changes

   ### Step 3: Build for Production
   To build the app for production, run:
   ```bash
   deno run build
   ```
   This creates an executable `planner-ws` in the current directory.

   ### Optional: IPC
   If you're using Linux or macOS, you can send SIGUSR1 for outputting information to stderr
   , and SIGHUP to hangup then restart the server.


## (Un)Subscribe (You send this request)
Parameters:
- action: Either `"subscribe"` or `"unsubscribe"`
- topics: An array of topic objects containing `type` and `id` shown below.
```jsonc
{
  "action": "subscribe" | "unsubscribe",
  "topics": [{
    "type": 'planners' | 'planner' | 'inbox',
    "id": string // userId | plannerId | userId
  }, ...] // an array of topics
}
```

## Broadcast Message (You receive this after subscribing)
Attributes:
- topic: A topic string in the form of `${type}:${id}`.
- action: Either `update` or `delete`
- message: The message data shown below
```jsonc
{
  "topic": string, // e.g. `planners:6733a813af257e92c275eee1` for planners:userId.
  "action": "update" | "delete",
  "message": {
    "data": any, // the object being updated
    "type": string, // the object's collection name
    "userIds"?: string[], // userIds relevant to the object
    "plannerId": string // plannerId associated with the object
  }
}
```
