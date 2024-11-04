import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { useAppContext } from '../lib/contextLib'
import { getCurrentUser } from '../lib/authLib'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'
import * as MUI from '@mui/material'
import PlannerDetailView from '../components/PlannerDetailView'
function PlannerDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [transportList, setTransportList] = useState([])
  const [destinationList, setDestinationList] = useState([])
  const [plannerDetails, setPlannerDetails] = useState({})
  const { ppUser, setCognitoUser, setPPUser } = useAppContext()
  const fetchPlannerDetails = useCallback(
    async (pUser) => {
      if (!pUser) return
      try {
        const planner = await apiLib.get(`/planner/${id}`, { params: { userId: pUser._id } })
        const creator = await apiLib.get(`/user/${planner.data.data.createdBy}`)
        setPlannerDetails({ ...planner.data.data, createdBy: creator.data.data })

        const transportRes = planner.data.data.transportations
        const destinationRes = planner.data.data.destinations
        const destinations = await Promise.all(
          destinationRes.map(async (did) => {
            const res = await apiLib.get(`/planner/${id}/destination/${did}`, {
              params: { userId: pUser._id },
            })
            return res.data.success ? res.data.data : {}
          }),
        )
        setDestinationList(destinations)
        const transports = await Promise.all(
          transportRes.map(async (tid) => {
            const res = await apiLib.get(`/planner/${id}/transportation/${tid}`, {
              params: { userId: pUser._id },
            })
            return res.data.success ? res.data.data : {}
          }),
        )
        setTransportList(transports)
      } catch (error) {
        onError(error)
      }
    },
    [id],
  )
  const onLoad = useCallback(async () => {
    try {
      if (!ppUser) {
        await getCurrentUser(setCognitoUser, setPPUser)
      }
      await fetchPlannerDetails(ppUser).then(() => setIsLoading(false))
    } catch (error) {
      alert(error)
      nav('/login')
    }
  }, [setCognitoUser, setIsLoading, setPPUser, fetchPlannerDetails, ppUser, nav])
  useEffect(() => {
    onLoad()
  }, [onLoad])
  return isLoading || !plannerDetails.name ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <PlannerDetailView
        key={plannerDetails._id}
        planner={plannerDetails}
        ppUser={ppUser}
        transportations={transportList}
        destinations={destinationList}
      ></PlannerDetailView>
}
export default PlannerDetail
