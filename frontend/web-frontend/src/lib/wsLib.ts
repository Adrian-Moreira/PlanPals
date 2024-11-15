import { PrimitiveAtom, useAtom, atom } from 'jotai'
import { useCallback, useEffect } from 'react'

const wsURL = 'ws://localhost:8080'
const wsSocket = new WebSocket(wsURL)
export const wsAtom = atom(wsSocket)
export const isWsConnected = atom(false)
export const wsError = atom<string | null>(null)
export const wsMessages = atom<Record<string, WebSocketMessage>>({})
export let subAtom: PrimitiveAtom<(topics: MessageTopic[]) => void>
export let unsubAtom: PrimitiveAtom<(topics: MessageTopic[]) => void>

interface MessageTopic {
  type: 'planners' | 'planner' | 'inbox'
  id: string // userId | plannerId | userId
}

interface PPObject {
  data: any
  type: string // Object collection name
  userIds?: string[]
  plannerId?: string
  addon?: any[]
}

interface WebSocketMessage {
  topic: MessageTopic
  action: 'update' | 'delete'
  message: PPObject
}

interface SubscriptionMessage {
  action: 'subscribe' | 'unsubscribe'
  topics: MessageTopic[]
}

export function WebSockerConnector(atom: PrimitiveAtom<WebSocket>) {
  const [ws, setWS] = useAtom(atom)
  const [connected, setIsConnected] = useAtom(isWsConnected)
  const [err, setError] = useAtom(wsError)
  const [msgs, setMessages] = useAtom(wsMessages)

  const subscribe = useCallback((topics: MessageTopic[]) => {
    if (!ws || !connected || topics.length < 1) return
    const msg: SubscriptionMessage = {
      action: 'subscribe',
      topics,
    }
    ws.send(JSON.stringify(msg))
  }, [])

  const unsubscribe = useCallback((topics: MessageTopic[]) => {
    if (!ws || !connected || topics.length < 1) return
    const msg: SubscriptionMessage = {
      action: 'unsubscribe',
      topics,
    }
    ws.send(JSON.stringify(msg))
  }, [])

  useEffect(() => {
    setWS(wsSocket)
  }, [])

  useEffect(() => {
    ws.onopen = () => {
      setIsConnected(true)
      setError(null)
    }
    ws.onclose = () => {
      setIsConnected(false)
      setError('Disconnected')
      setTimeout(() => {
        console.error('Retrying ws connection')
        setWS(new WebSocket(wsURL))
      }, 3000)
    }
    ws.onerror = (event) => {
      setError('Sum Ting Wong')
      console.error('Sum Ting Wong: ' + JSON.stringify(event))
    }
    ws.onmessage = (event) => {
      const msg: WebSocketMessage = JSON.parse(event.data)
      setMessages((prev) => ({
        ...prev,
        [`${msg.action}:${msg.message.type}:${msg.message.data._id}`]: msg,
      }))
    }
  }, [ws])

  return {
    webSocket: ws,
    isConnected: connected,
    error: err,
    messages: msgs,
    setWS,
    setIsConnected,
    setError,
    setMessages,
    subscribeAtom: subscribe,
    unsubscribeAtom: unsubscribe,
  }
}
