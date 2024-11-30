import React from 'react'
import { useEffect, useState } from 'react'
import TransportItem from './TransportItem'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { useNavigate } from 'react-router-dom'
import * as MUI from '@mui/material'

export interface TransportItemsProps {
  transportList: any[]
}

export default function TransportItems(props: TransportItemsProps) {
  const nav = useNavigate()
  const [listOfTransport, setListOfTransport] = useState([<></>])
  const [pUser] = useAtom(ppUserAtom)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!pUser.ppUser) nav('/')
    
    setIsLoading(true)
    setListOfTransport(
      props.transportList.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()).map((t) => (
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
  }, [props.transportList])
  return isLoading ?
  <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
    <MUI.CircularProgress />
  </MUI.Box>
  : <> {...listOfTransport}</>
}
