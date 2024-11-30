import React from 'react'
import { useEffect, useState } from 'react'
import TransportItem, { TransportProps } from './TransportItem'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { useNavigate } from 'react-router-dom'
import * as MUI from '@mui/material'
import { useWebSocket } from '../../lib/wsLib'
import { PPPlanner } from '../Planners/Planner'
import { useCallback } from 'react'
import apiLib from '../../lib/apiLib'

export interface TransportItemsProps {
  planner: PPPlanner
}

export default function TransportItems(props: TransportItemsProps) {
  const nav = useNavigate()
  const [tList, setTList] = useState<TransportProps[]>([])
  const [listOfTransport, setListOfTransport] = useState([<></>])
  const [pUser] = useAtom(ppUserAtom)
  const [isLoading, setIsLoading] = useState(true)
  const { messages, subscribe, webSocket } = useWebSocket()

  const fetchTList = useCallback(async () => {
    setIsLoading(true)
    const dList = await Promise.all(
      props.planner.transportations.map(async (tid) => {
        const res = await apiLib
          .get(`/planner/${props.planner._id}/transportation/${tid}`, {
            params: { userId: pUser.ppUser!._id },
          })
          .then((res) => res)
        return res.data.success ? res.data.data : {}
      }),
    )
    setIsLoading(false)
    setTList(dList)
  }, [pUser, props.planner._id])

  useEffect(() => {
    fetchTList()
  }, [props.planner._id])

  useEffect(() => {
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planner' && msg.topic.id === props.planner._id && msg.message.type === 'Transport',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let tmpList: TransportProps[]
      switch (msg.action) {
        case 'update':
          tmpList = tList.filter((t) => t._id !== msg.message.data._id)
          setTList([...tmpList, msg.message.data])
          delete messages[msgId]
          break
        case 'delete':
          tmpList = tList.filter((t) => t._id !== msg.message.data._id)
          setTList([...tmpList])
          delete messages[msgId]
          break
      }
    })
  }, [messages, tList])

  useEffect(() => {
    if (!pUser.ppUser) nav('/')

    setIsLoading(true)
    setListOfTransport(
      tList
        .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
        .map((t) => (
          <TransportItem
            key={t._id}
            _id={t._id}
            plannerId={t.plannerId}
            type={t.type}
            details={t.details}
            vehicleId={t.vehicleId}
            departureTime={t.departureTime}
            arrivalTime={t.arrivalTime}
            createdBy={t.createdBy}
            from={t.from}
            to={t.to}
            currentUserId={pUser.ppUser!._id}
          />
        )),
    )
    setIsLoading(false)
  }, [tList])
  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <> {...listOfTransport}</>
}
