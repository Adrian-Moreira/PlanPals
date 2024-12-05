import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { combineDateAndTime, convertDatePairs } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'
import config from '../../config'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import { onError } from '../../lib/errorLib'
import { useCallback } from 'react'
import apiLib from '../../lib/apiLib'
import AccommodationCreate from './AccommodationCreate'
import { useFormFields } from '../../lib/hooksLib'
import { PPPlanner } from '../Planners/Planner'
import dayjs from 'dayjs'
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'

export interface AccommodationProps {
  _id: string
  name: string
  locationName: string
  startDate: string
  endDate: string
  plannerId: string
  destinationId: string
  currentUserId: string
  planner: PPPlanner
  onClickHandler: () => void
}

export default function AccommodationItem(props: AccommodationProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.endDate)
  const [pUser] = useAtom(ppUserAtom)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [editStartDate, setEditStartDate] = useState(dayjs(props.startDate))
  const [editEndDate, setEditEndDate] = useState(dayjs(props.endDate))
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [nameError, setNameError] = useState(false)
  const [locationError, setLocationError] = useState(false)
  const [endTime, setEndTime] = useState(plannerEndDate)

  const [fields, handleFieldChange] = useFormFields({
    accommodationName: '' + props.name,
    accommodationLocation: '' + props.locationName,
  })

  const handleDeleteAction = useCallback(async () => {
    const res = await apiLib.delete(`/planner/${props.plannerId}/destination/${props.destinationId}/accommodation/${props._id}`, {
      params: { userId: props.currentUserId },
    })
    if (!res.data.success) {
      onError("Error deleting: Accommodation mightn't be removed")
    }
  }, [])

  const handleEditAction = useCallback(async () => {
    if(validateEditPlannerForm()){

      const res = await apiLib.patch(`/planner/${props.plannerId}/destination/${props.destinationId}/accommodation/${props._id}?userId=${props.currentUserId}`, {
        data: {
          name: fields.accommodationName,
          startDate: editStartDate,
          endDate: editEndDate,
          location: fields.accommodationLocation
        },
      })
      setOpenEditDialog(false)
      if (!res.data.success) {
        onError("Error deleting: Accommodation mightn't be updated")
      }
    }
  }, [fields.accommodationName, fields.accommodationLocation, editStartDate, editEndDate])


 //EDIT PLANNER FORM-------------------------------------

  const getEditForm = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
              <MUI.TextField
                required
                id="accommodationName"
                label="Name"
                error={nameError}
                helperText={nameError && 'Name cannot be blank.'}
                value={fields.accommodationName}
                onChange={handleFieldChange}
              />
              <MUI.TextField
                required
                id="accommodationLocation"
                label="Location"
                error={locationError}
                helperText={locationError && 'Location cannot be blank.'}
                value={fields.accommodationLocation}
                onChange={handleFieldChange}
              />
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
    fields.accommodationName,
    nameError,
    timeError,
    editStartDate,
    editEndDate,
    fields.accommodationLocation,
    endDate,
    endTime,
  ])

  const validateEditPlannerForm = useCallback(() => {
    const isNameValid = fields.accommodationName.length > 0
    setNameError(!isNameValid)
    const isLocationValid = fields.accommodationLocation.length > 0
    setLocationError(!isLocationValid)
    const isTimeValid =
      editStartDate.isBefore(editEndDate) &&
      combineDateAndTime(editStartDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(editEndDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid && isLocationValid
  }, [fields.accommodationName, startDate, fields.duration, startTime, editEndDate, endTime, editStartDate])

  useEffect(() => {
    validateEditPlannerForm()
  }, [fields.accommodationName, startDate, fields.duration, startTime, editEndDate, endTime, editStartDate])

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader
        avatar={<MUIcons.LocationOn />}
        title={props.name + ' @ ' + props.locationName + ', ' + props.destinationId}
        action={
          <CardActionButtons
            titleDelete={`Deleting Accommodation:`}
            messageDelete={`⚠️ Deleting ${props.name}, are you sure you want to continue?`}
            labelDelete={'ActItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing Accommodation'}
            childrensEdit={getEditForm()}
            labelEdit={'AccommodationItemEdit'}
            openEdit={openEditDialog}
            setOpenEdit={setOpenEditDialog}
            handleEditAction={handleEditAction}
          ></CardActionButtons>
        }
      />
      <MUI.CardActionArea onClick={props.onClickHandler}>
        <MUI.CardContent>
          <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
            <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                {`${startDate}`}
              </MUI.Typography>
              <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`${endDate}`}</MUI.Typography>
            </MUI.Box>
          </MUI.Box>
        </MUI.CardContent>
      </MUI.CardActionArea>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Accommodation'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
        <CommentButton id={props._id} type={'Accommodation'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
      </MUI.CardActions>
    </MUI.Card>
  )
}
