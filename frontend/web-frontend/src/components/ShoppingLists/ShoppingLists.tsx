import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useCallback, useState } from 'react'
import ShoppingListCard from './ShoppingListCard'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { userMapAtom } from '../../lib/appLib'
import { ppUserAtom, PPUserAuth } from '../../lib/authLib'
import { onError } from '../../lib/errorLib'
import ShoppingListCreateView from './ShoppingListCreateView'
import { useNavigate } from 'react-router-dom'
import SelectItems from '../Common/SelectItems'
import { useWebSocket } from '../../lib/wsLib'
import AddButton from '../Common/AddButton'
import { PPShoppingList } from './ShoppingList'

const titles = ['My Shopping Lists', 'Shopping Lists View Only', 'Shopping Lists I Can Edit']
const paths = ['/shoppingList', '/shoppingList?access=ro', '/shoppingList?access=rw']
const sortFunctions: { name: string; mapper: (shoppingLists: PPShoppingList[]) => PPShoppingList[] }[] = [
  {
    name: 'List Name',
    mapper: (shoppingLists: PPShoppingList[]) => shoppingLists.sort((p1, p2) => p1.name.localeCompare(p2.name)),
  },
  {
    name: 'Creator Name',
    mapper: (shoppingLists: PPShoppingList[]) =>
        shoppingLists.sort((p1, p2) => p1.createdBy.preferredName.localeCompare(p2.createdBy.preferredName)),
  },
]

export interface ShoppingListsProps {
    shoppingListOnClickHandler: (shoppingList: any) => () => void
}

