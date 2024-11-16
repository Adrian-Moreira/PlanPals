import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import SelectItems from '../Common/SelectItems'
import { PPUser } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import DestinationItems from '../Destinations/DestinationItems'
import DestinationCreate from '../Destinations/DestinationCreate'
import AddButton from '../Common/AddButton'
import TransportItems from '../Transportation/TransportItems'
import TransportCreate from '../Transportation/TransportCreate'
import { convertDatePairs } from '../../lib/dateLib'

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
}

export interface PlannerProps {
  key: string
  id: string
  planner: PPPlanner
  transportList: any[]
  destinationList: any[]
}

const tabs = ['Destination', 'Transportation']

export default function Planner(props: PlannerProps) {
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDestination, setCurrentDestination] = useState({})
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)

  const handleDeletePlanner = useCallback(async () => {}, [])
  const handleEditPlanner = useCallback(async () => {}, [])

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
            <DestinationItems
              planner={props.planner}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCurrentDestination={setCurrentDestination}
            />
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
            <TransportItems
              transportList={props.transportList}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            ></TransportItems>
          </>,
        )
        break
      default:
        elements.push(<MUI.Typography variant={'body1'}> No {selectedTab} </MUI.Typography>)
        break
    }

    return <> {...elements}</>
  }, [isLoading, selectedTab, creationDialogOpen, props.planner._id, props.destinationList])

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
                        titleEdit={''}
                        messageDelete={'This will remove everything associated with this planner.'}
                        childrensEdit={<></>}
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
                          {props.planner.rwUsers.length < 1 ? 'None' : ''}
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
