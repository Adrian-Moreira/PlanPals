import { TodoListCollection, TodoListModel } from '../models/TodoList'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoTaskModel } from '../models/TodoTask'

/**
 * Creates a new TodoList document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the user does not exist.
 *
 * @remarks
 * This function is called by the `createTodoList` endpoint.
 * It creates a new TodoList document in the database and adds it to the user.
 * The TodoList document is created with the given name, description, tasks, and access control lists.
 * The function adds the given user to the read-write list of the TodoList.
 * The function returns the new TodoList document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoList'.
 * The function sets `req.body.todoListId` to the new TodoList document's id.
 * The function sets `req.body.userIds` to the ids of the users that have access to the TodoList.
 * The function sets `req.body.status` to 201 (Created).
 */
export const createTodoListDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let { targetUser, name, description, tasks, rwUsers, roUsers } = req.body.out

  if (!rwUsers?.includes(targetUser._id)) {
    rwUsers.push(targetUser._id)
  }

  const todoList = await TodoListModel.create({
    createdBy: targetUser._id,
    name,
    description,
    tasks,
    roUsers,
    rwUsers,
  })

  req.body.result = todoList
  req.body.dataType = TodoListCollection
  req.body.todoListId = todoList._id
  req.body.userIds = [todoList.createdBy, ...todoList.roUsers, ...todoList.rwUsers]
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Updates a TodoList document given a TodoList id.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the TodoList does not exist.
 *
 * @remarks
 * This function is called by the `updateTodoList` endpoint.
 * It updates a TodoList document in the database given a TodoList id.
 * The TodoList document is updated with the given name, description, tasks, and access control lists.
 * The function returns the updated TodoList document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoList'.
 * The function sets `req.body.status` to 200 (OK).
 */
export const updateTodoListDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { todoList, name, description, rwUsers, roUsers } = req.body.out

  todoList.name = name || todoList.name
  todoList.description = description || todoList.description
  todoList.rwUsers = rwUsers || todoList.rwUsers
  todoList.roUsers = roUsers || todoList.roUsers

  const savedTodoList = await TodoListModel.findOneAndUpdate({ _id: todoList._id }, todoList, { new: true })

  req.body.result = savedTodoList
  req.body.dataType = TodoListCollection
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Deletes a TodoList document from the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `deleteTodoList` endpoint.
 * It deletes the TodoList document from the database given a TodoList id.
 * The function returns the deleted TodoList document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoList'.
 * The function sets `req.body.status` to 200 (OK).
 */
export const deleteTodoListDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { todoList } = req.body.out

  const targetTodoList = await TodoListModel.findOneAndDelete({ _id: todoList._id })
  await TodoTaskModel.deleteMany({ todoListId: todoList._id })

  req.body.result = targetTodoList
  req.body.dataType = TodoListCollection
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves TodoList documents from the database that a user has access to.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `getTodoListsByUserId` endpoint.
 * It retrieves TodoList documents from the database that a user has access to.
 * The access level is determined by the `access` parameter in `req.body.out`.
 * If `access` is 'rw', the function retrieves TodoList documents that the user is the owner of or has read-write access to.
 * If `access` is 'ro', the function retrieves TodoList documents that the user has read-only access to.
 * If `access` is not specified, the function retrieves TodoList documents that the user is the owner of.
 * The function returns the retrieved TodoList documents in `req.body.result`.
 * The function sets `req.body.status` to 200 (OK).
 */
export const getTodoListDocumentsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetUser, access } = req.body.out

  let resultTodoList

  switch (access) {
    case 'rw':
      resultTodoList = await TodoListModel.find({ $or: [{ createdBy: targetUser._id }, { rwUsers: targetUser._id }] })
      break
    case 'ro':
      resultTodoList = await TodoListModel.find({ roUsers: targetUser._id })
      break
    default:
      resultTodoList = await TodoListModel.find({ createdBy: targetUser._id })
      break
  }

  if (!resultTodoList || resultTodoList.length === 0) {
    req.body.err = new RecordNotFoundException({
      recordType: 'todoList',
      recordId: targetUser._id,
    })
    next(req.body.err)
  }
  req.body.result = resultTodoList
  req.body.status = StatusCodes.OK

  next()
}

