import * as React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import * as MUI from '@mui/material/'

export default function DatePickerValue({ label, field, setField, ...props }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUI.Stack spacing={2}>
        <DatePicker label={label} value={field} onChange={setField} className="w-full" />
      </MUI.Stack>
    </LocalizationProvider>
  )
}
