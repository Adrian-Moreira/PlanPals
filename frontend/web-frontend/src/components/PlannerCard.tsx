import * as MUI from '@mui/material'
import './PlannerCard.css'
import PropTypes from 'prop-types'
import React from 'react'
import { convertDatePairs, convertToLongDate } from '../lib/dateLib'

PlannerCard.propTypes = {
  planner: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    destinations: PropTypes.arrayOf(PropTypes.string),
    transportations: PropTypes.arrayOf(PropTypes.string),
    createdBy: PropTypes.object.isRequired,
  }).isRequired,
}

export default function PlannerCard({ className, planner, onClick, ...props }) {
  const { startDate, endDate } = convertDatePairs(planner.startDate, planner.endDate)
  return (
    <MUI.Card onClick={onClick} sx={{ minWidth: 300 }} className={`PlannerCard ${className}`} {...props}>
      <MUI.CardActionArea>
        <MUI.CardContent>
          <MUI.Typography variant="h6">{planner.name}</MUI.Typography>
          <MUI.Typography variant="subtitle1">{`${planner.createdBy.preferredName}`}</MUI.Typography>
          <MUI.Typography>{planner.description}</MUI.Typography>
          <MUI.Typography variant="subtitle2">From: {startDate}</MUI.Typography>
          <MUI.Typography variant="subtitle2">To: {endDate}</MUI.Typography>
        </MUI.CardContent>
      </MUI.CardActionArea>
      {props.children}
    </MUI.Card>
  )
}
