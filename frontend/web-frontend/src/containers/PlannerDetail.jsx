import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { ppUserAtom } from '../lib/authLib'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'
import * as MUI from '@mui/material'
import { useAtom } from 'jotai'
import { userMapAtom } from '../lib/appLib.ts'
import { useWebSocket } from '../lib/wsLib'
import Planner from '../components/Planners/Planner.tsx'

function PlannerDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const [plannerDetails, setPlannerDetails] = useState({})
  const [onReload, setReload] = useState(true)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const { subscribe, webSocket } = useWebSocket()
  useEffect(() => {
    if (!plannerDetails._id || !onReload) return
    setTimeout(() => {
      if (webSocket.readyState === 1) subscribe([{ type: 'planner', id: plannerDetails._id }])
      setReload(false)
    }, 500)
  }, [plannerDetails, webSocket.readyState, onReload])

  const fetchPlannerDetails = useCallback(
    async (pUser) => {
      if (!pUser) return
      try {
        const planner = await apiLib.get(`/planner/${id}`, { params: { userId: pUser._id } })
        let creator
        const creatorId = planner.data.data.createdBy
        if (userMap.has(creatorId)) {
          creator = userMap.get(creatorId)
        } else {
          const { user, ok } = await apiLib.getUserById(creatorId)
          if (ok) {
            setUserMap(userMap.set(creatorId, user))
            creator = user
          } else {
            creator = {}
          }
        }
        setPlannerDetails({ ...planner.data.data, createdBy: creator })
      } catch (error) {
        onError(error)
      }
    },
    [id],
  )
  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchPlannerDetails(pUser.ppUser).then(() => setIsLoading(false))
    } catch {
      nav('/login')
    }
  }, [setIsLoading, setPPUser, fetchPlannerDetails, pUser, nav])
  useEffect(() => {
    onLoad()
  }, [onLoad])
  return isLoading || !plannerDetails.name ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <Planner key={plannerDetails._id} id={plannerDetails._id} planner={plannerDetails}></Planner>
}
export default PlannerDetail
