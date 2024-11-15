import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import AlertDialog from './AlertDialog'
import AdaptiveDialog from './AdaptiveDialog'

interface CardActionButtonsProps {
  titleDelete: string
  titleEdit: string
  messageDelete: string
  childrensEdit: any
  labelDelete: string
  labelEdit: string
  openEdit: boolean
  setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>
  openDelete: boolean
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
  handleDeleteAction: () => Promise<void>
  handleEditAction: () => Promise<void>
}

export default function CardActionButtons(props: CardActionButtonsProps) {
  return (
    <>
      <AdaptiveDialog
        open={props.openEdit}
        setOpen={props.setOpenEdit}
        label={props.labelEdit}
        title={props.titleEdit}
        children={props.childrensEdit}
        onConfirmHandler={async () => {
          await props.handleEditAction()
        }}
        cancelEnable={false}
        confirmEnable={false}
        confirmButtonLabel={''}
        cancelButtonLabel={''}
      ></AdaptiveDialog>
      <MUI.IconButton aria-label="settings" onClick={() => props.setOpenEdit(true)}>
        <MUIcons.Edit />
      </MUI.IconButton>
      <AlertDialog
        open={props.openDelete}
        setOpen={props.setOpenDelete}
        label={props.labelDelete}
        title={props.titleDelete}
        message={props.messageDelete}
        onConfirmHandler={async () => {
          await props.handleDeleteAction()
        }}
      ></AlertDialog>
      <MUI.IconButton aria-label="settings" onClick={() => props.setOpenDelete(true)}>
        <MUIcons.Delete />
      </MUI.IconButton>
    </>
  )
}
