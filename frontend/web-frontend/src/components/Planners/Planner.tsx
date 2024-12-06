import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState,useContext } from 'react'
import SelectItems from '../Common/SelectItems'
import { ppUser, PPUser, ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import DestinationItems from '../Destinations/DestinationItems'
import DestinationCreate from '../Destinations/DestinationCreate'
import AddButton from '../Common/AddButton'
import TransportItems from '../Transportation/TransportItems'
import TransportCreate from '../Transportation/TransportCreate'
import { combineDateAndTime, convertDatePairs } from '../../lib/dateLib'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { onError } from '../../lib/errorLib'
import { useNavigate } from 'react-router-dom'
import ActivityCreate from '../Activities/ActivityCreate'
import ActivityItems from '../Activities/ActivityItems'
import { useFormFields } from '../../lib/hooksLib'
import { useWebSocket } from '../../lib/wsLib'
//import { toast } from 'react-toastify'
import { NotificationContext  } from '../../components/Notifications/notificationContext';
import AccommodationCreate from '../Accommodations/AccommodationCreate'
import AccommodationItems from '../Accommodations/AccommodationItems'
import DatePickerValue from '../Common/DatePickerValue'
import TimePickerValue from '../Common/TimePickerValue'
import dayjs from 'dayjs'

export interface PPPlanner {
  _id: string
  createdBy: PPUser
  name: string
  description: string
  roUsers: string[]
  rwUsers: string[]
  startDate: string
  endDate: string
  destinations: string[]
  transportations: string[]
  activities: string[]
}

export interface PlannerProps {
  key: string
  id: string
  planner: PPPlanner
}

const tabs = ['Destination', 'Transportation', 'Activities', 'Accommodations']

export default function Planner(props: PlannerProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDestination, setCurrentDestination] = useState({})
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const [editError, setEditError] = useState(false)
  const { webSocket, messages, subscribe, unsubscribe } = useWebSocket()
  const [onReload, setOnReload] = useState(false)
  const [startTime, setStartTime] = useState(dayjs(props.planner.startDate))
  const [endTime, setEndTime] = useState(dayjs(props.planner.endDate))
  const [editStartDate, setEditStartDate] = useState(dayjs(props.planner.startDate))
  const [editEndDate, setEditEndDate] = useState(dayjs(props.planner.endDate))
  const [timeError, setTimeError] = useState(false)
  const nav = useNavigate()
//const { setNotification } = useContext(NotificationContext);
  const { setNotification } = useContext(NotificationContext); // Use context here

  const [fields, handleFieldChange] = useFormFields({
    plannerName: '' + props.planner.name,
    plannerDescription: '' + props.planner.description,
  })

  const handleDeletePlanner = useCallback(async () => {
    try {
      const res = await apiLib.delete(`/planner/${props.planner._id}`, {
        params: { userId: pUser.ppUser?._id },
      });
      setNotification?.({ type: 'success', message: 'Planner deleted successfully!' }); 
      nav('/planners');
    } catch (err) {
      setNotification?.({ type: 'error', message: "Error deleting: Planner mightn't be removed" });
    }
  }, [props.planner._id, pUser.ppUser, nav, setNotification]);

  const handleEditPlanner = useCallback(async () => {
    if(validateEditPlannerForm()){
      try {
        console.log(fields.plannerName)

        const res = await apiLib.patch(`/planner/${props.planner._id}?userId=${pUser.ppUser!._id}`, {
          data: {
            name: fields.plannerName,
            description: fields.plannerDescription,
            startDate: combineDateAndTime(editStartDate, startTime).toISOString(),
            endDate: combineDateAndTime(editEndDate, endTime).toISOString(),
          }
        })
        setOpenEditDialog(false)
      } catch {
        onError("Error editing: Planner mightn't been edited")
      }
    }
  }, [fields.plannerName, fields.plannerDescription, editError, editStartDate, editEndDate, startTime, endTime])

  const mkTabItems = useCallback(() => {
    const elements = [
      <MUI.Box display={'flex'} flexDirection={'row'} mt={'0.35em'} mb={'-0.3em'}>
        <MUI.Typography flex={1} sx={{ pt: '0.2em', ml: '0.5em' }} variant="h6">
          {selectedTab}
        </MUI.Typography>
        <MUI.Box sx={{ marginTop: '-1em' }}>
          <SelectItems
            children={tabs.map((selection) => (
              <MUI.MenuItem key={selection} value={selection}>
                <MUI.Typography variant="body1">{`${selection}`}</MUI.Typography>
              </MUI.MenuItem>
            ))}
            helperText={''}
            label={'Viewing'}
            value={selectedTab}
            id={'SelectPlannerTab'}
            setValue={(v) => {
              setCreationDialogOpen(false)
              setSelectedTab(v)
            }}
          />
        </MUI.Box>
        <AddButton
          sx={{
            mt: '-0.5em',
            height: '3.5em',
            width: '3.5em',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 3,
              cursor: 'pointer',
            },
          }}
          onClickListener={() => setCreationDialogOpen(true)}
        ></AddButton>
      </MUI.Box>,
    ]
    switch (selectedTab) {
      case tabs[0]:
        elements.push(
          <>
            <DestinationCreate
              open={creationDialogOpen}
              setOpen={setCreationDialogOpen}
              planner={props.planner}
              setCurrentDestination={setCurrentDestination}
            ></DestinationCreate>
            <DestinationItems planner={props.planner} setCurrentDestination={setCurrentDestination} />
          </>,
        )
        break
      case tabs[1]:
        elements.push(
          <>
            <TransportCreate
              open={creationDialogOpen}
              setOpen={setCreationDialogOpen}
              planner={props.planner}
            ></TransportCreate>
            <TransportItems planner={props.planner}></TransportItems>
          </>,
        )
        break
      case tabs[2]:
        elements.push(
          <>
            <ActivityCreate
              open={creationDialogOpen}
              setOpen={setCreationDialogOpen}
              planner={props.planner}
            ></ActivityCreate>
            <ActivityItems planner={props.planner}></ActivityItems>
          </>,
        )
        break
      case tabs[3]:
        elements.push(
          <>
            <AccommodationCreate
              open={creationDialogOpen}
              setOpen={setCreationDialogOpen}
              planner={props.planner}
            ></AccommodationCreate>
            <AccommodationItems planner={props.planner}></AccommodationItems>
          </>,
        )
        break
      default:
        elements.push(<MUI.Typography variant={'body1'}> No {selectedTab} </MUI.Typography>)
        break
    }

    return <> {...elements}</>
  }, [isLoading, selectedTab, creationDialogOpen, props.planner._id])

  
  //NEAR REAL TIME UPDATES-----------------------

  useEffect(() => {
    if (!pUser.ppUser) return
    if (webSocket.readyState !== 1) return
    subscribe([{ type: 'planners', id: pUser.ppUser._id }])
  }, [pUser.ppUser, subscribe, onReload, isLoading])

  useEffect(() => {
    if (!pUser.ppUser) return
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planners' && msg.topic.id === pUser.ppUser!._id && msg.message.type === 'Planner',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      switch (msg.action) {
        case 'update':
          
          props.planner.name = msg.message.data.name
          props.planner.description = msg.message.data.description
          props.planner.startDate = msg.message.data.startDate
          props.planner.endDate = msg.message.data.endDate

          delete messages[msgId]
          break
        case 'delete':
          nav('/planners')
          delete messages[msgId]
          break
      }
    })
  }, [messages,])


  //EDIT PLANNER FORM-------------------------------------

  const getEditForm = useCallback(() => {
    return (
      <MUI.Box sx={{ mt: '1em', mb: '0em' }}>
        <MUI.Box sx={{ gap: 4 }}>
          <MUI.Stack spacing={2}>
            <MUI.TextField
              required
              id="plannerName"
              label="Planner Name"
              error={editError}
              helperText={editError && 'Name cannot be blank.'}
              value={fields.plannerName}
              onChange={handleFieldChange}
            />
            <MUI.TextField
              id="plannerDescription"
              label="Planner Description"
              value={fields.plannerDescription}
              onChange={handleFieldChange}
            />
            {timeError && (
            <MUI.Typography color="error" variant="subtitle1">
              Start date must be before end date.
            </MUI.Typography>
            )}
            <DatePickerValue label={'From'} field={editStartDate} setField={setEditStartDate}></DatePickerValue>
            <TimePickerValue label={'From'} field={startTime} setField={setStartTime}></TimePickerValue>
            <DatePickerValue label={'To'} field={editEndDate} setField={setEditEndDate}></DatePickerValue>
            <TimePickerValue label={'To'} field={endTime} setField={setEndTime}></TimePickerValue>
          </MUI.Stack>
          <MUI.Box sx={{ flexDirection: 'column' }}>
            <MUI.Stack spacing={2}>
              {/* add editting users who can view planner here if we have time */}
            </MUI.Stack>
          </MUI.Box>
        </MUI.Box>
      </MUI.Box>
    )
    
  }, [
    fields.plannerDescription,
    fields.plannerName,
    editError,
  ])

  const validateEditPlannerForm = useCallback(() => {
    const isNameValid = fields.plannerName.length > 0
    setEditError(!isNameValid)
    const isTimeValid = editStartDate.isBefore(editEndDate)
    setTimeError(!isTimeValid)
    return isNameValid && isTimeValid
  }, [fields.plannerName, editEndDate, editStartDate, startTime, endTime])

  useEffect(() => {
    validateEditPlannerForm()
  }, [fields.plannerName, editStartDate, startTime, editEndDate, endTime])

  function getRWUsers(){
    let list = ''

    props.planner.rwUsers.map((u) =>{
      list += u + ', '
    })

    list = list.slice(0, list.length - 2)
    
    return list
  }


  const { startDate, endDate } = convertDatePairs(props.planner.startDate, props.planner.endDate)
  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <MUI.Stack gap={8} pb={'2em'}>
        <MUI.Box sx={{ maxWidth: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <MUI.Box sx={{ m: '0 0.5em', pt: '0.6em' }} flex={1}>
            <MUI.Card>
              <MUI.CardHeader
                action={
                  <MUI.Box pr={'0.5em'} sx={{ display: 'flex', flexDirection: 'row' }}>
                    <MUI.Box sx={{ mt: '0.8em' }}>
                      <CardActionButtons
                        titleDelete={'Do you really want to delete this planner?'}
                        titleEdit={'Editting Planner'}
                        messageDelete={'This will remove everything associated with this planner.'}
                        childrensEdit={getEditForm()}
                        labelDelete={'PlannerDeleteDialog'}
                        labelEdit={'PlannerEditDialog'}
                        openEdit={openEditDialog}
                        setOpenEdit={setOpenEditDialog}
                        openDelete={openDeleteDialog}
                        setOpenDelete={setOpenDeleteDialog}
                        handleDeleteAction={async () => {
                          await handleDeletePlanner()
                        }}
                        handleEditAction={async () => {
                          await handleEditPlanner()
                        }}
                      ></CardActionButtons>
                    </MUI.Box>
                  </MUI.Box>
                }
                avatar={<MUIcons.Route />}
                title={props.planner.name}
                subheader={`Created By: ${props.planner.createdBy.preferredName}`}
              ></MUI.CardHeader>
              <MUI.CardContent sx={{ ml: '1em' }}>
                <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                          {`${startDate}`}
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`${endDate}`}</MUI.Typography>
                      </MUI.Box>
                    </MUI.Box>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.PeopleAlt sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can see this planner:
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          {props.planner.roUsers.length < 1 ? 'None' : ''}
                        </MUI.Typography>
                      </MUI.Box>
                    </MUI.Box>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.People sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can edit this planner:
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          {props.planner.rwUsers.length < 1 ? 'None' : getRWUsers()}
                        </MUI.Typography>
                      </MUI.Box>
                    </MUI.Box>
                  </MUI.Stack>

                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.Info sx={{ mt: '0.7em' }} />
                      <MUI.Typography sx={{ mt: '1.3em', pl: '1em' }} variant="subtitle2">
                        {props.planner.description}
                      </MUI.Typography>
                    </MUI.Box>
                  </MUI.Stack>
                </MUI.Box>
              </MUI.CardContent>
            </MUI.Card>
          </MUI.Box>
          <MUI.Box sx={{ m: '0em 0.5em', pt: '1em' }} flex={1}>
            {mkTabItems()}
          </MUI.Box>
        </MUI.Box>
      </MUI.Stack>
}
