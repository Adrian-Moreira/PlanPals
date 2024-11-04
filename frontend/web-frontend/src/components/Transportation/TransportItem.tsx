import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React from 'react'
import { convertDatePairsWithMinute } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'

function getVehicleIcon(type: string) {
  switch (type) {
    case 'Bus':
      return <MUIcons.DirectionsBus />
    case 'Train':
      return <MUIcons.DirectionsRailway />
    case 'Car':
      return <MUIcons.DirectionsCar />
    case 'Airplane':
      return <MUIcons.AirplanemodeActive />
    case 'Metro':
      return <MUIcons.DirectionsSubway />
    case 'Tram':
      return <MUIcons.DirectionsTransit />
    case 'Bicycle':
      return <MUIcons.DirectionsBike />
    case 'Ferry':
      return <MUIcons.DirectionsBoat />
    default:
      return <MUIcons.MapTwoTone />
  }
}

export interface TransportationProps {
  _id: string
  type: string
  details: string
  vehicleId: string
  departureTime: string
  arrivalTime: string
  onClickHandler: () => void
  currentUserId: string
}

export default function TransportationItem(props: TransportationProps) {
  const { startDate, endDate } = convertDatePairsWithMinute(props.departureTime, props.arrivalTime)
  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader avatar={getVehicleIcon(props.type)} title={props.type} subheader={props.details}></MUI.CardHeader>
      <MUI.CardContent>
        <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
          <MUI.Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
              {`${startDate}`}
            </MUI.Typography>
            <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`${endDate}`}</MUI.Typography>
          </MUI.Box>
        </MUI.Box>
      </MUI.CardContent>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Transport'} userId={props.currentUserId} />
        <CommentButton id={props._id} type={'Transport'} userId={props.currentUserId} />
      </MUI.CardActions>
    </MUI.Card>
  )
}
