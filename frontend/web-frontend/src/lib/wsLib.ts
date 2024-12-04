import { PrimitiveAtom, useAtom, atom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { subscriptionAtom, wsAtom } from './appLib'

const wsURL = 'ws://localhost:8080'

export const wsError = atom<string | null>(null)

// A record of TopicString in the shape of ${TopicType}:${ID} mapping to a corresponding message
export const wsMessages = atom<Record<string, WebSocketMessage>>({})

// Type of Topic
// planners:${userId} for list of planners
// planner:${plannerId} for a specific planner
// inbox:${userId} for a user's inbox (Not yet implemented)
export type TopicType = 'planners' | 'planner' | 'shoppingLists' | 'shoppingList' | 'inbox'

export interface MessageTopic {
  type: TopicType
  id: string // userId | plannerId | userId
}

// **
// Convert a topic message in the form of ** ${ID}:${type} ** which is in reverse
export const strFromTopic = (t: MessageTopic) => `${t.id}:${t.type}`

// The shape of the Object received from WebSocket
interface PPObject {
  data: any // The Object
  type: string // Object collection name for updating specific Object
  userIds?: string[] // Relavant userIds for topic
  plannerId?: string // Relavant Planner Id for topic
  addon?: any[] // Addition info for received data
}

// The shape of the message from WebSocket
interface WebSocketMessage {
  topic: MessageTopic
  action: 'update' | 'delete'
  message: PPObject
}

// The shape of a Subscribe request
export interface SubscriptionMessage {
  action: 'subscribe' | 'unsubscribe'
  topics: MessageTopic[]
}

// React hook for using WebSocket
export function useWebSocket() {
  const [appWS, setAppWS] = useAtom(wsAtom)

  const [ws, setWS] = useState(appWS)
  const [err, setError] = useAtom(wsError)
  const [msgs, setMessages] = useAtom(wsMessages)
  const [currSubs] = useAtom(subscriptionAtom)

  const subscribe = useCallback(
    (topics: MessageTopic[]) => {
      if (!appWS) return
      if (appWS.readyState !== 1 || topics.length < 1) return
      const newTopics: MessageTopic[] = topics.filter((t) => !currSubs.has(strFromTopic(t)))
      newTopics.map(strFromTopic).forEach((s) => currSubs.add(s))
      if (newTopics.length < 1) return
      const msg: SubscriptionMessage = {
        action: 'subscribe',
        topics: newTopics,
      }
      appWS.send(JSON.stringify(msg))
    },
    [ws, appWS, currSubs],
  )

  const resubscribe = (topics: MessageTopic[], socket: WebSocket) => {
    console.log('RESUB:', topics, socket.readyState)
    if (!socket) return
    if (socket.readyState !== 1 || topics.length < 1) return
    const msg: SubscriptionMessage = {
      action: 'subscribe',
      topics: topics,
    }
    socket.send(JSON.stringify(msg))
  }

  const unsubscribe = useCallback(
    (topics: MessageTopic[]) => {
      if (!appWS) return
      if (appWS.readyState !== 1 || topics.length < 1) return
      const msg: SubscriptionMessage = {
        action: 'unsubscribe',
        topics,
      }
      appWS.send(JSON.stringify(msg))
    },
    [ws, appWS],
  )

  const makeWSConnection = useCallback(() => {
    console.error('Retrying ws connection')
    ws.close()
    appWS.close()
    const newSocket = new WebSocket(wsURL)
    setWS(newSocket)
    setAppWS(newSocket)
    setTimeout(() => {
      if (newSocket.readyState === WebSocket.OPEN && currSubs.size > 0) {
        resubscribe(
          Array.from(currSubs).map((topicStr): MessageTopic => {
            const t = topicStr.split(':', 2)
            return { type: t[1] as TopicType, id: t[0] }
          }),
          newSocket,
        )
      }
    }, 2000)
  }, [resubscribe])

  useEffect(() => {
    appWS.onopen = () => {
      setError(null)
    }
    appWS.onclose = () => {
      setError('Disconnected')
      setTimeout(makeWSConnection, 3000)
    }
    appWS.onerror = (event) => {
      setError('Sum Ting Wong')
      console.error('WS: Sum Ting Wong')
      // setTimeout(makeWSConnection, 3000)
    }
    appWS.onmessage = (event) => {
      const msg: WebSocketMessage = JSON.parse(event.data)
      setMessages((prev) => ({
        ...prev,
        [`${msg.action}:${msg.message.type}:${msg.message.data._id}`]: msg,
      }))
    }
  }, [ws, appWS])

  return {
    webSocket: ws,
    error: err,
    messages: msgs,
    setWS,
    setError,
    setMessages,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  }
}
