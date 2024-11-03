import './Home.css'

import * as MUI from '@mui/material/'

import ppLogo from '../assets/PlanPals.jpg'

import { useAppContext } from '../lib/contextLib'

export default function Home() {
  const { isAuthenticated, cognitoUser, ppUser } = useAppContext()

  function renderPlanners() {
    return (
      <>
        Hi {cognitoUser.username} {ppUser.preferredName}!
      </>
    )
  }

  function renderPlanPalsWelcome() {
    return (
      <>
        <img className="PPLogo" src={ppLogo} height="500"></img>
        <div className="lander-text">PlanPals: Create your ideal travel planner with your pals now!</div>
        <MUI.Link href="/signup" underline="none">
          {' Signup '}
        </MUI.Link>
        or
        <MUI.Link href="/login" underline="none">
          {' Login '}
        </MUI.Link>
      </>
    )
  }

  return (
    <div className="Home">
      <div className="lander">{isAuthenticated ? renderPlanners() : renderPlanPalsWelcome()}</div>
    </div>
  )
}
