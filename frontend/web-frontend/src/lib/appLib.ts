import { atom, useAtom } from 'jotai'
import { MessageTopic } from './wsLib'
const wsURL = 'ws://localhost:8080'
interface UserAttrs {
  userName: string
  preferredName: string
}

export const userMap: Map<string, UserAttrs> = new Map()
export const userMapAtom = atom(userMap)

export const appWS = new WebSocket(wsURL)
export const wsAtom = atom(appWS)

export const subscriptionSet: Set<string> = new Set()
export const subscriptionAtom = atom(subscriptionSet)
