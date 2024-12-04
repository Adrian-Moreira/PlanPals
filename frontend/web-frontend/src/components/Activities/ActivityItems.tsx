import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import * as MUI from '@mui/material'
import ActivityItem, { ActivityProps } from './ActivityItem'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { PPPlanner } from '../Planners/Planner'
import { useWebSocket } from '../../lib/wsLib'

export interface ActivityItemsProps {
  planner: PPPlanner
}

export default function ActivityItems(props: ActivityItemsProps) {
  const [activityList, setListOfActivity] = useState<ActivityProps[]>([])
  const [actItems, setActItems] = useState([<></>])
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [isLoading, setIsLoading] = useState(true)
  const { messages, subscribe, webSocket } = useWebSocket()

  const fetchActivityList = useCallback(async () => {
    setIsLoading(true)
    const aList = await Promise.all(
      props.planner.destinations.map(async (did) => {
        try {
          const res = await apiLib
            .get(`/planner/${props.planner._id}/destination/${did}/activity`, {
              params: { userId: pUser.ppUser!._id },
            })
            .then((res) => res)
          return res.data.success ? res.data.data : {}
        } catch {
          return {}
        }
      }),
    )
    let tmpList: ActivityProps[]
    tmpList = activityList

    aList.forEach((a) => {
      a.forEach((b) => {
        tmpList = [...tmpList, b]
      })
    })
    setListOfActivity(tmpList)

    setIsLoading(false)
    // console.log(activityList)
  }, [pUser, props.planner._id])

  useEffect(() => {
    fetchActivityList()
  }, [props.planner._id])

  useEffect(() => {
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planner' && msg.topic.id === props.planner._id && msg.message.type === 'Activity',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let tmpList: ActivityProps[]
      switch (msg.action) {
        case 'update':
          tmpList = activityList.filter((t) => t._id !== msg.message.data._id)
          setListOfActivity([...tmpList, msg.message.data])
          delete messages[msgId]
          break
        case 'delete':
          tmpList = activityList.filter((t) => t._id !== msg.message.data._id)
          setListOfActivity([...tmpList])
          delete messages[msgId]
          break
      }
    })
  }, [messages, activityList])

  useEffect(() => {
    setIsLoading(true)

    setActItems(
      activityList
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .map((d) => (
          <ActivityItem
            key={d._id}
            _id={d._id}
            name={d.name}
            startDate={d.startDate}
            duration={d.duration}
            // onClickHandler={() => props.setCurrentActivity(d)}
            plannerId={props.planner._id}
            currentUserId={pUser.ppUser!._id}
            destinationId={d.destinationId}
            locationName={d.location}
          />
        )),
    )

    setIsLoading(false)
  }, [activityList])

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
