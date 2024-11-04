import { Auth } from 'aws-amplify'
import { createContext, useContext } from 'react'

export const AppContext = createContext({
  isAuthenticated: false,
  cognitoUser: Auth.currentAuthenticatedUser().then((user) => user),
  ppUser: undefined,
  userHasAuthenticated: useAppContext,
  setCognitoUser: useAppContext,
  setPPUser: useAppContext,
})

export function useAppContext() {
  return useContext(AppContext)
}

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: useThemeContext,
})

export function useThemeContext() {
  return useContext(ThemeContext)
}
