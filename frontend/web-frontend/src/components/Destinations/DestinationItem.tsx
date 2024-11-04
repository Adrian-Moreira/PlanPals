import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React from 'react'
import { convertDatePairs } from '../../lib/dateLib'

export interface DestinationProps {
  _id: string
  name: string
  startDate: string
  endDate: string
  onClickHandler: () => void
}

export default function DestinationItem(props: DestinationProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.endDate)
  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardActionArea onClick={props.onClickHandler}>
        <MUI.CardContent>
          <MUI.Typography variant="h6">
            <MUIcons.LocationOn /> {props.name}
          </MUI.Typography>
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
      </MUI.CardActionArea>
    </MUI.Card>
  )
}
