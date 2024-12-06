import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useCallback, useState } from 'react'
import TodoListCard from './TodoListCard'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { userMapAtom } from '../../lib/appLib'
import { ppUserAtom, PPUserAuth } from '../../lib/authLib'
import { onError } from '../../lib/errorLib'
import TodoListCreateView from './TodoListCreateView'
import { useNavigate } from 'react-router-dom'
import SelectItems from '../Common/SelectItems'
import { useWebSocket } from '../../lib/wsLib'
import AddButton from '../Common/AddButton'
import { PPTodoList } from './TodoList'
import { access } from 'fs'

const todoListURL = '/todoList'
const sortFunctions: { name: string; mapper: (todoLists: PPTodoList[]) => PPTodoList[] }[] = [
  {
    name: 'List Name',
    mapper: (todoLists: PPTodoList[]) => todoLists.sort((p1, p2) => p1.name.localeCompare(p2.name)),
  },
  {
    name: 'Creator Name',
    mapper: (todoLists: PPTodoList[]) =>
        todoLists.sort((p1, p2) => p1.createdBy.preferredName.localeCompare(p2.createdBy.preferredName)),
  },
]

export interface TodoListsProps {
    todoListOnClickHandler: (todoList: any) => () => void
}

export default function TodoLists(props: TodoListsProps) {
  const nav = useNavigate()
  const [todoListList, setTodoListList] = useState<PPTodoList[]>([])
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [createNew, setCreateNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [onReload, setOnReload] = useState(false)
  const [sortingBy, setSortingBy] = useState(sortFunctions[0].name)
  const { webSocket, messages, subscribe, unsubscribe } = useWebSocket()

  const fetchTodoListCreator = useCallback(
    async (userId: any, todoListList: any[]) => {
      return await Promise.all(
        todoListList.map(async (p) => {
          if (userMap.has(p.createdBy)) return { ...p, createdBy: userMap.get(p.createdBy) }
          const { user, ok } = await apiLib.getUserById(p.createdBy)
          if (!ok) return { ...p, createdBy: { userName: 'nil', preferredName: 'nil' } }
          else return { ...p, createdBy: user }
        }),
      )
    },
    [userMap],
  )

  const fetchTodoLists = useCallback(
    async (userId: any) => {
      if (!userId || !pUser.loggedIn) return
      let res: { data: { data: any; success: any } } | undefined = undefined
      let pList: any[] | undefined = undefined
      try {
        setIsLoading(true)
        res = await apiLib.get(todoListURL, { params: { userId: userId, access: 'rw' } })
        if (res?.data.success) pList = res.data.data
        else throw new Error()
        const todoListsWithCreators = await fetchTodoListCreator(userId, pList!)
        setTodoListList(todoListsWithCreators)
        setCreateNew(false)
      } catch {
        setIsLoading(false)
        if (!res || !pList || !res.data.success || pList.length < 1) {
          setTodoListList([])
        }
      }
    },
    [fetchTodoListCreator, pUser.loggedIn, todoListURL],
  )

  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchTodoLists(pUser.ppUser!._id)
    } catch {
      onError('Error fetching To-do Lists')
    } finally {
      setIsLoading(false)
    }
  }, [fetchTodoLists, pUser.loggedIn, setPPUser])

  useEffect(() => {
    onLoad()
  }, [onLoad, onReload])

  const sortTodoListList = (pList: PPTodoList[], sortBy: string) => {
    return sortFunctions.find((func) => func.name === sortBy)?.mapper([...pList]) ?? []
  }

  useEffect(() => {
    const sortedList = sortTodoListList(todoListList, sortingBy)
    if (JSON.stringify(sortedList) !== JSON.stringify(todoListList)) {
      setTodoListList(sortedList)
    }
  }, [sortingBy])

  useEffect(() => {
    if (!pUser.ppUser) return
    if (webSocket.readyState !== 1) return
    subscribe([{ type: 'todoLists', id: pUser.ppUser._id }])
  }, [pUser.ppUser, subscribe, onReload, isLoading])

  useEffect(() => {
    if (!pUser.ppUser) return
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'todoLists' && msg.topic.id === pUser.ppUser!._id && msg.message.type === 'todoLists',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let todoList = msg.message.data
      switch (msg.action) {
        case 'update':
          if (userMap.has(todoList.createdBy)) {
            todoList = {
              ...todoList,
              createdBy: userMap.get(todoList.createdBy),
            }
          }
          setTodoListList([...todoListList.filter((p) => p._id !== todoList._id), todoList])
          delete messages[msgId]
          break
        case 'delete':
          setTodoListList(todoListList.filter((p) => p._id !== todoList._id))
          delete messages[msgId]
          break
      }
    })
  }, [messages, pUser, todoListList, userMap])

  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <>
        <TodoListCreateView
          handelCancel={() => setCreateNew(false)}
          hasTodoList={todoListList.length > 0}
          setOnReload={setOnReload}
          open={createNew}
          setOpen={setCreateNew}
        ></TodoListCreateView>

        <MUI.Stack gap={8}>
          <MUI.Box sx={{ maxWidth: '100vw', display: 'flex', justifyContent: 'center' }}>
            <MUI.Box sx={{ display: 'flex', flexDirection: 'row', pr: '0.5em', flex: 0 }}>
              <SelectItems
                children={sortFunctions.map((sortFunc) => (
                  <MUI.MenuItem key={sortFunc.name} value={sortFunc.name}>
                    <MUI.Typography variant="body1">{`${sortFunc.name}`}</MUI.Typography>
                  </MUI.MenuItem>
                ))}
                helperText={''}
                label={'Sort By'}
                value={sortingBy}
                id={'SelectTodoListsSort'}
                setValue={setSortingBy}
              ></SelectItems>
              <AddButton
                sx={{
                  mt: '0.5em',
                  height: '3.5em',
                  width: '3.5em',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3,
                    cursor: 'pointer',
                  },
                }}
                onClickListener={() => setCreateNew(true)}
              ></AddButton>
            </MUI.Box>
          </MUI.Box>

          <MUI.Box>
            <MUI.Grid2
              sx={{
                maxWidth: '96vw',
                minWidth: 300,
                margin: '-3em auto',
                padding: '0em 0em 3em 0em',
              }}
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              justifyContent="center"
              container
              spacing={2}
              wrap={'wrap'}
            >
              {!(todoListList.length > 0) && <MUI.Typography variant="h5">No To-do Lists</MUI.Typography>}
              {todoListList.map((todoList) => (
                <TodoListCard
                  key={todoList._id}
                  todoList={todoList}
                  onClick={props.todoListOnClickHandler(todoList)}
                  className={'TodoListCard'}
                ></TodoListCard>
              ))}
            </MUI.Grid2>
          </MUI.Box>
        </MUI.Stack>
      </>
}
