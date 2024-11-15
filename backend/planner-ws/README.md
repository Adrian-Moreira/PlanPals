## (Un)Subscribe
Parameters:
- action: Either `"subscribe"` or `"unsubscribe"`
- topics: An array of topic objects containing `type` and `id` shown below.
```jsonc
{
  "action": "subscribe" | "unsubscribe",
  "topics": [{
    "type": 'planners' | 'planner' | 'inbox',
    "id": string // userId | plannerId | userId
  }]
}
```

## Broadcast Message
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
    "userIds"?: [string], // userIds relevant to the object
    "plannerId": string // plannerId associated with the object
  }
}
```
