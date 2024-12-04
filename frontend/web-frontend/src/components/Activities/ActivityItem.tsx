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
import ActivityCreate from './ActivityCreate'
import { useFormFields } from '../../lib/hooksLib'
import { PPPlanner } from '../Planners/Planner'
import dayjs from 'dayjs'
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'

export interface ActivityProps {
  _id: string
  name: string
  locationName: string
  startDate: string
  duration: string
  plannerId: string
  destinationId: string
  currentUserId: string
  planner: PPPlanner
  onClickHandler: () => void
}

export default function ActivityItem(props: ActivityProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.duration)
  const [pUser] = useAtom(ppUserAtom)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [editStartDate, setEditStartDate] = useState(dayjs(props.startDate))
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [nameError, setNameError] = useState(false)
  const [locationError, setLocationError] = useState(false)
  const [durationError, setDurationError] = useState(false)

  const [fields, handleFieldChange] = useFormFields({
    activityName: '' + props.name,
    activityLocation: '' + props.locationName,
    duration: 0 + props.duration,
  })

  const handleDeleteAction = useCallback(async () => {
    const res = await apiLib.delete(`/planner/${props.plannerId}/destination/${props.destinationId}/activity/${props._id}`, {
      params: { userId: props.currentUserId },
    })
    if (!res.data.success) {
      onError("Error deleting: Activity mightn't be removed")
    }
  }, [])

  const handleEditAction = useCallback(async () => {
    if(validateEditPlannerForm()){

      const res = await apiLib.patch(`/planner/${props.plannerId}/destination/${props.destinationId}/activity/${props._id}?userId=${props.currentUserId}`, {
        data: {
          name: fields.activityName,
          startDate: editStartDate,
          duration: Number(fields.duration),
          location: fields.activityLocation
        },
      })
      setOpenEditDialog(false)
      if (!res.data.success) {
        onError("Error deleting: Activity mightn't be updated")
      }
    }
  }, [fields.activityName, fields.activityLocation, fields.duration, editStartDate])


 //EDIT PLANNER FORM-------------------------------------

  const getEditForm = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
          <MUI.TextField
                required
                id="activityName"
                label="Name"
                error={nameError}
                helperText={nameError && 'Name cannot be blank.'}
                value={fields.activityName}
                onChange={handleFieldChange}
              />
              <MUI.TextField
                required
                id="activityLocation"
                label="Location"
                error={locationError}
                helperText={locationError && 'Location cannot be blank.'}
                value={fields.activityLocation}
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
              <MUI.TextField
                type="number"
                required
                id="duration"
                label="Duration"
                error={durationError}
                helperText={durationError && 'Duration must be greater than 0.'}
                value={fields.duration}
                onChange={handleFieldChange}
              />
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
  }, [
    editStartDate,
    startDate,
    endDate,
    timeError,
    fields.activityName,
    fields.activityLocation,
    fields.duration
  ])

  const validateEditPlannerForm = useCallback(() => {
    const isNameValid = fields.activityName.length > 0
    setNameError(!isNameValid)
    const isLocationValid = fields.activityLocation.length > 0
    setLocationError(!isLocationValid)
    const isDurationValid = fields.duration > 0
    setDurationError(!isDurationValid)
    const isTimeValid =
      combineDateAndTime(editStartDate, startTime).isAfter(plannerStartDate) && combineDateAndTime(editStartDate, startTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid && isDurationValid && isLocationValid
  }, [fields.activityName, startDate, fields.duration, startTime])

  useEffect(() => {
    validateEditPlannerForm()
  }, [editStartDate, editStartDate])

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader
        avatar={<MUIcons.LocationOn />}
        title={props.name + ' @ ' + props.locationName + ', ' + props.destinationId}
        action={
          <CardActionButtons
            titleDelete={`Deleting Activity:`}
            messageDelete={`⚠️ Deleting ${props.name}, are you sure you want to continue?`}
            labelDelete={'ActItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing Activity'}
            childrensEdit={getEditForm()}
            labelEdit={'ActivityItemEdit'}
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
              <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`Duration: ${props.duration}`}</MUI.Typography>
            </MUI.Box>
          </MUI.Box>
        </MUI.CardContent>
      </MUI.CardActionArea>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Activity'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
        <CommentButton id={props._id} type={'Activity'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
      </MUI.CardActions>
    </MUI.Card>
  )
}
