import { useCallback, useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'

import './Signup.css'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import LoaderButton from '../components/LoaderButton'

import { useNavigate } from 'react-router-dom'
import { useFormFields } from '../lib/hooksLib'
import { useAppContext, useThemeContext } from '../lib/contextLib'
import { onError } from '../lib/errorLib'
import apiLib from '../lib/apiLib'

export default function Signup() {
  const { theme } = useThemeContext()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [emailError, setEmailError] = useState(false)

  const [fields, handleFieldChange] = useFormFields({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  })
  const handleClickShowPassword = (fn) => () => fn((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (event) => {
    event.preventDefault()
  }

  const nav = useNavigate()
  const { userHasAuthenticated, setCognitoUser, setPPUser } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [newUser, setNewUser] = useState(null)
  const validateForm = useCallback(
    function () {
      return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword
    },
    [fields.confirmPassword, fields.email.length, fields.password],
  )

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  const handleSubmit = useCallback(
    async function (event) {
      event.preventDefault()
      setIsLoading(true)
      try {
        const newUser = await Auth.signUp({
          username: fields.email,
          password: fields.password,
        })
        setIsLoading(false)
        setNewUser(newUser)
      } catch (e) {
        if (
          e.message === 'Password did not conform with policy: Password not long enough' ||
          e.message === 'Password did not conform with policy: Password must have numeric characters'
        ) {
          setAuthError(true)
        } else {
          setAuthError(false)
        }
        if (e.message === 'User already exists') {
          setEmailError(true)
        } else {
          setEmailError(false)
        }
        onError(e)
        setIsLoading(false)
      }
    },
    [fields.email, fields.password, setAuthError, setEmailError],
  )

  async function handleConfirmationSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode)
      const cognitoUser = await Auth.signIn(fields.email, fields.password)
      setCognitoUser(cognitoUser)
      const response = await apiLib.post('/user', {
        params: {},
        data: { userName: fields.email, preferredName: fields.username },
      })
      setPPUser(response.data)
      userHasAuthenticated(true)

      nav('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="confirmationCode">
            <Form.Label>Confirmation Code</Form.Label>
            <Form.Control size="lg" autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
            <Form.Text muted>Please check your email for the code.</Form.Text>
          </Form.Group>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
          >
            Verify
          </LoaderButton>
        </Stack>
      </Form>
    )
  }

  const renderForm = useCallback(() => {
    return (
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <MUI.TextField
            autoCorrect="off"
            required
            id="username"
            label="Preferred Name"
            value={fields.username}
            onChange={handleFieldChange}
          />
          <MUI.TextField
            error={emailError}
            autoFocus
            helperText={emailError && 'Invalid email or email already in use.'}
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
              required
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <MUI.InputAdornment position="end">
                  <MUI.IconButton
                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword(setShowPassword)}
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
          <MUI.FormControl variant="outlined">
            <MUI.InputLabel>Confirm Password</MUI.InputLabel>
            <MUI.OutlinedInput
              error={authError}
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              endAdornment={
                <MUI.InputAdornment position="end">
                  <MUI.IconButton
                    aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                    onClick={handleClickShowPassword(setShowConfirmPassword)}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showConfirmPassword ?
                      <MUIcons.VisibilityOff />
                    : <MUIcons.Visibility />}
                  </MUI.IconButton>
                </MUI.InputAdornment>
              }
              label="confirm password"
              value={fields.confirmPassword}
              onChange={handleFieldChange}
            />
          </MUI.FormControl>
          <LoaderButton
            size="lg"
            type="submit"
            variant="success"
            theme={theme}
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Signup
          </LoaderButton>
        </Stack>
      </Form>
    )
  }, [
    authError,
    emailError,
    fields.confirmPassword,
    fields.email,
    fields.password,
    fields.username,
    handleFieldChange,
    handleSubmit,
    isLoading,
    showConfirmPassword,
    showPassword,
    theme,
    validateForm,
  ])

  useEffect(() => {
    renderForm()
  }, [authError, renderForm])

  return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>
}
