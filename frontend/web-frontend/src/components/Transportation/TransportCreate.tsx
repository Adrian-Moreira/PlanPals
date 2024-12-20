import CreateCard from '../Common/CreateCard'
import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState,useContext  } from 'react'
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
import { DraggableMarker } from '../DraggableMarker'
import { MapContainer, TileLayer } from 'react-leaflet'
import { NotificationContext  } from '../../components/Notifications/notificationContext';


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
  const { setNotification } = useContext(NotificationContext); 

  const [fromPosition, setFromPosition] = useState([51.505, -0.09]);
  const [toPosition, setToPosition] = useState([51.515, -0.1]);
  const [fromDraggable, setFromDraggable] = useState(false);
  const [toDraggable, setToDraggable] = useState(false);

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
              <MUI.Typography variant="body1">
                From
              </MUI.Typography>
              <MapContainer style={{ height: '300px', width: '100%' }} center={[fromPosition[0], fromPosition[1]]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker centre={[fromPosition[0], fromPosition[1]]} setCentre={(p) => setFromPosition(p)}></DraggableMarker>
              </MapContainer>
              <MUI.Typography variant="body1">
                To
              </MUI.Typography>
              <MapContainer style={{ height: '300px', width: '100%' }} center={[fromPosition[0], fromPosition[1]]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker centre={[toPosition[0], toPosition[1]]} setCentre={(p) => setToPosition(p)}></DraggableMarker>
              </MapContainer>
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
  }, [transportType, timeError, fields.transportDetails, fields.vehicleId, startDate, endDate, startTime, endTime, fromPosition, toPosition])

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

            from: fromPosition,
            to: toPosition
          },
        })
        if (res.data.success) {
          setNotification?.({ type: 'success', message: 'Transportation created successfully!' });
          // Reset form fields
          setStartDate(plannerStartDate);
          setEndDate(plannerEndDate);
          setStartTime(plannerStartDate);
          setEndTime(plannerEndDate);
          fields.vehicleId = '';
          fields.transportDetails = '';

        } else {

          throw new Error('Failed to create transportation');
        }
      } catch (e) {
        setNotification?.({ type: 'error', message: 'Error creating transportation. Please retry later!' });
      } finally {
        setIsLoading(false);
      }
    },
    [fields, startDate, startTime, endDate, endTime, fromPosition, toPosition, transportType, pUser.ppUser, setNotification],
  )

  const validateCreateTransportForm = useCallback(() => {
    const isTimeValid =
    combineDateAndTime(startDate, startTime).isBefore(combineDateAndTime(endDate, endTime)) &&
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(endDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isTimeValid
  }, [startDate, endDate, startTime, endTime, plannerStartDate, plannerEndDate])

  useEffect(() => {
    validateCreateTransportForm()
  }, [startDate, endDate, startTime, endTime, plannerStartDate, plannerEndDate, validateCreateTransportForm])

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
