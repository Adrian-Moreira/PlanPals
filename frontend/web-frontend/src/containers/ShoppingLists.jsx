import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'

import { ppUserAtom } from '../lib/authLib'
import ShoppingListsList from '../components/ShoppingLists/ShoppingLists'
import Welcome from '../components/Welcome'

export default function ShoppingLists() {
  const nav = useNavigate()
  const [pUser] = useAtom(ppUserAtom)

  return pUser.loggedIn ?
      <ShoppingListsList
        shoppingListOnClickHandler={(shoppingList) => () => {
          nav(`/shoppingList/${shoppingList._id}`)
        }}
      ></ShoppingListsList>
    : <Welcome />
}