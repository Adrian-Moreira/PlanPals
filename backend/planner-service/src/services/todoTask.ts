import { TodoTask, TodoTaskCollection, TodoTaskModel } from '../models/TodoTask'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { TodoListModel } from '../models/TodoList'

/**
 * Creates a new TodoTask document in the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `createTodoTask` endpoint.
 * It creates a new TodoTask document in the database and adds it to the user.
 * The TodoTask document is created with the given name, description, tasks, and access control lists.
 * The function adds the given user to the read-write list of the TodoTask.
 * The function returns the new TodoTask document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoTask'.
 * The function sets `req.body.status` to 201 (Created).
 */
const createTodoTaskDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetUser, targetTodoList, todoListId, name, assignedTo, dueDate, isCompleted } = req.body.out

  const createdTodoTask = await TodoTaskModel.create({
    todoListId,
    createdBy: targetUser._id,
    name,
    assignedTo,
    dueDate,
    isCompleted,
  })

  targetTodoList.tasks.push(createdTodoTask._id)

  await TodoListModel.findOneAndUpdate({ _id: todoListId }, { tasks: targetTodoList.tasks }, { new: true })

  req.body.result = createdTodoTask
  req.body.dataType = TodoTaskCollection
  req.body.status = StatusCodes.CREATED
  next()
}

/**
 * Updates a TodoTask document given a TodoTask id.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `updateTodoTask` endpoint.
 * It updates a TodoTask document in the database given a TodoTask id.
 * The TodoTask document is updated with the given name, description, tasks, and access control lists.
 * The function returns the updated TodoTask document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoTask'.
 * The function sets `req.body.status` to 200 (OK).
 */
const updateTodoTaskDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetTodoTask, name, assignedTo, dueDate, isCompleted } = req.body.out

  targetTodoTask.name = name || targetTodoTask.name
  targetTodoTask.assignedTo = assignedTo || targetTodoTask.assignedTo
  targetTodoTask.dueDate = dueDate || targetTodoTask.dueDate
  targetTodoTask.isCompleted = isCompleted || targetTodoTask.isCompleted

  const updatedTodoTask = await TodoTaskModel.findOneAndUpdate({ _id: targetTodoTask._id }, targetTodoTask, {
    new: true,
  })

  req.body.result = updatedTodoTask
  req.body.dataType = TodoTaskCollection
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Deletes a TodoTask document from the database.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `deleteTodoTask` endpoint.
 * It deletes the TodoTask document from the database given a TodoTask id and its associated TodoList id.
 * The function returns the deleted TodoTask document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoTask'.
 * The function sets `req.body.status` to 200 (OK).
 */
const deleteTodoTaskDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetTodoList, targetTodoTask } = req.body.out

  const deletedTodoTask = await TodoTaskModel.findOneAndDelete({
    _id: targetTodoTask._id,
    todoListId: targetTodoList._id,
  })

  req.body.result = deletedTodoTask
  req.body.dataType = TodoTaskCollection
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves a TodoTask document from the database given a TodoTask id.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `getTodoTaskById` endpoint.
 * It retrieves the TodoTask document from the database given a TodoTask id.
 * The function returns the retrieved TodoTask document in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoTask'.
 * The function sets `req.body.status` to 200 (OK).
 */
const getTodoTaskDocumentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetTodoTask } = req.body.out

  req.body.result = targetTodoTask
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Retrieves all TodoTask documents that belong to a TodoList given its id.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by the `getTodoTasksByTodoListId` endpoint.
 * It retrieves all TodoTask documents that belong to the given TodoList id.
 * The function returns the retrieved TodoTask documents in `req.body.result`.
 * The function sets `req.body.dataType` to 'TodoTask[]'.
 * The function sets `req.body.status` to 200 (OK).
 */
const getTodoTaskDocumentsByTodoListId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetTodoList } = req.body.out

  const resultTodoTasks: TodoTask[] = await targetTodoList.tasks.map((tid: any) => TodoTaskModel.findById(tid))

  req.body.result = await Promise.all(resultTodoTasks).then((results) => results.filter((result) => result !== null))
  req.body.status = StatusCodes.OK
  next()
}

/**
 * Verifies that a TodoTask exists in the database given a TodoTask id.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @remarks
 * This function is called by some endpoints to verify that a TodoTask exists before performing an action on it.
 * It retrieves the TodoTask document from the database given a TodoTask id.
 * If the TodoTask does not exist, it sets `req.body.err` to a RecordNotFoundException.
 * Otherwise, it adds the TodoTask to `req.body.out` and calls `next()`.
 */
async function verifyTodoTaskExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { targetTodoList, todoTaskId } = req.body.out
  const targetTodoTask = await TodoTaskModel.findOne({ _id: todoTaskId, todoListId: targetTodoList._id })

  if (!targetTodoTask) {
    req.body.err = new RecordNotFoundException({
      recordType: 'todoTask',
      recordId: todoTaskId,
    })
    next(req.body.err)
  }

  req.body.out = {
    ...req.body.out,
    targetTodoTask,
  }
  next()
}

const TodoTaskService = {
  createTodoTaskDocument,
  updateTodoTaskDocument,
  deleteTodoTaskDocument,
  getTodoTaskDocumentById,
  getTodoTaskDocumentsByTodoListId,
  verifyTodoTaskExists,
}

export default TodoTaskService
