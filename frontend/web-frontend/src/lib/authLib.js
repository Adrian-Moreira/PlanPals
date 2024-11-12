import apiLib from '../lib/apiLib'
import { atom } from 'jotai'

export const ppUser = atom({
  loggedIn: false,
  ppUser: undefined,
})

export async function getCurrentUser(setPPUser) {
  let user
  let response

  response = await apiLib.get('/user/search', {
    params: { userName: user.attributes.email },
  })
  setPPUser(response.data.data)

  return { ppUser: response.data.data }
}
