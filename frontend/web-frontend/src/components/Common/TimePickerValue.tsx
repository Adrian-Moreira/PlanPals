import * as React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import * as MUI from '@mui/material/'

export default function TimePickerValue({ label, field, setField, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUI.Stack spacing={2}>
        <TimePicker label={label} value={field} onChange={setField} />
      </MUI.Stack>
    </LocalizationProvider>
  )
}
