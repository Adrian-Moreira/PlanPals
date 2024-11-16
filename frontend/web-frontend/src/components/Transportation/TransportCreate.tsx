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
import SelectItems from '../Common/SelectItems'
import { getVehicleIcon } from './TransportItem'

const transportTypes = ['Bus', 'Train', 'Car', 'Airplane', 'Metro', 'Tram', 'Bicycle', 'Ferry']

export interface TransportCreateProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  planner: PPPlanner
}
export default function TransportCreate(props: TransportCreateProps) {
  const [timeError, setTimeError] = useState(false)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startDate, setStartDate] = useState(plannerStartDate)
  const [endDate, setEndDate] = useState(plannerEndDate)
  const [startTime, setStartTime] = useState(plannerStartDate)
  const [endTime, setEndTime] = useState(plannerEndDate)
  const [isLoading, setIsLoading] = useState(false)
  const [pUser] = useAtom(ppUserAtom)

  const [transportType, setTransportType] = useState(transportTypes[0])
  const [fields, handleFieldChange] = useFormFields({
    transportDetails: '',
    vehicleId: '',
  })

  const renderCreateTransport = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
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
  }, [transportType, timeError, fields.transportDetails, fields.vehicleId, startDate, endDate, startTime, endTime])

  const handleSubmitTransportation = useCallback(
    async (event: any) => {
      event.preventDefault()
      if (!pUser.ppUser) return
      try {
        const res = await apiLib.post(`/planner/${props.planner._id}/transportation`, {
          data: {
            createdBy: pUser.ppUser!._id,
            departureTime: combineDateAndTime(startDate, startTime).toISOString(),
            arrivalTime: combineDateAndTime(endDate, endTime).toISOString(),
            type: transportType,
            vehicleId: fields.vehicleId,
            details: fields.transportDetails,
          },
        })
        if (res.data.success) {
          setStartDate(plannerStartDate)
          setEndDate(plannerEndDate)
          setStartTime(plannerStartDate)
          setEndTime(plannerEndDate)
          setTimeError(false)
          fields.vehicleId = ''
          fields.transportDetails = ''
        } else {
          throw new Error()
        }
      } catch (e) {
        onError('Erorr Creating Transportation. Please retry later!')
      }
    },
    [fields.transportDetails, fields.vehicleId, startDate, startTime, endDate, endTime, pUser.ppUser],
  )

  const validateCreateTransportForm = useCallback(() => {
    const isTimeValid =
      startDate.isBefore(endDate) &&
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(endDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isTimeValid
  }, [startDate, endDate, startTime, endTime])

  useEffect(() => {
    validateCreateTransportForm()
  }, [startDate, endDate, startTime, endTime])

  return (
    <AdaptiveDialog
      open={props.open}
      setOpen={props.setOpen}
      label={'CreateNewTransport'}
      title={'Creating a New Transportation'}
      children={renderCreateTransport()}
      cancelEnable={true}
      confirmEnable={!timeError}
      confirmButtonLabel="Add Transportation"
      confirmIcon={<MUIcons.Save sx={{ mr: '0.5em' }} />}
      cancelButtonLabel="Cancel"
      cancelIcon={<MUIcons.Cancel sx={{ mr: '0.5em' }} />}
      onConfirmHandler={(e) => {
        handleSubmitTransportation(e)
        props.setOpen(false)
      }}
    ></AdaptiveDialog>
  )
}
