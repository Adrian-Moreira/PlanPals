import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Auth } from 'aws-amplify'

import './App.css'
import { lightTheme, darkTheme } from './theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ResponsiveAppBar from './components/AppBar'
import Container from '@mui/material/Container'
import useMediaQuery from '@mui/material/useMediaQuery'

import Routes from './Routes.jsx'
import { AppContext, ThemeContext } from './lib/contextLib'
import { onError } from './lib/errorLib'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  const nav = useNavigate()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [cognitoUser, setCognitoUser] = useState(undefined)
  const [ppUser, setPPUser] = useState(undefined)
  const [theme, setTheme] = useState(lightTheme)

  const handleThemeChange = useCallback(async () => {
    setTheme(prefersDarkMode ? darkTheme : lightTheme)
  }, [prefersDarkMode])

  useEffect(() => {
    onLoad()
    handleThemeChange()
  }, [handleThemeChange])

  async function onLoad() {
    try {
      await Auth.currentSession()
      userHasAuthenticated(true)
    } catch (error) {
      if (error !== 'No current user') {
        onError(error)
      }
    }
    setIsAuthenticating(false)
  }

  async function handleLogout() {
    await Auth.signOut()
    userHasAuthenticated(false)
    nav('/login')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticating && (
        <Container className="App" maxWidth="xl">
          <ResponsiveAppBar
            theme={theme}
            title={'PlanPals'}
            handleLogout={handleLogout}
            backToHomeHandler={() => nav('/planners')}
            handleLogin={() => nav('/login')}
            handleSignup={() => nav('/signup')}
            handleAbout={() => nav('/about')}
            handlePlanners={() => nav('/planners')}
            isAuthenticated={isAuthenticated}
          ></ResponsiveAppBar>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <AppContext.Provider
              value={{ isAuthenticated, cognitoUser, ppUser, userHasAuthenticated, setCognitoUser, setPPUser }}
            >
              <Routes />
            </AppContext.Provider>
          </ThemeContext.Provider>
        </Container>
      )}
    </ThemeProvider>
  )
}

export default App
