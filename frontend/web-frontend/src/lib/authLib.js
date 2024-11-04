import { Auth } from 'aws-amplify'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'

export async function getCurrentUser(setCognitoUser, setPPUser) {
  let user
  let response
  try {
    user = await Auth.currentAuthenticatedUser()
    setCognitoUser(user)
  } catch (error) {
    if (error === 'The user is not authenticated') {
      setCognitoUser(null)
      alert('Please sign in first.')
      navigator('/login')
    } else {
      onError(error)
    }
  } finally {
    response = await apiLib.get('/user/search', {
      params: { userName: user.attributes.email },
    })
    setPPUser(response.data.data)
  }

  return { cognitoUser: user, ppUser: response.data.data }
}
