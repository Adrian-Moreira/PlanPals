import * as MUI from '@mui/material/'
import * as MUIcons from '@mui/icons-material'
import React, { useEffect, useCallback, useState } from 'react'
import PlannerCard from './PlannerCard'
import apiLib from '../../lib/apiLib'
import { useAtom } from 'jotai'
import { userMapAtom } from '../../lib/appLib'
import { ppUserAtom, PPUserAuth } from '../../lib/authLib'
import { onError } from '../../lib/errorLib'
import AdaptiveDialog from '../Common/AdaptiveDialog'
import PlannerCreateView from './PlannerCreateView'
import { useNavigate } from 'react-router-dom'
import SelectItems from '../Common/SelectItems'
import { WebSockerConnector, wsAtom } from '../../lib/wsLib'
import AddButton from '../Common/AddButton'

const titles = ['My Planners', 'Planners View Only', 'Planners I Can Edit']
const paths = ['/planner', '/planner?access=ro', '/planner?access=rw']

export interface PlannersProps {
  plannerOnClickHandler: (planner: any) => () => void
}

export default function Planners(props: PlannersProps) {
  const nav = useNavigate()
  const [plannerList, setPlannerList] = useState<any[]>([])
  const [userMap, setUserMap] = useAtom(userMapAtom)
  const [pUser, setPPUser] = useAtom(ppUserAtom)
  const [createNew, setCreateNew] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [onReload, setOnReload] = useState(false)
  const [plannerTitle, setPlannerTitle] = useState(titles[0])
  const [plannerURL, setPlannerURL] = useState(paths[0])
  const [wsAtm] = useAtom(wsAtom)
  const ws = WebSockerConnector(wsAtom)

  const fetchPlannerCreator = useCallback(
    async (userId: any, plannerList: any[]) => {
      return await Promise.all(
        plannerList.map(async (p) => {
          if (userMap.has(p.createdBy)) return { ...p, createdBy: userMap.get(p.createdBy) }
          const { user, ok } = await apiLib.getUserById(p.createdBy)
          if (!ok) return { ...p, createdBy: { userName: 'nil', preferredName: 'nil' } }
          else return { ...p, createdBy: user }
        }),
      )
    },
    [userMap],
  )

  const fetchPlanners = useCallback(
    async (userId: any) => {
      if (!userId || !pUser.loggedIn) return
      let res: { data: { data: any; success: any } } | undefined = undefined
      let pList: any[] | undefined = undefined
      try {
        setIsLoading(true)
        res = await apiLib.get(plannerURL, { params: { userId } })
        if (res?.data.success) pList = res.data.data
        else throw new Error()
        const plannersWithCreators = await fetchPlannerCreator(userId, pList!)
        setPlannerList(plannersWithCreators)
        setCreateNew(false)
      } catch {
        setIsLoading(false)
        if (!res || !pList || !res.data.success || pList.length < 1) {
          setPlannerList([])
          if (plannerTitle === titles[0]) setCreateNew(true)
        }
      }
    },
    [fetchPlannerCreator, pUser.loggedIn, plannerURL],
  )

  const onLoad = useCallback(async () => {
    try {
      if (!pUser.loggedIn) nav('/login')
      await fetchPlanners(pUser.ppUser!._id)
    } catch {
      onError('Error fetching planners')
    } finally {
      setIsLoading(false)
    }
  }, [fetchPlanners, pUser.loggedIn, setPPUser])

  useEffect(() => {
    onLoad()
  }, [onLoad, onReload])

  useEffect(() => {
    switch (plannerTitle) {
      case titles[0]:
        setPlannerURL(paths[0])
        break
      case titles[1]:
        setPlannerURL(paths[1])
        break
      case titles[2]:
        setPlannerURL(paths[2])
        break
    }
  }, [plannerTitle])

  useEffect(() => {
    if (!pUser.ppUser) return
    ws.subscribeAtom([{ type: 'planners', id: pUser.ppUser._id }])
  }, [pUser.ppUser, wsAtm, onReload, isLoading])

  useEffect(() => {
    if (!pUser.ppUser) return
    const relevantEntries = Object.entries(ws.messages).filter(
      ([, msg]) =>
        msg.topic.type === 'planners' && msg.topic.id === pUser.ppUser!._id && msg.message.type === 'Planner',
    )
    relevantEntries.forEach(([msgId, msg]) => {
      let planner = msg.message.data
      switch (msg.action) {
        case 'update':
          if (userMap.has(planner.createdBy)) {
            planner = {
              ...planner,
              createdBy: userMap.get(planner.createdBy),
            }
          }
          setPlannerList([...plannerList.filter((p) => p._id !== planner._id), planner])
          delete ws.messages[msgId]
          break
        case 'delete':
          setPlannerList(plannerList.filter((p) => p._id !== planner._id))
          delete ws.messages[msgId]
          break
      }
    })
  }, [ws.messages, pUser, plannerList, userMap])

  return (
    <>
      <PlannerCreateView
        handelCancel={() => setCreateNew(false)}
        hasPlanner={plannerList.length > 0}
        setOnReload={setOnReload}
        open={createNew}
        setOpen={setCreateNew}
      ></PlannerCreateView>

      <MUI.Stack gap={8}>
        <MUI.Box sx={{ maxWidth: '100vw', display: 'flex', justifyContent: 'center' }}>
          <MUI.Typography flex={1} sx={{ ml: '0.5em', pt: '0.4em' }} variant="h4">
            {plannerTitle}
          </MUI.Typography>
          <MUI.Box sx={{ display: 'flex', flexDirection: 'row' }} pr={'0.5em'} flex={0}>
            <SelectItems
              children={titles.map((selection) => (
                <MUI.MenuItem key={selection} value={selection}>
                  <MUI.Typography variant="body1">{`${selection}`}</MUI.Typography>
                </MUI.MenuItem>
              ))}
              helperText={''}
              label={''}
              value={plannerTitle}
              id={'SelectPlannersView'}
              setValue={setPlannerTitle}
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
            {!(plannerList.length > 0) && <MUI.Typography variant="h5">No Planners</MUI.Typography>}
            {plannerList.map((planner) => (
              <PlannerCard
                key={planner._id}
                planner={planner}
                onClick={props.plannerOnClickHandler(planner)}
                className={'PlannerCard'}
              ></PlannerCard>
            ))}
          </MUI.Grid2>
        </MUI.Box>
      </MUI.Stack>
    </>
  )
}
