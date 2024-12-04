import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { ppUserAtom } from '../lib/authLib'
import apiLib from '../lib/apiLib'
import { onError } from '../lib/errorLib'
import * as MUI from '@mui/material'
import { useAtom } from 'jotai'
import { userMapAtom } from '../lib/appLib.ts'
import { useWebSocket } from '../lib/wsLib'
import ShoppingList from '../components/ShoppingLists/ShoppingList.tsx'

function ShoppingListDetail() {
  const nav = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const [shoppingListDetails, setShoppingListDetails] = useState({})
  const [onReload, setReload] = useState(true)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const { subscribe, webSocket } = useWebSocket()
  useEffect(() => {
    if (!shoppingListDetails._id || !onReload) return
    setTimeout(() => {
      if (webSocket.readyState === 1) subscribe([{ type: 'shoppingList', id: shoppingListDetails._id }])
      setReload(false)
    }, 500)
  }, [shoppingListDetails, webSocket.readyState, onReload])

  const fetchShoppingListDetails = useCallback(
    async (pUser) => {
      if (!pUser) return
      try {
        const shoppingList = await apiLib.get(`/shoppingList/${id}`, { params: { userId: pUser._id } })
        let creator
        const creatorId = shoppingList.data.data.createdBy
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
        setShoppingListDetails({ ...shoppingList.data.data, createdBy: creator })
      } catch (error) {
        onError(error)
      }
    },
    [id],
  )
  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchShoppingListDetails(pUser.ppUser).then(() => setIsLoading(false))
    } catch {
      nav('/login')
    }
  }, [setIsLoading, setPPUser, fetchShoppingListDetails, pUser, nav])
  useEffect(() => {
    onLoad()
  }, [onLoad])
  return isLoading || !shoppingListDetails.name ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <ShoppingList key={shoppingListDetails._id} id={shoppingListDetails._id} shoppingList={shoppingListDetails}></ShoppingList>
}
export default ShoppingListDetail
