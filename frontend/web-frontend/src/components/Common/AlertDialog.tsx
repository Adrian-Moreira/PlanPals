import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface AlertDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  label: string
  title: string
  message: string
  onConfirmHandler: () => void
}

export default function AlertDialog(props: AlertDialogProps) {
  const handleClickOpen = () => {
    props.setOpen(true)
  }

  const handleClose = () => {
    props.setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby={props.label + '-title'}
        aria-describedby={props.label + '-description'}
      >
        <DialogTitle id={props.label + '-title'}>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id={props.label + '-description'}>{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => {
              props.onConfirmHandler()
              handleClose()
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
