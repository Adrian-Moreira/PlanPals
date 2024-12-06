import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

import { ppUserAtom } from '../lib/authLib'
import TodoListsList from '../components/TodoLists/TodoLists'
import Welcome from '../components/Welcome'

export default function TodoLists() {
  const nav = useNavigate()
  const [pUser] = useAtom(ppUserAtom)

  return pUser.loggedIn ?
      <TodoListsList
        todoListOnClickHandler={(todoList) => () => {
          nav(`/todoList/${todoList._id}`)
        }}
      ></TodoListsList>
    : <Welcome />
}