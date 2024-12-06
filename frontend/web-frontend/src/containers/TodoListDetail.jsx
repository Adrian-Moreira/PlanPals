import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { ppUserAtom } from '../lib/authLib.ts'
import apiLib from '../lib/apiLib.js'
import { onError } from '../lib/errorLib.js'
import * as MUI from '@mui/material'
import { useAtom } from 'jotai'
import { userMapAtom } from '../lib/appLib.ts'
import { useWebSocket } from '../lib/wsLib.ts'
import TodoList from '../components/TodoLists/TodoList.tsx'

function TodoListDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const [todoListDetails, setTodoListDetails] = useState({})
  const [onReload, setReload] = useState(true)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const { subscribe, webSocket } = useWebSocket()
  useEffect(() => {
    if (!todoListDetails._id || !onReload) return
    setTimeout(() => {
      if (webSocket.readyState === 1) subscribe([{ type: 'todoList', id: todoListDetails._id }])
      setReload(false)
    }, 500)
  }, [todoListDetails, webSocket.readyState, onReload])

  const fetchTodoListDetails = useCallback(
    async (pUser) => {
      if (!pUser) return
      try {
        const todoList = await apiLib.get(`/todoList/${id}`, { params: { userId: pUser._id } })
        let creator
        const creatorId = todoList.data.data.createdBy
        if (userMap.has(creatorId)) {
          creator = userMap.get(creatorId)
        } else {
          const { user, ok } = await apiLib.getUserById(creatorId)
          if (ok) {
            setUserMap(userMap.set(creatorId, user))
            creator = user
          } else {
            creator = {}
          }
        }
        setTodoListDetails({ ...todoList.data.data, createdBy: creator })
      } catch (error) {
        onError(error)
      }
    },
    [id],
  )
  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchTodoListDetails(pUser.ppUser).then(() => setIsLoading(false))
    } catch {
      nav('/login')
    }
  }, [setIsLoading, setPPUser, fetchTodoListDetails, pUser, nav])
  useEffect(() => {
    onLoad()
  }, [onLoad])
  return isLoading || !todoListDetails.name ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <TodoList key={todoListDetails._id} id={todoListDetails._id} todoList={todoListDetails}></TodoList>
}
export default TodoListDetail
