import React, { useCallback } from 'react'
import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import dayjs from 'dayjs'
import { useFormFields } from '../lib/hooksLib'
import { useAppContext } from '../lib/contextLib'
import DatePickerValue from './DatePickerValue'
import TimePickerValue from './TimePickerValue'
import { combineDateAndTime } from '../lib/dateLib'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'
import { useNavigate } from 'react-router-dom'

export default function PlannerCreateView({ handelCancel, hasPlanner }) {
  const nav = useNavigate()

  const { ppUser }: any = useAppContext()
  const [fields, handleFieldChange] = useFormFields({
    plannerName: '',
    plannerDescription: '',
    destinationName: '',
  })
  const today = new Date()
  const [startDate, setStartDate] = React.useState(dayjs(today))
  const [endDate, setEndDate] = React.useState(dayjs(today))
  const [startTime, setStartTime] = React.useState(dayjs(today))
  const [endTime, setEndTime] = React.useState(dayjs(today))
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const res = await apiLib.post('/planner', {
        data: {
          createdBy: ppUser._id,
          name: fields.plannerName,
          description: fields.plannerDescription,
          startDate: combineDateAndTime(startDate, startTime).toISOString(),
          endDate: combineDateAndTime(endDate, endTime).toISOString(),
        },
      })
      if (res.data.success && fields?.destinationName !== '') {
        const res2 = await apiLib.post(`/planner/${res.data.data._id}/destination`, {
          data: {
            createdBy: ppUser._id,
            startDate: combineDateAndTime(startDate, startTime).toISOString(),
            endDate: combineDateAndTime(endDate, endTime).toISOString(),
            name: fields.destinationName,
          },
        })
        if (res2.data.success) {
          nav('/')
        }
      }
      if (res.data.success) {
        nav('/')
      }
      setIsLoading(false)
    } catch (e) {
      onError(e)
    }
  }

  const renderCreatePlanner = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '-5em', mb: '-3em', height: '86vh' }}>
        <MUI.Paper sx={{ minWidth: '15em', display: 'flex', p: '2em 3em', borderRadius: '1em' }}>
          <MUI.Box sx={{ gap: 4, display: 'flex', flexGrow: 1, flexDirection: { xs: 'column', md: 'row' } }}>
            <MUI.Stack sx={{ flex: 1 }} spacing={2}>
              <MUI.Typography variant="h5">Creating a New Planner</MUI.Typography>
              <MUI.TextField
                required
                id="plannerName"
                label="Planner Name"
                value={fields.plannerName}
                onChange={handleFieldChange}
              />
              <MUI.TextField
                id="plannerDescription"
                label="Planner Description"
                value={fields.plannerDescription}
                onChange={handleFieldChange}
              />
              <MUI.Typography variant="h6">Select Dates</MUI.Typography>
              <MUI.Box sx={{ display: 'flex', flexGrow: 1, flex: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                <MUI.Stack sx={{ flex: 1, m: '0.5em 0.5em' }} spacing={2}>
                  <DatePickerValue label={'From'} field={startDate} setField={setStartDate}></DatePickerValue>
                  <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
                </MUI.Stack>
                <MUI.Stack sx={{ flex: 1, m: '0.5em 0.5em' }} spacing={2}>
                  <DatePickerValue label={'To'} field={endDate} setField={setEndDate}></DatePickerValue>
                  <TimePickerValue label={'To'} field={endTime} setField={setEndTime}></TimePickerValue>
                </MUI.Stack>
              </MUI.Box>
            </MUI.Stack>
            <MUI.Box sx={{ flex: 1, flexDirection: 'column' }}>
              <MUI.Stack sx={{ flex: 1 }} spacing={2}>
                <MUI.Typography variant="h6">Add a Destination</MUI.Typography>
                <MUI.TextField
                  id="destinationName"
                  label="Destination"
                  value={fields.destinationName}
                  onChange={handleFieldChange}
                />
                <MUI.Button onClick={handleSubmit} sx={{ flex: 1, mt: 'auto' }}>
                  <MUIcons.Save sx={{ mr: '0.5em' }} /> Save and continue
                </MUI.Button>
                <MUI.Button disabled={!hasPlanner} onClick={handelCancel} sx={{ flex: 1, mt: 'auto' }}>
                  <MUIcons.Cancel sx={{ mr: '0.5em' }} /> Cancel
                </MUI.Button>
              </MUI.Stack>
            </MUI.Box>
          </MUI.Box>
        </MUI.Paper>
      </MUI.Box>
    )
  }, [
    startDate,
    endDate,
    startTime,
    endTime,
    fields.destinationName,
    fields.plannerDescription,
    fields.plannerName,
    handleSubmit,
    hasPlanner,
  ])

  return ppUser && renderCreatePlanner()
}
