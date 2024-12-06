import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState,useContext } from 'react'
import { combineDateAndTime, convertDatePairs } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'
import config from '../../config'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import dayjs from 'dayjs'
import { MapContainer, Marker, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'
import CardActionButtons from '../Common/CardActionButtons'
import { onError } from '../../lib/errorLib'
import apiLib from '../../lib/apiLib'
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'
import { PPPlanner } from '../Planners/Planner'
import { useFormFields } from '../../lib/hooksLib'
import AdaptiveDialog from '../Common/AdaptiveDialog'
import { NotificationContext  } from '../../components/Notifications/notificationContext';


interface WeatherInfo {
  temp: number
  description: string
  icon: string
}

export interface DestinationProps {
  _id: string
  name: string
  startDate: string
  endDate: string
  plannerId: string
  lat?: number
  lon?: number
  country?: string
  state?: string
  currentUserId: string
  planner: PPPlanner
  onClickHandler: () => void
}

export default function DestinationItem(props: DestinationProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.endDate)
  const plannerStartDate = dayjs(props.planner.startDate)
  const plannerEndDate = dayjs(props.planner.endDate)
  const [startTime, setStartTime] = useState(dayjs(props.startDate))
  const [endTime, setEndTime] = useState(dayjs(props.endDate))
  const [editStartDate, setEditStartDate] = useState(dayjs(props.startDate))
  const [editEndDate, setEditEndDate] = useState(dayjs(props.endDate))
  const [timeError, setTimeError] = useState(false)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [pUser] = useAtom(ppUserAtom)
  const { setNotification } = useContext(NotificationContext); 

  const regionName = new Intl.DisplayNames(['en'], { type: 'region' })

  useEffect(() => {
    const fetchWeather = async () => {
      const start = dayjs(props.startDate)
      const now = dayjs()
      let daysUntilStart = start.diff(now, 'day')
      if (!props.lat || !props.lon) return
      if (daysUntilStart < 0 || daysUntilStart > 5) return
      // if (daysUntilStart == 0) daysUntilStart = 1
      try {
        // const response = await fetch(
        //   `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&units=metric&appid=${config.api.OWM_DEFAULT_KEY}`
        // )
        // const data = await response.json()
        // setWeather({
        //   temp: Math.round(data.main.temp),
        //   description: data.weather[0].description,
        //   icon: data.weather[0].icon
        // })

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${props.lat}&lon=${props.lon}&units=metric&appid=${config.api.OWM_DEFAULT_KEY}`,
          )
          const data = await response.json()
          if (!data?.list) return
          const targetIndex = daysUntilStart * 8
          const forecast = data?.list[targetIndex]

          if (forecast) {
            setWeather({
              temp: Math.round(forecast.main.temp),
              description: forecast.weather[0].description,
              icon: forecast.weather[0].icon,
            })
          }
        } catch (error) {
          console.error('Error fetching weather:', error)
        }
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    }

    fetchWeather()
  }, [props.lat, props.lon])

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleDeleteAction = useCallback(async () => {
    const res = await apiLib.delete(`/planner/${props.plannerId}/destination/${props._id}`, {
      params: { userId: props.currentUserId },
    })
    if (!res.data.success) {
      
      setNotification?.({
        type: 'error',
        message: 'Error deleting: Destination may not have been updated.',
      });
      
    }else {
      
      setNotification?.({
        type: 'success',
        message: 'Destination updated successfully!',
      });
    }
  }, [setNotification])

  const handleEditAction = useCallback(async () => {
    if(!timeError){
      console.log(editStartDate)

      const res = await apiLib.patch(`/planner/${props.plannerId}/destination/${props._id}?userId=${props.currentUserId}`, {
        data: {
          startDate: editStartDate,
          endDate: editEndDate
        },
      })
      setOpenEditDialog(false)
      if (!res.data.success) {
        setNotification?.({
        type: 'error',
        message: 'Error deleting: Destination may not have been updated.',
      });
        onError("Error deleting: Destination mightn't be updated")
      }else{
        setNotification?.({
          type: 'success',
          message: 'Destination updated successfully!',
        });
      }
    }
  }, [editStartDate, editEndDate, timeError,setNotification])

  //EDIT PLANNER FORM-------------------------------------

  const getEditForm = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Box sx={{ flexDirection: 'column' }}>
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
        avatar={<MUIcons.LocationOn />}
        title={props.name}
        action={
          <CardActionButtons
            titleDelete={`Deleting destination:`}
            messageDelete={`⚠️ Deleting ${props.name}, ${
              props.country ?
                props.state ?
                  `${props.state}, ${regionName.of(props.country)}`
                : regionName.of(props.country)
              : ''
            }, are you sure you want to continue?`}
            labelDelete={'DestItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing destination'}
            childrensEdit={getEditForm()}
            labelEdit={'TransportItemEdit'}
            openEdit={openEditDialog}
            setOpenEdit={setOpenEditDialog}
            handleEditAction={async () => {
              await handleEditAction()
            }}
          ></CardActionButtons>
        }
        subheader={
          props.country ?
            props.state ?
              `${props.state}, ${regionName.of(props.country)}`
            : regionName.of(props.country)
          : ''
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
            {weather && (
              <>
                {/* <MUIcons.WbSunny sx={{ mt: '0.7em' }} /> */}
                <MUI.Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'right', flexGrow: 1, mr: '1em' }}>
                  <MUI.Box sx={{ display: 'flex', alignItems: 'right', pl: '0.5em', mt: '0.5em' }}>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                      alt="weather icon"
                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                    />
                    <MUI.Typography variant="body2">{`${weather.temp}°C`}</MUI.Typography>
                  </MUI.Box>
                  <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                    {weather.description}
                  </MUI.Typography>
                </MUI.Box>
              </>
            )}
          </MUI.Box>
        </MUI.CardContent>
      </MUI.CardActionArea>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Destination'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
        <CommentButton id={props._id} type={'Destination'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
      </MUI.CardActions>
      {props.lat && props.lon && (
        <MapContainer
          style={{ height: '200px', width: '100%' }}
          center={[props.lat, props.lon]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[props.lat, props.lon]}></Marker>
        </MapContainer>
      )}
    </MUI.Card>
  )
}
