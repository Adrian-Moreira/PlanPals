import * as MUI from '@mui/material'
import * as MUIcons from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { ppUser, PPUser, ppUserAtom } from '../../lib/authLib'
import CardActionButtons from '../Common/CardActionButtons'
import AddButton from '../Common/AddButton'
import TaskCreate from './TaskCreate'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { onError } from '../../lib/errorLib'
import { useNavigate } from 'react-router-dom'
import TodoListEditView from './TodoListEditView'

export interface PPTodoListTask {
    _id: string
    createdAt: string
    createdBy: string
    name: string
    dueDate: string
    isCompleted: boolean
    todoListId: string
    updatedAt: string
  }

export interface PPTodoList {
  _id: string
  createdBy: PPUser
  name: string
  description: string
  tasks: PPTodoListTask[]
  rwUsers: string[]
}

export interface TodoListProps {
  key: string
  id: string
  todoList: PPTodoList
}

export default function TodoList(props: TodoListProps) {
  const [taskList, setTaskList] = useState([])
  var stupidList
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)
  const [pUser] = useAtom(ppUserAtom)
  const nav = useNavigate()

  const handleDeleteTodoList = useCallback(async () => {
    try {
      const res = await apiLib.delete(`/todoList/${props.todoList._id}`, {
        params: { userId: pUser.ppUser?._id },
      })
      nav('/todoLists')
    } catch {
      onError("Error deleting: Todo List may have not been removed")
    }
  }, [])
  const handleEditTodoList = useCallback(async () => {

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

  const fetchTasks = useCallback(
    async () => {
      setIsLoading(true)
      const tList = await Promise.all(
        props.todoList.tasks.map(async (did) => {
          try {
            const res = await apiLib
              .get(`/todoList/${props.todoList._id}/task/${did}`, {
                params: { userId: pUser.ppUser!._id },
              })
              .then((res) => res)
            return res.data.success ? res.data.data : {}
          } catch {
            return {}
          }
        }),
      )
      stupidList = tList
      setIsLoading(false)
  }, [props.todoList._id, props.todoList.createdBy._id, taskList, setTaskList])

  const onLoad = useCallback(async () => {
    try {
      await fetchTasks()
    } catch {
      onError('Error fetching tasks')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    onLoad()
  }, [onLoad])


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
                        titleDelete={'Do you really want to delete this todo list?'}
                        titleEdit={''}
                        messageDelete={'This will remove everything associated with this todo list.'}
                        childrensEdit={<></>}
                        labelDelete={'TodoListDeleteDialog'}
                        labelEdit={'TodoListEditDialog'}
                        openEdit={openEditDialog}
                        setOpenEdit={setOpenEditDialog}
                        openDelete={openDeleteDialog}
                        setOpenDelete={setOpenDeleteDialog}
                        handleDeleteAction={async () => {
                          await handleDeleteTodoList()
                        }}
                        handleEditAction={async () => {
                          await handleEditTodoList()
                        }}
                      ></CardActionButtons>
                      <TodoListEditView
                        handelCancel={() => setOpenEditDialog(false)}
                        open={openEditDialog}
                        setOpen={setOpenEditDialog}
                        todoList={props.todoList}
                      ></TodoListEditView>
                    </MUI.Box>
                  </MUI.Box>
                }
                avatar={<MUIcons.List />}
                title={props.todoList.name}
                subheader={`Created By: ${props.todoList.createdBy.preferredName}`}
              ></MUI.CardHeader>
              <MUI.CardContent sx={{ ml: '1em' }}>
                <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.People sx={{ mt: '0.7em' }} />
                      <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MUI.Typography sx={{ mt: '0.5em', pl: '1em' }} variant="subtitle2">
                          Pals who can edit this to-do list: 
                          {props.todoList.rwUsers.map((user) => {

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
                          {props.todoList.rwUsers.length < 1 ? 'None' : ''}
                        </MUI.Typography>
                      </MUI.Box>
                    </MUI.Box>
                  </MUI.Stack>

                  <MUI.Stack gap={2} sx={{ flex: 1 }}>
                    <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                      <MUIcons.Info sx={{ mt: '0.7em' }} />
                      <MUI.Typography sx={{ mt: '1.3em', pl: '1em' }} variant="subtitle2">
                        {props.todoList.description}
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
                    Tasks
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
                <TaskCreate
                    open={creationDialogOpen}
                    setOpen={setCreationDialogOpen}
                    todoList={props.todoList}
                ></TaskCreate>
            </MUI.Box>
            {stupidList.map((task) => {
                const [userName, setUserName] = useState('Loading...');

                useEffect(() => {
                    fetchUserName(task.addedBy).then((name) => setUserName(name));
                }, [task.addedBy]);
                return(
                    <MUI.Card sx={{ borderRadius: '0.5em', marginTop: '0.5em', marginBottom: '0.5em' }}>
                        <MUI.CardHeader
                            avatar={<MUIcons.EditNote/>}
                            title={task.name}
                        ></MUI.CardHeader>
                        <MUI.CardContent>
                            <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                <MUIcons.Info sx={{ mt: '0.7em' }} />
                                <MUI.Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
