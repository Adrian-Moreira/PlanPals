import { useAtom } from 'jotai'
import apiLib from '../lib/apiLib'
import { atom } from 'jotai'

export interface PPUser {
  _id: string
  userName: string
  preferredName: string
}

export type PPUserAuth = {
  loggedIn: Boolean
  ppUser: PPUser | undefined
}

export const ppUser: PPUserAuth = {
  loggedIn: false,
  ppUser: undefined,
}

export const ppUserAtom = atom<PPUserAuth>(ppUser)
