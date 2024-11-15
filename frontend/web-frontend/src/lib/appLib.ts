import { atom } from 'jotai'

interface UserAttrs {
  userName: string
  preferredName: string
}

export const userMap: Map<string, UserAttrs> = new Map()
export const userMapAtom = atom(userMap)
