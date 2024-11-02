import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { RecordNotFoundException } from '../exceptions/RecordNotFoundException'

/**
 * Verifies that an object with the given objectId exists in the given collection.
 *
 * @param {Request} req - The incoming request from the client.
 * @param {Response} res - The response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 *
 * @throws {RecordNotFoundException} If the object does not exist.
 */
export async function verifyObjectExistInCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { objectId, type } = req.body.out
  const object = await mongoose.models[type].findById(objectId)
  if (!object) {
    req.body.err = new RecordNotFoundException({
      recordType: type,
      recordId: objectId,
    })
    next(req.body.err)
  }
  next()
}

/**
 * Given a Zod schema, returns a function that takes an Express.js request object
 * and returns a Promise that resolves to void if the request is well-formed,
 * or rejects with a MalformedRequestException if the request is malformed.
 *
 * @param schema - A Zod schema used for parsing the request.
 * @returns A function that takes an Express.js request object and returns a
 *          Promise that resolves to void if the request is well-formed, or
 *          rejects with a MalformedRequestException if the request is malformed.
 */
function mkRequestParser<T>(
  schema: z.ZodSchema<T>,
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await schema
      .parseAsync(req)
      .then((value: any) => {
        req.body.out = { ...value.body, ...value.params, ...value.query }
        next()
      })
      .catch((error: any) => {
        req.body.err = new MalformedRequestException({
          requestBody: ''
            .concat(` Body: ${req.body}`)
            .concat(` Params: ${req.params}`)
            .concat(` Query: ${req.query}`)
            .concat(' Error: ' + error),
          requestType: 'parseRequest',
        })
        next(req.body.err)
      })
  }
}

/**
 * Given a dictionary of Zod schemas, returns a dictionary of functions that
 * parse an Express.js request object into a value of type T. Each function in
 * the returned dictionary is associated with the same key as the schema in the
 * input dictionary, and takes an Express.js request object and returns a Promise
 * that resolves to the parsed value of type T, or rejects with a
 * MalformedRequestException if the request is malformed.
 *
 * @param schemas - a dictionary of Zod schemas used for parsing
 * @returns a dictionary of functions that take an Express.js request object and
 *          return a Promise that resolves to the parsed value of type T, or
 *          rejects with a MalformedRequestException if the request is malformed
 */
function mkRequestParsers(
  schemas: Record<string, z.ZodSchema<any>>,
): Record<string, (req: Request, res: Response, next: NextFunction) => Promise<void>> {
  return Object.fromEntries(
    Object.entries(schemas).map(([key, schema]) => [key, mkRequestParser(schema as z.ZodSchema<any>)]),
  )
}

export type ResponseMessage = {
  success: boolean
  data?: any
}

export const ReqAttrSchema = z.object({
  body: z.object({}).optional().nullable(),
  params: z.object({}).optional().nullable(),
  query: z.object({}).optional().nullable(),
})

export type RequestAttrs = z.infer<typeof ReqAttrSchema>

export function mkSuccessJSON<T>(data: T): ResponseMessage {
  return {
    success: true,
    data: data,
  }
}

/**
 * Given an error and an Express.js request, response, and next middleware
 * functions, returns a Promise that resolves to void. If the error is a
 * `BSONError`, sends a 400 response with the error message. If the error is a
 * `MalformedRequestException`, sends a response with the error's status code
 * and message. If the error is a `RecordNotFoundException` or
 * `RecordConflictException`, sends a response with the error's status code
 * and message. Otherwise, sends a 500 response with a generic error message.
 */
async function mkErrorResponse(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
  if (err) {
    switch (err.name) {
      case 'SyntaxError':
      case 'BSONError':
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: err.message,
        })
        break
      case 'AuthorizationError':
        res.status(err.status).json({
          success: false,
          message: err.message,
        })
        break
      case 'MalformedRequestException':
        res.status(err.status).json({
          success: false,
          message: err.message,
        })
        break
      case 'RecordNotFoundException':
        res.status(err.status).json({
          success: false,
          message: err.message,
        })
        break
      case 'RecordConflictException':
        res.status(err.status).json({
          success: false,
          message: err.message,
        })
        break
      default:
        console.error(err)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Sum Ting Wong',
        })
    }
  }
}

/**
 * Builds a successful response given the request body.
 *
 * If a request error exists in the request body, it will be passed to the next
 * middleware instead.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware in the chain.
 */
async function mkSuccessResponse<T>(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.body.err || !req.body.result) {
    next(req.body.err)
  } else {
    res.status(req.body.status).json(mkSuccessJSON<T>(req.body.result))
  }
}

const RequestUtils = {
  mkParser: mkRequestParser,
  mkParsers: mkRequestParsers,
  mkErrorResponse: mkErrorResponse,
  mkSuccessResponse: mkSuccessResponse,
  verifyObjectExistInCollection: verifyObjectExistInCollection,
}

export default RequestUtils
