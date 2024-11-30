import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { convertDatePairsWithMinute } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'
import { userMapAtom } from '../../lib/appLib.ts'
import { useAtom } from 'jotai'
import apiLib from '../../lib/apiLib.js'
import AlertDialog from '../Common/AlertDialog.tsx'
import { onError } from '../../lib/errorLib.js'
import CardActionButtons from '../Common/CardActionButtons.tsx'
import { MapContainer, Marker, Polyline, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'
import GeodesicPath from '../Geodesic.tsx'

export function getVehicleIcon(type: string) {
  switch (type) {
    case 'Bus':
      return <MUIcons.DirectionsBus />
    case 'Train':
      return <MUIcons.DirectionsRailway />
    case 'Car':
      return <MUIcons.DirectionsCar />
    case 'Airplane':
      return <MUIcons.AirplanemodeActive />
    case 'Metro':
      return <MUIcons.DirectionsSubway />
    case 'Tram':
      return <MUIcons.DirectionsTransit />
    case 'Bicycle':
      return <MUIcons.DirectionsBike />
    case 'Ferry':
      return <MUIcons.DirectionsBoat />
    default:
      return <MUIcons.MapTwoTone />
  }
}

export interface TransportProps {
  _id: string
  plannerId: string
  type: string
  details: string
  vehicleId: string
  departureTime: string
  arrivalTime: string
  createdBy: string
  currentUserId: string
  from?: number[]
  to?: number[]
}

export default function TransportItem(props: TransportProps) {
  const { startDate, endDate } = convertDatePairsWithMinute(props.departureTime, props.arrivalTime)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [creator, setCreator] = useState({ userName: 'nil', preferredName: 'nil' })

  const initItem = useCallback(async () => {
    const creatorId = props?.createdBy
    if (userMap.has(creatorId)) {
      setCreator(userMap.get(creatorId)!)
    } else {
      const { user, ok } = await apiLib.getUserById(creatorId)
      if (ok) {
        setUserMap(userMap.set(creatorId, user))
        setCreator(user)
      }
    }
  }, [])

  useEffect(() => {
    initItem()
  }, [props._id])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleDeleteAction = useCallback(async () => {
    const res = await apiLib.delete(`/planner/${props.plannerId}/transportation/${props._id}`, {
      params: { userId: props.currentUserId },
    })
    if (!res.data.success) {
      onError("Error deleting: Transport mightn't be removed")
    }
  }, [])

  const handleEditAction = useCallback(async () => {
    const res = await apiLib.patch(`/planner/${props.plannerId}/transportation/${props._id}`, {
      params: { userId: props.currentUserId },
      data: {
        type: props.type,
        details: props.details,
        vehicleId: props.vehicleId,
        departureTime: props.departureTime,
        arrivalTime: props.arrivalTime,
      },
    })
    if (!res.data.success) {
      onError("Error deleting: Transport mightn't be updated")
    }
  }, [])

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader
        avatar={getVehicleIcon(props.type)}
        title={props.type}
        subheader={props.details}
        action={
          <CardActionButtons
            titleDelete={`Deleting transportation:`}
            messageDelete={`⚠️ Deleting ${props.type}: ${props.details}, are you sure you want to continue?`}
            labelDelete={'TransportItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing transportation'}
            childrensEdit={<> </>}
            labelEdit={'TransportItemEdit'}
            openEdit={openEditDialog}
            setOpenEdit={setOpenEditDialog}
            handleEditAction={handleEditAction}
          ></CardActionButtons>
        }
      ></MUI.CardHeader>
      <MUI.CardContent>
        <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
          <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
              {`${startDate}`}
            </MUI.Typography>
            <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`${endDate}`}</MUI.Typography>
          </MUI.Box>
          <MUIcons.Info sx={{ mt: '0.7em' }} />
          <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
              {`Vehicle ID: ${props.vehicleId}`}
            </MUI.Typography>
            <MUI.Typography
              sx={{ mt: '0.5em', pl: '1em' }}
              variant="body2"
            >{`Created by: ${creator.preferredName}`}</MUI.Typography>
          </MUI.Box>
        </MUI.Box>
      </MUI.CardContent>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Transport'} userId={props.currentUserId} plannerId={props.plannerId} />
        <CommentButton id={props._id} type={'Transport'} userId={props.currentUserId} plannerId={props.plannerId} />
      </MUI.CardActions>

      {(props.from && props.from[0] && props.from[1] && props.to && props.to[0] && props.to[1]) ?
        <GeodesicPath
          from={[props.from[0], props.from[1]]}
          to={[props.to[0], props.to[1]]}
        /> : <>  </>}
    </MUI.Card>
  )
}
