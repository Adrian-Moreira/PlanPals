import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'

import './App.css'
import Routes from './Routes.jsx'
import { AppContext } from './lib/contextLib'
import { onError } from './lib/errorLib'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App() {
  const nav = useNavigate()
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [cognitoUser, setCognitoUser] = useState(undefined)
  const [ppUser, setPPUser] = useState(undefined)

  useEffect(() => {
    onLoad()
  }, [])

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
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold text-muted"> PlanPals </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ?
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              : <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, cognitoUser, ppUser, userHasAuthenticated, setCognitoUser, setPPUser }}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  )
}

export default App
