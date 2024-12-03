import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import {  useAtom } from 'jotai'
// import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './components/Notifications/notificationContext';



import './App.css'
import { lightTheme, darkTheme } from './theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ResponsiveAppBar from './components/AppBar'
import Container from '@mui/material/Container'
import useMediaQuery from '@mui/material/useMediaQuery'

import Routes from './Routes.jsx'
import { ppUserAtom } from './lib/authLib.ts'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { subscriptionAtom, wsAtom } from './lib/appLib.ts'

function App() {
  const nav = useNavigate()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [pUser, setPPUser] = useAtom(ppUserAtom)

  const [theme, setTheme] = useState(lightTheme)

  const [currSubs] = useAtom(subscriptionAtom)

  const [webSocket] = useAtom(wsAtom)

  const handleThemeChange = useCallback(async () => {
    setTheme(prefersDarkMode ? darkTheme : lightTheme)
  }, [prefersDarkMode])

  useEffect(() => {
    handleThemeChange()
  }, [handleThemeChange])

  // useEffect(() => {
  //   toast.success('Hello, world!');
  // }, []);

  async function handleLogout() {
    setPPUser({
      loggedIn: false,
      ppUser: null,
    })
    currSubs.clear()
    webSocket.close()
    nav('/')
  }

  return ( //<ToastContainer />
    
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
      {ppUserAtom && (
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
            handleShoppingLists={() => nav('/shoppingLists')}
            ppUser={pUser}
          ></ResponsiveAppBar>
          <Routes />
        </Container>
      )}
      </NotificationProvider>
    </ThemeProvider>
    
  )
}

export default App
