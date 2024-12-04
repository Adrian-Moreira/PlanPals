import express from 'express'
import TodoTaskValidator from '../../controllers/todoTask'
import UserService from '../../services/user'
import { publishUpdateEvent } from '../../services/rabbit'
import TodoListService from '../../services/todoList'
import TodoTaskService from '../../services/todoTask'

export const todoTaskRouter = express.Router({ mergeParams: true })

todoTaskRouter.get(
    '/',
    TodoTaskValidator.getTodoTasksByTodoListId,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanViewTodoList,
    TodoTaskService.getTodoTaskDocumentsByTodoListId
)

todoTaskRouter.post(
    '/',
    TodoTaskValidator.createTodoTask,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    TodoTaskService.createTodoTaskDocument,
    publishUpdateEvent
)

todoTaskRouter.get(
    '/:todoTaskId([0-9a-fA-F]{24})',
    TodoTaskValidator.getTodoTaskById,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanViewTodoList,
    TodoTaskService.verifyTodoTaskExists,
    TodoTaskService.getTodoTaskDocumentById
)

todoTaskRouter.patch(
    '/:todoTaskId([0-9a-fA-F]{24})',
    TodoTaskValidator.updateTodoTask,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    TodoTaskService.verifyTodoTaskExists,
    TodoTaskService.updateTodoTaskDocument,
    publishUpdateEvent
)

todoTaskRouter.delete(
    '/:todoTaskId([0-9a-fA-F]{24})',
    TodoTaskValidator.deleteTodoTask,
    UserService.verifyUserExists,
    TodoListService.verifyTodoListExists,
    TodoListService.verifyUserCanEditTodoList,
    TodoTaskService.verifyTodoTaskExists,
    TodoTaskService.deleteTodoTaskDocument,
    publishUpdateEvent
)