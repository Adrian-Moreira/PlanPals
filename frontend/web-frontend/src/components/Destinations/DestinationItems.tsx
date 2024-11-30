import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import * as MUI from '@mui/material'
import DestinationItem, { DestinationProps } from './DestinationItem'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { PPPlanner } from '../Planners/Planner'
import { useWebSocket } from '../../lib/wsLib'

export interface DestinationItemsProps {
  planner: PPPlanner
  setCurrentDestination: React.Dispatch<React.SetStateAction<any>>
}

export default function DestinationItems(props: DestinationItemsProps) {
  const [destinationList, setListOfDestination] = useState<DestinationProps[]>([])
  const [destItems, setDestItems] = useState([<></>])
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [isLoading, setIsLoading] = useState(true)
  const { messages, subscribe, webSocket } = useWebSocket()

  const fetchDestinationList = useCallback(async () => {
    setIsLoading(true)
    const dList = await Promise.all(
      props.planner.destinations.map(async (did) => {
        try {
          const res = await apiLib
            .get(`/planner/${props.planner._id}/destination/${did}`, {
              params: { userId: pUser.ppUser!._id },
            })
            .then((res) => res)
          return res.data.success ? res.data.data : {}
        } catch {
          return {}
        }
      }),
    )
    setListOfDestination(dList.filter((d) => d?._id && true) as DestinationProps[])
    setIsLoading(false)
  }, [pUser, props.planner._id])

  useEffect(() => {
    fetchDestinationList()
  }, [props.planner._id])

  useEffect(() => {
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planner' && msg.topic.id === props.planner._id && msg.message.type === 'Destination',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let tmpList: DestinationProps[]
      switch (msg.action) {
        case 'update':
          tmpList = destinationList.filter((t) => t._id !== msg.message.data._id)
          setListOfDestination([...tmpList, msg.message.data])
          delete messages[msgId]
          break
        case 'delete':
          tmpList = destinationList.filter((t) => t._id !== msg.message.data._id)
          setListOfDestination([...tmpList])
          delete messages[msgId]
          break
      }
    })
  }, [messages, destinationList])

  useEffect(() => {
    setDestItems(
      destinationList
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .map((d) => (
          <DestinationItem
            key={d._id}
            _id={d._id}
            name={d.name}
            startDate={d.startDate}
            endDate={d.endDate}
            onClickHandler={() => props.setCurrentDestination(d)}
            plannerId={props.planner._id}
            lat={d.lat}
            lon={d.lon}
            country={d.country}
            state={d.state}
            currentUserId={pUser.ppUser!._id}
          />
        )),
    )
  }, [destinationList])

  const renderItems = useCallback(() => {
    return <> {...destItems} </>
  }, [destItems])

  useEffect(() => {
    renderItems()
  }, [destItems])
  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <> {renderItems()}</>
}
