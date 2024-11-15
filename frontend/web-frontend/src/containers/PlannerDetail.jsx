import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { ppUserAtom } from '../lib/authLib'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'
import * as MUI from '@mui/material'
import { useAtom } from 'jotai'
import { userMapAtom } from '../lib/appLib.ts'
import { WebSockerConnector, wsAtom } from '../lib/wsLib'
import Planner from '../components/Planners/Planner.tsx'

function PlannerDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [transportList, setTransportList] = useState([])
  const [destinationList, setDestinationList] = useState([])
  const [plannerDetails, setPlannerDetails] = useState({})
  const [onReload, setReload] = useState(true)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [userMap, setUserMap] = useAtom(userMapAtom)

  const [wsAtm] = useAtom(wsAtom)
  const ws = WebSockerConnector(wsAtom)

  useEffect(() => {
    if (!plannerDetails._id || !onReload) return
    setTimeout(() => {
      ws.subscribeAtom([{ type: 'planner', id: plannerDetails._id }])
      setReload(false)
    }, 500)
  }, [plannerDetails, wsAtm, onReload])

  useEffect(() => {
    const relevantEntries = Object.entries(ws.messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planner' &&
        msg.topic.id === plannerDetails._id &&
        (msg.message.type === 'Transport' || msg.message.type === 'Destination'),
    )
    relevantEntries.forEach(([msgId, msg]) => {
      switch (msg.action) {
        case 'update':
          if (msg.message.type === 'Transport') {
            const tmpList = transportList.filter((t) => t._id !== msg.message.data._id)
            setTransportList([...tmpList, msg.message.data])
          }
          if (msg.message.type === 'Destination') {
            const tmpList = destinationList.filter((t) => t._id !== msg.message.data._id)
            setDestinationList([...tmpList, msg.message.data])
          }
          delete ws.messages[msgId]
          break
        case 'delete':
          if (msg.message.type === 'Transport') {
            const tmpList = transportList.filter((t) => t._id !== msg.message.data._id)
            setTransportList([...tmpList])
          }
          if (msg.message.type === 'Destination') {
            const tmpList = destinationList.filter((t) => t._id !== msg.message.data._id)
            setDestinationList([...tmpList])
          }
          delete ws.messages[msgId]
          break
      }
    })
  }, [ws.messages, plannerDetails, transportList, destinationList])

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
    : <Planner
        key={plannerDetails._id}
        id={plannerDetails._id}
        planner={plannerDetails}
        transportList={transportList}
        destnationList={destinationList}
      ></Planner>
  // : <PlannerDetailView
  //     key={plannerDetails._id}
  //     planner={plannerDetails}
  //     ppUser={pUser.ppUser}
  //     transportations={transportList}
  //     destinations={destinationList}
  //   ></PlannerDetailView>
}
export default PlannerDetail
