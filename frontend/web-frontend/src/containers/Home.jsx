import './Home.css'

import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ppLogo from '../assets/PlanPals.jpg'

import { onError } from '../lib/errorLib'
import apiLib from '../lib/apiLib'
import { getCurrentUser, ppUser } from '../lib/authLib'
import PlannerCard from '../components/PlannerCard'
import PlannerCreateView from '../components/PlannerCreateView'
import { useAtom } from 'jotai'

export default function Home() {
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [plannerList, setPlannerList] = useState([])
  const [createNew, setCreateNew] = useState(false)
  const [pUser, setPPUser] = useAtom(ppUser)

  const fetchPlanners = useCallback(async (userId) => {
    if (!userId) return
    try {
      const response = await apiLib.get('/planner', {
        params: { userId },
      })
      let plannerLs = response.data.data
      const plannersWithCreators = await Promise.all(
        plannerLs.map(async (planner) => {
          try {
            const userResponse = await apiLib.get(`/user/${planner.createdBy}`)
            return {
              ...planner,
              createdBy: userResponse.data.data,
            }
          } catch (userError) {
            onError(userError)
            return {
              ...planner,
              createdBy: {},
            }
          }
        }),
      )
      setPlannerList(plannersWithCreators)
    } catch (error) {
      onError(error)
    }
  }, [])

  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) {
        await getCurrentUser(setPPUser)
      }
      await fetchPlanners(pUser.ppUser._id)
    } catch (error) {
      if (error !== 'No current user') {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setPPUser, fetchPlanners, pUser])

  useEffect(() => {
    onLoad()
  }, [onLoad])

  function renderPlanners() {
    const gotPlanners = plannerList.length > 0
    return (
      (!createNew && gotPlanners && (
        <MUI.Grid2
          sx={{
            maxWidth: 1200,
            minWidth: 300,
            textAlign: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            margin: {
              xs: '-10% auto',
              md: '-5% auto',
            },
            padding: '0em',
          }}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          justifyContent="center"
          container
          spacing={2}
          wrap={'wrap'}
        >
          <MUI.Card
            onClick={() => setCreateNew(true)}
            sx={{
              m: '0.2em',
              textAlign: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              maxWidth: 100,
              // maxHeight: 100,
              borderRadius: '20px',
            }}
          >
            <MUI.CardActionArea>
              <MUI.CardContent>
                <MUIcons.Add></MUIcons.Add>
              </MUI.CardContent>
            </MUI.CardActionArea>
          </MUI.Card>
          {plannerList.map((planner) => (
            <PlannerCard key={planner._id} planner={planner} onClick={mkPlannerOnClickHandler(planner)}></PlannerCard>
          ))}
        </MUI.Grid2>
      )) || <PlannerCreateView hasPlanner={gotPlanners} handelCancel={() => setCreateNew(false)}></PlannerCreateView>
    )
  }

  function mkPlannerOnClickHandler(planner) {
    return () => {
      nav(`/planner/${planner._id}`)
    }
  }

  function renderPlanPalsWelcome() {
    return (
      <>
        <img className="PPLogo" src={ppLogo} height="250"></img>
        <div className="lander-text">PlanPals: Create your ideal travel planner with your pals now!</div>
        <MUI.Button sx={{ marginRight: '0.5em', marginLeft: '0.5em' }} onClick={() => nav('/login')}>
          Login
        </MUI.Button>
        <MUI.Button sx={{ marginRight: '0.5em', marginLeft: '0.5em' }} onClick={() => nav('/signup')}>
          Signup
        </MUI.Button>
      </>
    )
  }

  return (
    <MUI.Container className="Home">
      <div className="lander">
        {isLoading ?
          <></>
        : pUser.loggedIn ?
          renderPlanners()
        : renderPlanPalsWelcome()}
      </div>
    </MUI.Container>
  )
}
