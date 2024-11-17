import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import * as MUI from '@mui/material'
import DestinationItem, { DestinationProps } from './DestinationItem'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import { PPPlanner } from '../Planners/Planner'

export interface DestinationItemsProps {
  planner: PPPlanner
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentDestination: React.Dispatch<React.SetStateAction<any>>
}

export default function DestinationItems(props: DestinationItemsProps) {
  const [destinationList, setListOfDestination] = useState<DestinationProps[]>([])
  const [destItems, setDestItems] = useState([<></>])
  const [pUser, setPPUser] = useAtom(ppUserAtom)

  const fetchDestinationList = useCallback(async () => {
    props.setIsLoading(true)
    const dList = await Promise.all(
      props.planner.destinations.map(async (did) => {
        const res = await apiLib.get(`/planner/${props.planner._id}/destination/${did}`, {
          params: { userId: pUser.ppUser!._id },
        })
        props.setIsLoading(false)
        return res.data.success ? res.data.data : {}
      }),
    )
    setListOfDestination(dList)
  }, [pUser, props.planner._id])

  useEffect(() => {
    fetchDestinationList()
  }, [props.planner._id])

  useEffect(() => {
    setDestItems(
      destinationList.map((d) => (
        <DestinationItem
          key={d._id}
          _id={d._id}
          name={d.name}
          startDate={d.startDate}
          endDate={d.endDate}
          onClickHandler={() => props.setCurrentDestination(d)}
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
  return props.isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <> {renderItems()}</>
}