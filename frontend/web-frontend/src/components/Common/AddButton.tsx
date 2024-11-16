import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import React from 'react'
export interface AddButtonProps {
  onClickListener: () => void
  sx?: MUI.SxProps<MUI.Theme>
}

export default function AddButton(props: AddButtonProps) {
  return (
    <MUI.Card sx={props.sx} onClick={props.onClickListener}>
      <MUI.CardActionArea>
        <MUI.CardContent>
          <MUIcons.Add></MUIcons.Add>
        </MUI.CardContent>
      </MUI.CardActionArea>
    </MUI.Card>
  )
}
