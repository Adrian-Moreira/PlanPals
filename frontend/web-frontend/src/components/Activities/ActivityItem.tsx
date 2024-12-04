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


 //EDIT PLANNER FORM-------------------------------------

//  const getEditForm = useCallback(() => {
//   return (
//     <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
//       <MUI.Box sx={{ gap: 4 }}>
//         <MUI.Box sx={{ flexDirection: 'column' }}>
//         <SelectItems
//               children={transportTypes.map((t) => (
//                 <MUI.MenuItem key={t} value={t}>
//                   <MUI.Typography variant="body1">
//                     {getVehicleIcon(t)}
//                     {`   ${t}`}
//                   </MUI.Typography>
//                 </MUI.MenuItem>
//               ))}
//               helperText={'Select transport type'}
//               label={'Transport Type'}
//               value={transportType}
//               id={`trasport-items-${props.planner._id}`}
//               setValue={setTransportType}
//             ></SelectItems>
//             <MUI.TextField
//               helperText={'Optional'}
//               id="transportDetails"
//               label="Details"
//               value={fields.transportDetails}
//               onChange={handleFieldChange}
//             />
//             <MUI.TextField
//               helperText={'Optional'}
//               id="vehicleId"
//               label="Vehicle ID"
//               value={fields.vehicleId}
//               onChange={handleFieldChange}
//             />
//           <MUI.Stack spacing={2}>
//             {timeError && (
//               <MUI.Typography color="error" variant="subtitle1">
//                 Dates need to be within the planner's date.
//               </MUI.Typography>
//             )}
//             <DatePickerValue label={'From'} field={editStartDate} setField={setEditStartDate}></DatePickerValue>
//             <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
//             <DatePickerValue label={'To'} field={editEndDate} setField={setEditEndDate}></DatePickerValue>
//             <TimePickerValue label={'To'} field={endTime} setField={setEndTime}></TimePickerValue>
//           </MUI.Stack>
//         </MUI.Box>
//       </MUI.Box>
//     </MUI.Box>
//   )
// }, [
//   editStartDate,
//   editEndDate,
//   startDate,
//   endDate,
//   timeError,
//   fields.vehicleId,
//   fields.transportDetails,
//   transportType
// ])

// const validateEditPlannerForm = useCallback(() => {
//   const isTimeValid =
//     editStartDate.isBefore(editEndDate) &&
//     combineDateAndTime(editStartDate, startTime).isAfter(plannerStartDate) &&
//     combineDateAndTime(editEndDate, endTime).isBefore(plannerEndDate)
//   setTimeError(!isTimeValid)
//   return isTimeValid
// }, [editStartDate, editStartDate])

// useEffect(() => {
//   validateEditPlannerForm()
// }, [editStartDate, editStartDate])

  return (
    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }} key={props._id}>
      <MUI.CardHeader
        avatar={<MUIcons.LocationOn />}
        title={props.name + ' @ ' + props.locationName}
        action={
          <CardActionButtons
            titleDelete={`Deleting Activity:`}
            messageDelete={`⚠️ Deleting ${props.name}, are you sure you want to continue?`}
            labelDelete={'ActItemDelete'}
            openDelete={openDeleteDialog}
            setOpenDelete={setOpenDeleteDialog}
            handleDeleteAction={handleDeleteAction}
            titleEdit={'Editing Activity'}
            childrensEdit={/*getEditForm()*/<></>}
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
