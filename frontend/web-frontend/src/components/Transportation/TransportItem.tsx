import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { combineDateAndTime, convertDatePairsWithMinute } from '../../lib/dateLib'
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
import { PPPlanner } from '../Planners/Planner.tsx'
import DatePickerValue from '../Common/DatePickerValue.tsx'
import TimePickerValue from '../Common/TimePickerValue.tsx'
import SelectItems from '../Common/SelectItems.tsx'
import { useFormFields } from '../../lib/hooksLib.js'
import dayjs from 'dayjs'

const transportTypes = ['Bus', 'Train', 'Car', 'Airplane', 'Metro', 'Tram', 'Bicycle', 'Ferry']

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
  planner: PPPlanner
  from?: number[]
  to?: number[]
}

export default function TransportItem(props: TransportProps) {
  const { startDate, endDate } = convertDatePairsWithMinute(props.departureTime, props.arrivalTime)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startTime, setStartTime] = useState(dayjs(props.departureTime))
  const [endTime, setEndTime] = useState(dayjs(props.arrivalTime))
  const [editStartDate, setEditStartDate] = useState(dayjs(props.departureTime))
  const [editEndDate, setEditEndDate] = useState(dayjs(props.arrivalTime))
  const [timeError, setTimeError] = useState(false)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [creator, setCreator] = useState({ userName: 'nil', preferredName: 'nil' })

  const [transportType, setTransportType] = useState(props.type)

  const [fields, handleFieldChange] = useFormFields({
    transportDetails: '' + props.details,
    vehicleId: '' + props.vehicleId,
  })

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
    try {
      const res = await apiLib.delete(`/planner/${props.plannerId}/transportation/${props._id}`, {
        params: { userId: props.currentUserId },
      })
    } catch {
      onError("Error deleting: Transport mightn't be removed")
    }
  }, [])

  const handleEditAction = useCallback(async () => {
    if(!timeError){
      const res = await apiLib.patch(`/planner/${props.plannerId}/transportation/${props._id}?userId=${props.currentUserId }`, {
        data: {
          type: transportType,
          details: fields.transportDetails,
          vehicleId: fields.vehicleId,
          departureTime: editStartDate,
          arrivalTime: editEndDate,
        },
      })
      setOpenEditDialog(false)
      if (!res.data.success) {
        onError("Error deleting: Transport mightn't be updated")
      }
    }
  }, [fields.transportDetails, fields.vehicleId, editStartDate, editEndDate, timeError])

  //EDIT PLANNER FORM-------------------------------------

  const getEditForm = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
          <SelectItems
                children={transportTypes.map((t) => (
                  <MUI.MenuItem key={t} value={t}>
                    <MUI.Typography variant="body1">
                      {getVehicleIcon(t)}
                      {`   ${t}`}
                    </MUI.Typography>
                  </MUI.MenuItem>
                ))}
                helperText={'Select transport type'}
                label={'Transport Type'}
                value={transportType}
                id={`trasport-items-${props.planner._id}`}
                setValue={setTransportType}
              ></SelectItems>
              <MUI.TextField
                helperText={'Optional'}
                id="transportDetails"
                label="Details"
                value={fields.transportDetails}
                onChange={handleFieldChange}
              />
              <MUI.TextField
                helperText={'Optional'}
                id="vehicleId"
                label="Vehicle ID"
                value={fields.vehicleId}
                onChange={handleFieldChange}
              />
            <MUI.Stack spacing={2}>
              {timeError && (
                <MUI.Typography color="error" variant="subtitle1">
                  Dates need to be within the planner's date.
                </MUI.Typography>
              )}
              <DatePickerValue label={'From'} field={editStartDate} setField={setEditStartDate}></DatePickerValue>
              <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
              <DatePickerValue label={'To'} field={editEndDate} setField={setEditEndDate}></DatePickerValue>
              <TimePickerValue label={'To'} field={endTime} setField={setEndTime}></TimePickerValue>
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
  }, [
    editStartDate,
    editEndDate,
    startDate,
    endDate,
    timeError,
    fields.vehicleId,
    fields.transportDetails,
    transportType
  ])

  const validateEditPlannerForm = useCallback(() => {
    const isTimeValid =
      editStartDate.isBefore(editEndDate) &&
      combineDateAndTime(editStartDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(editEndDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isTimeValid
  }, [editStartDate, editStartDate])

  useEffect(() => {
    validateEditPlannerForm()
  }, [editStartDate, editStartDate])



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
            childrensEdit={getEditForm()}
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

      {props.from && props.from[0] && props.from[1] && props.to && props.to[0] && props.to[1] ?
        <GeodesicPath from={[props.from[0], props.from[1]]} to={[props.to[0], props.to[1]]} />
      : <> </>}
    </MUI.Card>
  )
}
