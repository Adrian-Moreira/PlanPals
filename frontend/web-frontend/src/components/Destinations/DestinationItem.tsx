import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { convertDatePairs } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'
import config from '../../config'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import dayjs from 'dayjs'
import { MapContainer, Marker, Popup } from 'react-leaflet'
import { TileLayer } from 'react-leaflet/TileLayer'

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
  onClickHandler: () => void
}

export default function DestinationItem(props: DestinationProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.endDate)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [pUser] = useAtom(ppUserAtom)
  const regionName = new Intl.DisplayNames(['en'], {type: 'region'});

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
            `https://api.openweathermap.org/data/2.5/forecast?lat=${props.lat}&lon=${props.lon}&units=metric&appid=${config.api.OWM_DEFAULT_KEY}`
          )
          const data = await response.json()
          if (!data?.list) return
          const targetIndex = daysUntilStart * 8
          const forecast = data?.list[targetIndex]

          if (forecast) {
            setWeather({
              temp: Math.round(forecast.main.temp),
              description: forecast.weather[0].description,
              icon: forecast.weather[0].icon
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

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardActionArea onClick={props.onClickHandler}>
        <MUI.CardHeader
          avatar={<MUIcons.LocationOn />}
          title={props.name}
          subheader={props.country ? props.state ? `${props.state}, ${regionName.of(props.country)}` : regionName.of(props.country) : ''}
        />
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
                      src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                      alt="weather icon"
                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                    />
                    <MUI.Typography variant="body2">
                      {`${weather.temp}°C`}
                    </MUI.Typography>
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
      {props.lat && props.lon && <MapContainer style={{ height: '200px', width: '100%' }} center={[props.lat, props.lon]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[props.lat, props.lon]}>

        </Marker>
      </MapContainer>}

    </MUI.Card>
  )
}