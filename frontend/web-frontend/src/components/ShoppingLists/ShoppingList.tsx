import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import SelectItems from '../Common/SelectItems'
import { ppUser, PPUser, ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import DestinationItems from '../Destinations/DestinationItems'
import DestinationCreate from '../Destinations/DestinationCreate'
import AddButton from '../Common/AddButton'
import TransportItems from '../Transportation/TransportItems'
import TransportCreate from '../Transportation/TransportCreate'
import { convertDatePairs } from '../../lib/dateLib'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { onError } from '../../lib/errorLib'
import { useNavigate } from 'react-router-dom'

export interface PPShoppingListItem {
    addedBy: PPUser
    name: string
    location: string
  }

export interface PPShoppingList {
  _id: string
  createdBy: PPUser
  name: string
  description: string
  items: PPShoppingListItem[]
  rwUsers: string[]
}

export interface ShoppingListProps {
  key: string
  id: string
  shoppingList: PPShoppingList
}

// const tabs = ['Destination', 'Transportation']

export default function ShoppingList(props: ShoppingListProps) {
//   const [selectedTab, setSelectedTab] = useState(tabs[0])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDestination, setCurrentDestination] = useState({})
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const nav = useNavigate()

  const handleDeleteShoppingList = useCallback(async () => {
    try {
      const res = await apiLib.delete(`/shoppingList/${props.shoppingList._id}`, {
        params: { userId: pUser.ppUser?._id },
      })
      nav('/shoppingLists')
    } catch {
      onError("Error deleting: Shopping List may have not been removed")
    }
  }, [])
  const handleEditShoppingList = useCallback(async () => {}, [])

  const mkTabItems = useCallback(() => {
    const elements = [
      <MUI.Box display={'flex'} flexDirection={'row'} mt={'0.35em'} mb={'-0.3em'}>
        <MUI.Typography flex={1} sx={{ pt: '0.2em', ml: '0.5em' }} variant="h6">
          Items
        </MUI.Typography>
        {/* <MUI.Box sx={{ marginTop: '-1em' }}>
          <SelectItems
            children={tabs.map((selection) => (
              <MUI.MenuItem key={selection} value={selection}>
                <MUI.Typography variant="body1">{`${selection}`}</MUI.Typography>
              </MUI.MenuItem>
            ))}
            helperText={''}
            label={'Viewing'}
            value={selectedTab}
            id={'SelectShoppingListTab'}
            setValue={(v) => {
              setCreationDialogOpen(false)
              setSelectedTab(v)
            }}
          />
        </MUI.Box> */}
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

    // elements.push(
    //     <>
    //       <DestinationCreate
    //         open={creationDialogOpen}
    //         setOpen={setCreationDialogOpen}
    //         shoppingList={props.shoppingList}
    //         setCurrentDestination={setCurrentDestination}
    //       ></DestinationCreate>
    //       <DestinationItems shoppingList={props.shoppingList} setCurrentDestination={setCurrentDestination} />
    //     </>,
    //   )

    // switch (selectedTab) {
    //   case tabs[0]:
    //     elements.push(
    //       <>
    //         <DestinationCreate
    //           open={creationDialogOpen}
    //           setOpen={setCreationDialogOpen}
    //           planner={props.planner}
    //           setCurrentDestination={setCurrentDestination}
    //         ></DestinationCreate>
    //         <DestinationItems planner={props.planner} setCurrentDestination={setCurrentDestination} />
    //       </>,
    //     )
    //     break
    //   case tabs[1]:
    //     elements.push(
    //       <>
    //         <TransportCreate
    //           open={creationDialogOpen}
    //           setOpen={setCreationDialogOpen}
    //           planner={props.planner}
    //         ></TransportCreate>
    //         <TransportItems planner={props.planner}></TransportItems>
    //       </>,
    //     )
    //     break
    //   default:
    //     elements.push(<MUI.Typography variant={'body1'}> No {selectedTab} </MUI.Typography>)
    //     break
    // }

    return <> {...elements}</>
  }, [isLoading, creationDialogOpen, props.shoppingList._id])

//   const { startDate, endDate } = convertDatePairs(props.planner.startDate, props.planner.endDate)
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
                        titleDelete={'Do you really want to delete this shopping list?'}
                        titleEdit={''}
                        messageDelete={'This will remove everything associated with this shopping list.'}
                        childrensEdit={<></>}
                        labelDelete={'ShoppingListDeleteDialog'}
                        labelEdit={'ShoppingListEditDialog'}
                        openEdit={openEditDialog}
                        setOpenEdit={setOpenEditDialog}
                        openDelete={openDeleteDialog}
                        setOpenDelete={setOpenDeleteDialog}
                        handleDeleteAction={async () => {
                          await handleDeleteShoppingList()
                        }}
                        handleEditAction={async () => {
                          await handleEditShoppingList()
                        }}
                      ></CardActionButtons>
                    </MUI.Box>
                  </MUI.Box>
                }
                avatar={<MUIcons.List />}
                title={props.shoppingList.name}
                subheader={`Created By: ${props.shoppingList.createdBy.preferredName}`}
              ></MUI.CardHeader>
              <MUI.CardContent sx={{ ml: '1em' }}>
                <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    {/* <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.CalendarMonth sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                          {`${startDate}`}
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">{`${endDate}`}</MUI.Typography>
                      </MUI.Box>
                    </MUI.Box> */}
                    {/* <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.PeopleAlt sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can see this shopping list:
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          {props.shoppingList.roUsers.length < 1 ? 'None' : ''}
                        </MUI.Typography>
                      </MUI.Box>
                    </MUI.Box> */}
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.People sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can edit this shopping list:
                        </MUI.Typography>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          {props.shoppingList.rwUsers.length < 1 ? 'None' : ''}
                        </MUI.Typography>
                      </MUI.Box>
                    </MUI.Box>
                  </MUI.Stack>

                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.Info sx={{ mt: '0.7em' }} />
                      <MUI.Typography sx={{ mt: '1.3em', pl: '1em' }} variant="subtitle2">
                        {props.shoppingList.description}
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