/**
 * Retrieves a TodoList document from the request body and sends it in the response.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function assumes the TodoList document is already present in the request body.
 * It sets the retrieved TodoList document as the result in `req.body.result`.
 * The function sets the response status to 200 (OK).
 */
export const getTodoListDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { todoList } = req.body.out

  req.body.result = todoList
  req.body.status = StatusCodes.OK
  next()
}

export const inviteUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { todoListId } = req.params
  const { userIds } = req.body

  const updatedTodoList = await TodoListModel.findOneAndUpdate(
    { _id: todoListId },
    { $addToSet: { rwUsers: { $each: userIds } } },
    { new: true },
  )

  if (!updatedTodoList) {
    req.body.err = new RecordNotFoundException({ recordType: 'todoList', recordId: todoListId })
    return next(req.body.err)
  }

  req.body.result = updatedTodoList
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Verifies that a TodoList document exists in the database given a TodoList id.
 * If not, throws a RecordNotFoundException with the TodoList ID and record type of 'todoList'.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `getTodoListDocumentById` endpoint.
 * It retrieves a TodoList document from the database given a TodoList id.
 * The function sets `req.body.out.todoList` to the retrieved TodoList document.
 * The function sets `req.body.todoListId` to the id of the retrieved TodoList document.
 * The function sets `req.body.userIds` to the userIds of the user who created the TodoList and the userIds of the users who have read-write access to the TodoList.
 */
async function verifyTodoListExists(req: Request, res: Response, next: NextFunction) {
  const { todoListId } = req.body.out

  const todoList = await TodoListModel.findOne({ _id: todoListId })
  if (!todoList) {
    req.body.err = new RecordNotFoundException({
      recordType: 'todoList',
      recordId: todoListId,
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, todoList }
    req.body.todoListId = todoList._id
    req.body.userIds = [
      req.body.out.todoList.createdBy,
      ...req.body.out.todoList.rwUsers,
      ...req.body.out.todoList.roUsers,
    ]
  }
  next()
}

/**
 * Verifies whether a user has permission to edit a specific TodoList.
 * If the user is not the owner or does not have read-write access, a RecordNotFoundException is thrown.
 *
 * @param {Request} req - The incoming request from the client containing the targetTodoList and targetUser.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function checks if the targetUser is in the read-write user list or is the creator of the targetTodoList.
 * If the user has permission, the targetTodoList is added to the request body output.
 */
async function verifyUserCanEditTodoList(req: Request, res: Response, next: NextFunction) {
  const { todoList, targetUser } = req.body.out

  if (
    todoList.rwUsers.includes(targetUser._id) ||
    todoList.createdBy?.toString() === targetUser._id.toString()
  ) {
    req.body.out = { ...req.body.out, todoList }
  } else {
    req.body.err = new RecordNotFoundException({
      recordType: 'todoList',
      recordId: todoList._id,
    })
    next(req.body.err)
  }

  next()
}

/**
 * Verifies whether a user has permission to view a specific TodoList.
 * If the user is not the owner or does not have read or read-write access,
 * a RecordNotFoundException is thrown.
 *
 * @param {Request} req - The incoming request from the client containing the targetTodoList and targetUser.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function checks if the targetUser is in the read-only or read-write user list
 * or is the creator of the targetTodoList. If the user has permission, the targetTodoList
 * is added to the request body output.
 */
async function verifyUserCanViewTodoList(req: Request, res: Response, next: NextFunction) {
  const { targetUser, todoList } = req.body.out

  if (
    !todoList.roUsers.includes(targetUser._id) &&
    !todoList.rwUsers.includes(targetUser._id) &&
    todoList.createdBy?.toString() !== targetUser._id.toString()
  ) {
    req.body.err = new RecordNotFoundException({
      recordType: 'todoList',
      recordId: todoList._id,
    })
    next(req.body.err)
  } else {
    req.body.out = { ...req.body.out, todoList }
  }
  next()
}

const TodoListService = {
  createTodoListDocument,
  updateTodoListDocument,
  deleteTodoListDocument,
  getTodoListDocumentsByUserId,
  getTodoListDocumentById,
  inviteUsers,
  verifyTodoListExists,
  verifyUserCanEditTodoList,
  verifyUserCanViewTodoList,
}

export default TodoListService
