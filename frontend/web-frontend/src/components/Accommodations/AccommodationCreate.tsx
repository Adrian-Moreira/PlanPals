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

export interface AccommodationCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  planner: PPPlanner
}
export default function AccommodationCreate(props: AccommodationCreateProps) {
  const [nameError, setNameError] = useState(false)
  const [locationError, setLocationError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startDate, setStartDate] = useState(plannerStartDate)
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [endDate, setEndDate] = useState(plannerEndDate)
  const [endTime, setEndTime] = useState(plannerEndDate)
  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const accommodationDestination = ''
  const [destination, setDestination] = useState(accommodationDestination)

  const [fields, handleFieldChange] = useFormFields({
    accommodationName: '',
    accommodationLocation: '',
  })
  const handleSubmitAccommodation = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.loggedIn) return
      try {
        const res = await apiLib.post(`/planner/${props.planner._id}/destination/${destination}/accommodation?userId=${pUser.ppUser!._id}`, {
          data: {
            createdBy: pUser.ppUser!._id,
            name: fields.accommodationName,
            location: fields.accommodationLocation,
            startDate: combineDateAndTime(startDate, startTime).toISOString(),
            endDate: combineDateAndTime(endDate, endTime),
          },
        })
        if (res.data.success) {
          setStartDate(plannerStartDate)
          setStartTime(plannerStartDate)
          setEndDate(plannerStartDate)
          setEndTime(plannerStartDate)
          setNameError(false)
          setTimeError(false)
          props.setOpen(false)
          fields.accommodationName = ''
          fields.accommodationLocation = ''
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Accommodation. Please retry later!')
      }
    },
    [fields.accommodationName, startDate, startTime, pUser.ppUser, fields.accommodationLocation, endDate, endTime],
  )

  const validateCreateAccommodationForm = useCallback(() => {
    const isNameValid = fields.accommodationName.length > 0
    setNameError(!isNameValid)
    const isLocationValid = fields.accommodationLocation.length > 0
    setLocationError(!isLocationValid)
    const isTimeValid =
      startDate.isBefore(endDate) &&
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(endDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid && isLocationValid
  }, [fields.accommodationName, startDate, fields.duration, startTime, endDate, endTime])

  useEffect(() => {
    validateCreateAccommodationForm()
  }, [fields.accommodationName, startDate, fields.duration, startTime, endDate, endTime])

  const renderCreateAccommodation = useCallback(() => {
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
              <DatePickerValue label={'From'} field={startDate} setField={setStartDate}></DatePickerValue>
              <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
              <DatePickerValue label={'To'} field={endDate} setField={setEndDate}></DatePickerValue>
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
    startDate,
    startTime,
    destination,
    fields.accommodationLocation,
    endDate,
    endTime,
  ])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewAccommodation'}
      title={'Creating a New Accommodation'}
      children={renderCreateAccommodation()}
      cancelEnable={true}
      confirmEnable={!nameError && !timeError}
      confirmButtonLabel="Add Accommodation"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitAccommodation(e)
      }}
    ></AdaptiveDialog>
  )
}
