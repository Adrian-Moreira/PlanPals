import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { convertDatePairs } from '../../lib/dateLib'
import VoteButtons from '../Votes/VoteButtons'
import CommentButton from '../Comments/CommentButton'
import config from '../../config'
import { useAtom } from 'jotai'
import { ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import { onError } from '../../lib/errorLib'
import { useCallback } from 'react'
import apiLib from '../../lib/apiLib'
import ActivityCreate from './ActivityCreate'

export interface ActivityProps {
  _id: string
  name: string
  locationName: string
  startDate: string
  duration: string
  plannerId: string
  destinationId: string
  currentUserId: string
  onClickHandler: () => void
}

export default function ActivityItem(props: ActivityProps) {
  const { startDate, endDate } = convertDatePairs(props.startDate, props.duration)
  const [pUser] = useAtom(ppUserAtom)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const handleDeleteAction = useCallback(async () => {
    const res = await apiLib.delete(`/planner/${props.plannerId}/destination/${props.destinationId}/activity/${props._id}`, {
      params: { userId: props.currentUserId },
    })
    if (!res.data.success) {
      onError("Error deleting: Activity mightn't be removed")
    }
  }, [])

  const handleEditAction = useCallback(async () => {
    const res = await apiLib.patch(`/planner/${props.plannerId}/destination/${props.destinationId}/activity/${props._id}`, {
      params: { userId: props.currentUserId },
      data: {},
    })
    if (!res.data.success) {
      onError("Error deleting: Activity mightn't be updated")
    }
  }, [])

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader
        avatar={<MUIcons.LocationOn />}
        title={props.name}
        action={
          <CardActionButtons
            titleDelete={`Deleting Activity:`}
            messageDelete={`⚠️ Deleting ${props.name}, are you sure you want to continue?`}
            labelDelete={'ActItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing Activity'}
            childrensEdit={<></>}
            labelEdit={'ActivityItemEdit'}
            openEdit={openEditDialog}
            setOpenEdit={setOpenEditDialog}
            handleEditAction={handleEditAction}
          ></CardActionButtons>
        }
      />
      <MUI.CardActionArea onClick={props.onClickHandler}>
        <MUI.CardContent>
          <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
            <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                {`${startDate}`}
              </MUI.Typography>
              <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`Duration: ${props.duration}`}</MUI.Typography>
            </MUI.Box>
          </MUI.Box>
        </MUI.CardContent>
      </MUI.CardActionArea>
      <MUI.CardActions disableSpacing>
        <VoteButtons id={props._id} type={'Activity'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
        <CommentButton id={props._id} type={'Activity'} userId={pUser.ppUser!._id} plannerId={props.plannerId} />
      </MUI.CardActions>
    </MUI.Card>
  )
}
