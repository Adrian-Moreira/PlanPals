import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

interface AdaptiveDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  label: string
  title: string
  children: any
  cancelEnable: boolean
  confirmEnable: boolean
  confirmButtonLabel: string
  cancelButtonLabel: string
  confirmIcon?: any
  cancelIcon?: any
  onConfirmHandler: (event: any) => void
}

export default function AdaptiveDialog(props: AdaptiveDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleClickOpen = () => {
    props.setOpen(true)
  }

  const handleClose = () => {
    props.setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog fullScreen={fullScreen} open={props.open} onClose={handleClose} aria-labelledby={props.label + '-title'}>
        <DialogTitle id={props.label + '-title'}>{props.title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
        <DialogActions sx={{ mb: '1em', mr: '1em' }}>
          <Button disabled={!props.cancelEnable} autoFocus onClick={handleClose}>
            {props.cancelIcon}
            {props.cancelButtonLabel}
          </Button>
          <Button disabled={!props.confirmEnable} onClick={props.onConfirmHandler}>
            {props.confirmIcon}
            {props.confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
