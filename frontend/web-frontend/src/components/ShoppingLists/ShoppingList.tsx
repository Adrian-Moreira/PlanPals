import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState,useContext } from 'react'
import { ppUser, PPUser, ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import AddButton from '../Common/AddButton'
import ItemCreate from './ItemCreate'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { onError } from '../../lib/errorLib'
import { useNavigate } from 'react-router-dom'
import ShoppingListEditView from './ShoppingListEditView'
import { NotificationContext  } from '../../components/Notifications/notificationContext';


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

export default function ShoppingList(props: ShoppingListProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const { setNotification } = useContext(NotificationContext); 

  const nav = useNavigate()

  const handleDeleteShoppingList = useCallback(async () => {
    try {
      const res = await apiLib.delete(`/shoppingList/${props.shoppingList._id}`, {
        params: { userId: pUser.ppUser?._id },
      })
      setNotification?.({ type: 'success', message: 'Shopping List deleted successfully' });

      nav('/shoppingLists')
    } catch {
      setNotification?.({ type: 'error', message: 'Error deleting: Shopping List may have not been removed' });

      onError("Error deleting: Shopping List may have not been removed")
    }
  }, [])

  const handleEditShoppingList = useCallback(async () => {

  }, [])

  const [userNames, setUserNames] = useState({}) 

  const fetchUserName = async (userId) => {
    if (userNames[userId]) return userNames[userId] 

    try {
      const response = await apiLib.get(`/user/${userId}`) 
      if (response?.data.success) {
        const data = response.data.data;
        setUserNames((prev) => ({ ...prev, [userId]: data.userName })) 
        return data.userName;
      } else {
        console.error(`Failed to fetch username for userId: ${userId}`)
        return 'Unknown User'
      }
    } catch (error) {
      console.error(`Error fetching username for userId: ${userId}`, error)
      return 'Unknown User'
    }
  }

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
                      <ShoppingListEditView
                        handelCancel={() => setOpenEditDialog(false)}
                        open={openEditDialog}
                        setOpen={setOpenEditDialog}
                        shoppingList={props.shoppingList}
                      ></ShoppingListEditView>
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
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.People sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can edit this shopping list: 
                          {props.shoppingList.rwUsers.map((user) => {

                            const [userName, setUserName] = useState('Loading...');

                            useEffect(() => {
                                fetchUserName(user).then((name) => setUserName(name));
                            }, [user]);
                            return(
                                <MUI.Typography>
                                  {userName}
                                </MUI.Typography>
                            )
                            })
                          }
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
            <MUI.Box display={'flex'} flexDirection={'row'} mt={'0.35em'} mb={'-0.3em'}>
                <MUI.Typography flex={1} sx={{ pt: '0.2em', ml: '0.5em' }} variant="h6">
                    Items
                </MUI.Typography>
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
                <ItemCreate
                    open={creationDialogOpen}
                    setOpen={setCreationDialogOpen}
                    shoppingList={props.shoppingList}
                ></ItemCreate>
            </MUI.Box>
            {props.shoppingList.items.map((item) => {

                const [userName, setUserName] = useState('Loading...');

                useEffect(() => {
                    fetchUserName(item.addedBy).then((name) => setUserName(name));
                }, [item.addedBy]);
                return(
                    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }}>
                        <MUI.CardHeader
                            avatar={<MUIcons.ShoppingCart />}
                            title={item.name}
                        ></MUI.CardHeader>
                        <MUI.CardContent>
                            <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <MUIcons.Info sx={{ mt: '0.7em' }} />
                                <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="body2">
                                    {`Available at ${item.location}`}
                                </MUI.Typography>
                                <MUI.Typography
                                    sx={{ mt: '0.5em', pl: '1em' }}
                                    variant="body2"
                                >{`Created by: ${userName}`}</MUI.Typography>
                                </MUI.Box>
                            </MUI.Box>
                        </MUI.CardContent>
                    </MUI.Card>
                )
            })
            }            
          </MUI.Box>
        </MUI.Box>
      </MUI.Stack>
}
