import { useState } from 'react'
import { Auth } from 'aws-amplify'

import './Signup.css'

import Form from 'react-bootstrap/Form'
import Stack from 'react-bootstrap/Stack'
import LoaderButton from '../components/LoaderButton'

import { useNavigate } from 'react-router-dom'
import { useFormFields } from '../lib/hooksLib'
import { useAppContext } from '../lib/contextLib'
import { onError } from '../lib/errorLib'
import apiLib from '../lib/apiLib'

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  })
  const nav = useNavigate()
  const { userHasAuthenticated, setCognitoUser, setPPUser } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [newUser, setNewUser] = useState(null)
  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  async function handleSubmit(event) {
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
      onError(e)
      setIsLoading(false)
    }
  }

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

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="username">
            <Form.Label>Preferred Name</Form.Label>
            <Form.Control size="lg" autoFocus type="text" value={fields.username} onChange={handleFieldChange} />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control size="lg" type="email" value={fields.email} onChange={handleFieldChange} />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control size="lg" type="password" value={fields.password} onChange={handleFieldChange} />
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control size="lg" type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
          </Form.Group>
          <LoaderButton size="lg" type="submit" variant="success" isLoading={isLoading} disabled={!validateForm()}>
            Signup
          </LoaderButton>
        </Stack>
      </Form>
    )
  }

  return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>
}
