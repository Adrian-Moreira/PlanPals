import { FormHelperText, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'

interface SelectItemsProps {
  children: any
  helperText: string
  label: string
  value: string
  id: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectItems(props: SelectItemsProps) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setValue(event.target.value)
  }

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={`${props.id}-helper-label`}>{props.label}</InputLabel>
        <Select
          labelId={`${props.id}-label`}
          id={props.id}
          value={props.value}
          label={props.label}
          onChange={handleChange}
        >
          {props.children}
        </Select>
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
    </div>
  )
}
