import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

import { ppUserAtom } from '../lib/authLib'
import Planners from '../components/Planners/Planners'
import Welcome from '../components/Welcome'

export default function Home() {
  const nav = useNavigate()
  const [pUser] = useAtom(ppUserAtom)

  return pUser.loggedIn ?
      <Planners
        plannerOnClickHandler={(planner) => () => {
          nav(`/planner/${planner._id}`)
        }}
      ></Planners>
    : <Welcome />
}
