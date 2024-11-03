import { createContext, useContext } from 'react'

export const AppContext = createContext({
  isAuthenticated: false,
  cognitoUser: undefined,
  ppUser: undefined,
  userHasAuthenticated: useAppContext,
  setCognitoUser: useAppContext,
  setPPUser: useAppContext,
})

export function useAppContext() {
  return useContext(AppContext)
}
