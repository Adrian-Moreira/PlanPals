import React from 'react'
import { useEffect, useState } from 'react'
import TransportItem from './TransportItem'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { useNavigate } from 'react-router-dom'

export interface TransportItemsProps {
  transportList: any[]
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TransportItems(props: TransportItemsProps) {
  const nav = useNavigate()
  const [listOfTransport, setListOfTransport] = useState([<></>])
  const [pUser] = useAtom(ppUserAtom)
  useEffect(() => {
    if (!pUser.ppUser) nav('/')
    setListOfTransport(
      props.transportList.map((t) => (
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
          currentUserId={pUser.ppUser!._id}
        />
      )),
    )
  }, [props.transportList])
  return <> {...listOfTransport}</>
}
