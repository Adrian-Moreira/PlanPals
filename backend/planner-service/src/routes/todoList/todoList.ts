import express from 'express'
import TodoListValidator from '../../controllers/todoList'
import UserService from '../../services/user'
import TodoListService from '../../services/todoList'
import { publishUpdateEvent } from '../../services/rabbit'
import { todoTaskRouter } from './todoTask'

const todoListRouter = express.Router({ mergeParams: true })

todoListRouter.get(
    '/',
    TodoListValidator.getTodoLists,
    UserService.verifyUserExists,
    TodoListService.getTodoListDocumentsByUserId
)
todoListRouter.post(
    '/',
    TodoListValidator.createTodoList,
    UserService.verifyUserExists,
    TodoListService.createTodoListDocument,
    publishUpdateEvent
)
todoListRouter.get(
    '/:todoListId([0-9a-fA-F]{24})',
    TodoListValidator.getTodoListById,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanViewTodoList,
    TodoListService.getTodoListDocumentById
)
todoListRouter.patch(
    '/:todoListId([0-9a-fA-F]{24})',
    TodoListValidator.updateTodoList,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    TodoListService.updateTodoListDocument,
    publishUpdateEvent
)
todoListRouter.delete(
    '/:todoListId([0-9a-fA-F]{24})',
    TodoListValidator.deleteTodoList,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    TodoListService.deleteTodoListDocument,
    publishUpdateEvent
)
todoListRouter.post(
    '/:todoListId([0-9a-fA-F]{24})/invite',
    TodoListValidator.inviteUsers,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    publishUpdateEvent
)

todoListRouter.use('/:todoListId([0-9a-fA-F]{24})/task', todoTaskRouter)

export default todoListRouter

