import { convertToLongDate } from '../../lib/dateLib.ts'
import VoteButtons from '../Votes/VoteButtons.tsx'
import CommentButton from '../Comments/CommentButton.tsx'
import { AccommodationProps } from './AccommodationItem.tsx'
import { userMapAtom } from '../../lib/appLib.ts'
import { useAtom } from 'jotai'

import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import apiLib from '../../lib/apiLib.js'

export interface AccommodationViewProps extends AccommodationProps {
  plannerId: string
  createdAt: string
  updatedAt: string
  createdBy: string
  currentUserId: string
  onDismissHandler: () => void
}

export function AccommodationView(props: AccommodationViewProps) {
  const updatedDateStr = convertToLongDate(props?.updatedAt)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [creator, setCreator] = useState({ userName: 'nil', preferredName: 'nil' })

  const initAccommodation = useCallback(async () => {
    const creatorId = props?.createdBy
    if (userMap.has(creatorId)) {
      setCreator(userMap.get(creatorId)!)
    } else {
      const { user, ok } = await apiLib.getUserById(creatorId)
      if (ok) {
        setUserMap(userMap.set(creatorId, user))
        setCreator(user)
      }
    }
  }, [])

  useEffect(() => {
    initAccommodation()
  }, [props._id])

  return (
    <MUI.Box
      sx={{
        flexGrow: 1,
        height: '100%',
        p: '0em 0.5em 0.5em 0.5em',
        m: {
          xs: '-0.5em 0 0 0',
          md: '0',
        },
        position: 'sticky',
        overflow: 'auto',
      }}
    >
      <MUI.Paper elevation={1} sx={{ height: '100%', borderRadius: '0.5em', p: 1, position: 'static' }}>
        <MUI.Card sx={{ bgcolor: '#00000000' }}>
          <MUI.CardHeader
            avatar={<MUI.Avatar aria-label="Accommodation">D</MUI.Avatar>}
            action={
              <MUI.IconButton aria-label="dismiss" onClick={props.onDismissHandler}>
                <MUIcons.Close />
              </MUI.IconButton>
            }
            title={`Trip to: ${props?.name}`}
            subheader={`Created by: ${creator?.preferredName}`}
          />
          <MUI.CardContent>
            <MUI.Typography variant="body2">{`Last updated: ${updatedDateStr}`}</MUI.Typography>
          </MUI.CardContent>
          <MUI.CardActions>
            <VoteButtons
              id={props._id}
              plannerId={props.plannerId}
              type={'Accommodation'}
              userId={props.currentUserId}
            ></VoteButtons>
            <CommentButton
              id={props._id}
              plannerId={props.plannerId}
              type={'Accommodation'}
              userId={props.currentUserId}
            ></CommentButton>
          </MUI.CardActions>
        </MUI.Card>
      </MUI.Paper>
    </MUI.Box>
  )
}
