import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'

import './Login.css'

import LoaderButton from '../components/LoaderButton.tsx'
import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'

import { onError } from '../lib/errorLib'
import { useFormFields } from '../lib/hooksLib'
import { useAppContext, useThemeContext } from '../lib/contextLib'
import apiLib from '../lib/apiLib'

export default function Login() {
  const nav = useNavigate()
  const { userHasAuthenticated, setCognitoUser, setPPUser } = useAppContext()
  const { theme } = useThemeContext()
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event) => {
    event.preventDefault()
  }

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const cognitoUser = await Auth.signIn(fields.email, fields.password)
      setCognitoUser(cognitoUser)
      let response = await apiLib
        .get('/user/search', {
          params: { userName: fields.email },
        })
        .catch(async (error) => {
          if (error.status === 404) {
            return await apiLib.post('/user', { data: { userName: fields.email, preferredName: fields.email } })
          }
        })
        .finally((res) => res)
      setPPUser(response.data.data)
      userHasAuthenticated(true)
      nav('/')
    } catch (error) {
      if (error?.message === 'Incorrect username or password.' || error?.message === 'User does not exist.') {
        setAuthError(true)
      }
      onError(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="Login">
      <MUI.Box component="form" noValidate autoComplete="off">
        <MUI.Stack gap={3}>
          <MUI.TextField
            error={authError}
            helperText={authError && 'Incorrect email or password.'}
            autoFocus
            required
            id="email"
            label="Email"
            value={fields.email}
            onChange={handleFieldChange}
          />
          <MUI.FormControl variant="outlined">
            <MUI.InputLabel>Password</MUI.InputLabel>
            <MUI.OutlinedInput
              error={authError}
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <MUI.InputAdornment position="end">
                  <MUI.IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ?
                      <MUIcons.VisibilityOff />
                    : <MUIcons.Visibility />}
                  </MUI.IconButton>
                </MUI.InputAdornment>
              }
              label="password"
              value={fields.password}
              onChange={handleFieldChange}
            />
          </MUI.FormControl>
          <LoaderButton isLoading={isLoading} onClick={handleSubmit} disabled={!validateForm()} theme={theme}>
            Login
          </LoaderButton>
        </MUI.Stack>
      </MUI.Box>
    </div>
  )
}
