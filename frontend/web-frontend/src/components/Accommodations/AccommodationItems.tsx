import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import * as MUI from '@mui/material'
import AccommodationItem, { AccommodationProps } from './AccommodationItem'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { PPPlanner } from '../Planners/Planner'
import { useWebSocket } from '../../lib/wsLib'

export interface AccommodationItemsProps {
  planner: PPPlanner
}

export default function AccommodationItems(props: AccommodationItemsProps) {
  const [accommodationList, setListOfAccommodation] = useState<AccommodationProps[]>([])
  const [actItems, setActItems] = useState([<></>])
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [isLoading, setIsLoading] = useState(true)
  const { messages, subscribe, webSocket } = useWebSocket()

  const fetchAccommodationList = useCallback(async () => {
    setIsLoading(true)
    const aList = await Promise.all(
      props.planner.destinations.map(async (did) => {
        try {
          const res = await apiLib
            .get(`/planner/${props.planner._id}/destination/${did}/accommodation`, {
              params: { userId: pUser.ppUser!._id },
            })
            .then((res) => res)
          return res.data.success ? res.data.data : {}
        } catch {
          return {}
        }
      }),
    )
    let tmpList: AccommodationProps[]
    tmpList = accommodationList

    aList.forEach((a) => {
      a.forEach((b) => {
        tmpList = [...tmpList, b]
      })
    })
    setListOfAccommodation(tmpList)

    setIsLoading(false)
  }, [pUser, props.planner._id])

  useEffect(() => {
    fetchAccommodationList()
  }, [props.planner._id])

  useEffect(() => {
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planner' && msg.topic.id === props.planner._id && msg.message.type === 'Accommodation',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let tmpList: AccommodationProps[]
      switch (msg.action) {
        case 'update':
          tmpList = accommodationList.filter((t) => t._id !== msg.message.data._id)
          setListOfAccommodation([...tmpList, msg.message.data])
          delete messages[msgId]
          break
        case 'delete':
          tmpList = accommodationList.filter((t) => t._id !== msg.message.data._id)
          setListOfAccommodation([...tmpList])
          delete messages[msgId]
          break
      }
    })
  }, [messages, accommodationList])

  useEffect(() => {
    setIsLoading(true)

    setActItems(
      accommodationList
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .map((d) => (
          <AccommodationItem
            key={d._id}
            _id={d._id}
            name={d.name}
            startDate={d.startDate}
            endDate={d.endDate}
            // onClickHandler={() => props.setCurrentAccommodation(d)}
            plannerId={props.planner._id}
            currentUserId={pUser.ppUser!._id}
            destinationId={d.destinationId}
            locationName={d.location}
            planner={props.planner}
          />
        )),
    )

    setIsLoading(false)
  }, [accommodationList])

  const renderItems = useCallback(() => {
    return <> {...actItems} </>
  }, [actItems])

  useEffect(() => {
    renderItems()
  }, [actItems])
  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <> {...actItems}</>
}
