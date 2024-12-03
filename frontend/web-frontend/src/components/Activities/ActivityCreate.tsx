import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormFields } from '../../lib/hooksLib'
import { PPPlanner } from '../Planners/Planner'
import dayjs from 'dayjs'
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import apiLib from '../../lib/apiLib'
import { combineDateAndTime } from '../../lib/dateLib'
import { onError } from '../../lib/errorLib'
import AdaptiveDialog from '../Common/AdaptiveDialog'
import config from '../../config'
import SelectItems from '../Common/SelectItems'

export interface ActivityCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  planner: PPPlanner
}
export default function ActivityCreate(props: ActivityCreateProps) {
  const [nameError, setNameError] = useState(false)
  const [destError, setDestError] = useState(false)
  const [durationError, setDurationError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startDate, setStartDate] = useState(plannerStartDate)
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [endDate, setEndDate] = useState(plannerEndDate)
  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const activityDestination = ''
  const [destination, setDestination] = useState(activityDestination)

  const [fields, handleFieldChange] = useFormFields({
    activityName: '',
    duration: 0,
  })
  const handleSubmitActivity = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.loggedIn) return
      try {
        const res = await apiLib.post(`/planner/${props.planner._id}/destination/${destination}/activity?userId=${pUser.ppUser!._id}`, {
          data: {
            createdBy: pUser.ppUser!._id,
            name: fields.activityName,
            startDate: combineDateAndTime(startDate, startTime).toISOString(),
            duration: Number(fields.duration),
          },
        })
        if (res.data.success) {
          setStartDate(plannerStartDate)
          setStartTime(plannerStartDate)
          setDestError(false)
          setNameError(false)
          setTimeError(false)
          setDurationError(false)
          props.setOpen(false)
          fields.activityName = ''
          fields.duration = 0
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Activity. Please retry later!')
      }
    },
    [fields.activityName, startDate, startTime, fields.duration, pUser.ppUser],
  )

  const validateCreateActivityForm = useCallback(() => {
    const isNameValid = fields.activityName.length > 0
    setNameError(!isNameValid)
    const isDurationValid = fields.duration > 0
    setDurationError(!isDurationValid)
    const isTimeValid =
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) && combineDateAndTime(startDate, startTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid && isDurationValid
  }, [fields.activityName, startDate, fields.duration, startTime])

  useEffect(() => {
    validateCreateActivityForm()
  }, [fields.activityName, startDate, fields.duration, startTime])

  const renderCreateActivity = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
              <SelectItems
                children={props.planner.destinations.map((d) => (
                  <MUI.MenuItem key={d} value={d}>
                    <MUI.Typography variant="body1">
                      {`${d}`}
                    </MUI.Typography>
                  </MUI.MenuItem>
                ))}
                helperText={'Select destination'}
                label={'Destination'}
                value={destination}
                id={`destination-items-${props.planner._id}`}
                setValue={setDestination}
              ></SelectItems>
              <MUI.TextField
                required
                id="activityName"
                label="Name"
                error={nameError}
                helperText={nameError && 'Name cannot be blank.'}
                value={fields.activityName}
                onChange={handleFieldChange}
              />
              {timeError && (
                <MUI.Typography color="error" variant="subtitle1">
                  Dates need to be within the planner's date.
                </MUI.Typography>
              )}
              <DatePickerValue label={'From'} field={startDate} setField={setStartDate}></DatePickerValue>
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
    fields.activityName,
    nameError,
    durationError,
    timeError,
    startDate,
    fields.duration,
    startTime,
    destination,
  ])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewActivity'}
      title={'Creating a New Activity'}
      children={renderCreateActivity()}
      cancelEnable={true}
      confirmEnable={!nameError && !timeError && !durationError}
      confirmButtonLabel="Add Activity"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitActivity(e)
      }}
    ></AdaptiveDialog>
  )
}
