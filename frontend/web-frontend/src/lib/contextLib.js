import { createContext, useContext } from 'react'

export const AppContext = createContext({
  ppUser: undefined,
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
