import CreateCard from '../Common/CreateCard'
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

export interface DestinationCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  planner: PPPlanner
  setCurrentDestination: React.Dispatch<React.SetStateAction<{}>>
}
export default function DestinationCreate(props: DestinationCreateProps) {
  const [destError, setDestError] = useState(false)
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startDate, setStartDate] = useState(plannerStartDate)
  const [endDate, setEndDate] = useState(plannerEndDate)
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [endTime, setEndTime] = useState(plannerEndDate)
  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const [fields, handleFieldChange] = useFormFields({
    destinationName: '',
  })
  const handleSubmitDestination = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.loggedIn) return
      try {
        const res = await apiLib.post(`/planner/${props.planner._id}/destination`, {
          data: {
            createdBy: pUser.ppUser!._id,
            startDate: combineDateAndTime(startDate, startTime).toISOString(),
            endDate: combineDateAndTime(endDate, endTime).toISOString(),
            name: fields.destinationName,
          },
        })
        if (res.data.success) {
          setStartDate(plannerStartDate)
          setStartTime(plannerStartDate)
          setEndDate(plannerEndDate)
          setEndTime(plannerEndDate)
          setDestError(false)
          props.setOpen(false)
          fields.destinationName = ''
          props.setCurrentDestination(res.data.data)
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Destination. Please retry later!')
      }
    },
    [fields.destinationName, startDate, startTime, endDate, endTime, pUser.ppUser],
  )

  const validateCreateDestinationForm = useCallback(() => {
    const isNameValid = fields.destinationName.length > 0
    setDestError(!isNameValid)
    const isTimeValid =
      startDate.isBefore(endDate) &&
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(endDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid
  }, [fields.destinationName, startDate, endDate, startTime, endTime])

  useEffect(() => {
    validateCreateDestinationForm()
  }, [fields.destinationName, startDate, endDate, startTime, endTime])

  const renderCreateDestination = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
              <MUI.TextField
                required
                error={destError}
                helperText={destError && 'Destination name is required.'}
                id="destinationName"
                label="Destination Name"
                value={fields.destinationName}
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
  }, [fields.destinationName, destError, timeError, startDate, endDate, startTime, endTime])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewDestination'}
      title={'Creating a New Destination'}
      children={renderCreateDestination()}
      cancelEnable={true}
      confirmEnable={!destError && !timeError}
      confirmButtonLabel="Add Destination"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitDestination(e)
      }}
    ></AdaptiveDialog>
  )
}