export default function ShoppingLists(props: ShoppingListsProps) {
  const nav = useNavigate()
  const [shoppingListList, setShoppingListList] = useState<PPShoppingList[]>([])
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [createNew, setCreateNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [onReload, setOnReload] = useState(false)
  const [shoppingListTitle, setShoppingListTitle] = useState(titles[2])
  const [shoppingListURL, setShoppingListURL] = useState(paths[2])
  const [sortingBy, setSortingBy] = useState(sortFunctions[0].name)
  const { webSocket, messages, subscribe, unsubscribe } = useWebSocket()

  const fetchShoppingListCreator = useCallback(
    async (userId: any, shoppingListList: any[]) => {
      return await Promise.all(
        shoppingListList.map(async (p) => {
          if (userMap.has(p.createdBy)) return { ...p, createdBy: userMap.get(p.createdBy) }
          const { user, ok } = await apiLib.getUserById(p.createdBy)
          if (!ok) return { ...p, createdBy: { userName: 'nil', preferredName: 'nil' } }
          else return { ...p, createdBy: user }
        }),
      )
    },
    [userMap],
  )

  const fetchShoppingLists = useCallback(
    async (userId: any) => {
      if (!userId || !pUser.loggedIn) return
      let res: { data: { data: any; success: any } } | undefined = undefined
      let pList: any[] | undefined = undefined
      try {
        setIsLoading(true)
        res = await apiLib.get(shoppingListURL, { params: { userId } })
        if (res?.data.success) pList = res.data.data
        else throw new Error()
        const shoppingListsWithCreators = await fetchShoppingListCreator(userId, pList!)
        setShoppingListList(shoppingListsWithCreators)
        setCreateNew(false)
      } catch {
        setIsLoading(false)
        if (!res || !pList || !res.data.success || pList.length < 1) {
          setShoppingListList([])
          if (shoppingListTitle === titles[0]) setCreateNew(true)
        }
      }
    },
    [fetchShoppingListCreator, pUser.loggedIn, shoppingListURL],
  )

  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchShoppingLists(pUser.ppUser!._id)
    } catch {
      onError('Error fetching Shopping Lists')
    } finally {
      setIsLoading(false)
    }
  }, [fetchShoppingLists, pUser.loggedIn, setPPUser])

  useEffect(() => {
    onLoad()
  }, [onLoad, onReload])

  useEffect(() => {
    switch (shoppingListTitle) {
      case titles[0]:
        setShoppingListURL(paths[0])
        break
      case titles[1]:
        setShoppingListURL(paths[1])
        break
      case titles[2]:
        setShoppingListURL(paths[2])
        break
    }
  }, [shoppingListTitle])

  const sortShoppingListList = (pList: PPShoppingList[], sortBy: string) => {
    return sortFunctions.find((func) => func.name === sortBy)?.mapper([...pList]) ?? []
  }

  useEffect(() => {
    const sortedList = sortShoppingListList(shoppingListList, sortingBy)
    if (JSON.stringify(sortedList) !== JSON.stringify(shoppingListList)) {
      setShoppingListList(sortedList)
    }
  }, [sortingBy])

  useEffect(() => {
    if (!pUser.ppUser) return
    if (webSocket.readyState !== 1) return
    subscribe([{ type: 'shoppingLists', id: pUser.ppUser._id }])
  }, [pUser.ppUser, subscribe, onReload, isLoading])

  useEffect(() => {
    if (!pUser.ppUser) return
    const relevantEntries = Object.entries(messages).filter(
      ([, msg]) =>
        msg.topic.type === 'shoppingLists' && msg.topic.id === pUser.ppUser!._id && msg.message.type === 'shoppingLists',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let shoppingList = msg.message.data
      switch (msg.action) {
        case 'update':
          if (userMap.has(shoppingList.createdBy)) {
            shoppingList = {
              ...shoppingList,
              createdBy: userMap.get(shoppingList.createdBy),
            }
          }
          setShoppingListList([...shoppingListList.filter((p) => p._id !== shoppingList._id), shoppingList])
          delete messages[msgId]
          break
        case 'delete':
          setShoppingListList(shoppingListList.filter((p) => p._id !== shoppingList._id))
          delete messages[msgId]
          break
      }
    })
  }, [messages, pUser, shoppingListList, userMap])

  return isLoading ?
      <MUI.Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
        <MUI.CircularProgress />
      </MUI.Box>
    : <>
        <ShoppingListCreateView
          handelCancel={() => setCreateNew(false)}
          hasShoppingList={shoppingListList.length > 0}
          setOnReload={setOnReload}
          open={createNew}
          setOpen={setCreateNew}
        ></ShoppingListCreateView>

        <MUI.Stack gap={8}>
          <MUI.Box sx={{ maxWidth: '100vw', display: 'flex', justifyContent: 'center' }}>
            <MUI.Box sx={{ display: 'flex', flexDirection: 'row', pr: '0.5em', flex: 0 }}>
              <SelectItems
                children={titles.map((selection) => (
                  <MUI.MenuItem key={selection} value={selection}>
                    <MUI.Typography variant="body1">{`${selection}`}</MUI.Typography>
                  </MUI.MenuItem>
                ))}
                helperText={''}
                label={'Viewing'}
                value={shoppingListTitle}
                id={'SelectShoppingListsView'}
                setValue={setShoppingListTitle}
              ></SelectItems>
              <SelectItems
                children={sortFunctions.map((sortFunc) => (
                  <MUI.MenuItem key={sortFunc.name} value={sortFunc.name}>
                    <MUI.Typography variant="body1">{`${sortFunc.name}`}</MUI.Typography>
                  </MUI.MenuItem>
                ))}
                helperText={''}
                label={'Sort By'}
                value={sortingBy}
                id={'SelectShoppingListsSort'}
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
              {!(shoppingListList.length > 0) && <MUI.Typography variant="h5">No Shopping Lists</MUI.Typography>}
              {shoppingListList.map((shoppingList) => (
                <ShoppingListCard
                  key={shoppingList._id}
                  shoppingList={shoppingList}
                  onClick={props.shoppingListOnClickHandler(shoppingList)}
                  className={'ShoppingListCard'}
                ></ShoppingListCard>
              ))}
            </MUI.Grid2>
          </MUI.Box>
        </MUI.Stack>
      </>
}
