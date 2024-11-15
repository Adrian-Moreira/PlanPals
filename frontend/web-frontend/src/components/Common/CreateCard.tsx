import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useState } from 'react'

export interface CreateCardProps {
  key: string
  id: string
  text: string
  children: any
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateCard(props: CreateCardProps) {
  const onClickHandler = () => {
    props.setExpanded(!props.expanded)
  }
  return (
    <MUI.Card key={props.id}>
      <MUI.CardActionArea onClick={onClickHandler}>
        <MUI.CardContent>
          <MUI.Typography variant="subtitle1">
            <MUIcons.AddBox /> {props.text}
          </MUI.Typography>
        </MUI.CardContent>
      </MUI.CardActionArea>
      <MUI.Collapse in={props.expanded} timeout="auto" unmountOnExit>
        <MUI.CardContent>
          <MUI.Stack sx={{ m: '0.5em 0.5em' }} spacing={2}>
            {props.children}
          </MUI.Stack>
        </MUI.CardContent>
      </MUI.Collapse>
    </MUI.Card>
  )
}
