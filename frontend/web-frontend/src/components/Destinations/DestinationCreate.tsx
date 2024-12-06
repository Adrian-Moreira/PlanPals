import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState, useContext } from 'react'
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
import { NotificationContext  } from '../../components/Notifications/notificationContext';

interface PPLocation {
  name: string
  lat: number
  lon: number
  country: string
  state: string
}

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
  const [locations, setLocations] = useState<PPLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<PPLocation | null>(null)
  const [pUser] = useAtom(ppUserAtom)
  const { setNotification } = useContext(NotificationContext); 

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
            name: selectedLocation!.name,
            lat: selectedLocation!.lat,
            lon: selectedLocation!.lon,
            country: selectedLocation!.country,
            state: selectedLocation!.state,
          },
        })
        if (res.data.success) {
          setNotification?.({ type: 'success', message: 'Destination created successfully!' });
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
        setNotification?.({ type: 'error', message: 'Error creating destination. Please retry later!' });
        onError('Erorr Creating Destination. Please retry later!')
      }
    },
    [fields.destinationName, startDate, startTime, endDate, endTime, pUser.ppUser, selectedLocation, setNotification],
  )

  const validateCreateDestinationForm = useCallback(() => {
    const isNameValid = fields.destinationName.length > 0
    setDestError(!selectedLocation)
    const isTimeValid =
      startDate.isBefore(endDate) &&
      combineDateAndTime(startDate, startTime).isAfter(plannerStartDate) &&
      combineDateAndTime(endDate, endTime).isBefore(plannerEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid
  }, [fields.destinationName, startDate, endDate, startTime, endTime, selectedLocation])

  useEffect(() => {
    validateCreateDestinationForm()
  }, [fields.destinationName, startDate, endDate, startTime, endTime, selectedLocation])

  const fetchLocations = async (query: string) => {
    if (!query) {
      setLocations([])
      return
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q="${query}"&limit=5&appid=${config.api.OWM_DEFAULT_KEY}`,
      )
      const data = await response.json()
      const formattedLocations: PPLocation[] = data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.state,
      }))
      setLocations(formattedLocations)
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
    }
  }

  const debouncedFetchLocations = useCallback(
    MUI.debounce((query: string) => fetchLocations(query), 300),
    [],
  )

  const renderCreateDestination = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
              <MUI.Autocomplete
                id="destination-search"
                options={locations}
                getOptionLabel={(option) =>
                  option.state ?
                    `${option.name}, ${option.state} (${option.country})`
                  : `${option.name} (${option.country})`
                }
                value={selectedLocation}
                onChange={(event, newValue) => {
                  setSelectedLocation(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  debouncedFetchLocations(newInputValue)
                }}
                renderInput={(params) => (
                  <MUI.TextField
                    {...params}
                    required
                    error={destError}
                    helperText={destError && 'Destination selection is required.'}
                    label="Search Destination"
                  />
                )}
              />
              {/* <MUI.TextField
                required
                error={destError}
                helperText={destError && 'Destination name is required.'}
                id="destinationName"
                label="Destination Name"
                value={fields.destinationName}
                onChange={handleFieldChange}
              /> */}
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
    fields.destinationName,
    destError,
    timeError,
    startDate,
    endDate,
    startTime,
    endTime,
    locations,
    selectedLocation,
  ])

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
