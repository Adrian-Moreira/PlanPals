import ppLogo from '../assets/PlanPals.jpg'
import * as MUI from '@mui/material/'
import { useNavigate } from 'react-router-dom'
import './Welcome.css'

export default function Welcome() {
  const nav = useNavigate()
  return (
    <MUI.Box sx={{ display: 'flex', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
      <MUI.Stack sx={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }} gap={2}>
        <img className="PPLogo" src={ppLogo} width="200px"></img>
        <MUI.Typography variant="subtitle1">
          PlanPals: Create your ideal travel planner with your pals now!
        </MUI.Typography>
        <MUI.Button sx={{ marginRight: '0.5em', marginLeft: '0.5em' }} onClick={() => nav('/login')}>
          Login
        </MUI.Button>
        {/* <MUI.Button sx={{ marginRight: '0.5em', marginLeft: '0.5em' }} onClick={() => nav('/signup')}>
        Signup
      </MUI.Button> */}
      </MUI.Stack>
    </MUI.Box>
  )
}
