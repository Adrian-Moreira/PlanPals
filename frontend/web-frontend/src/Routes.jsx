import { Route, Routes } from 'react-router-dom'
import Home from './containers/Home.jsx'
import NotFound from './containers/NotFound.jsx'
import Login from './containers/Login.jsx'
import Signup from './containers/Signup.jsx'
import PlannerDetail from './containers/PlannerDetail.jsx'
import ShoppingLists from './containers/ShoppingLists.jsx'
import ShoppingListDetail from './containers/ShoppingListDetail.jsx'
import TodoLists from './containers/TodoLists.jsx'
import TodoListDetail from './containers/TodoListDetail.jsx'
import About from './containers/About.jsx'

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/planner/:id" element={<PlannerDetail />} />
      <Route path="/planners" element={<Home />} />
      <Route path="/shoppingList/:id" element={<ShoppingListDetail />} />
      <Route path="/shoppingLists" element={<ShoppingLists />} />
      <Route path="/todoList/:id" element={<TodoListDetail />} />
      <Route path="/todoLists" element={<TodoLists />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
