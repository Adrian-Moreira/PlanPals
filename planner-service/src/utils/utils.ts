import { Request } from 'express'
import { z } from 'zod'
import { MalformedRequestException } from '../exceptions/MalformedRequestException'

/**
 * A function that takes a list of functions and returns a new function that
 * pipes the output of each function to the next one. The input to the first
 * function is the input to the returned function, and the output of the last
 * function is the output of the returned function.
 *
 * @example
 * const double = (num: number) => num * 2
 * const addOne = (num: number) => num + 1
 * const doubleAndAddOne = pipe(double, addOne)
 * doubleAndAddOne(4) // resolves to 9
 *
 * @param funcs - An array of functions to pipe together.
 * @return A function that takes the input to the first function and returns a
 *         Promise that resolves to the output of the last function.
 */
export function pipe<T, R>(
  ...funcs: Array<(arg: any) => any | Promise<any>>
): (input: T) => Promise<R> {
  return (input: T): Promise<R> =>
    funcs.reduce(
      async (prevPromise, nextFunc) => nextFunc(await prevPromise),
      Promise.resolve(input),
    ) as Promise<R>
}

export const RequestUtils = {
  mkParser: mkRequestParser,
  mkParsers: mkRequestParsers,
  mkErrorResponse: mkErrorResponse,
  mkSuccessResponse: mkSuccessResponse,
}

/**
 * Given a Zod schema, returns a function that parses an Express.js request object
 * into a value of type T. If the request body, params, or query do not conform
 * to the schema, a MalformedRequestException is thrown.
 *
 * @param schema - the Zod schema used for parsing
 * @returns a function that takes an Express.js request object and returns a Promise
 *          that resolves to the parsed value of type T, or rejects with a
 *          MalformedRequestException if the request is malformed
 */
function mkRequestParser<T>(
  schema: z.ZodSchema<T>,
): (req: Request) => Promise<T> {
  return async (req: Request): Promise<T> => {
    return await schema
      .parseAsync(req)
      .then((value) => value)
      .catch((error) => {
        throw new MalformedRequestException({
          requestBody: `
          Body: ${JSON.stringify(req.body, null, 2)}
          Params: ${JSON.stringify(req.params, null, 2)}
          Query: ${JSON.stringify(req.query, null, 2)}
          Error: ${error.toString()}`,
          requestType: 'parseRequest',
        })
      })
  }
}

/**
 * Given a record of Zod schemas, returns a record of functions that parse an Express.js
 * request object into a value of type T. If the request body, params, or query do not
 * conform to the schema, a MalformedRequestException is thrown.
 *
 * @param schemas - a record of Zod schemas used for parsing
 * @returns a record of functions that takes an Express.js request object and returns a Promise
 *          that resolves to the parsed value of type T, or rejects with a
 *          MalformedRequestException if the request is malformed
 */
function mkRequestParsers(
  schemas: Record<string, z.ZodSchema<any>>,
): Record<string, (req: Request) => Promise<any>> {
  return Object.fromEntries(
    Object.entries(schemas).map(([key, schema]) => [
      key,
      mkRequestParser(schema as z.ZodSchema<any>),
    ]),
  )
}

function mkErrorResponse<T>(error: T): ResponseMessage {
  return { success: false, data: error }
}

function mkSuccessResponse<T>(data: T): ResponseMessage {
  return { success: true, data: data }
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
