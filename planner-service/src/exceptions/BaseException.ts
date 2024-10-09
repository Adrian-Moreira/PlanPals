import { debug } from "./debug"

export interface BaseExceptionParams {
  name: string
  message: string
  status?: number
}

export class BaseException extends Error {
  status?: number
  constructor({ name, message, status }: BaseExceptionParams) {
    super(message)
    this.name = name
    this.status = status

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseException)
    }
    
    // debug('baseException', {
    //   exceptionClassName: name,
    //   exceptionFault: status,
    //   exceptionMessage: message,
    // })
  }
}
